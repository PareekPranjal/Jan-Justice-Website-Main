import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FeatureCard from "@/components/home/FeatureCard";
import JobsTable from "@/components/home/JobsTable";
import CourseCard from "@/components/home/CourseCard";
import ConsultantSection from "@/components/home/ConsultantSection";

const Index = () => {
  const features = [
    {
      icon: "work",
      title: "Job Vacancies",
      description: "Find your next legal role from top firms and companies.",
      href: "/jobs",
    },
    {
      icon: "menu_book",
      title: "Legal Courses",
      description: "Upskill with certified classes and legal workshops.",
      href: "/courses",
    },
    {
      icon: "account_circle",
      title: "Consultancy",
      description: "Book a session with a legal expert for career advice.",
      href: "/appointment",
    },
  ];

  const courses = [
    {
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGLdp2t9Kauult0IeoBCyPo1tbJSUbRKyeN6WO1IhajZ8JuYiwULMzXrRm7SrfMp18CQoIpEojsNVzeRzdVhUvfr7VIVmqqJ7jaiBdbKVrJ1FCTKZcEwZUtOiwHF3jGAHgK2b5Lj4wuIlL5Ulmt99n7w3HTBnscWeW87atMkIy_vNpYyPScp3rnvwmEgB_YLzHSqgiJ7OUgxE5ht26QY2tapmIlsbbr-QS5cXOO2Ips5Dc1k1hRG4e-1Ag5ZdXZ7GOwyh6CPwu-PE",
      title: "Contract Law Fundamentals",
      description: "Master the essentials of contract drafting, negotiation, and enforcement.",
      duration: "8 Weeks",
      level: "Beginner",
      certified: true,
    },
    {
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBezqJdWTOzQz1Da6EJiZ9QNcqoSLvAAWD3oPLD8AGSo90iOGEQtKIoXaq03W3_-Vsq1p7s64kvw_OfCASCHif2vWobn4PGV3ALR9N0bjhEOgAxvXc9YYeUDa1dUivaRIPdMunG9fFoGOZmUTKnTjLbVZ04qWAOaKmuZ2yv_BfonFCnE1Gkz2ZKZw7EuK9IzjTWZx0x6q_Xmi3wK2hd_zr-ReHusUW1uWxmiT6_Li5RVYr1hq9rDBM20pNOEHapYFwRe4cuDHIxlAo",
      title: "Corporate M&A Strategies",
      description: "Learn advanced merger and acquisition tactics from industry experts.",
      duration: "12 Weeks",
      level: "Advanced",
      certified: true,
    },
    {
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuChhVyWogtJnymQeED-OilEw-KA3ALlGzptjQ2jNBCtuj5d2h3e8zpAs8kpehYIRSMLmmLEXuOV46S8gmo9qMciYCObOBF_uX736zYPkrKSCBizWAxEm7WbYZ2Jb8vwFh8vXFbCNRVedM2D3T1oq-KKHwwjzRP7aJIv58LrJsccLq2C15eKvsYCfpAaCt1q-6Sjo8VoJ8pkIPZt0kNqV53p3NWwDnNDtmRvJx2gfuopygAA7RPpAagi-r3KHD38pp39bsjsCacQnlM",
      title: "International Trade Law",
      description: "Navigate complex cross-border transactions and regulations.",
      duration: "10 Weeks",
      level: "Intermediate",
      certified: true,
    },
  ];

  return (
    <>
      <Helmet>
        <title>LegalHub - Find Your Path in Law | Legal Jobs, Courses & Consultancy</title>
        <meta name="description" content="Navigate your legal career with LegalHub. Find legal job vacancies, certified courses, and book expert consultations for career advice in law." />
      </Helmet>
      
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <Header />
        
        <main className="flex flex-col items-center w-full">
          {/* Hero Section */}
          <section className="w-full flex justify-center px-4 lg:px-10 py-12 lg:py-16">
            <div className="flex flex-col max-w-[960px] flex-1 gap-12">
              <div className="flex flex-col gap-6 text-center items-center animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight max-w-[720px]">
                  Find Your Path in Law
                </h1>
                <p className="text-muted-foreground text-lg font-normal leading-relaxed max-w-[640px]">
                  Navigate your legal career with our dedicated tools for employment, education, and expert advice.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {features.map((feature, index) => (
                  <FeatureCard key={feature.href} {...feature} delay={index * 100} />
                ))}
              </div>
            </div>
          </section>

          {/* Latest Jobs Section */}
          <section className="w-full flex justify-center bg-card/50 py-12 px-4 lg:px-10 border-y border-border">
            <div className="flex flex-col max-w-[960px] flex-1 gap-6">
              <div className="flex items-center justify-between pb-2">
                <h2 className="text-2xl font-bold leading-tight tracking-tight">Latest Job Vacancies</h2>
                <Link to="/jobs" className="text-sm font-bold text-primary hover:underline">
                  View all jobs
                </Link>
              </div>
              <JobsTable />
            </div>
          </section>

          {/* Popular Courses Section */}
          <section className="w-full flex justify-center px-4 lg:px-10 py-12 lg:py-16">
            <div className="flex flex-col max-w-[960px] flex-1 gap-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold leading-tight tracking-tight">Popular Legal Courses</h2>
                <Link to="/courses" className="text-sm font-bold text-primary hover:underline">
                  Browse Catalog
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, index) => (
                  <CourseCard key={course.title} {...course} delay={index * 100} />
                ))}
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
