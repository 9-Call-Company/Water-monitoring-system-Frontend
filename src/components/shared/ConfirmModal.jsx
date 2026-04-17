import ActionBtn from "./ActionBtn";

export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-wcam-border bg-wcam-card p-5 shadow-soft">
        <h3 className="text-base font-medium text-white">{title}</h3>
        <p className="mt-2 text-sm text-zinc-400">{message}</p>
        <div className="mt-5 flex justify-end gap-3">
          <ActionBtn label="Cancel" onClick={onCancel} />
          <ActionBtn label="Confirm" variant="danger" onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
}
