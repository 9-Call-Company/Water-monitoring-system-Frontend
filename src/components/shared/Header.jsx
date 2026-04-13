import { Bell, Search } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import SearchInput from './SearchInput';

function getInitials(name) {
  return (name || 'WCAM')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function Header({ pageTitle = 'WCAM', onSearch }) {
  const user = useAuth();

  return (
    <header className="flex h-14 items-center border-b border-wcam-border bg-wcam-card px-5">
      <div className="flex min-w-0 items-center gap-3">
        <h1 className="truncate text-sm font-medium text-white">{pageTitle}</h1>
      </div>

      <div className="mx-6 hidden w-full max-w-[360px] md:block">
        <SearchInput placeholder="Search" icon={Search} onChange={onSearch} />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] text-zinc-300 transition hover:border-wcam-orange"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-wcam-orange" />
        </button>

        <div className="flex items-center gap-2 rounded-full border border-[#2A2A2A] bg-[#141414] px-2 py-1">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-wcam-orange text-[11px] font-bold text-black">
            {getInitials(user?.fullName)}
          </span>
          <span className="pr-2 text-[12px] text-zinc-400">{user?.fullName ?? 'Guest'}</span>
        </div>
      </div>
    </header>
  );
}
