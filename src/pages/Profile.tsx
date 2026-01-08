import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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

  const user = {
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    title: "Senior Corporate Attorney",
    company: "Sullivan & Cromwell LLP",
    joinedDate: "January 2024",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  };

  const stats = [
    { label: "Courses Completed", value: 12, icon: GraduationCap },
    { label: "Applications Sent", value: 8, icon: Briefcase },
    { label: "Consultations", value: 3, icon: Calendar },
    { label: "Certificates", value: 5, icon: Award },
  ];

  const savedJobs = [
    { id: 1, title: "Senior Legal Counsel", company: "Google", location: "Mountain View, CA", saved: "2 days ago" },
    { id: 2, title: "M&A Associate", company: "Skadden LLP", location: "New York, NY", saved: "5 days ago" },
    { id: 3, title: "IP Attorney", company: "Apple Inc.", location: "Cupertino, CA", saved: "1 week ago" },
  ];

  const enrolledCourses = [
    { id: 1, title: "Advanced Contract Drafting", progress: 75, instructor: "Prof. James Mitchell", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80" },
    { id: 2, title: "M&A Due Diligence Masterclass", progress: 45, instructor: "Sarah Chen, Partner", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80" },
    { id: 3, title: "Corporate Governance Essentials", progress: 100, instructor: "Dr. Robert Williams", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80" },
  ];

  const upcomingAppointments = [
    { id: 1, type: "Career Coaching", consultant: "Dr. Emily Parker", date: "Jan 15, 2026", time: "10:00 AM" },
    { id: 2, type: "Legal Consultation", consultant: "Michael Roberts, Esq.", date: "Jan 22, 2026", time: "2:00 PM" },
  ];

  return (
    <>
      <Helmet>
        <title>My Profile | LegalHub</title>
        <meta name="description" content="Manage your LegalHub profile, track your progress, and view your saved jobs and courses." />
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
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-2xl font-display gradient-primary text-primary-foreground">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-5 w-5" />
                  </button>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-display font-bold">{user.name}</h1>
                      <p className="text-muted-foreground">{user.title} at {user.company}</p>
                    </div>
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      onClick={() => setIsEditing(!isEditing)}
                      className="gap-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      {isEditing ? "Save Changes" : "Edit Profile"}
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {user.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      Member since {user.joinedDate}
                    </div>
                  </div>
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
                        <Link to="/my-courses" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                          View all <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>

                      <div className="space-y-4">
                        {enrolledCourses.map((course) => (
                          <div key={course.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                            <img
                              src={course.image}
                              alt={course.title}
                              className="h-14 w-14 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">{course.title}</p>
                              <p className="text-xs text-muted-foreground">{course.instructor}</p>
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
                    </div>

                    {/* Saved Jobs */}
                    <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-display font-bold">Saved Jobs</h2>
                        <Link to="/jobs" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                          Browse jobs <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>

                      <div className="space-y-3">
                        {savedJobs.map((job) => (
                          <div key={job.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                                {job.company.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{job.title}</p>
                                <p className="text-xs text-muted-foreground">{job.company} • {job.location}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Saved {job.saved}</p>
                              <Button variant="link" size="sm" className="h-auto p-0 text-primary">
                                Apply now
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Upcoming Appointments */}
                    <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                      <h2 className="text-lg font-display font-bold mb-4">Upcoming Appointments</h2>
                      
                      <div className="space-y-4">
                        {upcomingAppointments.map((apt) => (
                          <div key={apt.id} className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                                {apt.type}
                              </Badge>
                            </div>
                            <p className="font-semibold text-sm">{apt.consultant}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {apt.date}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {apt.time}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button variant="outline" className="w-full mt-4">
                        Book New Appointment
                      </Button>
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
                  <div className="space-y-4">
                    {savedJobs.map((job) => (
                      <Link
                        key={job.id}
                        to="/job-detail"
                        className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-soft transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                            {job.company.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold">{job.title}</p>
                            <p className="text-sm text-muted-foreground">{job.company} • {job.location}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="courses" className="animate-fade-in">
                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                  <h2 className="text-lg font-display font-bold mb-6">My Enrolled Courses</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledCourses.map((course) => (
                      <div key={course.id} className="rounded-xl border border-border/50 overflow-hidden hover:shadow-soft transition-shadow">
                        <img src={course.image} alt={course.title} className="h-32 w-full object-cover" />
                        <div className="p-4">
                          <p className="font-semibold">{course.title}</p>
                          <p className="text-sm text-muted-foreground mb-3">{course.instructor}</p>
                          <div className="flex items-center gap-2">
                            <Progress value={course.progress} className="h-2 flex-1" />
                            <span className="text-sm font-medium">{course.progress}%</span>
                          </div>
                          <Button className="w-full mt-4" variant={course.progress === 100 ? "outline" : "default"}>
                            {course.progress === 100 ? "View Certificate" : "Continue"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="appointments" className="animate-fade-in">
                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                  <h2 className="text-lg font-display font-bold mb-6">Upcoming Appointments</h2>
                  <div className="space-y-4">
                    {upcomingAppointments.map((apt) => (
                      <div key={apt.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <Badge variant="secondary" className="mb-1">{apt.type}</Badge>
                            <p className="font-semibold">{apt.consultant}</p>
                            <p className="text-sm text-muted-foreground">{apt.date} at {apt.time}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Reschedule</Button>
                          <Button size="sm" className="gradient-primary border-0">Join</Button>
                        </div>
                      </div>
                    ))}
                  </div>
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
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" defaultValue="Sarah" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" defaultValue="Johnson" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue={user.email} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" defaultValue={user.phone} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="location">Location</Label>
                          <Input id="location" defaultValue={user.location} />
                        </div>
                      </div>

                      <Button className="mt-6 gradient-primary border-0">Save Changes</Button>
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
                        <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-destructive/10 text-destructive transition-colors">
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
