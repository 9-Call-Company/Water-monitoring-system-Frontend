import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useSocket } from "../../contexts/SocketContext";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";

const AlertPopup = ({ alert, onClose, onView }) => {
  if (!alert) return null;

  const accent =
    alert.severity === "critical"
      ? "border-red-500/40 bg-red-950/70"
      : alert.severity === "warning"
        ? "border-amber-500/40 bg-amber-950/70"
        : "border-sky-500/40 bg-sky-950/70";

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
      <div
        className={`w-full max-w-lg rounded-3xl border p-6 shadow-[0_30px_90px_rgba(0,0,0,0.55)] ${accent}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400">
              Live Water Alert
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              {alert.subject}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-300 hover:text-white"
          >
            Close
          </button>
        </div>

        <p className="mt-4 text-sm leading-6 text-gray-300">
          {alert.description}
        </p>

        <div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-gray-300 sm:grid-cols-2">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
              Severity
            </div>
            <div className="mt-1 text-white capitalize">{alert.severity}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
              Status
            </div>
            <div className="mt-1 text-white capitalize">{alert.status}</div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-200 hover:bg-white/5"
          >
            Dismiss
          </button>
          <button
            onClick={onView}
            className="rounded-xl bg-[#FF6B00] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e05f00]"
          >
            View alerts
          </button>
        </div>
      </div>
    </div>
  );
};

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const socket = useSocket();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [popupAlert, setPopupAlert] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const onDiagnosisPage = location.pathname.startsWith("/diagnosis");

  useEffect(() => {
    if (!socket) return undefined;

    const handleAlert = (alert) => {
      if (!alert) return;

      const isSystemAlert = alert.generated_by === "system";
      const looksLikePipeProblem = /pipe\s*problem/i.test(alert.subject || "");

      // Pipe/system alerts should only show as popup when user is on diagnosis page.
      if ((isSystemAlert || looksLikePipeProblem) && !onDiagnosisPage) return;

      const shouldShowForUser =
        user?.role !== "user" || !alert.user_id || alert.user_id === user.userId;

      if (!shouldShowForUser) return;

      setPopupAlert(alert);
      showToast(alert.subject, alert.severity === "critical" ? "error" : "info");
    };

    socket.on("alert:new", handleAlert);

    return () => {
      socket.off("alert:new", handleAlert);
    };
  }, [socket, showToast, user?.role, user?.userId, onDiagnosisPage]);

  useEffect(() => {
    if (!onDiagnosisPage) {
      setPopupAlert(null);
    }
  }, [onDiagnosisPage]);

  // Close sidebar when navigating on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <>
      <AlertPopup
        alert={popupAlert}
        onClose={() => setPopupAlert(null)}
        onView={() => {
          setPopupAlert(null);
          navigate(user?.role === "user" ? "/my-alerts" : "/alerts");
        }}
      />

      <div className="flex h-screen bg-[#0D0D0D] overflow-hidden">
        {/* Mobile overlay when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - fixed on desktop, drawer on mobile */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-60 transform transition-transform duration-300 ease-in-out md:relative md:transform-none ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col w-full">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="min-w-0 flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
