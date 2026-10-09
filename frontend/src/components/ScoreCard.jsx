import React from 'react';
import { Target, CheckCircle2, XCircle, Calendar, Briefcase, FileText } from 'lucide-react';

export const getScoreInterpretation = (score) => {
  if (score >= 85) return { label: 'Excellent Match', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-500', barBg: 'bg-emerald-500' };
  if (score >= 70) return { label: 'Good Match', color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-500', barBg: 'bg-teal-500' };
  if (score >= 40) return { label: 'Moderate Match', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-500', barBg: 'bg-amber-500' };
  return { label: 'Low Match', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-500', barBg: 'bg-rose-500' };
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Match Score Card with Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black text-lg border flex-shrink-0 shadow-2xs ${interpretation.border} ${interpretation.color} ${interpretation.bg}`}
          >
            <span>{matchScore}%</span>
          </div>
          <div className="min-w-0">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 block">
              Match Score
            </span>
            <span className={`text-sm font-extrabold block truncate ${interpretation.color}`}>
              {interpretation.label}
            </span>
            <span className="text-xs text-slate-500 block font-medium">
              {matchedCount} of {matchedCount + missingCount} skills
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="mt-3.5 pt-3 border-t border-slate-100">
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${interpretation.barBg}`}
              style={{ width: `${Math.min(100, Math.max(0, matchScore))}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-2xs text-slate-400 font-semibold mt-1">
            <span>0%</span>
            <span>40% Mod</span>
            <span>70% Good</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* 2. Skills Matched */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 block">
              Skills Matched
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight">{matchedCount}</span>
              <span className="text-xs text-emerald-700 font-bold">verified</span>
            </div>
          </div>
        </div>
        <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Present on candidate resume</span>
        </div>
      </div>

      {/* 3. Skills Missing */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-100">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 block">
              Skill Gaps
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight">{missingCount}</span>
              <span className="text-xs text-amber-700 font-bold">to learn</span>
            </div>
          </div>
        </div>
        <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>Prioritized in learning roadmap</span>
        </div>
      </div>

      {/* 4. Target Role & Date */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 border border-indigo-100">
            <Briefcase className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 block">
              Target Role
            </span>
            <span className="text-sm font-bold text-slate-900 truncate block mt-0.5">
              {jobTitle}
            </span>
            <span className="text-xs text-slate-500 truncate block font-medium">
              {resumeFileName}
            </span>
          </div>
        </div>
        <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Analyzed {formatDate(createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
