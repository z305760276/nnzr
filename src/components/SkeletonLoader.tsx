const shimmer = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

const baseShimmer = {
  background: 'linear-gradient(90deg, var(--card-inner-bg) 25%, var(--card-inner-bg-strong) 50%, var(--card-inner-bg) 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s ease-in-out infinite',
};

function SkeletonBar({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded-lg ${className}`}
      style={{ ...baseShimmer, ...style }}
    />
  );
}

function DetailSkeleton() {
  return (
    <>
      <style>{shimmer}</style>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="rounded-2xl border p-6" style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
          <div className="flex items-center gap-4 mb-6">
            <SkeletonBar className="size-10 rounded-xl" />
            <div className="space-y-2 flex-1">
              <SkeletonBar className="h-5 w-48" />
              <SkeletonBar className="h-3 w-72" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border p-4" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-subtle)' }}>
                <SkeletonBar className="size-8 rounded-lg mb-3" />
                <SkeletonBar className="h-7 w-16 mb-2" />
                <SkeletonBar className="h-3 w-20" />
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border p-4" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <SkeletonBar className="size-10 rounded-lg shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <SkeletonBar className="h-4 w-40" />
                    <SkeletonBar className="h-3 w-56" />
                  </div>
                </div>
                <SkeletonBar className="h-16 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function GraphSkeleton() {
  return (
    <>
      <style>{shimmer}</style>
      <div className="space-y-4 animate-in fade-in duration-500">
        <div className="rounded-2xl border p-6" style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
          <div className="flex items-center justify-between mb-6">
            <SkeletonBar className="h-5 w-32" />
            <SkeletonBar className="size-8 rounded-lg" />
          </div>
          <div className="space-y-8">
            {[1, 2, 3, 4, 5, 6].map((layer) => (
              <div key={layer} className="flex items-center gap-4">
                <SkeletonBar className="h-4 w-16 shrink-0" />
                <div className="flex gap-3 flex-1">
                  {[...Array(4 - (layer % 3))].map((_, n) => (
                    <SkeletonBar key={n} className="h-16 w-20 rounded-xl shrink-0" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function SkeletonLoader({ type = 'detail' }: { type?: 'detail' | 'graph' }) {
  return type === 'graph' ? <GraphSkeleton /> : <DetailSkeleton />;
}
