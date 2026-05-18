export default function PatientLoading() {
  return (
    <div className="space-y-6 animate-pulse">

      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-24 bg-surface-200 rounded-full" />
        <div className="h-7 w-56 bg-surface-200 rounded-lg" />
        <div className="h-4 w-44 bg-surface-200 rounded-lg" />
      </div>

      {/* Progress + info row skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-surface-100 rounded-2xl p-6 flex items-center justify-center h-48">
          <div className="w-32 h-32 rounded-full bg-surface-100" />
        </div>
        <div className="sm:col-span-2 grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-surface-100 rounded-2xl p-5 space-y-3">
              <div className="h-3 w-20 bg-surface-200 rounded" />
              <div className="h-5 w-32 bg-surface-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Meals skeleton */}
      <div className="bg-white border border-surface-100 rounded-2xl p-6 space-y-4">
        <div className="h-5 w-32 bg-surface-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-surface-50 rounded-xl p-4 space-y-2">
              <div className="h-3 w-20 bg-surface-200 rounded" />
              <div className="h-4 w-full bg-surface-200 rounded" />
              <div className="h-4 w-3/4 bg-surface-200 rounded" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}