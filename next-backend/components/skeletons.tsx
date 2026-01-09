import {Skeleton} from "@/components/ui/skeleton";

export function NavLinksSkeleton() {
  const className = `w-full h-8 rounded-lg`
  return (
      <>
        <Skeleton className={className}/>
        <Skeleton className={className}/>
        <Skeleton className={className}/>
        <Skeleton className={className}/>
        <Skeleton className={className}/>
      </>
  )
}

export function GraphSkeleton() {
  return (
      <Skeleton className={`w-full h-auto rounded-lg`} />
  )
}