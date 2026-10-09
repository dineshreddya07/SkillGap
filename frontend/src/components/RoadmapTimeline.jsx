import React from 'react';
import { Map, Clock, CheckCircle2 } from 'lucide-react';

export default function RoadmapTimeline({ roadmap = null }) {
  const steps = roadmap?.steps || [];
  const message = roadmap?.message || 'Sequential learning roadmap ordered by prerequisite skill dependencies.';

  if (!steps || steps.length === 0) {
    return (
      <div className="bg-lux-surface rounded-card border border-lux-border p-6 text-center shadow-card">
        <CheckCircle2 className="w-8 h-8 text-lux-success mx-auto mb-2" />
        <h3 className="text-xs font-semibold text-lux-text">No Learning Roadmaps Required</h3>
        <p className="text-2xs text-lux-muted mt-1 max-w-sm mx-auto">
          The candidate profile fulfills all requirements identified for this position.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-lux-surface rounded-card border border-lux-border p-5 sm:p-6 shadow-card space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-lux-border-subtle">
        <span className="w-7 h-7 rounded-md bg-lux-cobalt-subtle text-lux-cobalt flex items-center justify-center font-bold text-xs border border-lux-cobalt-border">
          <Map className="w-3.5 h-3.5" />
        </span>
        <div>
          <h2 className="text-xs font-semibold text-lux-text">Intelligent Learning Roadmap</h2>
          <p className="text-2xs text-lux-muted font-normal">{message}</p>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 sm:pl-7 space-y-5 before:absolute before:left-3 before:top-2 before:bottom-3 before:w-px before:bg-lux-border">
        {steps.map((step) => {
          return (
            <div key={step.skill || step.step} className="relative group">
              {/* Timeline Marker Dot */}
              <div className="absolute -left-6 sm:-left-7 top-1 w-6 h-6 rounded-full bg-lux-surface border border-lux-cobalt flex items-center justify-center shadow-2xs">
                <span className="tabular-nums text-2xs font-bold text-lux-cobalt">{step.step}</span>
              </div>

              {/* Step Content Card */}
              <div className="bg-lux-bg hover:bg-lux-surface rounded-lg border border-lux-border p-3.5 transition-all shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xs font-semibold text-lux-text">{step.title}</h3>
                    <span className="px-2 py-0.5 rounded text-2xs font-medium bg-lux-cobalt-subtle text-lux-cobalt border border-lux-cobalt-border">
                      {step.skill}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-2xs font-medium text-lux-secondary bg-lux-surface px-2 py-0.5 rounded border border-lux-border">
                    <Clock className="w-3 h-3 text-lux-muted" />
                    {step.duration}
                  </span>
                </div>

                <p className="text-2xs text-lux-secondary leading-relaxed mt-1">
                  <strong className="text-lux-text font-medium">Milestone Target: </strong>
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
