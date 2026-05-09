import {
  Bell,
  Droplets,
  LayoutDashboard,
  Settings,
  Users,
  Building2,
  CircleAlert,
  FileText,
  ClipboardList,
  ShieldCheck,
  Home,
  Beaker, // Added Beaker icon
} from 'lucide-react';

export const navigationByRole = {
  admin: [
    {
      label: 'Overview',
      items: [{ label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' }],
    },
    {
      label: 'Administration',
      items: [
        { label: 'Sources', icon: Building2, path: '/sources' },
        { label: 'Users', icon: Users, path: '/users' },
        { label: 'Robines', icon: Droplets, path: '/admin/robines' },
        { label: 'Issues', icon: CircleAlert, path: '/admin/issues' },
        { label: 'Alerts', icon: Bell, path: '/alerts' },
        { label: 'Reports', icon: FileText, path: '/reports' },
        { label: 'Testing', icon: Beaker, path: '/admin/testing' }, // Corrected Entry
      ],
    },
    {
      label: 'System',
      items: [{ label: 'Settings', icon: Settings, path: '/settings' }],
    },
  ],
  agent: [
    {
      label: 'Overview',
      items: [{ label: 'Dashboard', icon: LayoutDashboard, path: '/agent/dashboard' }],
    },
    {
      label: 'Field Work',
      items: [
        { label: 'My Users', icon: Users, path: '/agent/users' },
        { label: 'Robines', icon: Droplets, path: '/agent/robines' },
        { label: 'Quality', icon: ShieldCheck, path: '/agent/quality' },
        { label: 'Issues', icon: CircleAlert, path: '/agent/issues' },
        { label: 'Alerts', icon: Bell, path: '/agent/alerts' },
      ],
    },
  ],
  user: [
    {
      label: 'Overview',
      items: [{ label: 'Dashboard', icon: Home, path: '/user/dashboard' }],
    },
    {
      label: 'Home Water',
      items: [
        { label: 'My Robine', icon: Droplets, path: '/user/robine' },
        { label: 'Alerts', icon: Bell, path: '/my-alerts' },
        { label: 'Quality', icon: ShieldCheck, path: '/user/quality' },
        { label: 'Maintenance', icon: ClipboardList, path: '/user/maintenance' },
      ],
    },
  ],
};
