import { Link } from "react-router-dom";
import { Briefcase, GraduationCap, Calendar, Mail, Phone, MapPin, Youtube, Newspaper, Info } from "lucide-react";

const footerLinks = {
  platform: [
    { name: "Jobs", href: "/jobs", icon: Briefcase },
    { name: "Courses", href: "/courses", icon: GraduationCap },
    { name: "Legal News", href: "/blogs", icon: Newspaper },
    { name: "Consultancy", href: "/appointment", icon: Calendar },
  ],
  contact: [
    { icon: Mail, text: "connect@janjustice.com" },
    { icon: Phone, text: "+91 70230 76680" },
    { icon: MapPin, text: "Jaipur, Rajasthan, India" },
  ],
};

const socialLinks = [
  { icon: Youtube, href: "https://www.youtube.com/@half-civil-judge", label: "YouTube" },
];

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-card/50 backdrop-blur-sm">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src="/images/JanJustice.png" alt="Jan Justice Logo" className="h-10 object-contain" />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              India's trusted platform for legal job vacancies, law courses, and expert career guidance. Your journey in law starts here.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              {footerLinks.contact.map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-border/40">
          <div className="rounded-xl bg-muted/40 border border-border/40 p-5 md:p-6">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Info className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-semibold text-foreground text-sm mb-2">Disclaimer</h4>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  This platform and its content are created for educational and informational purposes only.{" "}
                  <span className="font-medium text-foreground/80">Copyright Disclaimer under Section 107 of the Copyright Act, 1976:</span>{" "}
                  allowance is made for &ldquo;fair use&rdquo; for purposes such as criticism, comment, news reporting, teaching, scholarship, and research. Fair use is permitted by copyright statute that might otherwise be infringing. Non-profit, educational, or informational use tips the balance in favor of fair use.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-border/40 flex flex-col items-center gap-4">
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Jan Justice. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Cookies
              </a>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-muted-foreground text-center">
            <span>Designed, Developed & Managed by</span>
            <a href="https://www.adrologic.com/" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline transition-colors">
              Adrologic Private Limited
            </a>
            <span className="hidden sm:inline">|</span>
            <a href="https://www.adrologic.com/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              www.adrologic.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
