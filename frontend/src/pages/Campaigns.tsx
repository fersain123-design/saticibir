import React, { useState } from 'react';

interface CampaignPackage {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  duration: number;
  features: string[];
  isPopular?: boolean;
  color: string;
}

const Campaigns: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'discount' | 'campaign'>('discount');
  const [discountProducts, setDiscountProducts] = useState<any[]>([]);

  const campaignPackages: CampaignPackage[] = [
    {
      id: 'basic',
      name: 'Temel Paket',
      price: 0,
      duration: 7,
      features: [
        'Ürünlerde manuel indirim',
        'Saat 00:00 - 23:59 aktif',
        'Standart görünürlük',
        'İndirim rozeti',
      ],
      color: 'bg-gray-100',
    },
    {
      id: 'silver',
      name: 'Gümüş Kampanya',
      price: 499,
      originalPrice: 699,
      duration: 15,
      features: [
        'Ana sayfa kampanya alanı',
        'Kategori sayfasında öne çıkarılma',
        '"Kampanyada" rozeti',
        'Mobil push bildirimi (1 kez)',
        '15 gün boyunca aktif',
      ],
      color: 'bg-gradient-to-br from-gray-300 to-gray-400',
    },
    {
      id: 'gold',
      name: 'Altın Kampanya',
      price: 1299,
      originalPrice: 1799,
      duration: 30,
      features: [
        'Ana sayfa premium kampanya alanı',
        'Kategori sayfasında en üst sıra',
        '"Süper Kampanya" rozeti',
        'Mobil push bildirimi (3 kez)',
        'Email kampanyası (50.000 kişi)',
        '30 gün boyunca aktif',
        'Özel kampanya bağlantısı',
      ],
      isPopular: true,
      color: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    },
    {
      id: 'platinum',
      name: 'Platinum Kampanya',
      price: 2999,
      originalPrice: 3999,
      duration: 60,
      features: [
        'Ana sayfa carousel (ilk sıra)',
        'Tüm kategorilerde öne çıkarılma',
        '"Premium Kampanya" rozeti',
        'Mobil push bildirimi (sınırsız)',
        'Email + SMS kampanyası (100.000 kişi)',
        '60 gün boyunca aktif',
        'Özel kampanya sayfası',
        'Sosyal medya tanıtımı',
      ],
      color: 'bg-gradient-to-br from-purple-500 to-purple-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Kampanya ve İndirim Yönetimi</h1>
        <p className="text-text-secondary mt-1">
          Ürünlerinize indirim ekleyin veya ücretli kampanyalarla satışlarınızı artırın
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('discount')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'discount'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
            }`}
          >
            💸 İndirim Yönetimi (Bedava)
          </button>
          <button
            onClick={() => setActiveTab('campaign')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'campaign'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
            }`}
          >
            🚀 Üretli Kampanyalar
          </button>
        </nav>
      </div>

      {/* Discount Management Tab */}
      {activeTab === 'discount' && (
        <div className="space-y-6">
          {/* Info Card */}
          <div className="bg-gradient-to-r from-primary/5 to-background border border-primary/20 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎉</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-primary mb-2">Ücretsiz İndirim Sistemi</h3>
                <p className="text-text-secondary text-sm">
                  Ürünlerinize istediğiniz oranda indirim ekleyin. Müşterileriniz indirimli fiyatları görür ve
                  ürünlerinizde "indirimde" rozeti belirir. Bu özellik tamamen ücretsizdir!
                </p>
              </div>
            </div>
          </div>

          {/* Discount Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">İndirim Ekle</h3>
            
            <div className="space-y-4">
              {/* Select Products */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  İndirim Uygulanacak Ürünler
                </label>
                <select className="w-full px-4 py-3 bg-white border-2 border-primary/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                  <option>Tüm ürünler</option>
                  <option>Sebzeler kategorisi</option>
                  <option>Meyveler kategorisi</option>
                  <option>Seçili ürünler</option>
                </select>
              </div>

              {/* Discount Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    İndirim Tipi
                  </label>
                  <select className="w-full px-4 py-3 bg-white border-2 border-primary/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                    <option>Oran (%)</option>
                    <option>Sabit Tutar (₺)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    İndirim Oranı/Tutarı
                  </label>
                  <input
                    type="number"
                    placeholder="Örn: 25"
                    className="w-full px-4 py-3 bg-white border-2 border-primary/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Başlangıç Tarihi
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-3 bg-white border-2 border-primary/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Bitiş Tarihi
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-3 bg-white border-2 border-primary/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button className="px-6 py-3 border-2 border-primary/30 text-primary rounded-xl hover:bg-primary/5 transition-all font-semibold">
                  İptal
                </button>
                <button className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-600 transition-all font-semibold shadow-md hover:shadow-lg">
                  İndirim Ekle
                </button>
              </div>
            </div>
          </div>

          {/* Active Discounts List */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Aktif İndirimler</h3>
            <div className="text-center py-12 text-text-secondary">
              <span className="text-5xl mb-4 block">💸</span>
              <p>Henüz aktif indireminiz yok</p>
              <p className="text-sm mt-2">Yukarıdaki formdan yeni indirim ekleyebilirsiniz</p>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Packages Tab */}
      {activeTab === 'campaign' && (
        <div className="space-y-6">
          {/* Info Card */}
          <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-purple-700 mb-2">Üretli Kampanya Paketleri</h3>
                <p className="text-text-secondary text-sm">
                  Ürünlerinizi ana sayfada, kategori sayfalarında ve mobil uygulamada öne çıkarın. Push bildirimi,
                  email ve SMS ile müşterilerinize ulaşın. Satışlarınızı 10 kata kadar artırın!
                </p>
              </div>
            </div>
          </div>

          {/* Campaign Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {campaignPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  pkg.isPopular ? 'ring-2 ring-primary scale-105' : ''
                }`}
              >
                {/* Popular Badge */}
                {pkg.isPopular && (
                  <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    ⭐ EN POPÜLER
                  </div>
                )}

                {/* Package Header */}
                <div className={`${pkg.color} p-6 text-center`}>
                  <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                  <div className="flex items-center justify-center space-x-2">
                    {pkg.originalPrice && (
                      <span className="text-white/70 line-through text-sm">
                        ₺{pkg.originalPrice}
                      </span>
                    )}
                    <span className="text-3xl font-bold text-white">
                      {pkg.price === 0 ? 'ÜCRETSiZ' : `₺${pkg.price}`}
                    </span>
                  </div>
                  <p className="text-white/90 text-sm mt-2">{pkg.duration} gün</p>
                </div>

                {/* Features */}
                <div className="p-6">
                  <ul className="space-y-3">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-success flex-shrink-0 mt-0.5">✓</span>
                        <span className="text-sm text-text-secondary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <div className="p-6 pt-0">
                  <button
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      pkg.price === 0
                        ? 'bg-gray-100 text-text-primary hover:bg-gray-200'
                        : 'bg-primary text-white hover:bg-primary-600 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {pkg.price === 0 ? 'Kullanımda' : 'Kampanya Başlat'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">📈 Kampanya İstatistikleri</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">0</div>
                <div className="text-sm text-text-secondary mt-1">Aktif Kampanya</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success">0</div>
                <div className="text-sm text-text-secondary mt-1">Toplam Görüntülenme</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-warning">0</div>
                <div className="text-sm text-text-secondary mt-1">Kampanya Satışı</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;
