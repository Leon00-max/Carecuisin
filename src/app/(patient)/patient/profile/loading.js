export default function ProfileLoading() {
  return <PatientPageSkeleton />;
}

function PatientPageSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-8 w-56 rounded-xl bg-surface-200" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-72 rounded-2xl border border-surface-100 bg-white" />
        <div className="h-72 rounded-2xl border border-surface-100 bg-white" />
      </div>
      <div className="h-32 rounded-2xl border border-surface-100 bg-white" />
    </div>
  );
}
