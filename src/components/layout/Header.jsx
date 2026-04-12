import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1">
          <h1 className="text-xl font-semibold text-slate-800">Admin Portal</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={logout}
            className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
