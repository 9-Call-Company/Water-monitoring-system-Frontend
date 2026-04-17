import { LogOut, Bell } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const { logout, user } = useAuth();
  const role = (user?.role || "user").toLowerCase();

  const roleLabel = {
    admin: "Administrator",
    agent: "Field Agent",
    user: "End User",
  };

  return (
    <header className="bg-[#111111] border-b border-[#1E1E1E] h-16 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <div>
          <p className="text-white text-sm font-semibold font-mono">
            {roleLabel[role] || "Portal"}
          </p>
          <p className="text-gray-600 text-xs font-mono">
            Water Community Administration
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-500 hover:text-gray-200 transition-colors">
          <Bell className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-[#1E1E1E]" />
        <button
          onClick={logout}
          className="flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
