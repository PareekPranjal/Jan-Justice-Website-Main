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

const colorThemes: Record<string, {
  bg: string;
  iconBg: string;
  iconText: string;
  title: string;
  desc: string;
  arrow: string;
  glow: string;
  border: string;
}> = {
  account_circle: {
    bg: "bg-gradient-to-br from-orange-500 to-orange-600",
    iconBg: "bg-white/20",
    iconText: "text-white",
    title: "text-white",
    desc: "text-orange-100",
    arrow: "text-white",
    glow: "shadow-[0_20px_50px_-12px_rgba(249,115,22,0.4)]",
    border: "border-orange-400/30",
  },
  menu_book: {
    bg: "bg-gradient-to-br from-blue-600 to-blue-700",
    iconBg: "bg-white/20",
    iconText: "text-white",
    title: "text-white",
    desc: "text-blue-100",
    arrow: "text-white",
    glow: "shadow-[0_20px_50px_-12px_rgba(37,99,235,0.4)]",
    border: "border-blue-400/30",
  },
  work: {
    bg: "bg-gradient-to-br from-green-600 to-green-700",
    iconBg: "bg-white/20",
    iconText: "text-white",
    title: "text-white",
    desc: "text-green-100",
    arrow: "text-white",
    glow: "shadow-[0_20px_50px_-12px_rgba(22,163,74,0.4)]",
    border: "border-green-400/30",
  },
};

const FeatureCard = ({ icon, title, description, href, delay = 0 }: FeatureCardProps) => {
  const navigate = useNavigate();
  const IconComponent = iconMap[icon] || Briefcase;
  const theme = colorThemes[icon] || colorThemes.work;

  return (
    <div
      onClick={() => navigate(href)}
      className={`group relative flex flex-1 gap-5 rounded-2xl border ${theme.border} ${theme.bg} p-7 flex-col ${theme.glow} hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 cursor-pointer animate-fade-in overflow-hidden`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full" />

      <div className="relative">
        <div className={`h-14 w-14 rounded-2xl ${theme.iconBg} backdrop-blur-sm flex items-center justify-center ${theme.iconText} group-hover:scale-110 transition-transform duration-300`}>
          <IconComponent className="h-7 w-7" />
        </div>
      </div>

      <div className="relative flex flex-col gap-1.5">
        <h2 className={`text-xl font-display font-bold leading-tight ${theme.title}`}>
          {title}
        </h2>
        <p className={`${theme.desc} text-sm leading-relaxed`}>{description}</p>
      </div>

      <div className={`relative flex items-center gap-2 text-sm font-semibold ${theme.arrow} mt-auto pt-2`}>
        Learn more
        <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
      </div>
    </div>
  );
};

export default FeatureCard;
