import { useNavigate } from "react-router-dom";
import { Clock, Award } from "lucide-react";

interface CourseCardProps {
  id?: string;
  image: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  certified?: boolean;
  delay?: number;
}

const CourseCard = ({
  id,
  image,
  title,
  description,
  duration,
  level,
  certified = false,
  delay = 0
}: CourseCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (id) {
      navigate(`/courses/${id}`);
    } else {
      navigate("/courses");
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 cursor-pointer animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="h-48 w-full bg-muted relative overflow-hidden">
        <img
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {certified && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold shadow-lg">
            <Award className="h-3.5 w-3.5" />
            Certified
          </div>
        )}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
            {level}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 p-5 flex-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Clock className="h-3.5 w-3.5" />
          {duration}
        </div>
        <h3 className="text-lg font-display font-bold leading-tight group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{description}</p>
      </div>
    </div>
  );
};

export default CourseCard;
