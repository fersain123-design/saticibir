import React, { useState, useEffect } from 'react';
import { multiChannelAPI } from '../services/api.ts';

interface Channel {
  id: string;
  name: string;
  icon: string;
  color: string;
  status: 'active' | 'inactive' | 'pending';
  description: string;
  stats?: {
    products?: number;
    orders?: number;
    revenue?: number;
  };
}

const MultiChannel: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: 'instagram',
      name: 'Instagram Shopping',
      icon: '📷',
      color: 'from-pink-500 to-purple-600',
      status: 'inactive',
      description: 'Instagram üzerinden doğrudan satış yapın. Ürünlerinizi story ve postlarda etiketleyin.',
      stats: { products: 0, orders: 0, revenue: 0 },
    },
    {
      id: 'facebook',
      name: 'Facebook Marketplace',
      icon: '👥',
      color: 'from-blue-600 to-blue-700',
      status: 'inactive',
      description: 'Facebook Marketplace\'te ürünlerinizi sergileyin ve yerel müşterilere ulaşın.',
      stats: { products: 0, orders: 0, revenue: 0 },
    },
    {
      id: 'google',
      name: 'Google Shopping',
      icon: '🔍',
      color: 'from-red-500 to-yellow-500',
      status: 'inactive',
      description: 'Google arama sonuçlarında ürünlerinizi gösterin. Milyonlarca alıcıya ulaşın.',
      stats: { products: 0, orders: 0, revenue: 0 },
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      icon: '💬',
      color: 'from-green-500 to-green-600',
      status: 'inactive',
      description: 'WhatsApp üzerinden sipariş alın, katalog paylaşın ve müşterilerle anında iletişim kurun.',
      stats: { products: 0, orders: 0, revenue: 0 },
    },
    {
      id: 'mobile_ios',
      name: 'iOS Mobil Uygulama',
      icon: '📱',
      color: 'from-gray-800 to-gray-900',
      status: 'pending',
      description: 'iPhone ve iPad kullanıcıları için özel mobil uygulama. App Store\'da yayınlanma hazırlığı.',
      stats: { products: 0, orders: 0, revenue: 0 },
    },
    {
      id: 'mobile_android',
      name: 'Android Mobil Uygulama',
      icon: '🤖',
      color: 'from-green-600 to-green-700',
      status: 'pending',
      description: 'Android cihazlar için özel mobil uygulama. Google Play Store\'da yayınlanma hazırlığı.',
      stats: { products: 0, orders: 0, revenue: 0 },
    },
  ]);

  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [showSetupModal, setShowSetupModal] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className=\"px-3 py-1 bg-success/20 text-success text-xs font-semibold rounded-full\">✓ Aktif</span>;
      case 'pending':
        return <span className=\"px-3 py-1 bg-warning/20 text-warning text-xs font-semibold rounded-full\">⏳ Hazırlanıyor</span>;
      default:
        return <span className=\"px-3 py-1 bg-gray-200 text-gray-600 text-xs font-semibold rounded-full\">○ Pasif</span>;
    }
  };

  const handleActivate = (channel: Channel) => {
    setSelectedChannel(channel);
    setShowSetupModal(true);
  };

  const handleSetupComplete = () => {
    if (selectedChannel) {
      setChannels(
        channels.map((ch) =>
          ch.id === selectedChannel.id ? { ...ch, status: 'active' } : ch
        )
      );
      alert(`${selectedChannel.name} başarıyla aktifleştirildi!`);
    }
    setShowSetupModal(false);
    setSelectedChannel(null);
  };

  const totalActiveChannels = channels.filter((ch) => ch.status === 'active').length;
  const totalRevenue = channels.reduce((sum, ch) => sum + (ch.stats?.revenue || 0), 0);

  return (
    <div className=\"space-y-6\">
      {/* Header */}
      <div>
        <h1 className=\"text-2xl font-bold text-text-primary\">Çok Kanallı Satış</h1>
        <p className=\"text-text-secondary mt-1\">
          Ürünlerinizi farklı platformlarda satın, satışlarınızı artırın
        </p>
      </div>

      {/* Stats Overview */}
      <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">
        <div className=\"bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg p-6 text-white\">
          <div className=\"text-3xl mb-2\">🌐</div>
          <div className=\"text-3xl font-bold\">{totalActiveChannels}/{channels.length}</div>
          <div className=\"text-white/80 text-sm mt-1\">Aktif Kanal</div>
        </div>

        <div className=\"bg-gradient-to-br from-success to-success/80 rounded-xl shadow-lg p-6 text-white\">
          <div className=\"text-3xl mb-2\">💰</div>
          <div className=\"text-3xl font-bold\">₺{totalRevenue.toFixed(2)}</div>
          <div className=\"text-white/80 text-sm mt-1\">Toplam Gelir</div>
        </div>

        <div className=\"bg-gradient-to-br from-warning to-warning/80 rounded-xl shadow-lg p-6 text-white\">
          <div className=\"text-3xl mb-2\">🚀</div>
          <div className=\"text-3xl font-bold\">
            {channels.filter((ch) => ch.status === 'pending').length}
          </div>
          <div className=\"text-white/80 text-sm mt-1\">Hazırlanan Kanal</div>
        </div>
      </div>

      {/* Info Banner */}
      <div className=\"bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6\">
        <div className=\"flex items-start space-x-4\">
          <div className=\"text-4xl\">💡</div>
          <div>
            <h3 className=\"text-lg font-semibold text-primary mb-2\">
              Çok Kanallı Satışın Avantajları
            </h3>
            <ul className=\"text-sm text-text-secondary space-y-1\">
              <li>✓ Tek panelden tüm kanalları yönetin</li>
              <li>✓ Ürün ve stok bilgileriniz otomatik senkronize olur</li>
              <li>✓ Her kanaldan gelen siparişleri tek yerden takip edin</li>
              <li>✓ Satış hacminizi 3-5 kat artırma potansiyeli</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Channels Grid */}
      <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6\">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className=\"bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all\"
          >
            {/* Channel Header */}
            <div className={`bg-gradient-to-r ${channel.color} p-6 text-white`}>
              <div className=\"flex items-center justify-between mb-3\">
                <span className=\"text-4xl\">{channel.icon}</span>
                {getStatusBadge(channel.status)}
              </div>
              <h3 className=\"text-xl font-bold\">{channel.name}</h3>
            </div>

            {/* Channel Body */}
            <div className=\"p-6\">
              <p className=\"text-sm text-text-secondary mb-4\">{channel.description}</p>

              {/* Stats */}
              {channel.status === 'active' && channel.stats && (
                <div className=\"grid grid-cols-3 gap-2 mb-4\">
                  <div className=\"text-center\">
                    <div className=\"text-lg font-bold text-primary\">{channel.stats.products}</div>
                    <div className=\"text-xs text-text-secondary\">Ürün</div>
                  </div>
                  <div className=\"text-center\">
                    <div className=\"text-lg font-bold text-primary\">{channel.stats.orders}</div>
                    <div className=\"text-xs text-text-secondary\">Sipariş</div>
                  </div>
                  <div className=\"text-center\">
                    <div className=\"text-lg font-bold text-primary\">₺{channel.stats.revenue}</div>
                    <div className=\"text-xs text-text-secondary\">Gelir</div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => handleActivate(channel)}
                disabled={channel.status === 'active'}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  channel.status === 'active'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : channel.status === 'pending'
                    ? 'bg-warning/10 text-warning hover:bg-warning/20'
                    : 'bg-primary text-white hover:bg-primary-600 shadow-md hover:shadow-lg'
                }`}
              >
                {channel.status === 'active'
                  ? 'Aktif'
                  : channel.status === 'pending'
                  ? 'Hazırlanıyor...'
                  : 'Hemen Başla'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Setup Modal */}
      {showSetupModal && selectedChannel && (
        <div className=\"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50\">
          <div className=\"bg-white rounded-2xl max-w-2xl w-full p-6\">
            <div className=\"flex items-center justify-between mb-6\">
              <h3 className=\"text-xl font-bold text-text-primary\">
                {selectedChannel.name} Kurulumu
              </h3>
              <button
                onClick={() => setShowSetupModal(false)}
                className=\"text-text-secondary hover:text-text-primary text-2xl\"
              >
                ×
              </button>
            </div>

            {/* Channel Specific Setup */}
            <div className=\"space-y-4\">
              {selectedChannel.id === 'instagram' && (
                <div>
                  <h4 className=\"font-semibold text-text-primary mb-3\">Instagram Shopping Kurulum Adımları:</h4>
                  <ol className=\"list-decimal list-inside space-y-2 text-sm text-text-secondary\">
                    <li>Instagram Business hesabınızı Facebook sayfanıza bağlayın</li>
                    <li>Ürün kataloğunuzu Meta Commerce Manager'a yükleyin</li>
                    <li>Instagram Shopping özelliğini aktifleştirin</li>
                    <li>Ürünlerinizi postlarınızda etiketlemeye başlayın</li>
                  </ol>
                  <div className=\"mt-4\">
                    <label className=\"block text-sm font-medium text-text-primary mb-2\">
                      Instagram Business Hesap Adı
                    </label>
                    <input
                      type=\"text\"
                      placeholder=\"@manavim\"
                      className=\"w-full px-4 py-3 bg-white border-2 border-primary/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all\"
                    />
                  </div>
                </div>
              )}

              {selectedChannel.id === 'facebook' && (
                <div>
                  <h4 className=\"font-semibold text-text-primary mb-3\">Facebook Marketplace Kurulum:</h4>
                  <ol className=\"list-decimal list-inside space-y-2 text-sm text-text-secondary\">
                    <li>Facebook Business hesabı oluşturun</li>
                    <li>Mağaza sayfanızı onaylayın</li>
                    <li>Ürün kataloğunuzu yükleyin</li>
                    <li>Marketplace'te satışa başlayın</li>
                  </ol>
                </div>
              )}

              {selectedChannel.id === 'google' && (
                <div>
                  <h4 className=\"font-semibold text-text-primary mb-3\">Google Shopping Kurulum:</h4>
                  <ol className=\"list-decimal list-inside space-y-2 text-sm text-text-secondary\">
                    <li>Google Merchant Center hesabı oluşturun</li>
                    <li>Web sitenizi doğrulayın</li>
                    <li>Ürün feed'inizi yükleyin</li>
                    <li>Google Ads kampanyası başlatın</li>
                  </ol>
                  <div className=\"bg-warning/10 border border-warning/20 rounded-xl p-4 mt-4\">
                    <p className=\"text-sm text-warning\">
                      ⚠️ Google Shopping için reklam bütçesi gereklidir. Minimum ₺500/ay önerilir.
                    </p>
                  </div>
                </div>
              )}

              {selectedChannel.id === 'whatsapp' && (
                <div>
                  <h4 className=\"font-semibold text-text-primary mb-3\">WhatsApp Business Kurulum:</h4>
                  <ol className=\"list-decimal list-inside space-y-2 text-sm text-text-secondary\">
                    <li>WhatsApp Business API erişimi alın</li>
                    <li>İş telefon numaranızı doğrulayın</li>
                    <li>Ürün kataloğunuzu oluşturun</li>
                    <li>Otomatik mesaj şablonlarını ayarlayın</li>
                  </ol>
                  <div className=\"mt-4\">
                    <label className=\"block text-sm font-medium text-text-primary mb-2\">
                      WhatsApp Business Telefon
                    </label>
                    <input
                      type=\"tel\"
                      placeholder=\"+90 555 123 45 67\"
                      className=\"w-full px-4 py-3 bg-white border-2 border-primary/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all\"
                    />
                  </div>
                </div>
              )}

              {(selectedChannel.id === 'mobile_ios' || selectedChannel.id === 'mobile_android') && (
                <div>
                  <h4 className=\"font-semibold text-text-primary mb-3\">Mobil Uygulama Durumu:</h4>
                  <div className=\"bg-primary/5 border border-primary/20 rounded-xl p-4\">
                    <p className=\"text-sm text-text-primary mb-2\">
                      📱 Mobil uygulamanız şu anda geliştirilme aşamasında.
                    </p>
                    <p className=\"text-sm text-text-secondary\">
                      • Tasarım: %100 Tamamlandı<br />
                      • Geliştirme: %75 Tamamlandı<br />
                      • Test: %50 Tamamlandı<br />
                      • Yayınlanma: Yakında
                    </p>
                  </div>
                  <div className=\"mt-4 bg-warning/10 border border-warning/20 rounded-xl p-4\">
                    <p className=\"text-sm text-warning\">
                      🚀 Tahmini yayın tarihi: 2-3 hafta içinde
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className=\"flex space-x-3 mt-6\">
              <button
                onClick={() => setShowSetupModal(false)}
                className=\"flex-1 px-6 py-3 border-2 border-primary/30 text-primary rounded-xl hover:bg-primary/5 transition-all font-semibold\"
              >
                İptal
              </button>
              <button
                onClick={handleSetupComplete}
                className=\"flex-1 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-600 transition-all font-semibold shadow-md hover:shadow-lg\"
              >
                {selectedChannel.status === 'pending' ? 'Bilgilendim' : 'Kurulumu Tamamla'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiChannel;
