import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { jobApi, Job, BACKEND_URL } from "@/lib/api";
import { MapPin, Building2, Clock, Briefcase, ArrowRight, Bookmark } from "lucide-react";
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {latestJobs.map((job: Job) => (
        <div
          key={job._id}
          onClick={() => navigate(`/jobs/${job._id}`)}
          className="group relative rounded-2xl bg-white border-2 border-primary/10 p-0 cursor-pointer transition-all duration-300 hover:border-primary/40 hover:shadow-[0_8px_30px_-8px_rgba(194,102,42,0.2)] hover:-translate-y-1.5 overflow-hidden"
        >
          {/* Top accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary/70 to-primary/40" />

          <div className="p-6">
            {/* Bookmark */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveJob(job._id);
              }}
              className={`absolute top-5 right-5 h-9 w-9 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
                isJobSaved(job._id)
                  ? 'bg-primary/15 text-primary shadow-sm'
                  : 'bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-primary/10 hover:text-primary'
              }`}
              title={isJobSaved(job._id) ? "Remove from saved" : "Save job"}
            >
              <Bookmark className={`h-4 w-4 ${isJobSaved(job._id) ? 'fill-current' : ''}`} />
            </button>

            {/* Company icon + title */}
            <div className="flex items-start gap-3.5 mb-5 pr-10">
              {job.companyImage?.url ? (
                <img
                  src={job.companyImage.url.startsWith('http') ? job.companyImage.url : `${BACKEND_URL}${job.companyImage.url}`}
                  alt={job.company}
                  className="h-13 w-13 rounded-xl object-cover border-2 border-primary/10 shadow-sm"
                />
              ) : (
                <div className="h-13 w-13 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shrink-0 shadow-md">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors text-base">
                  {job.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 font-medium">{job.company}</p>
              </div>
            </div>

            {/* Info rows */}
            <div className="space-y-2.5 mb-5">
              {job.location && (
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <div className="h-7 w-7 rounded-lg bg-primary/8 flex items-center justify-center">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="truncate">{job.location}</span>
                </div>
              )}
              {job.experienceRequired && (job.experienceRequired.min || job.experienceRequired.max) && (
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <div className="h-7 w-7 rounded-lg bg-primary/8 flex items-center justify-center">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span>{job.experienceRequired.min}-{job.experienceRequired.max} years exp.</span>
                </div>
              )}
              {formatSalary(job) && (
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <span className="text-green-600 text-xs font-bold">₹</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">{formatSalary(job)} PA</span>
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/15">
                {job.employmentType || 'Full-time'}
              </span>
              {job.workMode && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                  {job.workMode}
                </span>
              )}
              {job.department && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200/60">
                  {job.department}
                </span>
              )}
            </div>

            {/* View button */}
            <div className="pt-4 border-t border-primary/10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-primary group-hover:underline">View Details</span>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <ArrowRight className="h-4 w-4 text-primary group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobsTable;
