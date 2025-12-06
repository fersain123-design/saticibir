import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days'>('30days');

  // Mock data - Sales trend
  const salesData = {
    labels: ['1 Ara', '5 Ara', '10 Ara', '15 Ara', '20 Ara', '25 Ara', '30 Ara'],
    datasets: [
      {
        label: 'Satışlar (₺)',
        data: [1200, 1900, 3000, 2500, 4200, 3800, 4500],
        borderColor: '#0A6A40',
        backgroundColor: 'rgba(10, 106, 64, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Order count data
  const orderData = {
    labels: ['1 Ara', '5 Ara', '10 Ara', '15 Ara', '20 Ara', '25 Ara', '30 Ara'],
    datasets: [
      {
        label: 'Sipariş Sayısı',
        data: [12, 19, 25, 22, 35, 30, 38],
        backgroundColor: '#0A6A40',
      },
    ],
  };

  // Category distribution
  const categoryData = {
    labels: ['Sebzeler', 'Meyveler', 'Sarküteri', 'Diğer'],
    datasets: [
      {
        data: [35, 30, 20, 15],
        backgroundColor: ['#0A6A40', '#E8A400', '#FF6B6B', '#4ECDC4'],
      },
    ],
  };

  // Top products
  const topProducts = [
    { name: 'Domates', sales: 156, revenue: 2340, trend: '+12%' },
    { name: 'Salatalık', sales: 142, revenue: 2130, trend: '+8%' },
    { name: 'Elma', sales: 128, revenue: 1920, trend: '+15%' },
    { name: 'Muz', sales: 98, revenue: 1470, trend: '+5%' },
    { name: 'Patates', sales: 87, revenue: 1305, trend: '+3%' },
  ];

  // Performance metrics
  const metrics = [
    { label: 'Ortalama Sepet', value: '₺345', change: '+8.2%', positive: true },
    { label: 'Dönüşüm Oranı', value: '3.2%', change: '+0.5%', positive: true },
    { label: 'Ürün Görüntülenme', value: '12,450', change: '+22%', positive: true },
    { label: 'İade Oranı', value: '1.8%', change: '-0.3%', positive: true },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Analitik ve Raporlar</h1>
          <p className="text-text-secondary mt-1">Satış performansınızı detaylı inceleyin</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="px-4 py-2 bg-white border-2 border-primary/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
        >
          <option value="7days">Son 7 Gün</option>
          <option value="30days">Son 30 Gün</option>
          <option value="90days">Son 90 Gün</option>
        </select>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-text-secondary mb-2">{metric.label}</p>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-text-primary">{metric.value}</span>
              <span
                className={`text-sm font-medium ${
                  metric.positive ? 'text-success' : 'text-error'
                }`}
              >
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">📈 Satış Trendi</h3>
          <div className="h-64">
            <Line data={salesData} options={chartOptions} />
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">🥧 Kategori Dağılımı</h3>
          <div className="h-64">
            <Doughnut data={categoryData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">📊 Sipariş Sayısı Trendi</h3>
        <div className="h-64">
          <Bar data={orderData} options={chartOptions} />
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">🏆 En Çok Satan Ürünler</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">#</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Ürün</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-text-secondary">Satış Adet</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-text-secondary">Gelir</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-text-secondary">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {topProducts.map((product, index) => (
                <tr key={index} className="hover:bg-background">
                  <td className="px-4 py-3 text-sm font-medium text-text-primary">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-text-primary">{product.name}</td>
                  <td className="px-4 py-3 text-sm text-right text-text-primary">{product.sales}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-success">
                    ₺{product.revenue}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-success">{product.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex justify-end space-x-3">
        <button className="px-6 py-3 bg-white border-2 border-primary/30 text-primary rounded-xl hover:bg-primary/5 transition-all font-semibold flex items-center space-x-2">
          <span>📊</span>
          <span>Excel İndir</span>
        </button>
        <button className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-600 transition-all font-semibold shadow-md hover:shadow-lg flex items-center space-x-2">
          <span>📝</span>
          <span>PDF Rapor</span>
        </button>
      </div>
    </div>
  );
};

export default Analytics;
