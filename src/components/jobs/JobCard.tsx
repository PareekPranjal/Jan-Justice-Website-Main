import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  department: string;
  description: string;
}

const JobCard = ({ id, title, company, department, description }: JobCardProps) => {
  const navigate = useNavigate();

  return (
    <article className="group bg-card border border-border rounded-xl p-5 lg:p-6 hover:shadow-card-hover transition-all duration-300 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="badge-info">{department}</span>
          </div>
          <h3 className="text-xl font-bold mb-1">{title}</h3>
          <p className="text-base font-semibold text-muted-foreground">{company}</p>
        </div>
      </div>
      <div className="text-sm text-muted-foreground leading-relaxed pt-4 mt-1 border-t border-dashed border-border">
        {description}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
        <Button 
          onClick={() => navigate("/job-detail")}
          className="w-full sm:w-auto"
        >
          Apply Now
        </Button>
      </div>
    </article>
  );
};

export default JobCard;
