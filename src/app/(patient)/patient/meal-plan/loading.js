export default function MealPlanLoading() {
  return <PatientPageSkeleton />;
}

function PatientPageSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-8 w-56 rounded-xl bg-surface-200" />
      <div className="h-28 rounded-2xl border border-surface-100 bg-white" />
      {[0, 1, 2, 3].map(item => (
        <div key={item} className="h-20 rounded-2xl border border-surface-100 bg-white" />
      ))}
    </div>
  );
}
