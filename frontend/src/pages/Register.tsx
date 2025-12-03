import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api.ts';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    owner_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirm: '',
    store_name: '',
    store_type: '',
    tax_number: '',
    tax_office: '',
    address: {
      province: '',
      district: '',
      full_address: '',
    },
    tax_sheet_url: '',
  });

  const [taxSheetFile, setTaxSheetFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTaxSheetFile(file);
      // Simulate upload - in real app, upload to server first
      setFormData(prev => ({ ...prev, tax_sheet_url: `/uploads/tax_${Date.now()}.pdf` }));
    }
  };

  const validateStep1 = () => {
    if (!formData.owner_name || !formData.email || !formData.phone || !formData.password) {
      setError('Lütfen tüm alanları doldurun');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return false;
    }
    if (formData.password !== formData.password_confirm) {
      setError('Şifreler eşleşmiyor');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.store_name || !formData.address.province || !formData.address.district || !formData.address.full_address) {
      setError('Lütfen tüm alanları doldurun');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.tax_sheet_url) {
      setError('Vergi levhası yüklenmesi ZORUNLUDUR');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateStep3()) return;

    setLoading(true);
    try {
      await authAPI.register(formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Kayıt başarısız oldu');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-4">
            <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Kayıt Başarılı!</h2>
          <p className="text-text-secondary mb-4">Hesabınız inceleme aşamasındadır. Onaylanma sürecinden sonra giriş yapabileceksiniz.</p>
          <p className="text-sm text-text-secondary">Giriş sayfasına yönlendiriliyorsunuz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Manavım Logo" className="h-20 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Satıcı Kayıt</h1>
          <p className="text-text-secondary mt-2">Adım {step}/3</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className={`text-sm ${step >= 1 ? 'text-primary font-medium' : 'text-gray-400'}`}>Hesap Bilgileri</span>
            <span className={`text-sm ${step >= 2 ? 'text-primary font-medium' : 'text-gray-400'}`}>Mağaza Bilgileri</span>
            <span className={`text-sm ${step >= 3 ? 'text-primary font-medium' : 'text-gray-400'}`}>Belgeler</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-primary rounded-full transition-all" style={{ width: `${(step / 3) * 100}%` }} />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-error/5 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          {/* Step 1: Account Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Yetkili Kişi Adı Soyadı *</label>
                <input
                  type="text"
                  name="owner_name"
                  value={formData.owner_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-light rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-light rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Telefon *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-light rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Şifre *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-light rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Şifre Tekrar *</label>
                  <input
                    type="password"
                    name="password_confirm"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-light rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Store Info */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Mağaza Adı *</label>
                <input
                  type="text"
                  name="store_name"
                  value={formData.store_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-light rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <option value="sarkuteri">Sarküteri</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Vergi Numarası</label>
                  <input
                    type="text"
                    name="tax_number"
                    value={formData.tax_number}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-light rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Vergi Dairesi</label>
                <input
                  type="text"
                  name="tax_office"
                  value={formData.tax_office}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-light rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">İl *</label>
                  <input
                    type="text"
                    name="address.province"
                    value={formData.address.province}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-light rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">İlçe *</label>
                  <input
                    type="text"
                    name="address.district"
                    value={formData.address.district}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-light rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Adres *</label>
                <textarea
                  name="address.full_address"
                  value={formData.address.full_address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-light rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 3: Documents */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-warning/5 border border-warning rounded-lg p-4 mb-4">
                <p className="text-warning font-medium">Vergi levhası yüklenmesi ZORUNLUDUR</p>
                <p className="text-yellow-700 text-sm mt-1">PDF, JPG veya PNG formatında yükleyebilirsiniz</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Vergi Levhası *</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-light rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
                {taxSheetFile && (
                  <p className="text-sm text-primary mt-2">✓ {taxSheetFile.name} seçildi</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 border border-gray-light rounded-lg text-text-primary hover:bg-gray-50"
              >
                Geri
              </button>
            )}
            <div className="ml-auto">
              {step < 3 ? (
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
                >
                  Devam
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-400"
                >
                  {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
                </button>
              )}
            </div>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-text-secondary">
            Zaten hesabınız var mı?{' '}
            <Link to="/login" className="text-primary hover:text-primary-700 font-medium">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
