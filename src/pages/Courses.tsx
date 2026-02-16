import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { courseApi } from "@/lib/api";

const Courses = () => {
  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseApi.getCourses(),
  });

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Legal Courses | Jan Justice - Certified Legal Education</title>
          <meta name="description" content="Advance your legal career with certified courses. Contract law, corporate law, IP, and more from industry experts." />
        </Helmet>

        <div className="bg-background min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading courses...</p>
            </div>
          </main>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Legal Courses | Jan Justice - Certified Legal Education</title>
          <meta name="description" content="Advance your legal career with certified courses. Contract law, corporate law, IP, and more from industry experts." />
        </Helmet>

        <div className="bg-background min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <p className="text-destructive">Error loading courses: {error.message}</p>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Legal Courses | Jan Justice - Certified Legal Education</title>
        <meta name="description" content="Advance your legal career with certified courses. Contract law, corporate law, IP, and more from industry experts." />
      </Helmet>

      <div className="bg-background min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border animate-fade-in">
              <div>
                <h1 className="text-3xl lg:text-4xl font-black">Legal Courses</h1>
                <p className="text-muted-foreground mt-2">
                  Explore {courses.length} certified legal courses
                </p>
              </div>
              <div className="w-full md:w-72">
                <Input
                  placeholder="Search courses..."
                  className="h-10"
                />
              </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-8">
              {courses.map((course, index) => (
                <Link
                  key={course._id}
                  to={`/courses/${course._id}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="h-40 w-full bg-secondary relative overflow-hidden">
                    <img
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={course.image}
                    />
                    {course.certified && (
                      <div className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                        Certified
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 p-4 flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      {course.duration}
                      <span className="w-1 h-1 rounded-full bg-border"></span>
                      <span>{course.level}</span>
                    </div>
                    <h3 className="text-base font-bold leading-tight group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
                      <div className="flex items-center gap-1 text-sm">
                        <span className="material-symbols-outlined text-warning text-sm">star</span>
                        <span className="font-semibold">{course.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {course.students.toLocaleString()} students
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Courses;
