import React from 'react';
import { CheckCircle2, XCircle, PlusCircle } from 'lucide-react';

export default function SkillList({
  matchingSkills = [],
  missingSkills = [],
  additionalSkills = [],
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Matched Skills Panel */}
        <div className="bg-lux-surface rounded-card border border-lux-border p-5 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-lux-border-subtle">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-lux-success-subtle text-lux-success flex items-center justify-center font-bold text-xs border border-lux-success-border">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
              <div>
                <h3 className="text-xs font-semibold text-lux-text">Matched Skills</h3>
                <p className="text-2xs text-lux-muted">Present on resume and required by job</p>
              </div>
            </div>
            <span className="tabular-nums text-2xs font-semibold px-2 py-0.5 rounded-full bg-lux-success-subtle text-lux-success border border-lux-success-border">
              {matchingSkills.length} verified
            </span>
          </div>

          {matchingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {matchingSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-lux-bg text-lux-text border border-lux-border hover:border-lux-cobalt-border transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-lux-success" />
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-lux-muted italic py-1">
              No overlapping skills detected between the resume and job requirements.
            </p>
          )}
        </div>

        {/* Missing Skills Panel */}
        <div className="bg-lux-surface rounded-card border border-lux-border p-5 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-lux-border-subtle">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-lux-warning-subtle text-lux-warning flex items-center justify-center font-bold text-xs border border-lux-warning-border">
                <XCircle className="w-3.5 h-3.5" />
              </span>
              <div>
                <h3 className="text-xs font-semibold text-lux-text">Skill Gaps</h3>
                <p className="text-2xs text-lux-muted">Required by role but absent from candidate profile</p>
              </div>
            </div>
            <span className="tabular-nums text-2xs font-semibold px-2 py-0.5 rounded-full bg-lux-warning-subtle text-lux-warning border border-lux-warning-border">
              {missingSkills.length} to acquire
            </span>
          </div>

          {missingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-lux-bg text-lux-text border border-lux-border hover:border-lux-warning-border transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-lux-warning" />
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-xs text-lux-success font-medium py-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-lux-success" />
              Full match — all specified job skills are present on resume.
            </div>
          )}
        </div>
      </div>

      {/* Additional Candidate Skills */}
      {additionalSkills && additionalSkills.length > 0 && (
        <div className="bg-lux-surface rounded-card border border-lux-border p-4 shadow-card">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-lux-muted" />
              <span className="text-2xs font-semibold uppercase tracking-wider text-lux-secondary">
                Additional Detected Candidate Skills
              </span>
            </div>
            <span className="tabular-nums text-2xs text-lux-muted font-medium">{additionalSkills.length} bonus competencies</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {additionalSkills.map((s) => (
              <span
                key={s}
                className="px-2.5 py-0.5 text-xs rounded-md font-medium bg-lux-bg text-lux-secondary border border-lux-border"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
