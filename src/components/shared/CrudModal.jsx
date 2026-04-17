import { X, Loader2 } from 'lucide-react';

const CrudModal = ({
  isOpen,
  onClose,
  title,
  onSubmit,
  loading = false,
  error = null,
  children,
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl font-mono mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1E1E1E] flex items-center justify-between flex-shrink-0">
          <h2 className="text-white font-semibold text-sm tracking-wide">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed p-1 rounded-md hover:bg-[#1E1E1E]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body — form wraps scrollable area + error + footer */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Scrollable content */}
          <div className="px-6 py-5 overflow-y-auto flex-1 space-y-4">
            {children}
          </div>

          {/* Error area */}
          {error && (
            <div className="mx-6 mb-2 text-red-400 text-xs border border-red-800/60 bg-red-900/20 rounded-lg px-3 py-2 flex-shrink-0">
              {error}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#1E1E1E] flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs text-gray-300 border border-[#2E2E2E] rounded-lg hover:bg-[#1E1E1E] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs text-white bg-[#FF6B00] rounded-lg hover:bg-[#e05e00] transition-colors disabled:opacity-60 disabled:cursor-not-allowed font-mono flex items-center gap-2"
            >
              {loading && (
                <Loader2 size={13} className="animate-spin" />
              )}
              {loading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrudModal;
