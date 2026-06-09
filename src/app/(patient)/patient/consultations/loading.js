export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl space-y-5 animate-pulse">
      <div className="h-20 rounded-2xl bg-white border border-surface-100" />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="h-[520px] rounded-2xl bg-white border border-surface-100" />
        <div className="h-[520px] rounded-2xl bg-white border border-surface-100" />
      </div>
    </div>
  );
}
