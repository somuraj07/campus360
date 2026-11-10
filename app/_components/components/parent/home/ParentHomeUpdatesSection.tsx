"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, Download, Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { downloadImageFromUrl } from "../../../utils/downloadImage";
import { formatRelativeTime } from "../../../utils/format";
import { ParentEvent, ParentFeed } from "./types";
import { toggleNewsfeedLike } from "@/lib/api/newsfeed";

type Props = {
  feeds: ParentFeed[];
  events: ParentEvent[];
};

function formatEventBadge(value?: string | null) {
  if (!value) return { top: "TBD", bottom: "" };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { top: "TBD", bottom: "" };
  const sameDay = date.toDateString() === new Date().toDateString();
  if (sameDay) {
    return {
      top: "Today",
      bottom: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };
  }
  return {
    top: date.toLocaleDateString("en-US", { month: "short" }),
    bottom: String(date.getDate()),
  };
}

export default function ParentHomeUpdatesSection({ feeds, events }: Props) {
  const latestFeed = useMemo(() => feeds[0] ?? null, [feeds]);
  const topFeeds = useMemo(() => feeds.slice(0, 3), [feeds]);
  const [likedByMe, setLikedByMe] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [downloadingFeedId, setDownloadingFeedId] = useState<string | null>(null);

  useEffect(() => {
    setLikedByMe(Boolean(latestFeed?.likedByMe));
    setLikesCount(Number(latestFeed?.likes ?? 0));
  }, [latestFeed]);

  const handleLike = async () => {
    if (!latestFeed || isLiking) return;

    setIsLiking(true);
    const prevLiked = likedByMe;
    const prevLikes = likesCount;
    const nextLiked = !prevLiked;
    const nextLikes = Math.max(0, prevLikes + (nextLiked ? 1 : -1));

    setLikedByMe(nextLiked);
    setLikesCount(nextLikes);

    try {
      const { ok, data: payload } = await toggleNewsfeedLike(latestFeed.id);
      if (!ok) throw new Error(payload?.message || "Failed to update like");

      setLikedByMe(Boolean(payload?.liked));
      setLikesCount(Number(payload?.likes ?? nextLikes));
    } catch {
      setLikedByMe(prevLiked);
      setLikesCount(prevLikes);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
      <div className="lg:col-span-2 space-y-4 sm:space-y-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 w-full">
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
          <h3 className="text-base sm:text-xl font-bold text-fg flex items-center gap-2 w-full">
            School Updates
          </h3>
        </div>

        {!latestFeed ? (
          <div className="rounded-xl sm:rounded-2xl border border-line bg-elev-1 p-4 sm:p-6 text-fg-muted text-sm sm:text-base">
            No school updates available.
          </div>
        ) : (
          <div className="space-y-4 max-h-[520px] overflow-y-auto no-scrollbar pr-1">
            {topFeeds.map((feed) => (
              <article
                key={feed.id}
                className="bg-elev-1 border border-line border-solid 
                rounded-xl sm:rounded-2xl shadow-card overflow-hidden flex flex-col min-h-[240px]"
              >
                <header className="flex items-center justify-between p-3 sm:p-5 border-b border-line-subtle gap-2 min-h-[64px]">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    { }
                    <img
                      src={feed.createdBy?.photoUrl || "https://i.pravatar.cc/120?img=11"}
                      alt={feed.createdBy?.name ?? "School"}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl object-cover border border-line flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-fg text-sm sm:text-base truncate">
                        {feed.createdBy?.name || "School Admin"}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-fg-subtle mt-0.5">
                        {formatRelativeTime(feed.createdAt)}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-elev-2 rounded-lg transition-all text-fg-muted hover:text-fg flex-shrink-0">
                    <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5 text-fg-subtle" />
                  </button>
                </header>

                <div className="px-3 sm:px-5 py-3 sm:py-4 flex-1">
                  <h5 className="font-bold text-fg text-base sm:text-lg mb-1 sm:mb-2 line-clamp-2">{feed.title}</h5>
                  <p className="text-fg-muted text-xs sm:text-sm leading-relaxed line-clamp-3">{feed.description}</p>
                  <span className="inline-block px-3 py-1 rounded-lg text-xs
                   font-semibold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wide mb-2 mt-2">
                    EVENT
                  </span>
                  {feed.photo && (
                    <div className="relative rounded-xl overflow-hidden border border-line-subtle">
                      <button
                        type="button"
                        onClick={async () => {
                          if (!feed.photo) return;
                          setDownloadingFeedId(feed.id);
                          try {
                            await downloadImageFromUrl(feed.photo, `school-update-${feed.id}`);
                          } finally {
                            setDownloadingFeedId(null);
                          }
                        }}
                        disabled={downloadingFeedId === feed.id}
                        className="absolute right-2 top-2 z-10 w-9 h-9 rounded-full bg-black/55 hover:bg-elev-2 text-fg flex items-center justify-center transition opacity-90 hover:opacity-100 disabled:opacity-50"
                        aria-label="Download image"
                        title="Download image"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      { }
                      <img
                        src={feed.photo}
                        alt={feed.title}
                        className="w-full aspect-video object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                </div>

                {feed.id === latestFeed?.id && (
                  <footer className="border-t border-line px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex flex-wrap items-center gap-3 text-sm sm:text-base">
                      <span className="text-fg-muted">{likesCount} likes</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike();
                        }}
                        disabled={isLiking}
                        aria-pressed={likedByMe}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 
                          text-sm font-medium text-fg-muted hover:text-red-700 dark:hover:text-red-400 hover:bg-elev-2 ${likedByMe
                            ? "border-red-300/40 bg-red-400/10 text-red-700 dark:text-red-300"
                            : "border-line-strong text-fg-muted hover:border-line-strong hover:text-fg"
                          } ${isLiking ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                      >
                        <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${likedByMe ? "fill-red-400 text-red-700 dark:text-red-400" : ""}`} />
                        <span className="font-semibold">{likedByMe ? "Liked" : "Like"}</span>
                      </button>
                    </div>
                  </footer>
                )}
              </article>
            ))}
          </div>
        )}
      </div>

      <aside className="bg-elev-1 border border-line border-solid rounded-xl sm:rounded-2xl shadow-card p-4 sm:p-5 h-full flex flex-col">
        <h4 className="font-bold text-fg text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2 w-full min-h-[32px]">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
          Upcoming Events
        </h4>
        <div className="space-y-3 sm:space-y-4 flex-1 max-h-[520px] overflow-y-auto no-scrollbar pr-1">
          {events.slice(0, 4).map((event) => {
            const badge = formatEventBadge(event.eventDate);
            return (
              <div
                key={event.id}
                className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-elev-1 border border-line-subtle hover:bg-elev-3 transition-colors"
              >
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg text-primary font-bold text-xs text-center min-w-[2.5rem] sm:min-w-[3rem] flex-shrink-0">
                  <p className="text-xs">{badge.top}</p>
                  <p className="text-xs">{badge.bottom}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="font-semibold text-fg text-xs sm:text-sm truncate">{event.title}</h5>
                  <p className="text-[11px] sm:text-xs text-fg-subtle">{event.type || "Event"}</p>
                </div>
              </div>
            );
          })}
          {events.length === 0 && <p className="text-fg-muted text-lg">No upcoming events.</p>}
        </div>
      </aside>
    </section>
  );
}