import { AlertTriangle, Loader2 } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, message, loading }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}
    >
      <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl w-full max-w-sm shadow-2xl font-mono mx-4">
        {/* Body */}
        <div className="px-6 py-6 flex items-start gap-4">
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-red-900/30 border border-red-800/50">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex flex-col gap-1 pt-1">
            <p className="text-white text-sm font-semibold">Confirm Action</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {message || 'Are you sure you want to proceed? This action cannot be undone.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#1E1E1E]">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs text-gray-300 border border-[#2E2E2E] rounded-lg hover:bg-[#1E1E1E] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Confirming...</span>
              </>
            ) : (
              <span>Confirm</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
