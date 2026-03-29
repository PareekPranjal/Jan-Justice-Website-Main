import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { store } from "@/store";
import { PageLoader } from "@/components/ui/loader";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Jobs = lazy(() => import("./pages/Jobs"));
const JobDetail = lazy(() => import("./pages/JobDetail"));
const Courses = lazy(() => import("./pages/Courses"));
const CoursesComingSoon = lazy(() => import("./pages/CoursesComingSoon"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const MyCourses = lazy(() => import("./pages/MyCourses"));
const Appointment = lazy(() => import("./pages/Appointment"));
const AppointmentDevPage = lazy(() => import("./pages/AppointmentDevPage"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));
const SavedJobs = lazy(() => import("./pages/SavedJobs"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <Provider store={store}>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/jobs/:id" element={<JobDetail />} />
                  <Route path="/courses" element={<CoursesComingSoon />} />
                  <Route path="/courses-dev" element={<Courses />} />
                  <Route path="/courses-dev/:id" element={<CourseDetail />} />
                  <Route path="/course-detail" element={<CourseDetail />} />
                  <Route path="/my-courses" element={<MyCourses />} />
                  <Route path="/appointment" element={<Appointment />} />
                  <Route path="/appointment-dev" element={<AppointmentDevPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/saved-jobs" element={<SavedJobs />} />
                  <Route path="/contact" element={<Contact />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </Provider>
);

export default App;
