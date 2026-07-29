import MediaGridSkeleton from '@/components/skeletons/MediaGridSkeleton';

export default function Loading() {
  return <MediaGridSkeleton title="Loading media gallery…" count={9} />;
}
