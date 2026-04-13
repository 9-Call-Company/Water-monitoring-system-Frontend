export default function LoadingSpinner({ size = 18 }) {
  return (
    <span
      className="inline-block animate-spin rounded-full border-2 border-wcam-orange border-t-transparent"
      style={{ width: size, height: size }}
    />
  );
}
