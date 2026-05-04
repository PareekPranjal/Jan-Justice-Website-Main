import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PageLoader } from "@/components/ui/loader";
import { blogApi } from "@/lib/api";
import { ArrowLeft, Calendar } from "lucide-react";

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: blog, isLoading, isError } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogApi.getBlogById(id!),
    enabled: Boolean(id),
  });

  if (isLoading) return <PageLoader />;

  if (isError || !blog) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-2xl font-display font-bold mb-3">Blog not found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find the blog you're looking for.
            </p>
            <Link to="/blogs" className="text-primary font-semibold hover:underline inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to all blogs
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
              All blogs
            </Link>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight mb-4">
              {blog.title}
            </h1>

            {/* Meta */}
            {blog.createdAt && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                <Calendar className="h-4 w-4" />
                {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            )}

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
