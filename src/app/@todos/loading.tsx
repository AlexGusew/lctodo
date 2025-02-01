import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Fragment } from "react";

export default function Loading() {
  return (
    <ResponsiveLayout>
      <div className="flex flex-col gap-8 pt-16">
        {Array.from({ length: 3 }).map((_, i) => (
          <Fragment key={i}>
            <Skeleton className="w-48 h-6 mb-[-20]" />
            {Array.from({ length: 1 }).map((_, i) => (
              <Skeleton key={i} className="h-[100] w-full rounded-xl" />
            ))}
          </Fragment>
        ))}
      </div>
    </ResponsiveLayout>
  );
}
