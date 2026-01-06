import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-card py-10 border-t border-border">
      <div className="mx-auto flex max-w-[960px] flex-col md:flex-row w-full px-4 lg:px-10 gap-8 justify-between items-center md:items-start">
        <div className="flex flex-col gap-2 items-center md:items-start">
          <Link to="/" className="flex items-center gap-2 text-foreground">
            <span className="material-symbols-outlined text-xl">gavel</span>
            <span className="font-bold text-lg">LegalHub</span>
          </Link>
          <p className="text-sm text-muted-foreground">© 2024 LegalHub. All rights reserved.</p>
        </div>
        
        <div className="flex gap-8 text-sm text-muted-foreground">
          <Link to="/jobs" className="hover:text-primary transition-colors">Jobs</Link>
          <Link to="/courses" className="hover:text-primary transition-colors">Courses</Link>
          <Link to="/appointment" className="hover:text-primary transition-colors">Consultancy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
