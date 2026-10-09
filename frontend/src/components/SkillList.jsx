import React from 'react';
import { CheckCircle2, XCircle, PlusCircle } from 'lucide-react';

export default function SkillList({
  matchingSkills = [],
  missingSkills = [],
  additionalSkills = [],
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-100">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-slate-900">Matched Skills</h3>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {matchingSkills.length} verified
            </span>
          </div>

          {matchingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {matchingSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs"
                >
                  <span className="text-emerald-600 font-bold">✓</span> {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-2">
              No matching skills detected from the job description on this resume.
            </p>
          )}
        </div>

        {/* Missing Skills */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs border border-amber-100">
                <XCircle className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-slate-900">Missing Skills (Gaps)</h3>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              {missingSkills.length} to learn
            </span>
          </div>

          {missingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs"
                >
                  <span className="text-amber-600 font-bold">✗</span> {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-xs text-emerald-700 font-semibold py-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              All required skills are covered! No skill gaps detected.
            </div>
          )}
        </div>
      </div>

      {/* Additional Candidate Skills */}
      {additionalSkills && additionalSkills.length > 0 && (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Additional Skills Found on Resume
              </span>
            </div>
            <span className="text-2xs text-slate-500 font-medium">{additionalSkills.length} bonus skills</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {additionalSkills.map((s) => (
              <span
                key={s}
                className="px-2.5 py-1 text-xs rounded-lg font-medium bg-white text-slate-700 border border-slate-200 shadow-2xs"
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
