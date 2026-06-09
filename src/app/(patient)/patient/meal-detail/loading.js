export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl space-y-5 animate-pulse">
      <div className="h-11 w-11 rounded-2xl bg-surface-200" />
      <div className="h-[420px] rounded-2xl border border-surface-100 bg-white" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-56 rounded-2xl border border-surface-100 bg-white" />
        <div className="h-56 rounded-2xl border border-surface-100 bg-white" />
      </div>
    </div>
  );
}
