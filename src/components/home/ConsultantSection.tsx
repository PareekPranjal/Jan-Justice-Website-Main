import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ConsultantSection = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full flex justify-center py-12 lg:py-20 px-4 lg:px-10 bg-card border-y border-border">
      <div className="flex flex-col lg:flex-row max-w-[960px] flex-1 gap-10 items-center">
        <div className="flex-1 order-2 lg:order-1 flex flex-col gap-6 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Built by Legal Professionals,{" "}
            <span className="text-primary">Trusted by Community</span>
          </h2>
          <div className="flex flex-wrap gap-3 pt-1">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">200K+ legal audience</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">Real user engagement</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">Verified opportunities</span>
          </div>
          <p className="text-muted-foreground text-lg leading-relaxed">
            JanJustice is built on real needs — not assumptions.
          </p>
          <p className="text-xl font-semibold">
            Legal Help. Legal Skills. Legal Opportunities.
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
              alt="Legal career consultant"
              className="h-full w-full object-cover"
              src="/images/177476879372.jpeg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultantSection;
