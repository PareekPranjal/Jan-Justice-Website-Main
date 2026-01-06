import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const CourseDetail = () => {
  const modules = [
    {
      id: "1",
      title: "Module 1: Introduction to Corporate Mergers",
      lessons: [
        "The Evolution of Corporate Mergers",
        "Key Stakeholders in M&A Transactions",
        "Types of Merger Structures",
      ],
    },
    {
      id: "2",
      title: "Module 2: Due Diligence Fundamentals",
      lessons: [
        "Financial Due Diligence",
        "Legal Due Diligence Checklist",
        "Risk Assessment Frameworks",
      ],
    },
    {
      id: "3",
      title: "Module 3: Deal Structuring",
      lessons: [
        "Asset vs Stock Purchases",
        "Tax Considerations",
        "Earnouts and Contingent Payments",
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Advanced Corporate Law & Mergers | LegalEd Course</title>
        <meta name="description" content="Master M&A, due diligence, and regulatory compliance. 15 hours of on-demand video with certificate of completion." />
      </Helmet>
      
      <div className="bg-background min-h-screen">
        <Header title="LegalEd" />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative">
            {/* Main Content */}
            <div className="lg:col-span-8 flex flex-col gap-10">
              {/* Breadcrumb */}
              <nav className="flex flex-wrap items-center gap-2 text-sm font-medium animate-fade-in">
                <Link to="/" className="text-muted-foreground hover:text-primary">Home</Link>
                <span className="text-muted-foreground">/</span>
                <Link to="/courses" className="text-muted-foreground hover:text-primary">Courses</Link>
                <span className="text-muted-foreground">/</span>
                <span>Corporate Law</span>
              </nav>
              
              {/* Course Header */}
              <div className="flex flex-col gap-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
                <h1 className="text-4xl lg:text-5xl font-black">Advanced Corporate Law & Mergers</h1>
                <p className="text-lg text-muted-foreground">
                  Master the intricacies of M&A, due diligence, and regulatory compliance with hands-on case studies.
                </p>
                
                {/* Video Preview */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-elevated group">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBezqJdWTOzQz1Da6EJiZ9QNcqoSLvAAWD3oPLD8AGSo90iOGEQtKIoXaq03W3_-Vsq1p7s64kvw_OfCASCHif2vWobn4PGV3ALR9N0bjhEOgAxvXc9YYeUDa1dUivaRIPdMunG9fFoGOZmUTKnTjLbVZ04qWAOaKmuZ2yv_BfonFCnE1Gkz2ZKZw7EuK9IzjTWZx0x6q_Xmi3wK2hd_zr-ReHusUW1uWxmiT6_Li5RVYr1hq9rDBM20pNOEHapYFwRe4cuDHIxlAo"
                    className="w-full h-full object-cover"
                    alt="Course Preview"
                  />
                  <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                      <div className="h-12 w-12 rounded-full bg-card flex items-center justify-center text-primary shadow-lg">
                        <span className="material-symbols-outlined text-3xl ml-1">play_arrow</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Course Content */}
              <section className="animate-fade-in" style={{ animationDelay: "200ms" }}>
                <h3 className="text-2xl font-bold mb-6">Course Content</h3>
                <Accordion type="single" collapsible className="border border-border rounded-xl overflow-hidden">
                  {modules.map((module) => (
                    <AccordionItem key={module.id} value={module.id} className="border-b border-border last:border-b-0">
                      <AccordionTrigger className="px-5 py-4 bg-secondary/50 hover:bg-secondary font-bold text-left">
                        {module.title}
                      </AccordionTrigger>
                      <AccordionContent className="p-5">
                        <ul className="flex flex-col gap-3 text-sm">
                          {module.lessons.map((lesson, index) => (
                            <li key={index} className="flex items-center gap-3 text-muted-foreground">
                              <span className="material-symbols-outlined text-primary">play_circle</span>
                              {lesson}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
              
              {/* Instructor */}
              <section className="animate-fade-in" style={{ animationDelay: "300ms" }}>
                <h3 className="text-2xl font-bold mb-6">Your Instructor</h3>
                <div className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border">
                  <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-xl">
                    JD
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">James Davidson, JD</h4>
                    <p className="text-muted-foreground text-sm mt-1">
                      Former M&A Partner at Sullivan & Cromwell with 20+ years of experience in complex corporate transactions.
                    </p>
                  </div>
                </div>
              </section>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-4 relative">
              <div className="sticky top-24 rounded-2xl border border-border p-6 shadow-elevated bg-card animate-fade-in" style={{ animationDelay: "200ms" }}>
                <div className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  20% OFF
                </div>
                
                <div className="flex items-end gap-3 mb-6">
                  <span className="text-3xl font-black">$499.00</span>
                  <span className="text-lg text-muted-foreground line-through">$625.00</span>
                </div>
                
                <Button className="w-full h-12 shadow-elevated" size="lg">
                  Buy Course
                </Button>
                
                <Button variant="outline" className="w-full mt-3">
                  Add to Cart
                </Button>
                
                <div className="flex flex-col gap-4 text-sm mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="material-symbols-outlined">schedule</span>
                    15 hours on-demand video
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="material-symbols-outlined">article</span>
                    25 downloadable resources
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="material-symbols-outlined">all_inclusive</span>
                    Full lifetime access
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="material-symbols-outlined">workspace_premium</span>
                    Certificate of completion
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CourseDetail;
