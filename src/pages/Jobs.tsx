import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import JobFilters from "@/components/jobs/JobFilters";
import JobCard from "@/components/jobs/JobCard";

const jobsData = [
  {
    id: "1",
    title: "Senior Legal Associate",
    company: "LexIsis Legal Partners",
    department: "Corporate Law",
    description: "We are seeking an experienced Senior Legal Associate with 5-7 years of experience in Corporate Litigation and Mergers & Acquisitions.",
  },
  {
    id: "2",
    title: "Patent Attorney",
    company: "High Court of Bombay",
    department: "IP Rights",
    description: "Looking for a registered Patent Attorney to assist with drafting patent specifications and handling IP portfolio management.",
  },
  {
    id: "3",
    title: "Associate Counsel",
    company: "TechLaw Solutions",
    department: "Technology Law",
    description: "Join our growing team to provide legal support for technology companies, including contracts, privacy, and regulatory compliance.",
  },
  {
    id: "4",
    title: "Real Estate Attorney",
    company: "Metro Legal Group",
    department: "Real Estate",
    description: "Handle commercial real estate transactions, title review, and lease negotiations for our diverse client portfolio.",
  },
];

const Jobs = () => {
  return (
    <>
      <Helmet>
        <title>Legal Job Vacancies | LegalHub - Find Your Next Legal Role</title>
        <meta name="description" content="Browse legal job vacancies from top law firms and companies. Find attorney, counsel, and legal professional positions." />
      </Helmet>
      
      <div className="bg-background min-h-screen flex flex-col">
        <Header title="LegalJobs" />
        
        <main className="flex-grow flex flex-col items-center">
          <div className="w-full max-w-7xl px-4 lg:px-8 py-8 flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-border">
              <div className="flex flex-col gap-2 animate-fade-in">
                <h1 className="text-3xl lg:text-4xl font-black">Legal Job Vacancies</h1>
                <p className="text-muted-foreground text-base font-medium">
                  Showing {jobsData.length} active openings
                </p>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8 items-start relative">
              <JobFilters />
              
              <div className="w-full lg:w-3/4 flex flex-col gap-5">
                {jobsData.map((job, index) => (
                  <div key={job.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <JobCard {...job} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Jobs;
