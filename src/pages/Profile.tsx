import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  userApi,
  appointmentApi,
  type User as UserType,
  type UserStats,
  type SavedJob,
  type EnrolledCourse,
  type Appointment,
} from "@/lib/api";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Edit3,
  Camera,
  Award,
  BookOpen,
  Clock,
  Settings,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  CheckCircle2,
  Star,
} from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();

  const userEmail = authUser?.email ?? "";

  // Form state for editing
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    location: "",
    title: "",
    company: "",
  });

  // Fetch user profile
  const { data: profileData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['userProfile', userEmail],
    queryFn: () => userApi.getUserProfile(userEmail),
    enabled: !!userEmail,
    retry: false,
  });

  // Fetch user stats
  const { data: userStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['userStats', userEmail],
    queryFn: () => userApi.getUserStats(userEmail),
    enabled: !!profileData,
    retry: false,
  });

  // Fetch saved jobs
  const { data: savedJobs = [], isLoading: isLoadingSavedJobs } = useQuery({
    queryKey: ['savedJobs', userEmail],
    queryFn: () => userApi.getSavedJobs(userEmail),
    enabled: !!profileData,
  });

  // Fetch enrolled courses
  const { data: enrolledCourses = [], isLoading: isLoadingCourses } = useQuery({
    queryKey: ['enrolledCourses', userEmail],
    queryFn: () => userApi.getCourseEnrollments(userEmail),
    enabled: !!profileData,
  });

  // Fetch upcoming appointments
  const { data: allAppointments = [], isLoading: isLoadingAppointments } = useQuery({
    queryKey: ['userAppointments', userEmail],
    queryFn: () => appointmentApi.getAppointments({ email: userEmail }),
    enabled: !!profileData,
  });

  // Filter for upcoming appointments only
  const upcomingAppointments = allAppointments.filter((apt: Appointment) => {
    const aptDate = new Date(apt.appointmentDate);
    return aptDate >= new Date() && apt.status !== 'cancelled';
  });

  // Unsave job mutation
  const unsaveJobMutation = useMutation({
    mutationFn: (savedJobId: string) => userApi.unsaveJob(savedJobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedJobs', userEmail] });
      toast({
        title: "Job removed",
        description: "The job has been removed from your saved list.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove job",
        variant: "destructive",
      });
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (userData: Partial<UserType> & { email: string }) =>
      userApi.createOrUpdateProfile(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', userEmail] });
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  // Initialize form data when user data is loaded (fall back to auth user)
  useEffect(() => {
    if (profileData) {
      setFormData({
        firstName: profileData.firstName || authUser?.firstName || "",
        lastName: profileData.lastName || authUser?.lastName || "",
        phone: profileData.phone || "",
        location: profileData.location || "",
        title: profileData.title || "",
        company: profileData.company || "",
      });
    } else if (authUser) {
      setFormData(prev => ({
        ...prev,
        firstName: authUser.firstName || "",
        lastName: authUser.lastName || "",
      }));
    }
  }, [profileData, authUser]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle profile update
  const handleSaveProfile = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast({
        title: "Validation Error",
        description: "First name and last name are required.",
        variant: "destructive",
      });
      return;
    }

    updateProfileMutation.mutate({
      email: userEmail,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      phone: formData.phone.trim(),
      location: formData.location.trim(),
      title: formData.title.trim(),
      company: formData.company.trim(),
    });
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // If canceling edit, reset form data
      if (profileData) {
        setFormData({
          firstName: profileData.firstName || "",
          lastName: profileData.lastName || "",
          phone: profileData.phone || "",
          location: profileData.location || "",
          title: profileData.title || "",
          company: profileData.company || "",
        });
      }
    }
    setIsEditing(!isEditing);
  };

  const stats = [
    { label: "Courses Completed", value: userStats?.coursesCompleted || 0, icon: GraduationCap },
    { label: "Applications Sent", value: userStats?.applicationsSent || 0, icon: Briefcase },
    { label: "Consultations", value: userStats?.consultations || 0, icon: Calendar },
    { label: "Certificates", value: userStats?.certificates || 0, icon: Award },
  ];

  const isLoading = isLoadingUser || isLoadingStats;

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>My Profile | Jan Justice</title>
        </Helmet>
        <div className="bg-background min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  // If no full profile yet, build a minimal display from auth data
  const displayUser = profileData ?? (authUser ? {
    _id: authUser._id,
    firstName: authUser.firstName,
    lastName: authUser.lastName,
    fullName: `${authUser.firstName} ${authUser.lastName}`,
    email: authUser.email,
    avatar: authUser.avatar,
    phone: "",
    location: "",
    title: "",
    company: "",
    bio: "",
    skills: [] as string[],
    experience: [] as unknown[],
    education: [] as unknown[],
    certifications: [] as unknown[],
    socialLinks: {},
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } : null);

  if (!displayUser) {
    return (
      <>
        <Helmet>
          <title>My Profile | Jan Justice</title>
        </Helmet>
        <div className="bg-background min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">User profile not found.</p>
              <p className="text-sm text-muted-foreground mt-2">Please create a profile first.</p>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  // Use displayUser so all JSX below works whether or not full profile exists
  const user = displayUser;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <>
      <Helmet>
        <title>My Profile | Jan Justice</title>
        <meta name="description" content="Manage your Jan Justice profile, track your progress, and view your saved jobs and courses." />
      </Helmet>

      <div className="bg-background min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          {/* Hero Section */}
          <div className="relative overflow-hidden border-b border-border/50">
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 left-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="container py-8">
              <div className="flex flex-col md:flex-row md:items-end gap-6">
                {/* Avatar */}
                <div className="relative group">
                  <Avatar className="h-28 w-28 border-4 border-background shadow-elevated">
                    <AvatarImage src={user.avatar} alt={user.fullName || `${user.firstName} ${user.lastName}`} />
                    <AvatarFallback className="text-2xl font-display gradient-primary text-primary-foreground">
                      {user.firstName[0]}{user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-5 w-5" />
                  </button>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  {!isEditing ? (
                    // View Mode
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                        <div>
                          <h1 className="text-2xl md:text-3xl font-display font-bold">{user.fullName || `${user.firstName} ${user.lastName}`}</h1>
                          <p className="text-muted-foreground">{user.title}{user.company && ` at ${user.company}`}</p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={toggleEditMode}
                          className="gap-2"
                        >
                          <Edit3 className="h-4 w-4" />
                          Edit Profile
                        </Button>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </div>
                        {user.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            {user.location}
                          </div>
                        )}
                        {user.createdAt && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            Member since {formatDate(user.createdAt)}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    // Edit Mode
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-display font-bold">Edit Profile</h2>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={toggleEditMode}
                            disabled={updateProfileMutation.isPending}
                            size="sm"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSaveProfile}
                            disabled={updateProfileMutation.isPending}
                            size="sm"
                            className="gap-2"
                          >
                            {updateProfileMutation.isPending ? (
                              <>
                                <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                                Saving...
                              </>
                            ) : (
                              <>
                                <Edit3 className="h-4 w-4" />
                                Save Changes
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-card/50 p-4 rounded-xl border border-border/50">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-xs">First Name *</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Enter first name"
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-xs">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Enter last name"
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-xs">Phone</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+1 (555) 123-4567"
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location" className="text-xs">Location</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="New York, NY"
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-xs">Job Title</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Senior Attorney"
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company" className="text-xs">Company</Label>
                          <Input
                            id="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            placeholder="Law Firm Name"
                            className="h-9"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 shadow-soft"
                  >
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-display font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container py-8">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="w-full md:w-auto justify-start h-12 p-1 bg-muted rounded-xl overflow-x-auto">
                <TabsTrigger value="overview" className="rounded-lg data-[state=active]:shadow-sm">Overview</TabsTrigger>
                <TabsTrigger value="saved-jobs" className="rounded-lg data-[state=active]:shadow-sm">Saved Jobs</TabsTrigger>
                <TabsTrigger value="courses" className="rounded-lg data-[state=active]:shadow-sm">My Courses</TabsTrigger>
                <TabsTrigger value="appointments" className="rounded-lg data-[state=active]:shadow-sm">Appointments</TabsTrigger>
                <TabsTrigger value="settings" className="rounded-lg data-[state=active]:shadow-sm">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Column */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Course Progress */}
                    <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-display font-bold">Course Progress</h2>
                        <Link to="/courses" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                          View all <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>

                      {isLoadingCourses ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                          <p className="text-sm">Loading courses...</p>
                        </div>
                      ) : enrolledCourses.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p className="text-sm">No enrolled courses yet.</p>
                          <Link to="/courses" className="text-sm text-primary mt-2 inline-block">
                            Browse courses
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {enrolledCourses.slice(0, 3).map((course) => (
                            <div key={course._id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                              <img
                                src={course.image}
                                alt={course.title}
                                className="h-14 w-14 rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{course.title}</p>
                                <p className="text-xs text-muted-foreground">{course.instructor?.name || 'Instructor'}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Progress value={course.progress} className="h-1.5 flex-1" />
                                  <span className="text-xs font-medium">{course.progress}%</span>
                                </div>
                              </div>
                              {course.progress === 100 && (
                                <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Saved Jobs */}
                    <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-display font-bold">Saved Jobs</h2>
                        <Link to="/jobs" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                          Browse jobs <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>

                      {isLoadingSavedJobs ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                          <p className="text-sm">Loading saved jobs...</p>
                        </div>
                      ) : savedJobs.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p className="text-sm">No saved jobs yet.</p>
                          <Link to="/jobs" className="text-sm text-primary mt-2 inline-block">
                            Browse jobs
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {savedJobs.slice(0, 3).map((job) => (
                            <div key={job._id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                                  {job.company.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-semibold text-sm">{job.title}</p>
                                  <p className="text-xs text-muted-foreground">{job.company} • {job.location || job.workMode}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">Saved {formatRelativeTime(job.savedAt)}</p>
                                <Link to={`/jobs/${job._id}`}>
                                  <Button variant="link" size="sm" className="h-auto p-0 text-primary">
                                    View job
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Upcoming Appointments */}
                    <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                      <h2 className="text-lg font-display font-bold mb-4">Upcoming Appointments</h2>

                      {isLoadingAppointments ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                          <p className="text-sm">Loading...</p>
                        </div>
                      ) : upcomingAppointments.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p className="text-sm">No upcoming appointments.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {upcomingAppointments.slice(0, 2).map((apt) => (
                            <div key={apt._id} className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                                  {apt.serviceTitle}
                                </Badge>
                              </div>
                              <p className="font-semibold text-sm">{apt.clientName}</p>
                              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(apt.appointmentDate)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {apt.appointmentTime}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <Link to="/appointment">
                        <Button variant="outline" className="w-full mt-4">
                          Book New Appointment
                        </Button>
                      </Link>
                    </div>

                    {/* Achievements */}
                    <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                      <h2 className="text-lg font-display font-bold mb-4">Achievements</h2>
                      
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { icon: Star, label: "First Course", color: "bg-warning/10 text-warning" },
                          { icon: Award, label: "5 Certs", color: "bg-accent/10 text-accent" },
                          { icon: BookOpen, label: "10 Hours", color: "bg-primary/10 text-primary" },
                        ].map((achievement, i) => (
                          <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-muted/50">
                            <div className={`h-10 w-10 rounded-lg ${achievement.color} flex items-center justify-center`}>
                              <achievement.icon className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-medium text-center">{achievement.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="saved-jobs" className="animate-fade-in">
                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                  <h2 className="text-lg font-display font-bold mb-6">All Saved Jobs</h2>
                  {isLoadingSavedJobs ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
                      <p>Loading saved jobs...</p>
                    </div>
                  ) : savedJobs.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Briefcase className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">No saved jobs yet</p>
                      <p className="text-sm mb-4">Start saving jobs to keep track of opportunities</p>
                      <Link to="/jobs">
                        <Button>Browse Jobs</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {savedJobs.map((job) => (
                        <div
                          key={job._id}
                          className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-soft transition-all"
                        >
                          <Link to={`/jobs/${job._id}`} className="flex items-center gap-4 flex-1">
                            <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                              {job.company.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold">{job.title}</p>
                              <p className="text-sm text-muted-foreground">{job.company} • {job.location || job.workMode}</p>
                              <p className="text-xs text-muted-foreground mt-1">Saved {formatRelativeTime(job.savedAt)}</p>
                            </div>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => unsaveJobMutation.mutate(job.savedJobId)}
                            disabled={unsaveJobMutation.isPending}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="courses" className="animate-fade-in">
                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                  <h2 className="text-lg font-display font-bold mb-6">My Enrolled Courses</h2>
                  {isLoadingCourses ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
                      <p>Loading courses...</p>
                    </div>
                  ) : enrolledCourses.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">No enrolled courses yet</p>
                      <p className="text-sm mb-4">Start learning with our professional courses</p>
                      <Link to="/courses">
                        <Button>Browse Courses</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {enrolledCourses.map((course) => (
                        <div key={course._id} className="rounded-xl border border-border/50 overflow-hidden hover:shadow-soft transition-shadow">
                          <img src={course.image} alt={course.title} className="h-32 w-full object-cover" />
                          <div className="p-4">
                            <p className="font-semibold">{course.title}</p>
                            <p className="text-sm text-muted-foreground mb-3">{course.instructor?.name || 'Instructor'}</p>
                            <div className="flex items-center gap-2">
                              <Progress value={course.progress} className="h-2 flex-1" />
                              <span className="text-sm font-medium">{course.progress}%</span>
                            </div>
                            <Link to={`/courses/${course._id}`}>
                              <Button className="w-full mt-4" variant={course.progress === 100 ? "outline" : "default"}>
                                {course.progress === 100 ? "View Certificate" : "Continue"}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="appointments" className="animate-fade-in">
                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                  <h2 className="text-lg font-display font-bold mb-6">Upcoming Appointments</h2>
                  {isLoadingAppointments ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
                      <p>Loading appointments...</p>
                    </div>
                  ) : upcomingAppointments.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">No upcoming appointments</p>
                      <p className="text-sm mb-4">Schedule a consultation with our experts</p>
                      <Link to="/appointment">
                        <Button>Book Appointment</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingAppointments.map((apt) => (
                        <div key={apt._id} className="flex items-center justify-between p-4 rounded-xl border border-border/50">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Calendar className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <Badge variant="secondary" className="mb-1">{apt.serviceTitle}</Badge>
                              <p className="font-semibold">{apt.clientName}</p>
                              <p className="text-sm text-muted-foreground">{formatDate(apt.appointmentDate)} at {apt.appointmentTime}</p>
                              <p className="text-xs text-muted-foreground mt-1">Confirmation: {apt.confirmationNumber}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge
                              variant={apt.status === 'confirmed' ? 'default' : 'secondary'}
                              className="capitalize"
                            >
                              {apt.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="settings" className="animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Profile Settings */}
                    <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                      <h2 className="text-lg font-display font-bold mb-6">Profile Settings</h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Enter first name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Enter last name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" value={user.email} disabled className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="title">Job Title</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Senior Attorney"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            placeholder="Law Firm Name"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="New York, NY"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <Button
                          onClick={handleSaveProfile}
                          disabled={updateProfileMutation.isPending}
                          className="gradient-primary border-0"
                        >
                          {updateProfileMutation.isPending ? (
                            <>
                              <span className="material-symbols-outlined animate-spin mr-2 text-sm">refresh</span>
                              Saving...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={toggleEditMode}
                          disabled={updateProfileMutation.isPending}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Settings */}
                  <div className="space-y-6">
                    <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                      <h2 className="text-lg font-display font-bold mb-4">Quick Actions</h2>
                      
                      <div className="space-y-2">
                        {[
                          { icon: Bell, label: "Notifications", desc: "Manage alerts" },
                          { icon: Shield, label: "Privacy", desc: "Security settings" },
                          { icon: Settings, label: "Preferences", desc: "App settings" },
                        ].map((item, i) => (
                          <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                <item.icon className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div className="text-left">
                                <p className="font-medium text-sm">{item.label}</p>
                                <p className="text-xs text-muted-foreground">{item.desc}</p>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </button>
                        ))}
                      </div>

                      <div className="border-t border-border/50 mt-4 pt-4">
                        <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-destructive/10 text-destructive transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                              <LogOut className="h-5 w-5" />
                            </div>
                            <span className="font-medium text-sm">Log out</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Profile;
