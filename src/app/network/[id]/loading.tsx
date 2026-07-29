import MediaGridSkeleton from '@/components/skeletons/MediaGridSkeleton';

export default function Loading() {
  return <MediaGridSkeleton title="Loading network profile…" count={10} />;
}
