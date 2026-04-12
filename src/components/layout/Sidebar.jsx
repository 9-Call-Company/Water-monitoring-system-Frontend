import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Droplets,
  AlertTriangle,
  Users,
  Settings,
  FileText,
  CalendarClock,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  const allNavItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      roles: ["ADMIN", "AGENT", "USER"],
    },
    {
      name: "Water Sources",
      href: "/sources",
      icon: Droplets,
      roles: ["ADMIN", "AGENT"],
    },
    {
      name: "Alerts & Issues",
      href: "/alerts",
      icon: AlertTriangle,
      roles: ["ADMIN", "AGENT"],
    },
    {
      name: "Communities",
      href: "/communities",
      icon: Users,
      roles: ["ADMIN"],
    },
    { name: "My Usage", href: "/usage", icon: Droplets, roles: ["USER"] },
    {
      name: "Scheduled Reports",
      href: "/reports",
      icon: CalendarClock,
      roles: ["USER", "ADMIN"],
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      roles: ["ADMIN", "AGENT", "USER"],
    },
  ];

  // Filter based on user role, normalizing to uppercase
  const userRole = (user?.role || "USER").toUpperCase();
  const navigation = allNavItems.filter((item) =>
    item.roles.includes(userRole),
  );

  return (
    <div className="flex bg-slate-900 w-64 flex-col fixed inset-y-0 z-50">
      <div className="flex h-16 shrink-0 items-center px-6 bg-slate-950">
        <Droplets className="h-8 w-8 text-primary-500" />
        <span className="ml-3 text-lg font-semibold text-white tracking-wide">
          WCAM
        </span>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-primary-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <item.icon
                className="mr-3 h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex shrink-0 bg-slate-800 p-4">
        <div className="flex items-center">
          <div>
            <div className="h-9 w-9 rounded-full bg-slate-600 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">
              {user?.name || "User"}
            </p>
            <p className="text-xs font-medium text-slate-400 capitalize">
              {userRole.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
