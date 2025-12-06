import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/products', icon: '📦', label: 'Ürünler' },
    { path: '/orders', icon: '🛒', label: 'Siparişler' },
    { path: '/campaigns', icon: '🎯', label: 'Kampanyalar' },
    { path: '/profile', icon: '⚙️', label: 'Profil' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section - Fixed container, bigger logo inside */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/5 to-background">
            <div className="flex items-center space-x-2.5 flex-1">
              <div className="bg-white p-1 rounded-lg shadow-sm border border-primary/10">
                <img src="/logo.png" alt="Manavım Logo" className="h-9 w-auto" />
              </div>
              <div>
                <span className="text-base font-bold text-primary block leading-tight">Manavım</span>
                <span className="text-[10px] text-text-secondary leading-tight">Satıcı Paneli</span>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden text-text-secondary hover:text-text-primary text-xl">
              ✕
            </button>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-white font-medium shadow-md'
                    : 'text-text-secondary hover:bg-background'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t text-sm text-text-secondary bg-background">
            © 2024 Manavım - Satıcı Paneli
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
