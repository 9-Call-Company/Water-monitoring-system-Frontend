import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { CheckCircle, Info, X, XCircle } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: <CheckCircle size={15} className="text-green-400 shrink-0 mt-0.5" />,
  error:   <XCircle    size={15} className="text-red-400   shrink-0 mt-0.5" />,
  info:    <Info       size={15} className="text-blue-400  shrink-0 mt-0.5" />,
};

const BORDER_COLORS = {
  success: 'border-green-700/60',
  error:   'border-red-700/60',
  info:    'border-blue-700/60',
};

const TEXT_COLORS = {
  success: 'text-green-300',
  error:   'text-red-300',
  info:    'text-blue-300',
};

let idCounter = 0;

function Toast({ id, message, type, onDismiss }) {
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(id), 3000);
    return () => clearTimeout(timerRef.current);
  }, [id, onDismiss]);

  return (
    <div
      className={[
        'flex items-start gap-3 w-80 max-w-full',
        'bg-[#111111] border rounded-lg px-3 py-2.5 shadow-2xl',
        'font-mono text-xs',
        BORDER_COLORS[type] ?? 'border-[#1E1E1E]',
        'animate-fade-in-right',
      ].join(' ')}
      style={{ animation: 'toastIn 0.22s ease' }}
    >
      {ICONS[type] ?? ICONS.info}

      <span className={['flex-1 leading-relaxed break-words', TEXT_COLORS[type] ?? 'text-gray-300'].join(' ')}>
        {message}
      </span>

      <button
        onClick={() => onDismiss(id)}
        className="text-gray-500 hover:text-gray-200 transition-colors shrink-0 mt-0.5"
        aria-label="Dismiss"
      >
        <X size={13} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    const id = ++idCounter;
    setToasts((prev) => {
      const next = [...prev, { id, message, type }];
      return next.length > 5 ? next.slice(next.length - 5) : next;
    });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div
        className="fixed top-4 right-4 flex flex-col gap-2"
        style={{ zIndex: 9999 }}
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onDismiss={dismiss} />
        ))}
      </div>

      {/* Keyframe for entry animation (injected once) */}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(1.5rem); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
