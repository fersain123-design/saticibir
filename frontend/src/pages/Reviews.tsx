import React, { useState } from 'react';

interface Review {
  id: string;
  customerName: string;
  productName: string;
  rating: number;
  comment: string;
  date: string;
  replied: boolean;
  reply?: string;
}

const Reviews: React.FC = () => {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState('');
  const [filter, setFilter] = useState<'all' | 'replied' | 'pending'>('all');

  // Mock data
  const reviews: Review[] = [
    {
      id: '1',
      customerName: 'Ahmet Y.',
      productName: 'Domates',
      rating: 5,
      comment: 'Çok taze ve kaliteliydi. Paketleme de mükemmeldi. Teşekkürler!',
      date: '2024-12-05',
      replied: true,
      reply: 'Güzel yorumunuz için teşekkür ederiz! Tekrar bekliyoruz.',
    },
    {
      id: '2',
      customerName: 'Zeynep K.',
      productName: 'Salatalık',
      rating: 4,
      comment: 'İyi ama biraz daha taze olabilirdi.',
      date: '2024-12-04',
      replied: false,
    },
    {
      id: '3',
      customerName: 'Mehmet S.',
      productName: 'Elma',
      rating: 5,
      comment: 'Harika! Çok lezzetliydi, ailecek beğendik.',
      date: '2024-12-03',
      replied: false,
    },
  ];

  const filteredReviews = reviews.filter((review) => {
    if (filter === 'replied') return review.replied;
    if (filter === 'pending') return !review.replied;
    return true;
  });

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  const handleReply = () => {
    alert(`Yanıt gönderildi: ${replyText}`);
    setSelectedReview(null);
    setReplyText('');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-warning' : 'text-gray-300'}>
        ⭐
      </span>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Yorumlar ve Değerlendirmeler</h1>
        <p className="text-text-secondary mt-1">Müşteri yorumlarını yönetin ve yanıtlayın</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-warning to-warning/80 rounded-xl shadow-lg p-6 text-white">
          <div className="text-center">
            <div className="text-4xl font-bold">{averageRating}</div>
            <div className="flex justify-center mt-2">{renderStars(Math.round(parseFloat(averageRating)))}</div>
            <div className="text-sm text-white/80 mt-2">Ortalama Puan</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{reviews.length}</div>
            <div className="text-sm text-text-secondary mt-2">Toplam Yorum</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-success">{reviews.filter(r => r.replied).length}</div>
            <div className="text-sm text-text-secondary mt-2">Yanıtlanan</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-error">{reviews.filter(r => !r.replied).length}</div>
            <div className="text-sm text-text-secondary mt-2">Bekleyen</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all' ? 'bg-primary text-white' : 'bg-background text-text-primary hover:bg-primary/10'
            }`}
          >
            Tüm Yorumlar ({reviews.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'pending' ? 'bg-primary text-white' : 'bg-background text-text-primary hover:bg-primary/10'
            }`}
          >
            Bekleyenler ({reviews.filter(r => !r.replied).length})
          </button>
          <button
            onClick={() => setFilter('replied')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'replied' ? 'bg-primary text-white' : 'bg-background text-text-primary hover:bg-primary/10'
            }`}
          >
            Yanıtlananlar ({reviews.filter(r => r.replied).length})
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">{review.customerName.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary">{review.customerName}</div>
                    <div className="text-sm text-text-secondary">{review.productName}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  {renderStars(review.rating)}
                  <span className="text-sm text-text-secondary">
                    {new Date(review.date).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <p className="text-text-primary">{review.comment}</p>

                {/* Reply */}
                {review.replied && review.reply && (
                  <div className="mt-4 bg-primary/5 border-l-4 border-primary rounded-lg p-4">
                    <div className="text-sm font-semibold text-primary mb-1">Sizin Yanıtınız:</div>
                    <p className="text-sm text-text-primary">{review.reply}</p>
                  </div>
                )}
              </div>

              {/* Reply Button */}
              {!review.replied && (
                <button
                  onClick={() => setSelectedReview(review)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-all font-medium"
                >
                  Yanıtla
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reply Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-text-primary">Yorum Yanıtla</h3>
              <button
                onClick={() => setSelectedReview(null)}
                className="text-text-secondary hover:text-text-primary text-2xl"
              >
                ×
              </button>
            </div>

            {/* Original Review */}
            <div className="bg-background rounded-xl p-4 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-semibold">{selectedReview.customerName}</span>
                <span className="text-text-secondary">-</span>
                <span className="text-text-secondary">{selectedReview.productName}</span>
              </div>
              <div className="flex items-center mb-2">{renderStars(selectedReview.rating)}</div>
              <p className="text-text-primary">{selectedReview.comment}</p>
            </div>

            {/* Reply Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-2">Yanıtınız</label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
                placeholder="Müşteriye yanıtınızı yazın..."
                className="w-full px-4 py-3 bg-white border-2 border-primary/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            {/* Quick Responses */}
            <div className="mb-6">
              <p className="text-sm text-text-secondary mb-2">Hızlı Yanıtlar:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setReplyText('Güzel yorumunuz için teşekkür ederiz!')}
                  className="px-3 py-1 bg-background text-text-primary rounded-lg hover:bg-primary/10 text-sm"
                >
                  Teşekkür
                </button>
                <button
                  onClick={() => setReplyText('Geri bildiriminiz bizim için çok değerli. Daha iyi hizmet için çalışmaya devam edeceğiz.')}
                  className="px-3 py-1 bg-background text-text-primary rounded-lg hover:bg-primary/10 text-sm"
                >
                  İyileştirme
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedReview(null)}
                className="flex-1 px-4 py-3 border-2 border-primary/30 text-primary rounded-xl hover:bg-primary/5 transition-all font-semibold"
              >
                İptal
              </button>
              <button
                onClick={handleReply}
                disabled={!replyText}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-semibold shadow-md hover:shadow-lg"
              >
                Yanıt Gönder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
