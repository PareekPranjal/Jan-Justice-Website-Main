import { useNavigate } from "react-router-dom";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
  delay?: number;
}

const FeatureCard = ({ icon, title, description, href, delay = 0 }: FeatureCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(href)}
      className="group flex flex-1 gap-4 rounded-xl border border-border bg-card p-6 flex-col shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all duration-300 cursor-pointer animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="icon-container icon-container-primary icon-container-primary-hover h-12 w-12 group-hover:bg-primary group-hover:text-primary-foreground">
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold leading-tight">{title}</h2>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
