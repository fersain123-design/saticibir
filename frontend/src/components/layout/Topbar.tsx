import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const { vendor, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getStatusBadge = () => {
    switch (vendor?.status) {
      case 'approved':
        return <span className="px-2 py-1 text-xs bg-success/10 text-success rounded-full font-medium">✓ Onaylı</span>;
      case 'pending_review':
        return <span className="px-2 py-1 text-xs bg-warning/10 text-warning rounded-full font-medium">⏳ İnceleniyor</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs bg-error/10 text-error rounded-full font-medium">✕ Reddedildi</span>;
      case 'suspended':
        return <span className="px-2 py-1 text-xs bg-gray/10 text-gray rounded-full font-medium">⊘ Askıda</span>;
      default:
        return null;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-text-secondary hover:text-text-primary"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-semibold text-text-primary">{vendor?.store_name}</h1>
            <p className="text-sm text-text-secondary">{vendor?.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {getStatusBadge()}
          
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 text-text-primary hover:text-primary"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                {vendor?.owner_name?.charAt(0) || 'S'}
              </div>
            </button>

            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/profile');
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    ⚙️ Profil Ayarları
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    🚪 Çıkış Yap
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
