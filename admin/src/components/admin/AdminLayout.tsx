import { Outlet, Navigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
import { AdminSidebar } from './AdminSidebar';
// import { Loader2 } from 'lucide-react';

export function AdminLayout() {
  // const { isAuthenticated, isLoading } = useAuth();

  // const token = localStorage.getItem("admintoken")
  // const admin = JSON.parse(localStorage.getItem("admin"));

  // if(!token || !admin || admin.role !== "ADMIN"){
  //   return <Navigate to="/admin/login" replace />;
  // }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="pl-64 transition-all duration-300">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
