import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '../../context/AuthContext.tsx';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { vendor } = useAuth();

  // Show status message for non-approved vendors
  if (vendor && vendor.status !== 'approved') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-4">
            {vendor.status === 'pending_review' && (
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <span className="text-3xl">⏳</span>
              </div>
            )}
            {vendor.status === 'rejected' && (
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <span className="text-3xl">✕</span>
              </div>
            )}
            {vendor.status === 'suspended' && (
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <span className="text-3xl">⊘</span>
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {vendor.status === 'pending_review' && 'Hesabınız İnceleniyor'}
            {vendor.status === 'rejected' && 'Hesabınız Reddedildi'}
            {vendor.status === 'suspended' && 'Hesabınız Askıya Alındı'}
          </h2>

          <p className="text-gray-600 mb-4">
            {vendor.status === 'pending_review' &&
              'Hesabınız şu anda inceleme aşamasında. Onaylandığında size email ile bildirilecektir.'}
            {vendor.status === 'rejected' && (
              <>
                Hesabınız reddedildi.
                {vendor.rejection_reason && (
                  <span className="block mt-2 text-sm">
                    <strong>Sebep:</strong> {vendor.rejection_reason}
                  </span>
                )}
              </>
            )}
            {vendor.status === 'suspended' &&
              'Hesabınız askıya alınmıştır. Lütfen destek ekibi ile iletişime geçiniz.'}
          </p>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Mağaza: {vendor.store_name}</p>
            <p className="text-sm text-gray-500">Email: {vendor.email}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
