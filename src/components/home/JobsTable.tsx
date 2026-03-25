import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { jobApi, Job, BACKEND_URL } from "@/lib/api";
import { MapPin, Building2, Clock, Briefcase, ArrowUpRight, Bookmark } from "lucide-react";
import { useSavedJobs } from "@/hooks/use-saved-jobs";

const JobsTable = () => {
  const navigate = useNavigate();
  const { isJobSaved, toggleSaveJob } = useSavedJobs();

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['latestJobs'],
    queryFn: () => jobApi.getJobs(),
  });

  const latestJobs = jobs.slice(0, 3);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-6 animate-pulse">
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
    );
  }

  if (latestJobs.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card shadow-soft p-12 text-center">
        <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground font-medium">No jobs available at the moment.</p>
        <p className="text-sm text-muted-foreground/70 mt-1">Check back soon for new opportunities.</p>
      </div>
    );
  }

  const formatSalary = (job: Job) => {
    if (!job.salary?.min && !job.salary?.max) return null;
    const fmt = (n: number) => {
      if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
      if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
      return String(n);
    };
    const parts: string[] = [];
    if (job.salary?.min) parts.push(fmt(job.salary.min));
    if (job.salary?.max) parts.push(fmt(job.salary.max));
    return `${job.salary?.currency || 'INR'} ${parts.join(' - ')}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {latestJobs.map((job: Job) => (
        <div
          key={job._id}
          onClick={() => navigate(`/jobs/${job._id}`)}
          className="group relative rounded-2xl border border-border/60 bg-card p-6 cursor-pointer transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
        >
          {/* Top: Company icon + title */}
          <div className="flex items-start gap-3 mb-4">
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
              <p className="text-sm text-muted-foreground mt-0.5">{job.company}</p>
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
            {job.experienceRequired && (job.experienceRequired.min || job.experienceRequired.max) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span>{job.experienceRequired.min}-{job.experienceRequired.max} years exp.</span>
              </div>
            )}
            {formatSalary(job) && (
              <p className="text-sm font-semibold text-primary">{formatSalary(job)} PA</p>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {job.employmentType || 'Full-time'}
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

          {/* Bookmark + Hover arrow */}
          <div className="absolute top-5 right-5 flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveJob(job._id);
              }}
              className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                isJobSaved(job._id)
                  ? 'bg-primary/10 text-primary opacity-100'
                  : 'opacity-0 group-hover:opacity-100 bg-muted/80 text-muted-foreground hover:text-primary hover:bg-primary/10'
              }`}
              title={isJobSaved(job._id) ? "Remove from saved" : "Save job"}
            >
              <Bookmark className={`h-4 w-4 ${isJobSaved(job._id) ? 'fill-current' : ''}`} />
            </button>
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
              <ArrowUpRight className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobsTable;
