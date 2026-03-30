import { useState, FormEvent } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Eye, EyeOff, Loader2, Scale } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Login() {
  const [view, setView] = useState<"login" | "register">("login");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/";

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      await login(loginEmail, loginPassword);
      navigate(from, { replace: true });
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setRegError("");
    if (regPassword !== regConfirm) { setRegError("Passwords do not match"); return; }
    if (regPassword.length < 6) { setRegError("Password must be at least 6 characters"); return; }
    setRegLoading(true);
    try {
      await register(firstName, lastName, regEmail, regPassword);
      navigate(from, { replace: true });
    } catch (err) {
      setRegError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{view === "login" ? "Sign In" : "Create Account"} | Jan Justice</title>
      </Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-3">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Scale className="h-7 w-7 text-primary" />
                </div>
              </div>
              <h1 className="text-2xl font-bold">
                {view === "login" ? "Welcome back" : "Create your account"}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {view === "login"
                  ? "Sign in to your Jan Justice account"
                  : "Join Jan Justice — India's legal career platform"}
              </p>
            </div>

            {/* Tab switcher */}
            <div className="flex bg-muted rounded-lg p-1 mb-6">
              <button
                onClick={() => { setView("login"); setLoginError(""); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${view === "login" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setView("register"); setRegError(""); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${view === "register" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Create Account
              </button>
            </div>

            {/* Card */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              {view === "login" ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  {loginError && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">{loginError}</div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email Address</label>
                    <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required autoComplete="email" placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Password</label>
                    <div className="relative">
                      <input type={showLoginPassword ? "text" : "password"} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required autoComplete="current-password" placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 pr-10 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                      <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={loginLoading || !loginEmail || !loginPassword}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {loginLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {loginLoading ? "Signing in..." : "Sign In"}
                  </button>
                  <p className="text-sm text-center text-muted-foreground">
                    Don't have an account?{" "}
                    <button type="button" onClick={() => setView("register")} className="text-primary font-medium hover:underline">Create one</button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  {regError && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">{regError}</div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">First Name</label>
                      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="Rahul"
                        className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Last Name</label>
                      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Sharma"
                        className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email Address</label>
                    <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required autoComplete="email" placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Password</label>
                    <div className="relative">
                      <input type={showRegPassword ? "text" : "password"} value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required placeholder="Min. 6 characters"
                        className="w-full px-3.5 py-2.5 pr-10 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                      <button type="button" onClick={() => setShowRegPassword(!showRegPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
                    <input type="password" value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)} required placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                  </div>
                  <button type="submit" disabled={regLoading || !firstName || !lastName || !regEmail || !regPassword || !regConfirm}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {regLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {regLoading ? "Creating account..." : "Create Account"}
                  </button>
                  <p className="text-sm text-center text-muted-foreground">
                    Already have an account?{" "}
                    <button type="button" onClick={() => setView("login")} className="text-primary font-medium hover:underline">Sign in</button>
                  </p>
                </form>
              )}
            </div>

            <p className="text-xs text-center text-muted-foreground mt-4">
              By continuing, you agree to our{" "}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>{" "}
              and <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
