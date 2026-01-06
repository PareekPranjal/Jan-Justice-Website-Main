import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";

const JobDetail = () => {
  return (
    <>
      <Helmet>
        <title>Senior Corporate Associate - Pearson & Specter LLP | LegalHub</title>
        <meta name="description" content="Apply for Senior Corporate Associate position at Pearson & Specter LLP. Full-time role in New York with competitive salary." />
      </Helmet>
      
      <div className="bg-background min-h-screen flex flex-col">
        <Header title="LexJobs" />
        
        <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap gap-2 py-4 text-sm animate-fade-in">
            <Link to="/" className="text-muted-foreground hover:text-primary font-medium">Home</Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/jobs" className="text-muted-foreground hover:text-primary font-medium">Jobs</Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">Senior Associate</span>
          </nav>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
            <main className="lg:col-span-8 flex flex-col gap-6">
              {/* Job Header */}
              <div className="bg-card rounded-xl p-6 border border-border shadow-card animate-fade-in">
                <h1 className="text-3xl font-bold leading-tight">Senior Corporate Associate</h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-muted-foreground mt-2">
                  <span className="font-semibold text-foreground">Pearson & Specter LLP</span>
                  <span>• New York, NY (Hybrid)</span>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <span className="flex h-8 items-center justify-center px-3 rounded-full bg-secondary text-xs font-medium">
                    Full-time
                  </span>
                  <span className="flex h-8 items-center justify-center px-3 rounded-full bg-secondary text-xs font-medium">
                    Senior Level
                  </span>
                </div>
              </div>
              
              {/* Job Content */}
              <div className="bg-card rounded-xl p-6 md:p-8 border border-border shadow-card space-y-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
                <section>
                  <h2 className="text-xl font-bold mb-4">Job Overview</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Pearson & Specter LLP is seeking a highly motivated and experienced Senior Corporate Associate to join our bustling Mergers & Acquisitions practice. The ideal candidate will have a strong background in transactional work, exceptional drafting skills, and the ability to manage complex deals from inception to closing.
                  </p>
                </section>
                
                <hr className="border-border" />
                
                <section>
                  <h2 className="text-xl font-bold mb-4">Key Responsibilities</h2>
                  <ul className="space-y-3">
                    {[
                      "Drafting transaction documents including merger agreements, stock purchase agreements, and asset purchase agreements",
                      "Managing due diligence processes and coordinating with cross-functional teams",
                      "Advising clients on corporate governance matters and regulatory compliance",
                      "Mentoring junior associates and contributing to practice development",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-muted-foreground">
                        <span className="material-symbols-outlined text-primary text-sm mt-1">check_circle</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
                
                <hr className="border-border" />
                
                <section>
                  <h2 className="text-xl font-bold mb-4">Requirements</h2>
                  <ul className="space-y-3">
                    {[
                      "J.D. from an ABA-accredited law school",
                      "5-7 years of M&A experience at a major law firm",
                      "New York Bar admission in good standing",
                      "Excellent analytical and communication skills",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-muted-foreground">
                        <span className="material-symbols-outlined text-primary text-sm mt-1">task_alt</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </main>
            
            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-card rounded-xl p-6 border border-border shadow-card sticky top-24 animate-fade-in" style={{ animationDelay: "200ms" }}>
                <Button className="w-full h-12 shadow-elevated" size="lg">
                  Apply Now
                </Button>
                
                <div className="my-6 border-t border-border"></div>
                
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Salary Range</p>
                    <p className="font-semibold text-lg">$180,000 - $220,000</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Experience</p>
                    <p className="font-semibold">5-7 years</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Posted</p>
                    <p className="font-semibold">3 days ago</p>
                  </div>
                </div>
                
                <div className="my-6 border-t border-border"></div>
                
                <div className="flex flex-col gap-3">
                  <Button variant="outline" className="w-full">
                    <span className="material-symbols-outlined mr-2 text-lg">bookmark</span>
                    Save Job
                  </Button>
                  <Button variant="outline" className="w-full">
                    <span className="material-symbols-outlined mr-2 text-lg">share</span>
                    Share
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobDetail;
