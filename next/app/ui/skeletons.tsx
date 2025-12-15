import Skeleton from "@mui/material/Skeleton";

export function NavLinksSkeleton() {
  const className = `w-full`
  const height = 36
  return (
      <>
        <Skeleton variant={`rounded`} height={height} className={className}/>
        <Skeleton variant={`rounded`} height={height} className={className}/>
        <Skeleton variant={`rounded`} height={height} className={className}/>
        <Skeleton variant={`rounded`} height={height} className={className}/>
        <Skeleton variant={`rounded`} height={height} className={className}/>
      </>
  )
}

export function GraphSkeleton() {
  return (
      <Skeleton variant={`rounded`} className={`w-full h-auto`} />
  )
}