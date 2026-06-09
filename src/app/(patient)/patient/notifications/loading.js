export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 animate-pulse">
      <div className="h-11 w-11 rounded-2xl bg-surface-200" />
      <div className="h-20 rounded-2xl bg-surface-100" />
      {[0, 1, 2, 3].map(item => (
        <div key={item} className="h-28 rounded-2xl border border-surface-100 bg-white" />
      ))}
    </div>
  );
}
