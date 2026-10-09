import React from 'react';
import { Map, Clock, CheckCircle } from 'lucide-react';

export default function RoadmapTimeline({ roadmap = null }) {
  const steps = roadmap?.steps || [];
  const message = roadmap?.message || 'Your personalized learning path ordered by skill dependency.';

  if (!steps || steps.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-2xs">
        <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
        <h3 className="text-base font-bold text-slate-900">No Learning Steps Needed</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Your profile covers all required skills for this position. No roadmap generation was necessary.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
        <span className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-xs border border-sky-100">
          <Map className="w-4 h-4" />
        </span>
        <div>
          <h2 className="text-base font-bold text-slate-900">Personalized Learning Roadmap</h2>
          <p className="text-xs text-slate-500">{message}</p>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3.5 sm:before:left-4 before:top-2 before:bottom-3 before:w-0.5 before:bg-indigo-100">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          return (
            <div key={step.skill || step.step} className="relative group">
              {/* Timeline Marker Dot */}
              <div className="absolute -left-6 sm:-left-8 top-1 w-7 h-7 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center shadow-xs">
                <span className="text-2xs font-extrabold text-indigo-600">{step.step}</span>
              </div>

              {/* Step Content Card */}
              <div className="bg-slate-50/80 hover:bg-slate-50 rounded-xl border border-slate-200/90 p-4 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                    <span className="px-2 py-0.5 rounded-md text-2xs font-bold bg-indigo-100/70 text-indigo-800 border border-indigo-200">
                      {step.skill}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-2xs font-semibold text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {step.duration}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  <strong className="text-slate-700 font-semibold">Milestone Goal: </strong>
                  {step.goal}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
