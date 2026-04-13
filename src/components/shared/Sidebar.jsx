import { LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { navigationByRole } from '../../config/navigation';
import useAuth from '../../hooks/useAuth';

function getInitials(name) {
  return (name || 'WCAM')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function Sidebar({ role = 'admin', onLogout }) {
  const user = useAuth();
  const sections = navigationByRole[role] ?? navigationByRole.admin;

  return (
    <aside className="hidden w-[220px] shrink-0 border-r border-wcam-border bg-wcam-card lg:flex lg:flex-col">
      <div className="border-b border-wcam-border px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-wcam-orange text-sm font-bold text-black">
            W
          </div>
          <div>
            <div className="text-sm font-semibold tracking-[0.18em] text-white">WCAM</div>
            <div className="text-[11px] text-zinc-400">{role} panel</div>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {sections.map((section) => (
          <div key={section.label}>
            <div className="px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-500">
              {section.label}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      [
                        'flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition',
                        isActive
                          ? 'border-[#FF6B0033] bg-[#FF6B0018] text-wcam-orange'
                          : 'border-transparent text-zinc-400 hover:border-wcam-border hover:bg-[#151515] hover:text-zinc-200',
                      ].join(' ')
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-wcam-border p-4">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center justify-between rounded-xl border border-wcam-border bg-[#141414] px-3 py-3 text-left text-sm text-zinc-300 transition hover:border-wcam-orange hover:bg-[#181818]"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-wcam-orange text-xs font-bold text-black">
              {getInitials(user?.fullName)}
            </span>
            <span>
              <span className="block text-white">Logout</span>
              <span className="block text-[11px] text-zinc-500">{user?.fullName ?? 'Session'}</span>
            </span>
          </span>
          <LogOut className="h-4 w-4 text-zinc-400" />
        </button>
      </div>
    </aside>
  );
}
