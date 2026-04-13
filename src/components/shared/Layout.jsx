import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import useAuth from '../../hooks/useAuth';

export default function Layout({ children, pageTitle = 'WCAM', role = 'admin' }) {
  const user = useAuth();

  return (
    <div className="flex min-h-screen bg-wcam-black text-white">
      <Sidebar role={role} />
      <div className="flex min-w-0 flex-1 flex-col bg-wcam-black">
        <Header pageTitle={pageTitle} />
        <main className="wcam-scrollbar min-h-0 flex-1 overflow-y-auto bg-wcam-panel p-5">
          {children ?? <Outlet context={{ user, role }} />}
        </main>
      </div>
    </div>
  );
}
