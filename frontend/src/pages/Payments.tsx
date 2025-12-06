import React, { useState } from 'react';

const Payments: React.FC = () => {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Mock data
  const balance = {
    available: 12450.75,
    pending: 3200.50,
    total: 15651.25,
  };

  const paymentHistory = [
    { id: '1', date: '2024-12-01', amount: 5000, status: 'completed', method: 'IBAN Transfer' },
    { id: '2', date: '2024-11-25', amount: 3500, status: 'completed', method: 'IBAN Transfer' },
    { id: '3', date: '2024-11-15', amount: 7200, status: 'completed', method: 'IBAN Transfer' },
  ];

  const commissions = [
    { category: 'Sebzeler', rate: 12, amount: 450.50 },
    { category: 'Meyveler', rate: 10, amount: 320.75 },
    { category: 'Diğer', rate: 15, amount: 180.25 },
  ];

  const handleWithdraw = () => {
    alert(`Çekim talebi oluşturuldu: ₺${withdrawAmount}`);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Ödemeler ve Gelir Yönetimi</h1>
        <p className="text-text-secondary mt-1">Kazançlarınızı takip edin ve para çekin</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-success to-success/80 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-sm">Kullanılabilir Bakiye</span>
            <span className="text-2xl">💵</span>
          </div>
          <div className="text-3xl font-bold">₺{balance.available.toFixed(2)}</div>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="mt-4 w-full bg-white text-success py-2 rounded-lg font-semibold hover:bg-gray-50 transition-all"
          >
            Para Çek
          </button>
        </div>

        <div className="bg-gradient-to-br from-warning to-warning/80 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-sm">Bekleyen Ödemeler</span>
            <span className="text-2xl">⏳</span>
          </div>
          <div className="text-3xl font-bold">₺{balance.pending.toFixed(2)}</div>
          <p className="text-xs text-white/70 mt-2">Sipariş tamamlandığında kullanılabilir olacak</p>
        </div>

        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-sm">Toplam Kazancınız</span>
            <span className="text-2xl">💰</span>
          </div>
          <div className="text-3xl font-bold">₺{balance.total.toFixed(2)}</div>
          <p className="text-xs text-white/70 mt-2">Bu ay toplam gelir</p>
        </div>
      </div>

      {/* Commission Details */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">📈 Komisyon Detayları</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Kategori</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Komisyon Oranı</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-text-secondary">Bu Ay Kesilen</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {commissions.map((comm, index) => (
                <tr key={index} className="hover:bg-background">
                  <td className="px-4 py-3 text-sm text-text-primary">{comm.category}</td>
                  <td className="px-4 py-3 text-sm text-text-primary">%{comm.rate}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-error">
                    -₺{comm.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">💳 Ödeme Geçmişi</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Tarih</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Tutar</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Yöntem</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paymentHistory.map((payment) => (
                <tr key={payment.id} className="hover:bg-background">
                  <td className="px-4 py-3 text-sm text-text-primary">
                    {new Date(payment.date).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-success">₺{payment.amount}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{payment.method}</td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                      ✓ Tamamlandı
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-text-primary">Para Çekme Talebi</h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-text-secondary hover:text-text-primary text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <p className="text-sm text-text-secondary mb-1">Kullanılabilir Bakiye</p>
                <p className="text-2xl font-bold text-primary">₺{balance.available.toFixed(2)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Çekim Tutarı (₺)
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Minimum ₺500"
                  className="w-full px-4 py-3 bg-white border-2 border-primary/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
              </div>

              <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
                <p className="text-xs text-warning">
                  ⚠️ <strong>Bilgi:</strong> Minimum çekim tutarı ₺500'dir. Para transfer işlemi 1-3 iş günü sürer.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-primary/30 text-primary rounded-xl hover:bg-primary/5 transition-all font-semibold"
                >
                  İptal
                </button>
                <button
                  onClick={handleWithdraw}
                  disabled={!withdrawAmount || parseFloat(withdrawAmount) < 500}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-semibold shadow-md hover:shadow-lg"
                >
                  Talebi Oluştur
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
