import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Job {
  id: string;
  role: string;
  company: string;
  location: string;
  type: string;
}

const jobs: Job[] = [
  { id: "1", role: "Associate Attorney", company: "Smith & Partners", location: "New York, NY", type: "Full-time" },
  { id: "2", role: "Senior Legal Counsel", company: "Global Corp", location: "Los Angeles, CA", type: "Full-time" },
  { id: "3", role: "Paralegal", company: "Justice League LLP", location: "Chicago, IL", type: "Contract" },
];

const JobsTable = () => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50 hover:bg-secondary/50">
            <TableHead className="font-semibold text-muted-foreground w-1/3">Role</TableHead>
            <TableHead className="font-semibold text-muted-foreground w-1/4 hidden sm:table-cell">Company</TableHead>
            <TableHead className="font-semibold text-muted-foreground w-1/4 hidden md:table-cell">Location</TableHead>
            <TableHead className="font-semibold text-muted-foreground hidden lg:table-cell">Type</TableHead>
            <TableHead className="font-semibold text-muted-foreground text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow
              key={job.id}
              onClick={() => navigate("/job-detail")}
              className="group cursor-pointer hover:bg-secondary/30 transition-colors"
            >
              <TableCell>
                <div className="font-medium">{job.role}</div>
                <div className="text-xs text-muted-foreground sm:hidden mt-1">
                  {job.company} • {job.location}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                {job.company}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                {job.location}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <span className="badge-info">{job.type}</span>
              </TableCell>
              <TableCell className="text-right">
                <button className="text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Apply
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default JobsTable;
