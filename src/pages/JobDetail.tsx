import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Bookmark, Share2, MapPin, Clock, DollarSign, Building2, Users, FileText, Download, ExternalLink, CheckCircle2, Briefcase } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const JobDetail = () => {
  const [isPdfExpanded, setIsPdfExpanded] = useState(false);

  const job = {
    title: "Senior Corporate Associate",
    company: "Pearson & Specter LLP",
    location: "New York, NY (Hybrid)",
    type: "Full-time",
    level: "Senior Level",
    salary: "$180,000 - $220,000",
    experience: "5-7 years",
    posted: "3 days ago",
    department: "Mergers & Acquisitions",
    teamSize: "15-20 attorneys",
  };

  const responsibilities = [
    "Drafting transaction documents including merger agreements, stock purchase agreements, and asset purchase agreements",
    "Managing due diligence processes and coordinating with cross-functional teams",
    "Advising clients on corporate governance matters and regulatory compliance",
    "Mentoring junior associates and contributing to practice development",
    "Leading negotiations with opposing counsel on complex deal terms",
    "Preparing disclosure schedules and ancillary transaction documents",
  ];

  const requirements = [
    "J.D. from an ABA-accredited law school",
    "5-7 years of M&A experience at a major law firm",
    "New York Bar admission in good standing",
    "Excellent analytical and communication skills",
    "Proven track record of managing complex transactions",
    "Strong attention to detail and ability to work under pressure",
  ];

  const benefits = [
    "Competitive base salary with annual bonuses",
    "Comprehensive health, dental, and vision insurance",
    "401(k) with generous employer matching",
    "Flexible hybrid work arrangements",
    "Professional development allowance",
    "Generous PTO and parental leave policies",
  ];

  return (
    <>
      <Helmet>
        <title>{job.title} - {job.company} | LegalHub</title>
        <meta name="description" content={`Apply for ${job.title} position at ${job.company}. ${job.type} role in ${job.location} with competitive salary.`} />
      </Helmet>
      
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <div className="relative overflow-hidden border-b border-border/50">
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2" />
            </div>
            
            <div className="container py-8">
              {/* Breadcrumb */}
              <nav className="flex flex-wrap gap-2 text-sm mb-6 animate-fade-in">
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
                <span className="text-muted-foreground">/</span>
                <Link to="/jobs" className="text-muted-foreground hover:text-primary transition-colors">Jobs</Link>
                <span className="text-muted-foreground">/</span>
                <span className="font-medium text-foreground">Senior Associate</span>
              </nav>

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                      <Building2 className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-display font-bold">{job.title}</h1>
                      <p className="text-muted-foreground font-medium">{job.company}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <span className="text-border">•</span>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {job.posted}
                    </div>
                    <span className="text-border">•</span>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {job.teamSize}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="badge-info">{job.type}</span>
                    <span className="badge-success">{job.level}</span>
                    <span className="badge-warning">{job.department}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:text-right">
                  <Button size="lg" className="h-12 px-8 gradient-primary border-0 shadow-glow hover:shadow-glow-lg transition-all duration-300">
                    Apply Now
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="lg" className="h-12 flex-1">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="lg" className="h-12 flex-1">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Job Details */}
              <div className="lg:col-span-2 space-y-6">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="w-full justify-start h-12 p-1 bg-muted rounded-xl mb-6">
                    <TabsTrigger value="overview" className="rounded-lg data-[state=active]:shadow-sm">Overview</TabsTrigger>
                    <TabsTrigger value="requirements" className="rounded-lg data-[state=active]:shadow-sm">Requirements</TabsTrigger>
                    <TabsTrigger value="benefits" className="rounded-lg data-[state=active]:shadow-sm">Benefits</TabsTrigger>
                    <TabsTrigger value="document" className="rounded-lg data-[state=active]:shadow-sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Job PDF
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6 animate-fade-in">
                    <div className="bg-card rounded-2xl p-6 md:p-8 border border-border/50 shadow-soft">
                      <h2 className="text-xl font-display font-bold mb-4">About This Role</h2>
                      <p className="text-muted-foreground leading-relaxed">
                        Pearson & Specter LLP is seeking a highly motivated and experienced Senior Corporate Associate to join our bustling Mergers & Acquisitions practice. The ideal candidate will have a strong background in transactional work, exceptional drafting skills, and the ability to manage complex deals from inception to closing. You'll work alongside some of the most talented attorneys in the industry on high-profile transactions for Fortune 500 clients.
                      </p>
                    </div>

                    <div className="bg-card rounded-2xl p-6 md:p-8 border border-border/50 shadow-soft">
                      <h2 className="text-xl font-display font-bold mb-4">Key Responsibilities</h2>
                      <ul className="space-y-3">
                        {responsibilities.map((item, index) => (
                          <li key={index} className="flex items-start gap-3 text-muted-foreground">
                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="requirements" className="animate-fade-in">
                    <div className="bg-card rounded-2xl p-6 md:p-8 border border-border/50 shadow-soft">
                      <h2 className="text-xl font-display font-bold mb-4">Requirements & Qualifications</h2>
                      <ul className="space-y-3">
                        {requirements.map((item, index) => (
                          <li key={index} className="flex items-start gap-3 text-muted-foreground">
                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="benefits" className="animate-fade-in">
                    <div className="bg-card rounded-2xl p-6 md:p-8 border border-border/50 shadow-soft">
                      <h2 className="text-xl font-display font-bold mb-4">Benefits & Perks</h2>
                      <ul className="space-y-3">
                        {benefits.map((item, index) => (
                          <li key={index} className="flex items-start gap-3 text-muted-foreground">
                            <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="document" className="animate-fade-in">
                    <div className="bg-card rounded-2xl border border-border/50 shadow-soft overflow-hidden">
                      <div className="p-4 bg-muted/50 border-b border-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-destructive" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">Job_Description_Senior_Associate.pdf</p>
                            <p className="text-xs text-muted-foreground">2.4 MB • Last updated 3 days ago</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="gap-2">
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsPdfExpanded(!isPdfExpanded)}>
                            <ExternalLink className="h-4 w-4" />
                            {isPdfExpanded ? "Collapse" : "Expand"}
                          </Button>
                        </div>
                      </div>
                      
                      {/* PDF Viewer */}
                      <div className={`transition-all duration-500 ${isPdfExpanded ? "h-[800px]" : "h-[500px]"}`}>
                        <iframe
                          src="https://mozilla.github.io/pdf.js/web/viewer.html?file=https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf"
                          className="w-full h-full border-0"
                          title="Job Description PDF"
                        />
                      </div>
                      
                      <div className="p-4 bg-muted/30 border-t border-border/50">
                        <p className="text-sm text-muted-foreground text-center">
                          Can't view the PDF?{" "}
                          <a href="#" className="text-primary font-medium hover:underline">
                            Click here to download
                          </a>
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Quick Info Card */}
                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft sticky top-24 animate-fade-in" style={{ animationDelay: "200ms" }}>
                  <h3 className="font-display font-bold mb-4">Job Details</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-medium">Salary Range</p>
                        <p className="font-semibold">{job.salary}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-medium">Experience</p>
                        <p className="font-semibold">{job.experience}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-medium">Job Type</p>
                        <p className="font-semibold">{job.type}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-medium">Location</p>
                        <p className="font-semibold">{job.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border/50 my-6" />

                  <Button className="w-full h-12 gradient-primary border-0 shadow-glow hover:shadow-glow-lg transition-all duration-300">
                    Apply Now
                  </Button>
                </div>

                {/* Company Card */}
                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft animate-fade-in" style={{ animationDelay: "300ms" }}>
                  <h3 className="font-display font-bold mb-4">About the Company</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                      <span className="text-lg font-display font-bold text-primary-foreground">PS</span>
                    </div>
                    <div>
                      <p className="font-semibold">{job.company}</p>
                      <p className="text-sm text-muted-foreground">Elite Law Firm</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Pearson & Specter LLP is a leading full-service law firm with offices across the globe. We are known for our innovative approach to complex legal challenges and our commitment to client excellence.
                  </p>
                  <Button variant="outline" className="w-full mt-4">
                    View Company Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default JobDetail;
