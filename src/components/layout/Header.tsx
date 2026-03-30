import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Briefcase, GraduationCap, Calendar, MessageCircle, LogIn, User, Bookmark, LogOut } from "lucide-react";
import { useSavedJobs } from "@/hooks/use-saved-jobs";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  variant?: "default" | "minimal";
  showBackLink?: boolean;
}

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Consultancy", href: "/appointment", icon: Calendar },
  { name: "Courses", href: "/courses", icon: GraduationCap },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Contact", href: "/contact", icon: MessageCircle },
];

const Header = ({ variant = "default", showBackLink = false }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { savedCount } = useSavedJobs();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/images/JanJustice.png" alt="Jan Justice Logo" className="h-10 object-contain transition-all duration-300 group-hover:scale-105" />
        </Link>

        {variant === "default" && (
          <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/saved-jobs" className="relative group">
                <Button
                  variant="outline"
                  size="sm"
                  className={`gap-2 ${isActive('/saved-jobs') ? 'bg-primary/10 text-primary border-primary/30' : ''}`}
                >
                  <Bookmark className={`h-4 w-4 ${isActive('/saved-jobs') ? 'fill-current' : ''}`} />
                  Saved Jobs
                  {user && savedCount > 0 && (
                    <span className="h-5 min-w-5 px-1.5 rounded-full bg-primary text-[11px] font-bold text-primary-foreground flex items-center justify-center">
                      {savedCount > 9 ? '9+' : savedCount}
                    </span>
                  )}
                </Button>
              </Link>
              {user ? (
                <>
                  <Link to="/profile">
                    <Button size="sm" className="gap-2 gradient-primary border-0 shadow-glow hover:shadow-glow-lg transition-all duration-300">
                      <User className="h-4 w-4" />
                      {user.firstName}
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="gap-2" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button size="sm" className="gap-2 gradient-primary border-0 shadow-glow hover:shadow-glow-lg transition-all duration-300">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-6 mt-8">
                  <nav className="flex flex-col gap-2">
                    {navigation.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                            active
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.name}
                        </Link>
                      );
                    })}
                    <Link
                      to="/saved-jobs"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                        isActive('/saved-jobs')
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Bookmark className={`h-5 w-5 ${isActive('/saved-jobs') ? 'fill-current' : ''}`} />
                      Saved Jobs
                      {user && savedCount > 0 && (
                        <span className="ml-auto h-5 min-w-5 px-1.5 rounded-full bg-primary text-xs font-bold text-primary-foreground flex items-center justify-center">
                          {savedCount}
                        </span>
                      )}
                    </Link>
                  </nav>

                  <div className="border-t pt-6 flex flex-col gap-3">
                    {user ? (
                      <>
                        <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                          <Button className="w-full gap-2 gradient-primary border-0">
                            <User className="h-4 w-4" />
                            {user.firstName}
                          </Button>
                        </Link>
                        <Button variant="outline" className="w-full gap-2" onClick={handleLogout}>
                          <LogOut className="h-4 w-4" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full gap-2 gradient-primary border-0">
                          <LogIn className="h-4 w-4" />
                          Login
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </>
        )}

        {showBackLink && (
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to Home
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
