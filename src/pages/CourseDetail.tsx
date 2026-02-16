import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { courseApi } from "@/lib/api";

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: () => courseApi.getCourseById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Loading Course | LegalEd</title>
        </Helmet>

        <div className="bg-background min-h-screen">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading course details...</p>
            </div>
          </main>
        </div>
      </>
    );
  }

  if (error || !course) {
    return (
      <>
        <Helmet>
          <title>Error | LegalEd</title>
        </Helmet>

        <div className="bg-background min-h-screen">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <p className="text-destructive">Error loading course: {error?.message || 'Course not found'}</p>
              <Link to="/courses" className="text-primary hover:underline mt-4 inline-block">
                Back to Courses
              </Link>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{course.title} | LegalEd Course</title>
        <meta name="description" content={course.description} />
      </Helmet>

      <div className="bg-background min-h-screen">
        <Header />

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
                <span>{course.category}</span>
              </nav>

              {/* Course Header */}
              <div className="flex flex-col gap-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
                <h1 className="text-4xl lg:text-5xl font-black">{course.title}</h1>
                <p className="text-lg text-muted-foreground">
                  {course.detailedDescription || course.description}
                </p>

                {/* Video Preview */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-elevated group">
                  <img
                    src={course.image}
                    className="w-full h-full object-cover"
                    alt={course.title}
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
              {course.modules && course.modules.length > 0 && (
                <section className="animate-fade-in" style={{ animationDelay: "200ms" }}>
                  <h3 className="text-2xl font-bold mb-6">Course Content</h3>
                  <Accordion type="single" collapsible className="border border-border rounded-xl overflow-hidden">
                    {course.modules.map((module, index) => (
                      <AccordionItem key={index} value={`module-${index}`} className="border-b border-border last:border-b-0">
                        <AccordionTrigger className="px-5 py-4 bg-secondary/50 hover:bg-secondary font-bold text-left">
                          {module.title}
                        </AccordionTrigger>
                        <AccordionContent className="p-5">
                          <ul className="flex flex-col gap-3 text-sm">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <li key={lessonIndex} className="flex items-center gap-3 text-muted-foreground">
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
              )}

              {/* Instructor */}
              {course.instructor && (
                <section className="animate-fade-in" style={{ animationDelay: "300ms" }}>
                  <h3 className="text-2xl font-bold mb-6">Your Instructor</h3>
                  <div className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border">
                    <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-xl">
                      {course.instructor.initials || course.instructor.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{course.instructor.name}</h4>
                      {course.instructor.title && (
                        <p className="text-sm text-muted-foreground mt-0.5">{course.instructor.title}</p>
                      )}
                      {course.instructor.bio && (
                        <p className="text-muted-foreground text-sm mt-2">
                          {course.instructor.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 relative">
              <div className="sticky top-24 rounded-2xl border border-border p-6 shadow-elevated bg-card animate-fade-in" style={{ animationDelay: "200ms" }}>
                {course.discount && course.discount > 0 && (
                  <div className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    {course.discount}% OFF
                  </div>
                )}

                <div className="flex items-end gap-3 mb-6">
                  <span className="text-3xl font-black">
                    {course.price.currency === 'USD' ? '$' : ''}{course.price.current.toFixed(2)}
                  </span>
                  {course.price.original && (
                    <span className="text-lg text-muted-foreground line-through">
                      {course.price.currency === 'USD' ? '$' : ''}{course.price.original.toFixed(2)}
                    </span>
                  )}
                </div>

                <Button className="w-full h-12 shadow-elevated" size="lg">
                  Buy Course
                </Button>

                <Button variant="outline" className="w-full mt-3">
                  Add to Cart
                </Button>

                <div className="flex flex-col gap-4 text-sm mt-6 pt-6 border-t border-border">
                  {course.videoHours && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span className="material-symbols-outlined">schedule</span>
                      {course.videoHours} on-demand video
                    </div>
                  )}
                  {course.resources !== undefined && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span className="material-symbols-outlined">article</span>
                      {course.resources} downloadable resources
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="material-symbols-outlined">all_inclusive</span>
                    Full lifetime access
                  </div>
                  {course.certified && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span className="material-symbols-outlined">workspace_premium</span>
                      Certificate of completion
                    </div>
                  )}
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
