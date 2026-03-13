import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-6">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="h-12 w-full" />
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </main>
  );
}
