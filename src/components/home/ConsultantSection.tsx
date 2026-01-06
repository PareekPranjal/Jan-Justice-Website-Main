import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ConsultantSection = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full flex justify-center py-12 lg:py-20 px-4 lg:px-10 bg-card border-y border-border">
      <div className="flex flex-col lg:flex-row max-w-[960px] flex-1 gap-10 items-center">
        <div className="flex-1 order-2 lg:order-1 flex flex-col gap-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary w-fit">
            <span className="material-symbols-outlined text-sm">verified</span> 
            Expert Guidance
          </div>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Meet Sarah Jenkins, <br />
            <span className="text-primary">Senior Career Consultant</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            With over 15 years of experience in top-tier law firms, Sarah helps aspiring attorneys navigate their career paths with personalized guidance and industry insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button
              onClick={() => navigate("/appointment")}
              size="lg"
              className="shadow-elevated"
            >
              Book Consultation
            </Button>
          </div>
        </div>
        <div className="flex-1 order-1 lg:order-2 flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="relative w-full max-w-[400px] aspect-[4/5] rounded-2xl overflow-hidden shadow-elevated">
            <img
              alt="Professional woman in a suit smiling"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB65PmXL1W8PbcxSGLxtabjfyimhxR2EmC41Gc_GMt4ZM76ViLeZGew095k6Xgdux4eAD16b2d8vnyyJXcjKQNZQjCLG09h9nobBL4tb5scebQBzACxMXgZXs0FgTQBAQynUBQ-sFE7vTqibbxWAYIrQUMGkgAhnDl4Tpsc61QXC3e215f-Dlozvf-6Uy8LK6HIfBS1OEkrl4LmeK24b5zYeHIrOVMnYFprCGNGYSgEV-GiAteg8dGPgg5s4fl28tYO6uY3YDZhWTM"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultantSection;
