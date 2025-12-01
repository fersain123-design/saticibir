import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../types';
import Product from '../models/Product';

export const getProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.vendor) {
      res.status(401).json({
        success: false,
        message: 'Yetkilendirme gerekli',
      });
      return;
    }

    const {
      search,
      category,
      status,
      lowStockOnly,
      page = 1,
      limit = 50,
    } = req.query;

    const query: any = { vendorId: req.vendor._id };

    // Search by name
    if (search) {
      query.$text = { $search: search as string };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter low stock
    if (lowStockOnly === 'true') {
      query.$expr = { $lte: ['$stock', '$minStockThreshold'] };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Ürünler alınamadı',
      error: error.message,
    });
  }
};

export const getProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.vendor) {
      res.status(401).json({
        success: false,
        message: 'Yetkilendirme gerekli',
      });
      return;
    }

    const product = await Product.findOne({
      _id: req.params.id,
      vendorId: req.vendor._id,
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        product,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Ürün alınamadı',
      error: error.message,
    });
  }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Doğrulama hatası',
        errors: errors.array(),
      });
      return;
    }

    if (!req.vendor) {
      res.status(401).json({
        success: false,
        message: 'Yetkilendirme gerekli',
      });
      return;
    }

    const productData = {
      ...req.body,
      vendorId: req.vendor._id,
    };

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Ürün oluşturuldu',
      data: {
        product,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Ürün oluşturulamadı',
      error: error.message,
    });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.vendor) {
      res.status(401).json({
        success: false,
        message: 'Yetkilendirme gerekli',
      });
      return;
    }

    const product = await Product.findOneAndUpdate(
      {
        _id: req.params.id,
        vendorId: req.vendor._id,
      },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Ürün güncellendi',
      data: {
        product,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Ürün güncellenemedi',
      error: error.message,
    });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.vendor) {
      res.status(401).json({
        success: false,
        message: 'Yetkilendirme gerekli',
      });
      return;
    }

    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      vendorId: req.vendor._id,
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Ürün silindi',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Ürün silinemedi',
      error: error.message,
    });
  }
};

export const toggleProductStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.vendor) {
      res.status(401).json({
        success: false,
        message: 'Yetkilendirme gerekli',
      });
      return;
    }

    const product = await Product.findOne({
      _id: req.params.id,
      vendorId: req.vendor._id,
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı',
      });
      return;
    }

    product.status = product.status === 'active' ? 'inactive' : 'active';
    await product.save();

    res.status(200).json({
      success: true,
      message: `Ürün ${product.status === 'active' ? 'aktif' : 'pasif'} yapıldı`,
      data: {
        product,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Ürün durumu değiştirilemedi',
      error: error.message,
    });
  }
};

export const getCategories = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.vendor) {
      res.status(401).json({
        success: false,
        message: 'Yetkilendirme gerekli',
      });
      return;
    }

    const categories = await Product.distinct('category', {
      vendorId: req.vendor._id,
    });

    res.status(200).json({
      success: true,
      data: {
        categories,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Kategoriler alınamadı',
      error: error.message,
    });
  }
};
