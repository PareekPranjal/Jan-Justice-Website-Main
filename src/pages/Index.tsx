import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FeatureCard from "@/components/home/FeatureCard";
import JobsTable from "@/components/home/JobsTable";
import CourseCard from "@/components/home/CourseCard";
import ConsultantSection from "@/components/home/ConsultantSection";
import YouTubeSection from "@/components/home/YouTubeSection";
import { ArrowRight, Calendar, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { courseApi, blogApi } from "@/lib/api";

const Index = () => {
  // Fetch courses for homepage
  const { data: allCourses = [] } = useQuery({
    queryKey: ['homePageCourses'],
    queryFn: () => courseApi.getCourses(),
  });

  // Show only first 3 courses
  const popularCourses = allCourses.slice(0, 3);

  // Fetch featured blogs for homepage
  const { data: featuredBlogs = [] } = useQuery({
    queryKey: ['featuredBlogs'],
    queryFn: () => blogApi.getFeaturedBlogs(),
  });

  const features = [
    {
      icon: "account_circle",
      title: "Consultancy",
      description: "Book Legal Consultation",
      href: "/appointment",
    },
    {
      icon: "menu_book",
      title: "Legal Courses",
      description: "Explore Law Courses",
      href: "/courses",
    },
    {
      icon: "work",
      title: "Job Vacancies",
      description: "Find Legal Jobs",
      href: "/jobs",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Jan Justice - Find Your Path in Law | Legal Jobs, Courses & Consultancy</title>
        <meta name="description" content="Navigate your legal career with Jan Justice. Find legal job vacancies, certified courses, and book expert consultations for career advice in law." />
      </Helmet>
      
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <Header />
        
        <main className="flex flex-col items-center w-full">
          {/* Hero Section */}
          <section className="w-full relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="container py-16 lg:py-24">
              <div className="flex flex-col gap-8 text-center items-center max-w-4xl mx-auto">
                <h1 className="animate-fade-in flex flex-col items-center gap-3" style={{ animationDelay: "100ms" }}>
                  <span className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight text-primary">
                    Jan<span className="text-foreground">Justice</span>
                  </span>
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-muted-foreground tracking-wide text-center">
                    Your Legal Support & Career Platform
                  </span>
                </h1>
                
                <p className="text-muted-foreground text-lg md:text-xl font-normal leading-relaxed max-w-2xl animate-fade-in" style={{ animationDelay: "200ms" }}>
                  Get trusted legal guidance, learn practical law skills, and explore verified legal job opportunities — all in one place.
                </p>

              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
                {features.map((feature, index) => (
                  <FeatureCard key={feature.href} {...feature} delay={index * 100} />
                ))}
              </div>
            </div>
          </section>

          {/* Latest Jobs Section */}
          <section className="w-full py-16 lg:py-20">
            <div className="container">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold">Latest Job Vacancies</h2>
                    <p className="text-muted-foreground mt-1">Discover opportunities at courts, law firms & government departments across India</p>
                  </div>
                  <Link to="/jobs" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                    View all jobs
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <JobsTable />
                <Link to="/jobs" className="flex sm:hidden items-center justify-center gap-2 text-sm font-semibold text-primary mt-6">
                  View all jobs
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* YouTube Channel Section */}
          <YouTubeSection />

          {/* Featured Blogs Section — only renders when there are featured blogs */}
          {featuredBlogs.length > 0 && (
            <section className="w-full py-16 lg:py-20 bg-muted/30">
              <div className="container">
                <div className="max-w-6xl mx-auto">
                  <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-display font-bold">From the Blog</h2>
                      <p className="text-muted-foreground mt-1">Latest insights and updates from our team</p>
                    </div>
                    <Link to="/blogs" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                      View all blogs
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredBlogs.map((blog, i) => (
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
                  <Link to="/blogs" className="flex sm:hidden items-center justify-center gap-2 text-sm font-semibold text-primary mt-6">
                    View all blogs
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Popular Courses Section */}
          {/* <section className="w-full py-16 lg:py-20 bg-muted/30">
            <div className="container">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold">Popular Legal Courses</h2>
                    <p className="text-muted-foreground mt-1">Advance your skills with expert-led programs</p>
                  </div>
                  <Link to="/courses" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                    Browse Catalog
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popularCourses.map((course, index) => (
                    <CourseCard
                      key={course._id}
                      id={course._id}
                      image={course.image}
                      title={course.title}
                      description={course.description}
                      duration={course.duration}
                      level={course.level}
                      certified={course.certified}
                      delay={index * 100}
                    />
                  ))}
                </div>
                <Link to="/courses" className="flex sm:hidden items-center justify-center gap-2 text-sm font-semibold text-primary mt-6">
                  Browse Catalog
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section> */}

          {/* Consultant Section */}
          <ConsultantSection />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
