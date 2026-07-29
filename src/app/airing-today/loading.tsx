import MediaGridSkeleton from '@/components/skeletons/MediaGridSkeleton';

export default function Loading() {
  return <MediaGridSkeleton title="TV Episodes Airing Today" count={20} />;
}
