import type { SidebarField, Job } from '../../lib/api';
import {
  DollarSign,
  Briefcase,
  Clock,
  MapPin,
  GraduationCap,
  Calendar,
  Tag,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  DollarSign,
  Briefcase,
  Clock,
  MapPin,
  GraduationCap,
  Calendar,
  Tag,
};

interface DynamicSidebarFieldProps {
  field: SidebarField;
  job: Job;
}

function formatSalary(salary: { min?: number; max?: number; currency?: string }): string {
  const fmt = (n: number) => {
    if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return String(n);
  };
  const parts: string[] = [];
  if (salary.min) parts.push(fmt(salary.min));
  if (salary.max) parts.push(fmt(salary.max));
  if (parts.length === 0) return '';
  const currency = salary.currency || 'INR';
  return `${currency} ${parts.join(' - ')} PA`;
}

function formatExperience(exp: { min?: number; max?: number }): string {
  if (exp.min && exp.max) return `${exp.min} - ${exp.max} years`;
  if (exp.min) return `${exp.min}+ years`;
  if (exp.max) return `Up to ${exp.max} years`;
  return '';
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function DynamicSidebarField({ field, job }: DynamicSidebarFieldProps) {
  const IconComponent = iconMap[field.icon || ''] || Tag;

  let displayValue = '';

  if (field.fixedFieldKey) {
    const val = (job as Record<string, unknown>)[field.fixedFieldKey];
    if (!val && val !== 0) return null;

    switch (field.fieldType) {
      case 'salary-range':
        displayValue = formatSalary(val as { min?: number; max?: number; currency?: string });
        break;
      case 'experience-range':
        displayValue = formatExperience(val as { min?: number; max?: number });
        break;
      case 'text':
      case 'dropdown-single':
        if (field.fixedFieldKey === 'applicationDeadline') {
          displayValue = formatDate(val as string);
        } else {
          displayValue = String(val);
        }
        break;
      default:
        displayValue = String(val);
    }
  } else {
    displayValue = field.value ? String(field.value) : '';
  }

  if (!displayValue) return null;

  return (
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <IconComponent className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{field.label}</p>
        <p className="text-sm font-semibold">{displayValue}</p>
      </div>
    </div>
  );
}
