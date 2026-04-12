import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar fixed to the left */}
      <Sidebar />
      
      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col pl-64 transition-all duration-300">
        <Header />
        
        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
