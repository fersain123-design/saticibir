import React, { useEffect, useState } from 'react';
import { productsAPI } from '../services/api.ts';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  images?: string[];
  variants?: ProductVariant[];
  is_bundle?: boolean;
  bundle_items?: string[];
  created_at: string;
  total_sales?: number;
}

interface ProductVariant {
  id: string;
  name: string;
  price_modifier: number;
  stock: number;
}

const ProductsAdvanced: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    unit: '',
    stock: '',
    status: 'active',
    description: '',
    images: [] as string[],
    is_bundle: false,
    bundle_items: [] as string[],
  });

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [newVariant, setNewVariant] = useState({ name: '', price_modifier: 0, stock: 0 });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      const productsData = response.data.data?.products || response.data.products || [];
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProductBadges = (product: Product) => {
    const badges = [];
    
    // Yeni Ürün rozeti (30 gün)
    const daysSinceCreated = Math.floor(
      (Date.now() - new Date(product.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceCreated <= 30) {
      badges.push({ text: 'YENİ', color: 'bg-blue-500' });
    }

    // Çok Satan rozeti
    if (product.total_sales && product.total_sales > 50) {
      badges.push({ text: 'ÇOK SATAN', color: 'bg-warning' });
    }

    // Son X Adet uyarısı
    if (product.stock > 0 && product.stock <= 5) {
      badges.push({ text: `SON ${product.stock} ADET!`, color: 'bg-error' });
    }

    // Paket ürün
    if (product.is_bundle) {
      badges.push({ text: 'PAKET', color: 'bg-purple-500' });
    }

    // Varyantlı ürün
    if (product.variants && product.variants.length > 0) {
      badges.push({ text: `${product.variants.length} VARYANT`, color: 'bg-primary' });
    }

    return badges;
  };

  const handleAddVariant = () => {
    if (newVariant.name) {
      setVariants([...variants, { ...newVariant, id: Date.now().toString() }]);
      setNewVariant({ name: '', price_modifier: 0, stock: 0 });
    }
  };

  const handleRemoveVariant = (id: string) => {
    setVariants(variants.filter(v => v.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        variants: variants,
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct.id, data);
      } else {
        await productsAPI.create(data);
      }

      alert('Ürün başarıyla kaydedildi!');
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'İşlem başarısız oldu');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      unit: '',
      stock: '',
      status: 'active',
      description: '',
      images: [],
      is_bundle: false,
      bundle_items: [],
    });
    setVariants([]);
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Gelişmiş Ürün Yönetimi</h1>
          <p className="text-text-secondary mt-1">Varyant, paket ve rozet sistemli ürünler</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-600 transition-all font-semibold shadow-md hover:shadow-lg"
        >
          + Yeni Ürün
        </button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl mb-2">📦</div>
          <div className="text-2xl font-bold text-primary">{products.length}</div>
          <div className="text-sm text-text-secondary">Toplam Ürün</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl mb-2">🎨</div>
          <div className="text-2xl font-bold text-primary">
            {products.filter(p => p.variants && p.variants.length > 0).length}
          </div>
          <div className="text-sm text-text-secondary">Varyantlı Ürün</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl mb-2">🎁</div>
          <div className="text-2xl font-bold text-primary">
            {products.filter(p => p.is_bundle).length}
          </div>
          <div className="text-sm text-text-secondary">Paket Ürün</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl mb-2">⚠️</div>
          <div className="text-2xl font-bold text-error">
            {products.filter(p => p.stock <= 5).length}
          </div>
          <div className="text-sm text-text-secondary">Kritik Stok</div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const badges = getProductBadges(product);
          return (
            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all">
              {/* Product Image */}
              <div className="relative h-48 bg-background">
                {product.images && product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    🥬
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-wrap gap-2">
                  {badges.map((badge, index) => (
                    <span
                      key={index}
                      className={`${badge.color} text-white text-xs font-bold px-2 py-1 rounded`}
                    >
                      {badge.text}
                    </span>
                  ))}
                </div>

                {/* Status Toggle */}
                <div className="absolute top-2 right-2">
                  <button
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.status === 'active'
                        ? 'bg-success text-white'
                        : 'bg-gray-400 text-white'
                    }`}
                  >
                    {product.status === 'active' ? 'Yayında' : 'Taslak'}
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-text-primary text-lg mb-2">{product.name}</h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-primary">₺{product.price}</span>
                  <span className="text-sm text-text-secondary">Stok: {product.stock}</span>
                </div>

                {/* Variants Preview */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs text-text-secondary mb-1">Varyantlar:</div>
                    <div className="flex flex-wrap gap-1">
                      {product.variants.slice(0, 3).map((variant) => (
                        <span
                          key={variant.id}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                        >
                          {variant.name}
                        </span>
                      ))}
                      {product.variants.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-text-secondary text-xs rounded">
                          +{product.variants.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      setShowModal(true);
                    }}
                    className="flex-1 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all text-sm font-medium"
                  >
                    Düzenle
                  </button>
                  <button className="px-3 py-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-all text-sm font-medium">
                    Sil
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-text-primary">
                  {editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-text-secondary hover:text-text-primary text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-text-primary">Temel Bilgiler</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Ürün Adı *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-primary/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Kategori *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-primary/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      required
                    >
                      <option value="">Seçiniz</option>
                      <option value="sebze">Sebzeler</option>
                      <option value="meyve">Meyveler</option>
                      <option value="sarkuteri">Şarküteri</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Fiyat (₺) *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-primary/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Birim *
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-primary/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      required
                    >
                      <option value="">Seçiniz</option>
                      <option value="kg">Kilogram</option>
                      <option value="adet">Adet</option>
                      <option value="lt">Litre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Stok *
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-primary/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Product Type */}
              <div className="space-y-4">
                <h4 className="font-semibold text-text-primary">Ürün Tipi</h4>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_bundle}
                      onChange={(e) => setFormData({ ...formData, is_bundle: e.target.checked })}
                      className="w-5 h-5 text-primary"
                    />
                    <span className="text-sm font-medium text-text-primary">🎁 Paket Ürün</span>
                  </label>
                </div>
                {formData.is_bundle && (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <p className="text-sm text-purple-700">
                      Bu ürün birden fazla ürünü içeren bir pakettir. Paket içeriğini belirtebilirsiniz.
                    </p>
                  </div>
                )}
              </div>

              {/* Variants */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-text-primary">Varyantlar (Opsiyonel)</h4>
                  <span className="text-xs text-text-secondary">Örn: Küçük, Orta, Büyük</span>
                </div>

                {/* Existing Variants */}
                {variants.length > 0 && (
                  <div className="space-y-2">
                    {variants.map((variant) => (
                      <div
                        key={variant.id}
                        className="flex items-center justify-between bg-background rounded-lg p-3"
                      >
                        <div>
                          <span className="font-medium text-text-primary">{variant.name}</span>
                          <span className="text-sm text-text-secondary ml-3">
                            {variant.price_modifier > 0 ? '+' : ''}{variant.price_modifier}₺ | Stok: {variant.stock}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(variant.id)}
                          className="text-error hover:text-error/80"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Variant */}
                <div className="border-2 border-dashed border-primary/30 rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        value={newVariant.name}
                        onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                        placeholder="Varyant adı (örn: Küçük)"
                        className="w-full px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={newVariant.price_modifier}
                        onChange={(e) => setNewVariant({ ...newVariant, price_modifier: parseFloat(e.target.value) })}
                        placeholder="Fiyat farkı"
                        className="w-full px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={newVariant.stock}
                        onChange={(e) => setNewVariant({ ...newVariant, stock: parseInt(e.target.value) })}
                        placeholder="Stok"
                        className="w-full px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="mt-3 w-full px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all font-medium"
                  >
                    + Varyant Ekle
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 border-2 border-primary/30 text-primary rounded-xl hover:bg-primary/5 transition-all font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-600 transition-all font-semibold shadow-md hover:shadow-lg"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsAdvanced;
