export default function Spinner() {
  return (
    <div
      className="inline-block h-24 w-24 animate-spin rounded-full border-[3px] border-current border-t-transparent text-blue-600"
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
