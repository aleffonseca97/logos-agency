export function SectionSkeleton() {
  return (
    <div
      aria-hidden
      className="bg-logos-surface/40 animate-pulse py-24 lg:py-32"
    >
      <div className="logos-container mx-auto max-w-6xl space-y-8 px-4">
        <div className="bg-logos-border mx-auto h-6 w-24 rounded-full" />
        <div className="bg-logos-border mx-auto h-10 max-w-lg rounded-lg" />
        <div className="bg-logos-border mx-auto h-4 max-w-md rounded" />
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-logos-border h-48 rounded-xl"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
