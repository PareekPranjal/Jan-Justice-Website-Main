import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Bookmark, Share2, Building2, ArrowLeft, FileText, Download, ExternalLink, Calendar, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { jobApi, BACKEND_URL } from "@/lib/api";
import DynamicSection from "@/components/jobs/DynamicSection";
import DynamicSidebarField from "@/components/jobs/DynamicSidebarField";
import { useSavedJobs } from "@/hooks/use-saved-jobs";
import { useToast } from "@/hooks/use-toast";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isPdfExpanded, setIsPdfExpanded] = useState(false);
  const { isJobSaved, toggleSaveJob } = useSavedJobs();
  const { toast } = useToast();

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobApi.getJobById(id!),
    enabled: !!id,
  });

  // Resolve file URL: full URLs (Cloudinary) are used as-is, relative paths get BACKEND_URL prepended
  const resolveFileUrl = (url: string) => url.startsWith('http') ? url : `${BACKEND_URL}${url}`;

  const hasDynamicTabs = Boolean(job?.tabs && job.tabs.length > 0);
  const hasDynamicSidebar = Boolean(job?.sidebarFields && job.sidebarFields.length > 0);

  // Check if dynamic tabs already include a PDF section (avoid duplicate display)
  const tabsHavePdf = job?.tabs?.some(tab =>
    tab.sections.some(s => s.fixedFieldKey === 'jobDescriptionPdf')
  ) ?? false;

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Loading... | Jan Justice</title>
        </Helmet>
        <div className="bg-background min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <p className="text-muted-foreground">Loading job details...</p>
          </main>
        </div>
      </>
    );
  }

  if (error || !job) {
    return (
      <>
        <Helmet>
          <title>Job Not Found | Jan Justice</title>
        </Helmet>
        <div className="bg-background min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <p className="text-destructive mb-4">Failed to load job details</p>
              <Button onClick={() => navigate('/jobs')}>Back to Jobs</Button>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{job.title} - {job.department} | Jan Justice</title>
        <meta name="description" content={job.description} />
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
                <span className="font-medium text-foreground">{job.title}</span>
              </nav>

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    {job.companyImage?.url ? (
                      <img
                        src={resolveFileUrl(job.companyImage.url)}
                        alt={job.company || job.title}
                        className="h-14 w-14 rounded-xl object-cover shadow-glow"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                        <Building2 className="h-7 w-7 text-primary-foreground" />
                      </div>
                    )}
                    <div>
                      <h1 className="text-2xl md:text-3xl font-display font-bold">{job.title}</h1>
                      {job.company && <p className="text-muted-foreground font-medium">{job.company}</p>}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="badge-warning">{job.department}</span>
                    {job.employmentType && <span className="badge-info">{job.employmentType}</span>}
                    {job.workMode && <span className="badge-success">{job.workMode}</span>}
                    {job.tags?.map((tag, i) => (
                      <span key={i} className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-violet-50 text-violet-600 border border-violet-200/60">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:text-right">
                  <Button size="lg" className="h-12 px-8 gradient-primary border-0 shadow-glow hover:shadow-glow-lg transition-all duration-300">
                    Apply Now
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="lg"
                      className={`h-12 flex-1 ${isJobSaved(job._id) ? 'bg-primary/10 border-primary/30 text-primary' : ''}`}
                      onClick={() => {
                        toggleSaveJob(job._id);
                        toast({
                          title: isJobSaved(job._id) ? "Job removed" : "Job saved",
                          description: isJobSaved(job._id)
                            ? "Removed from your saved jobs."
                            : "Added to your saved jobs.",
                        });
                      }}
                    >
                      <Bookmark className={`h-4 w-4 mr-2 ${isJobSaved(job._id) ? 'fill-current' : ''}`} />
                      {isJobSaved(job._id) ? "Saved" : "Save"}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-12 flex-1"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast({ title: "Link Copied!", description: "Job link has been copied to clipboard." });
                      }}
                    >
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
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left Column - Job Details */}
              <div className="lg:col-span-3 space-y-6">
                {/* Description */}
                {job.description && (
                  <div className="bg-card rounded-2xl p-6 md:p-8 border border-border/50 shadow-soft animate-fade-in">
                    <h2 className="text-xl font-display font-bold mb-4">About This Role</h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{job.description}</p>
                  </div>
                )}

                {/* Dynamic tabs for legacy jobs */}
                {hasDynamicTabs && (
                  <Tabs defaultValue={job.tabs![0].id} className="w-full">
                    <TabsList className="w-full justify-start h-12 p-1 bg-muted rounded-xl mb-6">
                      {[...job.tabs!].sort((a, b) => a.order - b.order).map((tab) => (
                        <TabsTrigger key={tab.id} value={tab.id} className="rounded-lg data-[state=active]:shadow-sm">
                          {tab.id === 'job-pdf' && <FileText className="h-4 w-4 mr-2" />}
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {[...job.tabs!].sort((a, b) => a.order - b.order).map((tab) => (
                      <TabsContent key={tab.id} value={tab.id} className="space-y-6 animate-fade-in">
                        {[...tab.sections].sort((a, b) => a.order - b.order).map((section) => (
                          <DynamicSection key={section.id} section={section} job={job} />
                        ))}
                      </TabsContent>
                    ))}
                  </Tabs>
                )}

                {/* PDF Viewer (only if not already shown in dynamic tabs) */}
                {job.jobDescriptionPdf?.url && !tabsHavePdf && (
                  <div className="bg-card rounded-2xl border border-border/50 shadow-soft overflow-hidden animate-fade-in">
                    <div className="p-4 bg-muted/50 border-b border-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{job.jobDescriptionPdf.filename || 'Job_Description.pdf'}</p>
                          <p className="text-xs text-muted-foreground">
                            {job.jobDescriptionPdf.size
                              ? `${(job.jobDescriptionPdf.size / 1024).toFixed(1)} KB`
                              : 'PDF Document'
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => window.open(resolveFileUrl(job.jobDescriptionPdf?.url || ''), '_blank')}
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => setIsPdfExpanded(!isPdfExpanded)}
                        >
                          <ExternalLink className="h-4 w-4" />
                          {isPdfExpanded ? "Collapse" : "Expand"}
                        </Button>
                      </div>
                    </div>
                    <div className={`transition-all duration-500 ${isPdfExpanded ? "h-[800px]" : "h-[500px]"}`}>
                      <iframe
                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(resolveFileUrl(job.jobDescriptionPdf.url))}&embedded=true`}
                        className="w-full h-full border-0"
                        title="Job Description PDF"
                      />
                    </div>
                    <div className="p-4 bg-muted/30 border-t border-border/50">
                      <p className="text-sm text-muted-foreground text-center">
                        Can't view the PDF?{" "}
                        <a
                          href={resolveFileUrl(job.jobDescriptionPdf.url)}
                          download
                          className="text-primary font-medium hover:underline"
                        >
                          Click here to download
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-24">
                {/* Job Info Card */}
                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft animate-fade-in" style={{ animationDelay: "200ms" }}>
                  <h3 className="font-display font-bold mb-4">Job Details</h3>

                  <div className="space-y-4">
                    {/* Post Date */}
                    {(job.postDate || job.createdAt) && (
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-medium">Posted On</p>
                          <p className="font-semibold text-sm">{formatDate(job.postDate || job.createdAt)}</p>
                        </div>
                      </div>
                    )}

                    {/* Expiry Date */}
                    {job.applicationDeadline && (
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-medium">Apply Before</p>
                          <p className="font-semibold text-sm">{formatDate(job.applicationDeadline)}</p>
                        </div>
                      </div>
                    )}

                    {/* Dynamic sidebar fields for legacy jobs */}
                    {hasDynamicSidebar && (
                      [...job.sidebarFields!].sort((a, b) => a.order - b.order).map((field) => (
                        <DynamicSidebarField key={field.id} field={field} job={job} />
                      ))
                    )}

                    {/* Additional Details (Custom Inputs) */}
                    {job.customInputs && job.customInputs.length > 0 && (
                      <>
                        <div className="border-t border-border/50 pt-4 mt-2">
                          <p className="text-xs text-muted-foreground uppercase font-medium mb-3">Additional Details</p>
                          <div className="space-y-3">
                            {job.customInputs.map((input, index) => (
                              <div key={index} className="flex flex-col gap-0.5">
                                <p className="text-xs font-semibold text-foreground">{input.label}</p>
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{input.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="border-t border-border/50 my-6" />

                  <Button className="w-full h-12 gradient-primary border-0 shadow-glow hover:shadow-glow-lg transition-all duration-300">
                    Apply Now
                  </Button>
                </div>

                {/* Contact Card - only show if contact info exists */}
                {(job.contactEmail || job.contactPhone || job.companyWebsite) && (
                  <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft animate-fade-in" style={{ animationDelay: "300ms" }}>
                    <h3 className="font-display font-bold mb-4">Contact Information</h3>
                    <div className="space-y-3 text-sm">
                      {job.contactEmail && (
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Email</p>
                          <a href={`mailto:${job.contactEmail}`} className="text-primary hover:underline break-all">{job.contactEmail}</a>
                        </div>
                      )}
                      {job.contactPhone && (
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Phone</p>
                          <a href={`tel:${job.contactPhone}`} className="text-primary hover:underline">{job.contactPhone}</a>
                        </div>
                      )}
                      {job.companyWebsite && (
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Website</p>
                          <a href={job.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                            {job.companyWebsite.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Back Button */}
                <Button
                  variant="outline"
                  onClick={() => navigate('/jobs')}
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to All Jobs
                </Button>
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
