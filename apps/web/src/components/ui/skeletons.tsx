export function CardSkeleton() {
  return (
    <div className="bg-[rgba(10,10,10,0.7)] border border-[rgba(255,255,255,0.06)] rounded-[3px] overflow-hidden">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-20 skeleton" />
        <div className="h-5 w-3/4 skeleton" />
        <div className="h-3 w-full skeleton" />
        <div className="h-3 w-2/3 skeleton" />
        <div className="flex justify-between items-center pt-3 border-t border-[rgba(255,255,255,0.06)]">
          <div className="h-6 w-16 skeleton" />
          <div className="h-8 w-8 skeleton" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 bg-[rgba(10,10,10,0.7)] border border-[rgba(255,255,255,0.06)] rounded-[3px]">
      <div className="flex-1 space-y-2">
        <div className="flex gap-2">
          <div className="h-4 w-16 skeleton" />
          <div className="h-4 w-12 skeleton" />
        </div>
        <div className="h-5 w-48 skeleton" />
        <div className="h-3 w-32 skeleton" />
      </div>
      <div className="flex gap-3 items-center">
        <div className="h-6 w-16 skeleton" />
        <div className="h-8 w-20 skeleton" />
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="bg-[rgba(10,10,10,0.7)] border border-[rgba(255,255,255,0.06)] rounded-[3px] p-6 space-y-3">
      <div className="h-3 w-24 skeleton" />
      <div className="h-10 w-32 skeleton" />
      <div className="h-3 w-20 skeleton" />
    </div>
  );
}
