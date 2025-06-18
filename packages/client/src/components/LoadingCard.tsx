import { v4 as uuidv4 } from 'uuid'
import { Card } from './ui/card'
import { Skeleton } from './ui/skeleton'

interface LoadingCardProps {
  heightPx?: number
  message?: string
  showSkeleton?: boolean
  skeletonCount?: number
}

export function LoadingCard({
  heightPx = 500,
  message = 'Loading...',
  showSkeleton = false,
  skeletonCount = 3,
}: LoadingCardProps) {
  return (
    <Card
      className="w-full flex flex-col items-center justify-center"
      style={{ minHeight: `${heightPx}px` }}
    >
      <div className="text-gray-500 mb-4">{message}</div>
      {showSkeleton && (
        <div className="flex-1 w-[80%] flex flex-col justify-evenly py-4">
          {Array.from({ length: skeletonCount }).map((_) => (
            <Skeleton
              key={`skeleton-${uuidv4()}`}
              className="h-[calc((100%-1rem*${skeletonCount-1})/${skeletonCount})] w-full"
            />
          ))}
        </div>
      )}
    </Card>
  )
}
