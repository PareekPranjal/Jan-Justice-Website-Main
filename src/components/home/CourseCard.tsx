import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  image: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  certified?: boolean;
  delay?: number;
}

const CourseCard = ({ 
  image, 
  title, 
  description, 
  duration, 
  level, 
  certified = false,
  delay = 0 
}: CourseCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/course-detail")}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="h-48 w-full bg-secondary relative overflow-hidden">
        <img
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={image}
        />
        {certified && (
          <div className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
            Certified
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <span className="material-symbols-outlined text-base">schedule</span> 
          {duration}
          <span className="w-1 h-1 rounded-full bg-border"></span>
          <span>{level}</span>
        </div>
        <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </div>
    </div>
  );
};

export default CourseCard;
