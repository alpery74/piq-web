// iOS-style skeleton loading components

const Skeleton = ({ className = '', variant = 'default' }) => {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%] animate-shimmer';

  const variants = {
    default: 'rounded-lg',
    circle: 'rounded-full',
    text: 'rounded h-4',
    card: 'rounded-2xl',
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} />
  );
};

// Skeleton for text lines
export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        className={i === lines - 1 ? 'w-3/4' : 'w-full'}
      />
    ))}
  </div>
);

// Skeleton for the hero card
export const SkeletonHeroCard = () => (
  <div className="card-glass p-6">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-64" />
        <div className="flex gap-4">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-28 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <Skeleton className="h-4 w-24 mb-4" />
        <Skeleton variant="circle" className="h-36 w-36" />
        <Skeleton className="h-3 w-48 mt-4" />
      </div>
    </div>
  </div>
);

// Skeleton for a data card/section
export const SkeletonCard = ({ className = '' }) => (
  <div className={`card p-6 ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      <Skeleton variant="circle" className="h-10 w-10" />
      <div className="flex-1">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-3 w-40" />
      </div>
    </div>
    <SkeletonText lines={4} />
  </div>
);

// Skeleton for holdings table
export const SkeletonTable = ({ rows = 5 }) => (
  <div className="space-y-3">
    {/* Header */}
    <div className="flex gap-4 pb-3 border-b border-gray-200 dark:border-gray-700">
      {['w-16', 'w-24', 'w-16', 'w-20', 'w-16', 'w-20'].map((w, i) => (
        <Skeleton key={i} className={`h-4 ${w}`} />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 py-3 items-center">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    ))}
  </div>
);

// Skeleton for chart
export const SkeletonChart = ({ height = 300 }) => (
  <div className="relative" style={{ height }}>
    <div className="absolute inset-0 flex items-end justify-around gap-2 p-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton
          key={i}
          className="flex-1 rounded-t-lg"
          style={{ height: `${30 + Math.random() * 60}%` }}
        />
      ))}
    </div>
  </div>
);

// Skeleton for circular gauge
export const SkeletonGauge = ({ size = 120 }) => (
  <div className="flex flex-col items-center">
    <Skeleton variant="circle" style={{ width: size, height: size }} />
    <Skeleton className="h-4 w-16 mt-3" />
  </div>
);

export default Skeleton;
