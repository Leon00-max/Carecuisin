export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl space-y-5 animate-pulse">
      <div className="h-11 w-11 rounded-2xl bg-surface-200" />
      <div className="h-72 rounded-2xl border border-surface-100 bg-white" />
      <div className="h-64 rounded-2xl border border-surface-100 bg-white" />
    </div>
  );
}
