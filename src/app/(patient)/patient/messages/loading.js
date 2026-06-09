export default function MessagesLoading() {
  return <PatientPageSkeleton />;
}

function PatientPageSkeleton() {
  return (
    <div className="h-[calc(100vh-128px)] rounded-2xl border border-surface-100 bg-white p-4 animate-pulse">
      <div className="grid h-full gap-4 md:grid-cols-[280px_1fr]">
        <div className="space-y-3">
          {[0, 1, 2].map(item => (
            <div key={item} className="h-20 rounded-2xl bg-surface-100" />
          ))}
        </div>
        <div className="rounded-2xl bg-surface-50" />
      </div>
    </div>
  );
}
