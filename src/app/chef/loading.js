export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl space-y-5 animate-pulse">
      <div className="h-16 rounded-2xl bg-white" />
      <div className="grid gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map(item => (
          <div key={item} className="h-24 rounded-2xl border border-surface-100 bg-white" />
        ))}
      </div>
      <div className="h-80 rounded-2xl border border-surface-100 bg-white" />
      <div className="h-56 rounded-2xl border border-surface-100 bg-white" />
    </div>
  );
}
