import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Input } from "@/components/ui/input";

const coursesData = [
  {
    id: "1",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGLdp2t9Kauult0IeoBCyPo1tbJSUbRKyeN6WO1IhajZ8JuYiwULMzXrRm7SrfMp18CQoIpEojsNVzeRzdVhUvfr7VIVmqqJ7jaiBdbKVrJ1FCTKZcEwZUtOiwHF3jGAHgK2b5Lj4wuIlL5Ulmt99n7w3HTBnscWeW87atMkIy_vNpYyPScp3rnvwmEgB_YLzHSqgiJ7OUgxE5ht26QY2tapmIlsbbr-QS5cXOO2Ips5Dc1k1hRG4e-1Ag5ZdXZ7GOwyh6CPwu-PE",
    title: "Contract Law Fundamentals",
    description: "Master the essentials of contract drafting, negotiation, and enforcement with practical exercises.",
    duration: "8 Weeks",
    level: "Beginner",
    rating: 4.8,
    students: 1234,
    certified: true,
  },
  {
    id: "2",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBezqJdWTOzQz1Da6EJiZ9QNcqoSLvAAWD3oPLD8AGSo90iOGEQtKIoXaq03W3_-Vsq1p7s64kvw_OfCASCHif2vWobn4PGV3ALR9N0bjhEOgAxvXc9YYeUDa1dUivaRIPdMunG9fFoGOZmUTKnTjLbVZ04qWAOaKmuZ2yv_BfonFCnE1Gkz2ZKZw7EuK9IzjTWZx0x6q_Xmi3wK2hd_zr-ReHusUW1uWxmiT6_Li5RVYr1hq9rDBM20pNOEHapYFwRe4cuDHIxlAo",
    title: "Advanced Corporate Law & Mergers",
    description: "Deep dive into M&A, due diligence, and regulatory compliance for experienced legal professionals.",
    duration: "12 Weeks",
    level: "Advanced",
    rating: 4.9,
    students: 856,
    certified: true,
  },
  {
    id: "3",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuChhVyWogtJnymQeED-OilEw-KA3ALlGzptjQ2jNBCtuj5d2h3e8zpAs8kpehYIRSMLmmLEXuOV46S8gmo9qMciYCObOBF_uX736zYPkrKSCBizWAxEm7WbYZ2Jb8vwFh8vXFbCNRVedM2D3T1oq-KKHwwjzRP7aJIv58LrJsccLq2C15eKvsYCfpAaCt1q-6Sjo8VoJ8pkIPZt0kNqV53p3NWwDnNDtmRvJx2gfuopygAA7RPpAagi-r3KHD38pp39bsjsCacQnlM",
    title: "International Trade Law",
    description: "Navigate complex cross-border transactions and international trade regulations.",
    duration: "10 Weeks",
    level: "Intermediate",
    rating: 4.7,
    students: 642,
    certified: true,
  },
  {
    id: "4",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGLdp2t9Kauult0IeoBCyPo1tbJSUbRKyeN6WO1IhajZ8JuYiwULMzXrRm7SrfMp18CQoIpEojsNVzeRzdVhUvfr7VIVmqqJ7jaiBdbKVrJ1FCTKZcEwZUtOiwHF3jGAHgK2b5Lj4wuIlL5Ulmt99n7w3HTBnscWeW87atMkIy_vNpYyPScp3rnvwmEgB_YLzHSqgiJ7OUgxE5ht26QY2tapmIlsbbr-QS5cXOO2Ips5Dc1k1hRG4e-1Ag5ZdXZ7GOwyh6CPwu-PE",
    title: "Intellectual Property Essentials",
    description: "Comprehensive coverage of patents, trademarks, copyrights, and trade secrets.",
    duration: "6 Weeks",
    level: "Beginner",
    rating: 4.6,
    students: 1089,
    certified: true,
  },
];

const Courses = () => {
  return (
    <>
      <Helmet>
        <title>Legal Courses | LegalHub - Certified Legal Education</title>
        <meta name="description" content="Advance your legal career with certified courses. Contract law, corporate law, IP, and more from industry experts." />
      </Helmet>
      
      <div className="bg-background min-h-screen flex flex-col">
        <Header title="LegalEd Platform" />
        
        <main className="flex-grow">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border animate-fade-in">
              <div>
                <h1 className="text-3xl lg:text-4xl font-black">Course Catalog</h1>
                <p className="text-muted-foreground mt-2">
                  Explore {coursesData.length} certified legal courses
                </p>
              </div>
              <div className="w-full md:w-72">
                <Input 
                  placeholder="Search courses..." 
                  className="h-10"
                />
              </div>
            </div>
            
            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-8">
              {coursesData.map((course, index) => (
                <Link
                  key={course.id}
                  to="/course-detail"
                  className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="h-40 w-full bg-secondary relative overflow-hidden">
                    <img
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={course.image}
                    />
                    {course.certified && (
                      <div className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                        Certified
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 p-4 flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      {course.duration}
                      <span className="w-1 h-1 rounded-full bg-border"></span>
                      <span>{course.level}</span>
                    </div>
                    <h3 className="text-base font-bold leading-tight group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
                      <div className="flex items-center gap-1 text-sm">
                        <span className="material-symbols-outlined text-warning text-sm">star</span>
                        <span className="font-semibold">{course.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {course.students.toLocaleString()} students
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Courses;
