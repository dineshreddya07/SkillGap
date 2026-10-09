import React from 'react';
import { CheckCircle2, XCircle, Calendar, Briefcase } from 'lucide-react';

export const getScoreInterpretation = (score) => {
  if (score >= 85) {
    return {
      label: 'High Match',
      color: 'text-lux-success',
      bg: 'bg-lux-success-subtle',
      border: 'border-lux-success-border',
      stroke: '#0E9F6E',
    };
  }
  if (score >= 70) {
    return {
      label: 'Strong Match',
      color: 'text-lux-cobalt',
      bg: 'bg-lux-cobalt-subtle',
      border: 'border-lux-cobalt-border',
      stroke: '#3659D9',
    };
  }
  if (score >= 40) {
    return {
      label: 'Moderate Match',
      color: 'text-lux-warning',
      bg: 'bg-lux-warning-subtle',
      border: 'border-lux-warning-border',
      stroke: '#D97706',
    };
  }
  return {
    label: 'Low Match',
    color: 'text-lux-error',
    bg: 'bg-lux-error-subtle',
    border: 'border-lux-error-border',
    stroke: '#E02424',
  };
};

export const formatDate = (isoDate) => {
  if (!isoDate) return 'Just now';
  try {
    return new Date(isoDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Recently';
  }
};

export default function ScoreCard({
  matchScore = 0,
  matchedCount = 0,
  missingCount = 0,
  jobTitle = 'Target Role',
  resumeFileName = 'Resume',
  createdAt = null,
}) {
  const interpretation = getScoreInterpretation(matchScore);
  const totalRequired = matchedCount + missingCount;

  // SVG Circular Ring parameters
  const size = 56;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, matchScore));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Overall Match Score Card with SVG Ring */}
      <div className="bg-lux-surface rounded-card border border-lux-border p-4 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
        <div className="flex items-center gap-3.5">
          <div className="relative flex-shrink-0 flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#E7E9EE"
                strokeWidth={strokeWidth}
                fill="none"
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={interpretation.stroke}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <span className="absolute tabular-nums text-xs font-bold text-lux-text">
              {matchScore}%
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <span className="text-2xs font-medium uppercase tracking-wider text-lux-secondary block">
              Match Score
            </span>
            <span className={`text-xs font-semibold block truncate ${interpretation.color}`}>
              {interpretation.label}
            </span>
            <span className="text-2xs text-lux-muted block tabular-nums">
              {matchedCount} of {totalRequired} skills met
            </span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-lux-border-subtle flex items-center justify-between text-2xs text-lux-muted">
          <span>Deterministic evaluation</span>
          <span className="tabular-nums font-medium text-lux-secondary">{clampedScore}/100</span>
        </div>
      </div>

      {/* 2. Skills Matched */}
      <div className="bg-lux-surface rounded-card border border-lux-border p-4 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-lux-success-subtle text-lux-success flex items-center justify-center flex-shrink-0 border border-lux-success-border">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xs font-medium uppercase tracking-wider text-lux-secondary block">
              Skills Matched
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="tabular-nums text-xl font-bold text-lux-text">{matchedCount}</span>
              <span className="text-2xs text-lux-success font-medium">verified</span>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-lux-border-subtle text-2xs text-lux-secondary font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-lux-success" />
          <span>Present on submitted resume</span>
        </div>
      </div>

      {/* 3. Skill Gaps */}
      <div className="bg-lux-surface rounded-card border border-lux-border p-4 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-lux-warning-subtle text-lux-warning flex items-center justify-center flex-shrink-0 border border-lux-warning-border">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xs font-medium uppercase tracking-wider text-lux-secondary block">
              Skill Gaps
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="tabular-nums text-xl font-bold text-lux-text">{missingCount}</span>
              <span className="text-2xs text-lux-warning font-medium">to acquire</span>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-lux-border-subtle text-2xs text-lux-secondary font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-lux-warning" />
          <span>Ordered in roadmap milestones</span>
        </div>
      </div>

      {/* 4. Target Role & Context */}
      <div className="bg-lux-surface rounded-card border border-lux-border p-4 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-lux-cobalt-subtle text-lux-cobalt flex items-center justify-center flex-shrink-0 border border-lux-cobalt-border">
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-2xs font-medium uppercase tracking-wider text-lux-secondary block">
              Target Role
            </span>
            <span className="text-xs font-semibold text-lux-text truncate block mt-0.5" title={jobTitle}>
              {jobTitle}
            </span>
            <span className="text-2xs text-lux-muted truncate block" title={resumeFileName}>
              {resumeFileName}
            </span>
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-lux-border-subtle text-2xs text-lux-secondary font-medium flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-lux-muted" />
          <span>Evaluated {formatDate(createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
