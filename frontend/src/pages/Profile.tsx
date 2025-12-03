import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { vendorAPI, authAPI } from '../services/api.ts';

const Profile: React.FC = () => {
  const { vendor, refreshVendor } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    owner_name: vendor?.owner_name || '',
    phone: vendor?.phone || '',
    store_name: vendor?.store_name || '',
    store_type: vendor?.store_type || '',
    store_description: vendor?.store_description || '',
  });

  const [paymentData, setPaymentData] = useState({
    account_holder_name: vendor?.payment_info?.account_holder_name || '',
    bank_name: vendor?.payment_info?.bank_name || '',
    iban: vendor?.payment_info?.iban || '',
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await vendorAPI.updateProfile(formData);
      await refreshVendor();
      setSuccess('Profil başarıyla güncellendi');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Profil güncellenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('Yeni şifreler eşleşmiyor');
      return;
    }

    if (passwordData.new_password.length < 6) {
      setError('Yeni şifre en az 6 karakter olmalıdır');
      return;
    }

    setLoading(true);
    try {
      await authAPI.changePassword(passwordData.current_password, passwordData.new_password);
      setSuccess('Şifre başarıyla değiştirildi');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Şifre değiştirilemedi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Profil Ayarları</h1>

      {success && (
        <div className="bg-primary-50 border border-green-200 rounded-lg p-4 text-primary-700">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-error/5 border border-error rounded-lg p-4 text-error">
          {error}
        </div>
      )}

      {/* Account Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Hesap Durumu</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-text-secondary">Email</span>
            <span className="font-medium">{vendor?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Hesap Durumu</span>
            <span
              className={`px-3 py-1 text-sm rounded-full ${
                vendor?.status === 'approved'
                  ? 'bg-success/10 text-success'
                  : vendor?.status === 'pending_review'
                  ? 'bg-warning/10 text-warning'
                  : 'bg-error/10 text-error'
              }`}
            >
              {vendor?.status === 'approved' && '✓ Onaylı'}
              {vendor?.status === 'pending_review' && '⏳ İnceleniyor'}
              {vendor?.status === 'rejected' && '✕ Reddedildi'}
              {vendor?.status === 'suspended' && '⊘ Askıda'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Kayıt Tarihi</span>
            <span className="font-medium">
              {vendor?.created_at && new Date(vendor.created_at).toLocaleDateString('tr-TR')}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleProfileSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Profil Bilgileri</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Yetkili Kişi Adı</label>
            <input
              type="text"
              name="owner_name"
              value={formData.owner_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-light rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Telefon</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-light rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Mağaza Adı</label>
          <input
            type="text"
            name="store_name"
            value={formData.store_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-light rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Mağaza Tipi</label>
          <select
            name="store_type"
            value={formData.store_type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-light rounded-lg focus:ring-2 focus:ring-primary"
          >
            <option value="">Seçiniz</option>
            <option value="manav">Manav</option>
            <option value="market">Market</option>
            <option value="sarkuteri">Şarküteri</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Mağaza Açıklaması</label>
          <textarea
            name="store_description"
            value={formData.store_description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-light rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:bg-gray"
          >
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>

      {/* Address Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Adres Bilgileri</h2>
        <div className="space-y-2 text-sm">
          <p>
            <span className="text-text-secondary">İl:</span>{' '}
            <span className="font-medium">{vendor?.address?.province}</span>
          </p>
          <p>
            <span className="text-text-secondary">İlçe:</span>{' '}
            <span className="font-medium">{vendor?.address?.district}</span>
          </p>
          <p>
            <span className="text-text-secondary">Adres:</span>{' '}
            <span className="font-medium">{vendor?.address?.full_address}</span>
          </p>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Belgeler</h2>
        <div className="space-y-3">
          {vendor?.documents?.tax_sheet_url && (
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div>
                <p className="font-medium text-text-primary">Vergi Levhası</p>
                <p className="text-sm text-text-secondary">Yüklenmiş</p>
              </div>
              <a
                href={vendor.documents.tax_sheet_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-700"
              >
                Görüntüle
              </a>
            </div>
          )}
          {!vendor?.documents?.tax_sheet_url && (
            <p className="text-text-secondary text-sm">Henüz belge yüklenmemiş</p>
          )}
        </div>
      </div>

      {/* Password Change */}
      <form onSubmit={handlePasswordSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Şifre Değiştir</h2>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Mevcut Şifre</label>
          <input
            type="password"
            name="current_password"
            value={passwordData.current_password}
            onChange={handlePasswordChange}
            className="w-full px-4 py-2 border border-gray-light rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Yeni Şifre</label>
            <input
              type="password"
              name="new_password"
              value={passwordData.new_password}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border border-gray-light rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Yeni Şifre (Tekrar)</label>
            <input
              type="password"
              name="confirm_password"
              value={passwordData.confirm_password}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border border-gray-light rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:bg-gray"
          >
            Şifre Değiştir
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
