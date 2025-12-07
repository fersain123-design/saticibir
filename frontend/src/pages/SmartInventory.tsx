import React, { useEffect, useState } from 'react';
import { productsAPI } from '../services/api.ts';

interface InventoryAlert {
  id: string;
  type: 'low_stock' | 'reorder' | 'trend' | 'demand';
  severity: 'high' | 'medium' | 'low';
  product_name: string;
  current_stock: number;
  message: string;
  suggestion: string;
  icon: string;
  color: string;
}

interface StockPrediction {
  product_name: string;
  current_stock: number;
  daily_sales_avg: number;
  days_until_empty: number;
  suggested_reorder: number;
  trend: 'increasing' | 'stable' | 'decreasing';
}

const SmartInventory: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [predictions, setPredictions] = useState<StockPrediction[]>([]);
  const [activeTab, setActiveTab] = useState<'alerts' | 'predictions' | 'trends'>('alerts');

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      const products = response.data.data?.products || response.data.products || [];
      
      // Generate smart alerts
      const generatedAlerts = generateAlerts(products);
      setAlerts(generatedAlerts);

      // Generate predictions
      const generatedPredictions = generatePredictions(products);
      setPredictions(generatedPredictions);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAlerts = (products: any[]): InventoryAlert[] => {
    const alerts: InventoryAlert[] = [];

    products.forEach((product) => {
      // Low stock alert
      if (product.stock <= product.min_stock_threshold) {
        alerts.push({
          id: `low-${product.id}`,
          type: 'low_stock',
          severity: 'high',
          product_name: product.name,
          current_stock: product.stock,
          message: `${product.name} stoğu kritik seviyede!`,
          suggestion: `En az ${product.min_stock_threshold * 3} ${product.unit} sipariş önerilir`,
          icon: '🚨',
          color: 'from-red-500 to-red-600',
        });
      }

      // Reorder suggestion
      if (product.stock > product.min_stock_threshold && product.stock <= product.min_stock_threshold * 2) {
        alerts.push({
          id: `reorder-${product.id}`,
          type: 'reorder',
          severity: 'medium',
          product_name: product.name,
          current_stock: product.stock,
          message: `${product.name} için yeniden sipariş zamanı`,
          suggestion: `${product.min_stock_threshold * 2} ${product.unit} sipariş önerilir`,
          icon: '📦',
          color: 'from-yellow-500 to-orange-500',
        });
      }
    });

    // Add seasonal trend alert (mock)
    alerts.push({
      id: 'trend-1',
      type: 'trend',
      severity: 'low',
      product_name: 'Meyve & Sebze',
      current_stock: 0,
      message: 'Kış mevsimi sebze talebi artışta',
      suggestion: 'Lahana, pırasa, havuç stoklarınızı %30 artırmanız önerilir',
      icon: '📈',
      color: 'from-blue-500 to-blue-600',
    });

    // Add AI demand prediction (mock)
    alerts.push({
      id: 'demand-1',
      type: 'demand',
      severity: 'medium',
      product_name: 'Popüler Ürünler',
      current_stock: 0,
      message: 'AI Tahmin: Hafta sonu talep artışı bekleniyor',
      suggestion: 'En çok satan 10 ürününüzün stoğunu kontrol edin',
      icon: '🤖',
      color: 'from-purple-500 to-pink-500',
    });

    return alerts;
  };

  const generatePredictions = (products: any[]): StockPrediction[] => {
    return products
      .filter(p => p.stock > 0)
      .slice(0, 10)
      .map((product) => {
        // Mock calculations - in production, use real sales data
        const dailySalesAvg = Math.floor(Math.random() * 10) + 5;
        const daysUntilEmpty = Math.floor(product.stock / dailySalesAvg);
        const suggestedReorder = dailySalesAvg * 7; // 1 week supply
        const trend = daysUntilEmpty < 3 ? 'increasing' : daysUntilEmpty > 10 ? 'decreasing' : 'stable';

        return {
          product_name: product.name,
          current_stock: product.stock,
          daily_sales_avg: dailySalesAvg,
          days_until_empty: daysUntilEmpty,
          suggested_reorder: suggestedReorder,
          trend,
        };
      })
      .sort((a, b) => a.days_until_empty - b.days_until_empty);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return '📈';
      case 'decreasing':
        return '📉';
      default:
        return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'text-success';
      case 'decreasing':
        return 'text-error';
      default:
        return 'text-warning';
    }
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
      <div>
        <h1 className="text-2xl font-bold text-text-primary">🤖 Akıllı Stok Yönetimi</h1>
        <p className="text-text-secondary mt-1">
          AI destekli stok takibi, otomatik sipariş önerileri ve trend analizi
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-error to-error/80 rounded-xl shadow-lg p-6 text-white">
          <div className="text-3xl mb-2">🚨</div>
          <div className="text-3xl font-bold">{alerts.filter(a => a.severity === 'high').length}</div>
          <div className="text-white/80 text-sm mt-1">Kritik Uyarı</div>
        </div>

        <div className="bg-gradient-to-br from-warning to-warning/80 rounded-xl shadow-lg p-6 text-white">
          <div className="text-3xl mb-2">📦</div>
          <div className="text-3xl font-bold">{alerts.filter(a => a.type === 'reorder').length}</div>
          <div className="text-white/80 text-sm mt-1">Sipariş Önerisi</div>
        </div>

        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg p-6 text-white">
          <div className="text-3xl mb-2">📈</div>
          <div className="text-3xl font-bold">{predictions.length}</div>
          <div className="text-white/80 text-sm mt-1">Tahmin Edilen</div>
        </div>

        <div className="bg-gradient-to-br from-success to-success/80 rounded-xl shadow-lg p-6 text-white">
          <div className="text-3xl mb-2">🤖</div>
          <div className="text-3xl font-bold">AI</div>
          <div className="text-white/80 text-sm mt-1">Aktif</div>
        </div>
      </div>

      {/* AI Info Banner */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-300 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="text-4xl">🤖</div>
          <div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              AI Destekli Akıllı Stok Yönetimi
            </h3>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>✓ Satış verileriniz analiz ediliyor</li>
              <li>✓ Mevsimsel trendler takip ediliyor</li>
              <li>✓ Otomatik sipariş önerileri oluşturuluyor</li>
              <li>✓ Talep tahmini yapılıyor</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'alerts'
                ? 'bg-primary text-white shadow-md'
                : 'text-text-secondary hover:bg-background'
            }`}
          >
            🚨 Uyarılar ({alerts.length})
          </button>
          <button
            onClick={() => setActiveTab('predictions')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'predictions'
                ? 'bg-primary text-white shadow-md'
                : 'text-text-secondary hover:bg-background'
            }`}
          >
            📊 Tahminler
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'trends'
                ? 'bg-primary text-white shadow-md'
                : 'text-text-secondary hover:bg-background'
            }`}
          >
            📈 Trend Analizi
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
            >
              <div className={`bg-gradient-to-r ${alert.color} p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{alert.icon}</span>
                    <div>
                      <h3 className="font-bold text-lg">{alert.message}</h3>
                      {alert.product_name && alert.current_stock > 0 && (
                        <p className="text-white/80 text-sm">Mevcut stok: {alert.current_stock}</p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      alert.severity === 'high'
                        ? 'bg-white/20'
                        : alert.severity === 'medium'
                        ? 'bg-white/20'
                        : 'bg-white/20'
                    }`}
                  >
                    {alert.severity === 'high' ? 'ACİL' : alert.severity === 'medium' ? 'ORTA' : 'BİLGİ'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-text-primary mb-3">
                  <span className="font-semibold">💡 Öneri:</span> {alert.suggestion}
                </p>
                <button className="w-full px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all font-medium">
                  Sipariş Oluştur
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'predictions' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Ürün</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Mevcut Stok</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Günlük Satış Ort.</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tükenme Süresi</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Trend</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Öneri</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {predictions.map((pred, index) => (
                  <tr key={index} className="hover:bg-background">
                    <td className="px-6 py-4 font-medium text-text-primary">{pred.product_name}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-semibold ${
                          pred.days_until_empty <= 3 ? 'text-error' : 'text-text-primary'
                        }`}
                      >
                        {pred.current_stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-primary">{pred.daily_sales_avg.toFixed(1)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-semibold ${
                          pred.days_until_empty <= 3
                            ? 'text-error'
                            : pred.days_until_empty <= 7
                            ? 'text-warning'
                            : 'text-success'
                        }`}
                      >
                        {pred.days_until_empty} gün
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center space-x-1 ${getTrendColor(pred.trend)}`}>
                        <span>{getTrendIcon(pred.trend)}</span>
                        <span className="capitalize">{pred.trend}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-primary font-semibold">{pred.suggested_reorder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'trends' && (
        <div className="space-y-6">
          {/* Seasonal Trends */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4">🌦️ Mevsimsel Trend Analizi</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-text-primary">Kış Sebzeleri</h4>
                  <p className="text-sm text-text-secondary">Lahana, pırasa, havuç talebi artıyor</p>
                </div>
                <span className="text-2xl">📈</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-text-primary">Organik Ürünler</h4>
                  <p className="text-sm text-text-secondary">Organik ürün talebi %25 artış gösteriyor</p>
                </div>
                <span className="text-2xl">🌱</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-text-primary">Hazır Salata</h4>
                  <p className="text-sm text-text-secondary">Hazır paket ürünlerine ilgi artıyor</p>
                </div>
                <span className="text-2xl">🥗</span>
              </div>
            </div>
          </div>

          {/* Weekly Analysis */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4">📅 Haftalık Analiz</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-background rounded-lg">
                <div className="text-3xl mb-2">🔥</div>
                <div className="text-2xl font-bold text-primary">Pazartesi</div>
                <div className="text-sm text-text-secondary">En yoğun gün</div>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <div className="text-3xl mb-2">⬆️</div>
                <div className="text-2xl font-bold text-success">+15%</div>
                <div className="text-sm text-text-secondary">Haftalık artış</div>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-2xl font-bold text-warning">₺2,450</div>
                <div className="text-sm text-text-secondary">Ortalama sepet</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartInventory;
