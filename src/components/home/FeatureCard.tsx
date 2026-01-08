import { useNavigate } from "react-router-dom";
import { Briefcase, GraduationCap, Users, ArrowRight } from "lucide-react";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
  delay?: number;
}

const iconMap: Record<string, React.ElementType> = {
  work: Briefcase,
  menu_book: GraduationCap,
  account_circle: Users,
};

const FeatureCard = ({ icon, title, description, href, delay = 0 }: FeatureCardProps) => {
  const navigate = useNavigate();
  const IconComponent = iconMap[icon] || Briefcase;

  return (
    <div
      onClick={() => navigate(href)}
      className="group relative flex flex-1 gap-4 rounded-2xl border border-border/50 bg-card p-6 flex-col shadow-soft hover:shadow-elevated hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer animate-fade-in overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative">
        <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:gradient-primary group-hover:text-primary-foreground group-hover:shadow-glow transition-all duration-300">
          <IconComponent className="h-7 w-7" />
        </div>
      </div>
      
      <div className="relative flex flex-col gap-2">
        <h2 className="text-lg font-display font-bold leading-tight group-hover:text-primary transition-colors">
          {title}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>

      <div className="relative flex items-center gap-2 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-auto">
        Learn more
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export default FeatureCard;
