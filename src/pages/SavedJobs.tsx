import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { SavedJob, BACKEND_URL } from "@/lib/api";
import { useSavedJobs } from "@/hooks/use-saved-jobs";
import {
  Bookmark,
  MapPin,
  Building2,
  Clock,
  Briefcase,
  ArrowRight,
  Trash2,
} from "lucide-react";

const SavedJobs = () => {
  const { savedJobs, savedJobIds, toggleSaveJob, isLoading } = useSavedJobs();

  const formatSalary = (job: SavedJob) => {
    if (!job.salary?.min && !job.salary?.max) return null;
    const fmt = (n: number) => {
      if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
      if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
      return String(n);
    };
    const parts: string[] = [];
    if (job.salary?.min) parts.push(fmt(job.salary.min));
    if (job.salary?.max) parts.push(fmt(job.salary.max));
    return `${job.salary?.currency || "INR"} ${parts.join(" - ")}`;
  };

  return (
    <>
      <Helmet>
        <title>Saved Jobs | Jan Justice</title>
        <meta
          name="description"
          content="View your saved job listings on Jan Justice."
        />
      </Helmet>

      <div className="bg-background min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          {/* Hero */}
          <div className="relative overflow-hidden border-b border-border/50">
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="container py-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bookmark className="h-6 w-6 text-primary fill-current" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-display font-bold">
                    Saved Jobs
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    {savedJobIds.length === 0
                      ? "No saved jobs yet"
                      : `${savedJobIds.length} job${savedJobIds.length !== 1 ? "s" : ""} saved`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="container py-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-border bg-card p-6 animate-pulse"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-xl bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : savedJobs.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card shadow-soft p-16 text-center max-w-lg mx-auto">
                <Briefcase className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                <h2 className="text-xl font-display font-bold mb-2">
                  No saved jobs yet
                </h2>
                <p className="text-muted-foreground mb-6">
                  Browse legal job vacancies and save the ones you're interested
                  in. They'll appear here for easy access.
                </p>
                <Link to="/jobs">
                  <Button className="gap-2 gradient-primary border-0 shadow-glow">
                    Browse Legal Jobs
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedJobs.map((job: SavedJob) => (
                  <div
                    key={job._id}
                    className="group relative rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                  >
                    {/* Remove button */}
                    <button
                      onClick={() => toggleSaveJob(job._id)}
                      className="absolute top-4 right-4 h-8 w-8 rounded-lg flex items-center justify-center bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <Link to={`/jobs/${job._id}`} className="block">
                      {/* Company icon + title */}
                      <div className="flex items-start gap-3 mb-4 pr-10">
                        {job.companyImage?.url ? (
                          <img
                            src={job.companyImage.url.startsWith('http') ? job.companyImage.url : `${BACKEND_URL}${job.companyImage.url}`}
                            alt={job.company}
                            className="h-12 w-12 rounded-xl object-cover border border-border/50"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                            <Building2 className="h-6 w-6 text-primary-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {job.company}
                          </p>
                        </div>
                      </div>

                      {/* Info rows */}
                      <div className="space-y-2 mb-4">
                        {job.location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{job.location}</span>
                          </div>
                        )}
                        {job.experienceRequired &&
                          (job.experienceRequired.min ||
                            job.experienceRequired.max) && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3.5 w-3.5 shrink-0" />
                              <span>
                                {job.experienceRequired.min}-
                                {job.experienceRequired.max} years exp.
                              </span>
                            </div>
                          )}
                        {formatSalary(job) && (
                          <p className="text-sm font-semibold text-primary">
                            {formatSalary(job)} PA
                          </p>
                        )}
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {job.employmentType || "Full-time"}
                        </span>
                        {job.workMode && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600">
                            {job.workMode}
                          </span>
                        )}
                        {job.department && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600">
                            {job.department}
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SavedJobs;
