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
import { ArrowRight, Star, Users, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { courseApi, statsApi } from "@/lib/api";

const Index = () => {
  // Fetch homepage stats
  const { data: apiStats } = useQuery({
    queryKey: ['homepageStats'],
    queryFn: () => statsApi.getStats(),
  });

  // Fetch courses for homepage
  const { data: allCourses = [] } = useQuery({
    queryKey: ['homePageCourses'],
    queryFn: () => courseApi.getCourses(),
  });

  // Show only first 3 courses
  const popularCourses = allCourses.slice(0, 3);

  const features = [
    {
      icon: "work",
      title: "Job Vacancies",
      description: "Find your next legal role from top firms and companies worldwide.",
      href: "/jobs",
    },
    {
      icon: "menu_book",
      title: "Legal Courses",
      description: "Upskill with certified classes and workshops from industry experts.",
      href: "/courses",
    },
    {
      icon: "account_circle",
      title: "Consultancy",
      description: "Book a session with a legal expert for personalized career advice.",
      href: "/appointment",
    },
  ];

  // Use real stats or fallback to defaults
  const stats = apiStats ? [
    { icon: Users, value: apiStats.students.display, label: "Legal Professionals" },
    { icon: Award, value: apiStats.courses.display + '+', label: "Certified Courses" },
    { icon: Star, value: apiStats.rating.display, label: "Average Rating" },
    { icon: TrendingUp, value: apiStats.successRate.display, label: "Success Rate" },
  ] : [
    { icon: Users, value: "50K+", label: "Legal Professionals" },
    { icon: Award, value: "200+", label: "Certified Courses" },
    { icon: Star, value: "4.9", label: "Average Rating" },
    { icon: TrendingUp, value: "95%", label: "Success Rate" },
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
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Over 10,000 Legal Jobs Available
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight tracking-tight animate-fade-in" style={{ animationDelay: "100ms" }}>
                  Find Your Path in{" "}
                  <span className="gradient-text">Legal Excellence</span>
                </h1>
                
                <p className="text-muted-foreground text-lg md:text-xl font-normal leading-relaxed max-w-2xl animate-fade-in" style={{ animationDelay: "200ms" }}>
                  Navigate your legal career with our comprehensive platform for employment, education, and expert guidance.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
                  <Link to="/jobs">
                    <Button size="lg" className="h-12 px-8 gradient-primary border-0 shadow-glow hover:shadow-glow-lg transition-all duration-300">
                      Explore Jobs
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/courses">
                    <Button size="lg" variant="outline" className="h-12 px-8">
                      Browse Courses
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: "400ms" }}>
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-elevated transition-all duration-300">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <span className="text-2xl md:text-3xl font-display font-bold">{stat.value}</span>
                    <span className="text-sm text-muted-foreground text-center">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="w-full py-16 bg-muted/30">
            <div className="container">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
                    <p className="text-muted-foreground mt-1">Discover opportunities at top legal firms</p>
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

          {/* Popular Courses Section */}
          <section className="w-full py-16 lg:py-20 bg-muted/30">
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
          </section>

          {/* Consultant Section */}
          <ConsultantSection />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
