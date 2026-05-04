import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PageLoader } from "@/components/ui/loader";
import { blogApi } from "@/lib/api";
import { Newspaper, ArrowRight, Calendar } from "lucide-react";

const Blogs = () => {
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogApi.getBlogs(),
  });

  if (isLoading) return <PageLoader />;

  // Empty state — Coming Soon (mirrors the /courses placeholder)
  if (blogs.length === 0) {
    return (
      <>
        <Helmet>
          <title>Blogs - Coming Soon | Jan Justice</title>
          <meta name="description" content="Our blogs system is coming soon. Stay tuned!" />
        </Helmet>
        <div className="bg-background min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow flex items-center justify-center px-4">
            <div className="text-center max-w-md mx-auto animate-fade-in">
              <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
                <Newspaper className="h-10 w-10" />
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Coming Soon
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Our Blogs system is currently under development. We'll be live shortly — stay tuned!
              </p>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Blogs | Jan Justice</title>
        <meta name="description" content="Read the latest articles, legal insights, and career advice from Jan Justice." />
      </Helmet>
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow w-full">
          <section className="container py-12 lg:py-16">
            <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-5">
                <Newspaper className="h-7 w-7" />
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
                Latest Articles
              </h1>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                Insights, updates, and career advice from the Jan Justice team.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {blogs.map((blog, i) => (
                <Link
                  key={blog._id}
                  to={`/blogs/${blog._id}`}
                  className="group bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-300 flex flex-col animate-fade-in"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {blog.image?.url ? (
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img
                        src={blog.image.url}
                        alt={blog.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <Newspaper className="h-10 w-10 text-primary/40" />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col gap-3">
                    <h3 className="text-lg font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    {blog.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-3">{blog.excerpt}</p>
                    )}
                    <div className="mt-auto pt-3 flex items-center justify-between border-t border-border/40">
                      {blog.createdAt && (
                        <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                      <span className="text-sm font-semibold text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read more
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Blogs;
