export default function Loading() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="h-20 bg-surface-200 rounded-[32px] w-1/3" />
      <div className="grid grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-surface-200 rounded-[32px]" />
        ))}
      </div>
      <div className="h-96 bg-surface-100 rounded-[40px]" />
    </div>
  );
}