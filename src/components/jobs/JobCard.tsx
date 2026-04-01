import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bookmark, Calendar } from "lucide-react";
import { useSavedJobs } from "@/hooks/use-saved-jobs";
import { useAuth } from "@/context/AuthContext";

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  department: string;
  description: string;
  postDate?: string;
  tags?: string[];
}

const JobCard = ({ id, title, company, department, description, postDate, tags }: JobCardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isJobSaved, toggleSaveJob } = useSavedJobs();
  const { user } = useAuth();
  const saved = isJobSaved(id);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    toggleSaveJob(id);
  };

  return (
    <article className="group relative bg-card border border-border rounded-xl p-5 lg:p-6 hover:shadow-card-hover transition-all duration-300 flex flex-col gap-4">
      {/* Bookmark button */}
      <button
        onClick={handleSave}
        className={`absolute top-4 right-4 h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
          saved
            ? 'bg-primary/10 text-primary'
            : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
        }`}
        title={saved ? "Remove from saved" : "Save job"}
      >
        <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
      </button>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pr-10">
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="badge-info">{department}</span>
            {tags?.map((tag, i) => (
              <span key={i} className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-violet-50 text-violet-600 border border-violet-200/60">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-xl font-bold mb-1">{title}</h3>
          <p className="text-base font-semibold text-muted-foreground">{company}</p>
        </div>
      </div>
      <div className="text-sm text-muted-foreground leading-relaxed pt-4 mt-1 border-t border-dashed border-border line-clamp-2">
        {description}
      </div>
      {postDate && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>Posted {new Date(postDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
        <Button
          onClick={() => navigate(`/jobs/${id}`)}
          className="w-full sm:w-auto"
        >
          View Details & Apply
        </Button>
      </div>
    </article>
  );
};

export default JobCard;
