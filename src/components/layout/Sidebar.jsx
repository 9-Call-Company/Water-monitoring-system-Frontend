import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Droplets,
  AlertTriangle,
  Users,
  Settings,
  FileText,
  Bell,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();
  const userRole = (user?.role || "user").toLowerCase();

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      roles: ["admin", "agent", "user"],
    },
    {
      name: "Water Sources",
      href: "/sources",
      icon: Droplets,
      roles: ["admin", "agent"],
    },
    {
      name: "Alerts",
      href: "/alerts",
      icon: AlertTriangle,
      roles: ["admin", "agent"],
    },
    { name: "Users", href: "/users", icon: Users, roles: ["admin"] },
    { name: "Reports", href: "/reports", icon: FileText, roles: ["admin"] },
    { name: "My Users", href: "/agent/users", icon: Users, roles: ["agent"] },
    {
      name: "My Robines",
      href: "/agent/robines",
      icon: Droplets,
      roles: ["agent"],
    },
    { name: "My Alerts", href: "/my-alerts", icon: Bell, roles: ["user"] },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      roles: ["admin", "agent", "user"],
    },
  ].filter((item) => item.roles.includes(userRole));

  return (
    <div className="flex bg-[#111111] border-r border-[#1E1E1E] w-60 flex-col fixed inset-y-0 z-50">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-5 bg-[#0D0D0D] border-b border-[#1E1E1E]">
        <div className="w-7 h-7 rounded-lg bg-[#FF6B00] flex items-center justify-center">
          <Droplets className="h-4 w-4 text-white" />
        </div>
        <span className="ml-3 text-base font-bold text-white tracking-wider font-mono">
          WCAM
        </span>
      </div>

      {/* Nav */}
      <div className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
        <nav className="flex-1 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2.5 text-xs font-mono rounded-lg transition-all ${
                  isActive
                    ? "bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/20"
                    : "text-gray-500 hover:text-gray-200 hover:bg-[#1E1E1E] border border-transparent"
                }`
              }
            >
              <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Footer */}
      <div className="shrink-0 bg-[#0D0D0D] border-t border-[#1E1E1E] p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#FF6B00]/20 border border-[#FF6B00]/30 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-[#FF6B00] font-mono">
              {user?.full_name?.charAt(0)?.toUpperCase() ||
                user?.email?.charAt(0)?.toUpperCase() ||
                "U"}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white font-mono truncate">
              {user?.full_name || user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 font-mono capitalize">
              {userRole}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
