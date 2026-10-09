import React from 'react';
import { Bot, Layers, BookOpen, Code2, Sparkles, Sliders } from 'lucide-react';

const PRIORITY_STYLES = {
  High: 'bg-red-50 text-red-700 border-red-200',
  HIGH: 'bg-red-50 text-red-700 border-red-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
  Low: 'bg-sky-50 text-sky-700 border-sky-200',
  LOW: 'bg-sky-50 text-sky-700 border-sky-200',
};

export default function CareerInsights({
  summary = '',
  skillPriorities = [],
  recommendations = [],
  source = 'fallback',
}) {
  const isAi = source === 'ai';

  return (
    <div className="space-y-6">
      {/* 1. Summary Box with Source Badge */}
      <div className="bg-gradient-to-br from-indigo-50/60 via-white to-violet-50/60 rounded-2xl border border-indigo-100 p-6 sm:p-7 shadow-2xs">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5">
            <Bot className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <h2 className="text-sm font-bold text-slate-900">Career Insights Summary</h2>
              {isAi ? (
                <span className="inline-flex items-center gap-1 text-2xs font-bold px-2.5 py-1 rounded-full bg-violet-100 text-violet-800 border border-violet-200">
                  <Sparkles className="w-3 h-3 text-violet-600" />
                  AI Generated
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-2xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  <Sliders className="w-3 h-3 text-slate-500" />
                  Standard Recommendations
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {summary || 'Review your matching skills and targeted recommendations to close your skill gap.'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Skill Priority Explanation */}
      {skillPriorities && skillPriorities.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs border border-indigo-100">
              <Layers className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Skill Priority Assessment</h3>
              <p className="text-2xs text-slate-500">Why each missing skill is crucial for this job target</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillPriorities.map((item) => (
              <div
                key={item.skill}
                className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-sm text-slate-900">{item.skill}</span>
                  <span
                    className={`text-2xs font-bold px-2 py-0.5 rounded-full border ${
                      PRIORITY_STYLES[item.priority] || PRIORITY_STYLES.Medium
                    }`}
                  >
                    {item.priority} Priority
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-600 leading-relaxed">
                  {item.reason && (
                    <p>
                      <strong className="text-slate-800">Job relevance: </strong>
                      {item.reason}
                    </p>
                  )}
                  {item.whyItMatters && (
                    <p>
                      <strong className="text-slate-800">Impact: </strong>
                      {item.whyItMatters}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Actionable Recommendations & Practice Projects */}
      {recommendations && recommendations.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <span className="w-7 h-7 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center font-bold text-xs border border-violet-100">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Actionable Recommendations</h3>
              <p className="text-2xs text-slate-500">Structured learning guidance and portfolio projects</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <div
                key={rec.skill}
                className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{rec.skill}</span>
                  {rec.priority && (
                    <span
                      className={`text-2xs font-bold px-2 py-0.5 rounded-full border ${
                        PRIORITY_STYLES[rec.priority] || PRIORITY_STYLES.Medium
                      }`}
                    >
                      {rec.priority}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {rec.recommendation || rec.reason}
                </p>

                {rec.practiceProject && (
                  <div className="pt-2 border-t border-slate-200/80 flex items-start gap-2 text-xs text-indigo-950 bg-indigo-50/60 p-2.5 rounded-lg">
                    <Code2 className="w-4 h-4 flex-shrink-0 text-indigo-600 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-indigo-900 text-2xs uppercase tracking-wider">
                        Practice Project
                      </span>
                      <span className="text-indigo-800 text-xs">{rec.practiceProject}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
