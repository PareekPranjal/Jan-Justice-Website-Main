import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const myCourses = [
  {
    id: "1",
    title: "Drafting & Negotiating International Contracts",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuChhVyWogtJnymQeED-OilEw-KA3ALlGzptjQ2jNBCtuj5d2h3e8zpAs8kpehYIRSMLmmLEXuOV46S8gmo9qMciYCObOBF_uX736zYPkrKSCBizWAxEm7WbYZ2Jb8vwFh8vXFbCNRVedM2D3T1oq-KKHwwjzRP7aJIv58LrJsccLq2C15eKvsYCfpAaCt1q-6Sjo8VoJ8pkIPZt0kNqV53p3NWwDnNDtmRvJx2gfuopygAA7RPpAagi-r3KHD38pp39bsjsCacQnlM",
    progress: 65,
  },
  {
    id: "2",
    title: "Advanced Corporate Law & Mergers",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBezqJdWTOzQz1Da6EJiZ9QNcqoSLvAAWD3oPLD8AGSo90iOGEQtKIoXaq03W3_-Vsq1p7s64kvw_OfCASCHif2vWobn4PGV3ALR9N0bjhEOgAxvXc9YYeUDa1dUivaRIPdMunG9fFoGOZmUTKnTjLbVZ04qWAOaKmuZ2yv_BfonFCnE1Gkz2ZKZw7EuK9IzjTWZx0x6q_Xmi3wK2hd_zr-ReHusUW1uWxmiT6_Li5RVYr1hq9rDBM20pNOEHapYFwRe4cuDHIxlAo",
    progress: 30,
  },
  {
    id: "3",
    title: "Contract Law Fundamentals",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGLdp2t9Kauult0IeoBCyPo1tbJSUbRKyeN6WO1IhajZ8JuYiwULMzXrRm7SrfMp18CQoIpEojsNVzeRzdVhUvfr7VIVmqqJ7jaiBdbKVrJ1FCTKZcEwZUtOiwHF3jGAHgK2b5Lj4wuIlL5Ulmt99n7w3HTBnscWeW87atMkIy_vNpYyPScp3rnvwmEgB_YLzHSqgiJ7OUgxE5ht26QY2tapmIlsbbr-QS5cXOO2Ips5Dc1k1hRG4e-1Ag5ZdXZ7GOwyh6CPwu-PE",
    progress: 100,
  },
];

const MyCourses = () => {
  return (
    <>
      <Helmet>
        <title>My Learning Dashboard | LegalEd</title>
        <meta name="description" content="Track your progress and continue learning with your enrolled legal courses." />
      </Helmet>
      
      <div className="bg-background min-h-screen flex">
        {/* Sidebar */}
        <aside className="w-72 bg-card border-r border-border flex flex-col h-screen sticky top-0 hidden lg:flex">
          <div className="p-6 flex items-center gap-3">
            <div className="bg-primary/10 rounded-lg p-2">
              <span className="material-symbols-outlined text-primary text-2xl">gavel</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">LegalEd</h1>
              <p className="text-xs text-muted-foreground">Premium Plan</p>
            </div>
          </div>
          
          <nav className="flex-1 px-4 py-4 flex flex-col gap-2">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary transition-colors"
            >
              <span className="material-symbols-outlined">home</span>
              Home
            </Link>
            <Link
              to="/courses"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary transition-colors"
            >
              <span className="material-symbols-outlined">library_books</span>
              Catalog
            </Link>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-bold">
              <span className="material-symbols-outlined">school</span>
              My Courses
            </div>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-screen">
          {/* Top Header */}
          <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 lg:px-10">
            <div className="flex items-center gap-4 lg:hidden">
              <Link to="/" className="text-muted-foreground">
                <span className="material-symbols-outlined">home</span>
              </Link>
              <span className="font-bold text-lg">LegalEd</span>
            </div>
            <div className="hidden lg:block text-sm font-semibold">My Courses</div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                JD
              </div>
            </div>
          </header>
          
          {/* Dashboard Content */}
          <div className="p-6 lg:p-10 flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 animate-fade-in">
              <div>
                <h1 className="text-3xl font-black">My Learning Dashboard</h1>
                <p className="text-muted-foreground">Track your progress and continue learning.</p>
              </div>
              <Button className="shadow-elevated">
                <span className="material-symbols-outlined mr-2 text-sm">play_circle</span>
                Resume Learning
              </Button>
            </div>
            
            {/* Course Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {myCourses.map((course, index) => (
                <article
                  key={course.id}
                  className="bg-card rounded-xl border border-border overflow-hidden shadow-card flex flex-col animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className="h-48 bg-cover bg-center relative"
                    style={{ backgroundImage: `url('${course.image}')` }}
                  >
                    {course.progress === 100 && (
                      <div className="absolute top-3 right-3 bg-success text-success-foreground px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        Completed
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1 gap-4">
                    <h3 className="text-lg font-bold">{course.title}</h3>
                    <div className="mt-auto">
                      <Progress value={course.progress} className="h-2 mb-2" />
                      <span className="text-xs font-semibold text-muted-foreground">
                        {course.progress}% Completed
                      </span>
                      <Button
                        className="mt-4 w-full"
                        variant={course.progress === 100 ? "outline" : "default"}
                      >
                        {course.progress === 100 ? "Review Course" : "Continue"}
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default MyCourses;
