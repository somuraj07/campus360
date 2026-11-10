"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useNewsFeeds } from "../../hooks/useNewsFeeds";
import TimellyLoader from "../common/TimellyLoader";
import CreatePost from "./newsfeed/CreatePost";
import PostCard from "./newsfeed/PostCard";
import { Newspaper } from "lucide-react";
import { SaPage, SaPageHeader, Alert, Panel, EmptyState } from "../common/ui";

export default function NewsFeed() {
  const router = useRouter();
  const { feeds, loading, error, refetch, toggleLike, likingIds } = useNewsFeeds();

  const onPublished = useCallback(() => {
    void refetch();
    try {
      router.refresh();
    } catch {
      /* noop */
    }
  }, [refetch, router]);

  return (
    <SaPage>
      <div className="mx-auto w-full max-w-3xl space-y-5 sm:space-y-6">
        <SaPageHeader
          eyebrow="Communication"
          title="News Feed"
          description="Create and manage school announcements. You can download images from each post. Posts older than 7 days are removed automatically to keep storage manageable."
        />

        <CreatePost onPublished={onPublished} />

        {error && <Alert tone="error">{error}</Alert>}

        {loading && feeds.length === 0 ? (
          <TimellyLoader
            compact
            title="Loading newsfeed"
            steps={["Announcements", "Likes", "Media"]}
          />
        ) : feeds.length === 0 ? (
          <Panel bodyClassName="p-0">
            <EmptyState icon={Newspaper} title="No posts yet" description="Create the first one above." />
          </Panel>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {feeds.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={toggleLike}
                isLiking={Boolean(likingIds[post.id])}
              />
            ))}
          </div>
        )}
      </div>
    </SaPage>
  );
}
