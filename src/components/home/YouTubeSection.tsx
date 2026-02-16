import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Play, Youtube, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const CHANNEL_URL = "https://www.youtube.com/@half-civil-judge";
const CHANNEL_NAME = "FIT JAIPUR vlogs";

interface YouTubeVideo {
  videoId: string;
  title: string;
  published: string;
  thumbnail: string;
  thumbnailHigh: string;
  url: string;
  views: number | null;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

const formatViews = (views: number | null) => {
  if (!views) return null;
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K views`;
  return `${views} views`;
};

const YouTubeSection = () => {
  const [activeVideo, setActiveVideo] = useState<YouTubeVideo | null>(null);

  const { data, isLoading } = useQuery<{ videos: YouTubeVideo[] }>({
    queryKey: ["youtubeVideos"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/youtube/latest`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      return json.data;
    },
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  const videos = data?.videos || [];

  return (
    <section className="w-full py-16 lg:py-20">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20">
                <Youtube className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold">
                  Latest on YouTube
                </h2>
                <p className="text-muted-foreground text-sm mt-0.5">
                  {CHANNEL_NAME} &middot; Law job updates & career guidance
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <a
                href={`${CHANNEL_URL}?sub_confirmation=1`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white gap-2 shadow-lg shadow-red-600/20"
                >
                  <Youtube className="h-4 w-4" />
                  Subscribe
                </Button>
              </a>
              <a
                href={`${CHANNEL_URL}/videos`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-muted-foreground hover:text-red-600 transition-colors flex items-center gap-1.5"
              >
                View all
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Active Video Player */}
          {activeVideo && (
            <div className="mb-6 animate-fade-in">
              <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl shadow-black/20">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&rel=0`}
                    className="w-full h-full"
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="absolute top-3 right-3 h-9 w-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors z-10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 px-1">
                <h3 className="font-semibold text-lg leading-tight">
                  {activeVideo.title}
                </h3>
                <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                  {formatViews(activeVideo.views) && (
                    <span>{formatViews(activeVideo.views)}</span>
                  )}
                  <span>{formatDate(activeVideo.published)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Video Thumbnails Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-video rounded-xl bg-muted animate-pulse" />
                  <div className="space-y-2 px-1">
                    <div className="h-3.5 bg-muted rounded w-full animate-pulse" />
                    <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : videos.length === 0 ? (
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl overflow-hidden"
            >
              <div className="aspect-[21/9] flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-gray-900 to-gray-800 group cursor-pointer">
                <div className="h-16 w-16 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Play className="h-8 w-8 text-white ml-1" />
                </div>
                <p className="text-white font-semibold">
                  Visit our YouTube channel
                </p>
              </div>
            </a>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {videos.map((video) => {
                const isActive = activeVideo?.videoId === video.videoId;
                return (
                  <button
                    key={video.videoId}
                    onClick={() => setActiveVideo(video)}
                    className={`group text-left transition-all duration-200 rounded-xl ${
                      isActive
                        ? "ring-2 ring-red-500 ring-offset-2 ring-offset-background"
                        : "hover:scale-[1.02]"
                    }`}
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                      <img
                        src={video.thumbnailHigh}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                      <div
                        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        <div className="h-12 w-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-black/30 group-hover:scale-110 transition-transform duration-300">
                          <Play className="h-5 w-5 text-white ml-0.5" />
                        </div>
                      </div>
                      {isActive && (
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider">
                          Now Playing
                        </div>
                      )}
                    </div>
                    <div className="mt-2.5 px-0.5">
                      <h4
                        className={`text-sm font-semibold leading-tight line-clamp-2 transition-colors ${
                          isActive
                            ? "text-red-600"
                            : "group-hover:text-red-600"
                        }`}
                      >
                        {video.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                        {formatViews(video.views) && (
                          <>
                            <span>{formatViews(video.views)}</span>
                            <span className="text-border">&middot;</span>
                          </>
                        )}
                        <span>{formatDate(video.published)}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Mobile actions */}
          <div className="flex sm:hidden items-center justify-center gap-4 mt-6">
            <a
              href={`${CHANNEL_URL}?sub_confirmation=1`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white gap-2"
              >
                <Youtube className="h-4 w-4" />
                Subscribe
              </Button>
            </a>
            <a
              href={`${CHANNEL_URL}/videos`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-red-600 transition-colors flex items-center gap-1.5"
            >
              View all
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YouTubeSection;
