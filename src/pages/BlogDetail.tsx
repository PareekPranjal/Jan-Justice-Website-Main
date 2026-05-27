import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PageLoader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { blogApi } from "@/lib/api";
import { ArrowLeft, Calendar, Share2, Link as LinkIcon, MessageCircle, Twitter, Facebook, Linkedin, Mail } from "lucide-react";

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: blog, isLoading, isError } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogApi.getBlogById(id!),
    enabled: Boolean(id),
  });

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = blog?.title ?? '';
  const shareText = blog?.excerpt ?? blog?.title ?? '';

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
        return;
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }
    await handleCopyLink();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Could not copy link');
    }
  };

  const openShareWindow = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600');
  };

  const shareTargets = {
    whatsapp: () =>
      openShareWindow(
        `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`
      ),
    twitter: () =>
      openShareWindow(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`
      ),
    facebook: () =>
      openShareWindow(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
      ),
    linkedin: () =>
      openShareWindow(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
      ),
    email: () => {
      window.location.href = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
    },
  };

  if (isLoading) return <PageLoader />;

  if (isError || !blog) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-2xl font-display font-bold mb-3">Article not found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find the article you're looking for.
            </p>
            <Link to="/blogs" className="text-primary font-semibold hover:underline inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Legal News
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{blog.title} | Jan Justice</title>
        {blog.excerpt && <meta name="description" content={blog.excerpt} />}
        <meta property="og:title" content={`${blog.title} | Jan Justice`} />
        {blog.excerpt && <meta property="og:description" content={blog.excerpt} />}
        <meta property="og:type" content="article" />
        {blog.image?.url && <meta property="og:image" content={blog.image.url} />}
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${blog.title} | Jan Justice`} />
        {blog.excerpt && <meta name="twitter:description" content={blog.excerpt} />}
        {blog.image?.url && <meta name="twitter:image" content={blog.image.url} />}
      </Helmet>
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow w-full">
          <article className="container max-w-3xl py-10 lg:py-14">
            {/* Back link */}
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              All Legal News
            </Link>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight mb-4">
              {blog.title}
            </h1>

            {/* Meta + share */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              {blog.createdAt ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              ) : <span />}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="default" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleNativeShare} className="gap-2">
                    <Share2 className="h-4 w-4" /> Share via…
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={shareTargets.whatsapp} className="gap-2">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={shareTargets.twitter} className="gap-2">
                    <Twitter className="h-4 w-4" /> Twitter / X
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={shareTargets.facebook} className="gap-2">
                    <Facebook className="h-4 w-4" /> Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={shareTargets.linkedin} className="gap-2">
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={shareTargets.email} className="gap-2">
                    <Mail className="h-4 w-4" /> Email
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopyLink} className="gap-2">
                    <LinkIcon className="h-4 w-4" /> Copy link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Cover image */}
            {blog.image?.url && (
              <div className="rounded-2xl overflow-hidden mb-10 border border-border/60">
                <img
                  src={blog.image.url}
                  alt={blog.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Excerpt as lead paragraph */}
            {blog.excerpt && (
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 italic border-l-4 border-primary/30 pl-4">
                {blog.excerpt}
              </p>
            )}

            {/* Sections */}
            <div className="space-y-6">
              {blog.sections.map((section, i) =>
                section.type === 'heading' ? (
                  <h2 key={i} className="text-2xl md:text-3xl font-display font-bold mt-8 mb-2">
                    {section.text}
                  </h2>
                ) : (
                  <p key={i} className="text-base md:text-lg leading-relaxed text-foreground/90 whitespace-pre-line">
                    {section.text}
                  </p>
                )
              )}
            </div>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BlogDetail;
