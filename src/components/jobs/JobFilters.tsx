import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const JobFilters = () => {
  return (
    <aside className="w-full lg:w-1/4 flex-shrink-0 lg:sticky lg:top-24 bg-card p-6 rounded-xl border border-border shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-xl">filter_list</span>
          Filters
        </h3>
      </div>
      
      <div className="mb-6 space-y-3">
        <h4 className="text-sm font-semibold uppercase tracking-wider mb-2">Location</h4>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ny">New York</SelectItem>
            <SelectItem value="ca">California</SelectItem>
            <SelectItem value="tx">Texas</SelectItem>
            <SelectItem value="il">Illinois</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="mb-6">
        <h4 className="text-sm font-semibold uppercase tracking-wider mb-3">Department</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Checkbox id="litigation" />
            <Label htmlFor="litigation" className="text-sm cursor-pointer">Litigation</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox id="corporate" defaultChecked />
            <Label htmlFor="corporate" className="text-sm cursor-pointer">Corporate Law</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox id="ip" />
            <Label htmlFor="ip" className="text-sm cursor-pointer">IP Rights</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox id="real-estate" />
            <Label htmlFor="real-estate" className="text-sm cursor-pointer">Real Estate</Label>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold uppercase tracking-wider mb-3">Job Type</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Checkbox id="fulltime" defaultChecked />
            <Label htmlFor="fulltime" className="text-sm cursor-pointer">Full-time</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox id="contract" />
            <Label htmlFor="contract" className="text-sm cursor-pointer">Contract</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox id="remote" />
            <Label htmlFor="remote" className="text-sm cursor-pointer">Remote</Label>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default JobFilters;
