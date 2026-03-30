import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { store } from "@/store";
import { PageLoader } from "@/components/ui/loader";
import { AuthProvider, useAuth } from "@/context/AuthContext";

// Lazy load pages
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

// Redirect to login if not authenticated
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <PageLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user, isLoading } = useAuth();
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/courses" element={<CoursesComingSoon />} />
        <Route path="/courses-dev" element={<Courses />} />
        <Route path="/courses-dev/:id" element={<CourseDetail />} />
        <Route path="/course-detail" element={<CourseDetail />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/appointment-dev" element={<AppointmentDevPage />} />
        <Route path="/contact" element={<Contact />} />
        {/* Auth */}
        <Route path="/login" element={!isLoading && user ? <Navigate to="/" replace /> : <Login />} />
        {/* Protected */}
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/saved-jobs" element={<RequireAuth><SavedJobs /></RequireAuth>} />
        <Route path="/my-courses" element={<RequireAuth><MyCourses /></RequireAuth>} />
        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

const App = () => (
  <Provider store={store}>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </Provider>
);

export default App;
