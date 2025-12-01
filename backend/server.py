# Satıcı Paneli Backend - FastAPI
# Tam kapsamlı backend implementation

from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, File, UploadFile, Form, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import shutil
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'vendor_panel')]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get("JWT_SECRET", "satici-paneli-super-secret-key-2024")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE = timedelta(days=7)
REFRESH_TOKEN_EXPIRE = timedelta(days=30)

security = HTTPBearer()

# Create uploads directory
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# Create the main app
app = FastAPI(title="Satıcı Paneli API", version="1.0.0")
api_router = APIRouter(prefix="/api")

# ==== UTILITY FUNCTIONS ====

def clean_mongo_doc(doc):
    """MongoDB _id alanını çıkar"""
    if isinstance(doc, dict):
        return {k: v for k, v in doc.items() if k != "_id"}
    elif isinstance(doc, list):
        return [clean_mongo_doc(item) for item in doc]
    return doc

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + ACCESS_TOKEN_EXPIRE
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + REFRESH_TOKEN_EXPIRE
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ==== AUTH DEPENDENCIES ====

async def get_current_vendor(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Geçersiz token tipi")
        
        vendor_id = payload.get("sub")
        if not vendor_id:
            raise HTTPException(status_code=401, detail="Token geçersiz")
        
        vendor = await db.vendors.find_one({"id": vendor_id})
        if not vendor:
            raise HTTPException(status_code=401, detail="Satıcı bulunamadı")
        
        return vendor
    except JWTError:
        raise HTTPException(status_code=401, detail="Token doğrulanamadı")

async def require_approved_vendor(vendor: dict = Depends(get_current_vendor)):
    if vendor["status"] != "approved":
        message = "Hesabınız henüz onaylanmadı"
        
        if vendor["status"] == "pending_review":
            message = "Hesabınız inceleme aşamasında. Lütfen onay bekleyiniz."
        elif vendor["status"] == "rejected":
            reason = vendor.get("rejection_reason", "Belirtilmemiş")
            message = f"Hesabınız reddedildi. Sebep: {reason}"
        elif vendor["status"] == "suspended":
            message = "Hesabınız askıya alınmıştır."
        
        raise HTTPException(status_code=403, detail=message)
    
    return vendor

# ==== MODELS ====

class Address(BaseModel):
    province: str
    district: str
    full_address: str
    postal_code: Optional[str] = None

class VendorRegister(BaseModel):
    owner_name: str
    email: EmailStr
    phone: str
    password: str
    store_name: str
    store_type: Optional[str] = None
    tax_number: Optional[str] = None
    address: Address
    tax_sheet_url: str

class VendorLogin(BaseModel):
    email: EmailStr
    password: str

class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    unit: str
    stock: int
    min_stock_threshold: int = 10
    status: str = "active"
    description: Optional[str] = None

class OrderStatusUpdate(BaseModel):
    status: str
    note: Optional[str] = None

# ==== ENDPOINTS ====

# AUTH
@api_router.post("/vendor/register")
async def register_vendor(vendor_data: VendorRegister):
    existing = await db.vendors.find_one({"email": vendor_data.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Bu email zaten kayıtlı")
    
    if len(vendor_data.password) < 6:
        raise HTTPException(status_code=400, detail="Şifre en az 6 karakter olmalıdır")
    
    if not vendor_data.tax_sheet_url:
        raise HTTPException(status_code=400, detail="Vergi levhası zorunludur")
    
    vendor_id = str(uuid.uuid4())
    vendor = {
        "id": vendor_id,
        "owner_name": vendor_data.owner_name,
        "email": vendor_data.email.lower(),
        "phone": vendor_data.phone,
        "password_hash": hash_password(vendor_data.password),
        "store_name": vendor_data.store_name,
        "store_type": vendor_data.store_type,
        "tax_number": vendor_data.tax_number,
        "address": vendor_data.address.model_dump(),
        "status": "pending_review",
        "documents": {"tax_sheet_url": vendor_data.tax_sheet_url},
        "created_at": datetime.utcnow(),
    }
    
    await db.vendors.insert_one(vendor)
    
    return {
        "success": True,
        "message": "Kayıt başarılı. Hesabınız inceleme aşamasındadır."
    }

@api_router.post("/vendor/login")
async def login_vendor(login_data: VendorLogin):
    vendor = await db.vendors.find_one({"email": login_data.email.lower()})
    
    if not vendor or not verify_password(login_data.password, vendor["password_hash"]):
        raise HTTPException(status_code=401, detail="Email veya şifre hatalı")
    
    access_token = create_access_token({"sub": vendor["id"]})
    refresh_token = create_refresh_token({"sub": vendor["id"]})
    
    return {
        "success": True,
        "data": {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "vendor": {
                "id": vendor["id"],
                "email": vendor["email"],
                "store_name": vendor["store_name"],
                "status": vendor["status"]
            }
        }
    }

@api_router.get("/vendor/me")
async def get_me(vendor: dict = Depends(get_current_vendor)):
    return {"success": True, "data": {"vendor": clean_mongo_doc(vendor)}}

# DASHBOARD
@api_router.get("/vendor/dashboard")
async def get_dashboard(vendor: dict = Depends(require_approved_vendor)):
    now = datetime.utcnow()
    today_start = now.replace(hour=0, minute=0, second=0)
    week_start = now - timedelta(days=7)
    
    today_orders = await db.orders.count_documents({"vendor_id": vendor["id"], "created_at": {"$gte": today_start}})
    week_orders = await db.orders.count_documents({"vendor_id": vendor["id"], "created_at": {"$gte": week_start}})
    pending_orders = await db.orders.count_documents({"vendor_id": vendor["id"], "status": "pending"})
    total_products = await db.products.count_documents({"vendor_id": vendor["id"]})
    
    return {
        "success": True,
        "data": {
            "today": {"orders": today_orders},
            "week": {"orders": week_orders},
            "pending": {"orders": pending_orders},
            "products": {"total": total_products}
        }
    }

# PRODUCTS
@api_router.get("/vendor/products")
async def get_products(vendor: dict = Depends(require_approved_vendor)):
    products = await db.products.find({"vendor_id": vendor["id"]}).to_list(100)
    return {"success": True, "data": {"products": clean_mongo_doc(products)}}

@api_router.post("/vendor/products")
async def create_product(product: ProductCreate, vendor: dict = Depends(require_approved_vendor)):
    product_id = str(uuid.uuid4())
    new_product = {"id": product_id, "vendor_id": vendor["id"], **product.model_dump(), "created_at": datetime.utcnow()}
    await db.products.insert_one(new_product)
    return {"success": True, "data": {"product": clean_mongo_doc(new_product)}}

@api_router.delete("/vendor/products/{product_id}")
async def delete_product(product_id: str, vendor: dict = Depends(require_approved_vendor)):
    result = await db.products.delete_one({"id": product_id, "vendor_id": vendor["id"]})
    if result.deleted_count == 0:
        raise HTTPException(404, "Ürün bulunamadı")
    return {"success": True}

# ORDERS
@api_router.get("/vendor/orders")
async def get_orders(vendor: dict = Depends(require_approved_vendor)):
    orders = await db.orders.find({"vendor_id": vendor["id"]}).to_list(100)
    return {"success": True, "data": {"orders": clean_mongo_doc(orders)}}

@api_router.put("/vendor/orders/{order_id}/status")
async def update_order_status(order_id: str, status_data: OrderStatusUpdate, vendor: dict = Depends(require_approved_vendor)):
    await db.orders.update_one({"id": order_id, "vendor_id": vendor["id"]}, {"$set": {"status": status_data.status}})
    return {"success": True}

# ROOT
@api_router.get("/")
async def api_root():
    return {"success": True, "message": "Satıcı Paneli API v1.0.0"}

@app.get("/health")
async def health():
    return {"success": True, "status": "healthy"}

app.include_router(api_router)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
