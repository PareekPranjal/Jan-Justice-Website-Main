import type { TabSection, Job } from '../../lib/api';
import { BACKEND_URL } from '../../lib/api';

const resolveFileUrl = (url: string) => url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
import { CheckCircle, FileText, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useState } from 'react';

interface DynamicSectionProps {
  section: TabSection;
  job: Job;
}

export default function DynamicSection({ section, job }: DynamicSectionProps) {
  if (section.contentType === 'fixed-field-map' && section.fixedFieldKey) {
    return <FixedFieldSection section={section} job={job} />;
  }

  return (
    <div className="bg-card rounded-2xl p-6 md:p-8 border border-border/50 shadow-soft">
      {section.heading && (
        <h2 className="text-xl font-display font-bold text-foreground mb-2">{section.heading}</h2>
      )}
      {section.subheading && (
        <p className="text-sm text-muted-foreground mb-4">{section.subheading}</p>
      )}
      <div className="space-y-4">
        {section.customFields
          ?.sort((a, b) => a.order - b.order)
          .map((field) => (
            <div key={field.id}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">{field.label}</h3>
              <CustomFieldDisplay fieldType={field.fieldType} value={field.value} />
            </div>
          ))}
      </div>
    </div>
  );
}

function CustomFieldDisplay({ fieldType, value }: { fieldType: string; value: unknown }) {
  if (!value) return null;

  switch (fieldType) {
    case 'richtext':
      return (
        <div
          className="prose prose-sm max-w-none text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: value as string }}
        />
      );
    case 'dropdown-multi':
      return (
        <div className="flex flex-wrap gap-2">
          {(value as string[]).map((v, i) => (
            <Badge key={i} variant="secondary">{v}</Badge>
          ))}
        </div>
      );
    case 'textarea':
      return <p className="text-muted-foreground whitespace-pre-wrap">{value as string}</p>;
    default:
      return <p className="text-muted-foreground">{String(value)}</p>;
  }
}

function FixedFieldSection({ section, job }: { section: TabSection; job: Job }) {
  const [isPdfExpanded, setIsPdfExpanded] = useState(false);

  const renderContent = () => {
    switch (section.fixedFieldKey) {
      case 'detailedDescription':
        return job.detailedDescription ? (
          <div
            className="prose prose-sm max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: job.detailedDescription }}
          />
        ) : null;

      case 'responsibilities':
        return job.responsibilities && job.responsibilities.length > 0 ? (
          <ul className="space-y-3">
            {job.responsibilities.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        ) : null;

      case 'qualifications':
        return job.qualifications && job.qualifications.length > 0 ? (
          <ul className="space-y-3">
            {job.qualifications.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        ) : null;

      case 'benefits':
        return job.benefits && job.benefits.length > 0 ? (
          <ul className="space-y-3">
            {job.benefits.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        ) : null;

      case 'skills':
        return job.skills && job.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, idx) => (
              <Badge key={idx} variant="secondary" className="text-sm">{skill}</Badge>
            ))}
          </div>
        ) : null;

      case 'jobDescriptionPdf':
        return job.jobDescriptionPdf?.url ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{job.jobDescriptionPdf.filename || 'Job Description'}</p>
                  {job.jobDescriptionPdf.size && (
                    <p className="text-xs text-muted-foreground">{(job.jobDescriptionPdf.size / 1024).toFixed(1)} KB</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.open(resolveFileUrl(job.jobDescriptionPdf!.url), '_blank')}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  <Download className="h-4 w-4" /> Download
                </button>
                <button
                  onClick={() => setIsPdfExpanded(!isPdfExpanded)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg hover:bg-muted"
                >
                  {isPdfExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {isPdfExpanded ? 'Collapse' : 'Expand'}
                </button>
              </div>
            </div>
            <div className={`rounded-xl overflow-hidden border transition-all duration-500 ${isPdfExpanded ? 'h-[800px]' : 'h-[500px]'}`}>
              <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(resolveFileUrl(job.jobDescriptionPdf.url))}&embedded=true`}
                className="w-full h-full"
                title="Job Description PDF"
              />
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No PDF attached.</p>
        );

      case 'companyImage':
        return job.companyImage?.url ? (
          <img
            src={resolveFileUrl(job.companyImage.url)}
            alt={job.company}
            className="w-full max-h-64 object-contain rounded-xl border"
          />
        ) : null;

      default:
        return null;
    }
  };

  const content = renderContent();
  if (!content) return null;

  return (
    <div className="bg-card rounded-2xl p-6 md:p-8 border border-border/50 shadow-soft">
      {section.heading && (
        <h2 className="text-xl font-display font-bold text-foreground mb-2">{section.heading}</h2>
      )}
      {section.subheading && (
        <p className="text-sm text-muted-foreground mb-4">{section.subheading}</p>
      )}
      {content}
    </div>
  );
}
