import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { GraduationCap } from "lucide-react";

const CoursesComingSoon = () => {
  return (
    <>
      <Helmet>
        <title>Courses - Coming Soon | Jan Justice</title>
        <meta name="description" content="Our courses system is coming soon. Stay tuned!" />
      </Helmet>

      <div className="bg-background min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow flex items-center justify-center px-4">
          <div className="text-center max-w-md mx-auto animate-fade-in">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
              <GraduationCap className="h-10 w-10" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Coming Soon
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Our courses system is currently under development. We'll be live shortly — stay tuned!
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CoursesComingSoon;
