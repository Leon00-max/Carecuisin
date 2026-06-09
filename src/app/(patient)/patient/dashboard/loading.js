export default function DashboardLoading() {
  return <PatientPageSkeleton />;
}

function PatientPageSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-8 w-52 rounded-xl bg-surface-200" />
      <div className="rounded-2xl border border-surface-100 bg-white p-4">
        <div className="h-[200px] rounded-2xl bg-surface-100" />
        <div className="mt-5 h-6 w-3/4 rounded-lg bg-surface-200" />
        <div className="mt-3 h-4 w-1/2 rounded-lg bg-surface-100" />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[0, 1, 2, 3].map(item => (
          <div key={item} className="h-20 rounded-2xl border border-surface-100 bg-white" />
        ))}
      </div>
    </div>
  );
}
