import React, { useState } from 'react';

const Help: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [supportTicket, setSupportTicket] = useState({ subject: '', message: '' });

  const faqCategories = [
    {
      id: 'orders',
      title: 'Sipariş Yönetimi',
      icon: '📦',
      questions: [
        {
          q: 'Sipariş nasıl kabul edilir?',
          a: 'Siparişler sayfasından yeni siparişler listelenir. "Hazırla" butonuna tıklayarak siparişi kabul edebilirsiniz.',
        },
        {
          q: 'Sipariş durumu nasıl güncellenir?',
          a: 'Sipariş detay sayfasında "Durum Güncelle" bölümünden siparişin durumunu değiştirebilirsiniz.',
        },
      ],
    },
    {
      id: 'products',
      title: 'Ürün Yönetimi',
      icon: '🥬',
      questions: [
        {
          q: 'Yeni ürün nasıl eklenir?',
          a: 'Ürünler sayfasından "Yeni Ürün" butonuna tıklayın. Ürün bilgilerini doldurun ve kaydedin.',
        },
        {
          q: 'Stok nasıl güncellenir?',
          a: 'Ürün düzenle sayfasında stok alanını güncelleyebilirsiniz. Ayrıca toplu stok güncellemesi yapabilirsiniz.',
        },
      ],
    },
    {
      id: 'payments',
      title: 'Ödeme ve Gelir',
      icon: '💰',
      questions: [
        {
          q: 'Para nasıl çekilir?',
          a: 'Ödemeler sayfasından "Para Çek" butonuna tıklayın. Minimum çekim tutarı ₺500\'dir.',
        },
        {
          q: 'Komisyon oranları nedir?',
          a: 'Komisyon oranları kategori bazında değişir. Sebzeler %12, Meyveler %10, Diğer %15\'dir.',
        },
      ],
    },
    {
      id: 'campaigns',
      title: 'Kampanyalar',
      icon: '🎁',
      questions: [
        {
          q: 'İndirim nasıl uygulanır?',
          a: 'Kampanyalar sayfasından "İndirim Yönetimi" sekmesine gidin. Ürün seçin ve indirim oranını belirleyin.',
        },
        {
          q: 'Üretli kampanya paketleri nedir?',
          a: 'Üretli kampanyalar ile ürünlerinizi ana sayfada, kategori sayfalarında ve mobil uygulamada öne çıkarabilirsiniz.',
        },
      ],
    },
  ];

  const videoTutorials = [
    { title: 'İlk Ürün Ekleme', duration: '3:45', thumbnail: '📹' },
    { title: 'Sipariş Süreci', duration: '5:20', thumbnail: '📹' },
    { title: 'Para Çekme', duration: '2:30', thumbnail: '📹' },
    { title: 'Kampanya Oluşturma', duration: '4:15', thumbnail: '📹' },
  ];

  const handleSupportTicket = () => {
    alert('Destek talebiniz oluşturuldu. En kısa sürede size dönüş yapacağız.');
    setSupportTicket({ subject: '', message: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Yardım Merkezi</h1>
        <p className="text-text-secondary mt-1">Size nasıl yardımcı olabiliriz?</p>
      </div>

      {/* Quick Contact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg p-6 text-white">
          <div className="text-3xl mb-3">📞</div>
          <div className="font-semibold mb-1">Telefon Desteği</div>
          <div className="text-white/80 text-sm mb-3">7/24 Canlı Destek</div>
          <a href="tel:+908501234567" className="text-sm font-medium underline">
            0850 123 45 67
          </a>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl mb-3">📧</div>
          <div className="font-semibold mb-1 text-text-primary">Email</div>
          <div className="text-text-secondary text-sm mb-3">24 saat içinde cevap</div>
          <a href="mailto:destek@manavim.com" className="text-sm text-primary font-medium underline">
            destek@manavim.com
          </a>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl mb-3">💬</div>
          <div className="font-semibold mb-1 text-text-primary">Canlı Chat</div>
          <div className="text-text-secondary text-sm mb-3">Anında yanıt</div>
          <button className="text-sm text-primary font-medium underline">Chat Başlat</button>
        </div>
      </div>

      {/* Video Tutorials */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">🎥 Video Eğitimler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {videoTutorials.map((video, index) => (
            <div
              key={index}
              className="bg-background rounded-xl p-4 hover:bg-primary/5 cursor-pointer transition-all"
            >
              <div className="text-5xl mb-3 text-center">{video.thumbnail}</div>
              <div className="font-medium text-text-primary text-sm text-center">{video.title}</div>
              <div className="text-xs text-text-secondary text-center mt-1">{video.duration}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">❓ Sık Sorulan Sorular</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {faqCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedCategory === category.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{category.icon}</span>
                <span className="font-semibold text-text-primary">{category.title}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Category Questions */}
        {selectedCategory && (
          <div className="space-y-4">
            {faqCategories
              .find((c) => c.id === selectedCategory)
              ?.questions.map((qa, index) => (
                <div key={index} className="bg-background rounded-xl p-4">
                  <div className="font-semibold text-primary mb-2">Q: {qa.q}</div>
                  <div className="text-text-primary text-sm">A: {qa.a}</div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Support Ticket */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">🎫 Destek Talebi Oluştur</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Konu</label>
            <input
              type="text"
              value={supportTicket.subject}
              onChange={(e) => setSupportTicket({ ...supportTicket, subject: e.target.value })}
              placeholder="Sorun başlığını yazın"
              className="w-full px-4 py-3 bg-white border-2 border-primary/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Mesaj</label>
            <textarea
              value={supportTicket.message}
              onChange={(e) => setSupportTicket({ ...supportTicket, message: e.target.value })}
              rows={5}
              placeholder="Sorununuzu detaylı anlatın..."
              className="w-full px-4 py-3 bg-white border-2 border-primary/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSupportTicket}
              disabled={!supportTicket.subject || !supportTicket.message}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-semibold shadow-md hover:shadow-lg"
            >
              Talep Gönder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
