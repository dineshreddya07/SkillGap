import React from 'react';
import { Bot, Layers, BookOpen, Code2, Sparkles, Sliders } from 'lucide-react';

const PRIORITY_STYLES = {
  High: 'bg-lux-error-subtle text-lux-error border-lux-error-border',
  HIGH: 'bg-lux-error-subtle text-lux-error border-lux-error-border',
  Medium: 'bg-lux-warning-subtle text-lux-warning border-lux-warning-border',
  MEDIUM: 'bg-lux-warning-subtle text-lux-warning border-lux-warning-border',
  Low: 'bg-lux-cobalt-subtle text-lux-cobalt border-lux-cobalt-border',
  LOW: 'bg-lux-cobalt-subtle text-lux-cobalt border-lux-cobalt-border',
};

export default function CareerInsights({
  summary = '',
  skillPriorities = [],
  recommendations = [],
  source = 'fallback',
}) {
  const isAi = source === 'ai';

  return (
    <div className="space-y-4">
      {/* 1. Summary Box with Source Badge */}
      <div className="bg-lux-surface rounded-card border border-lux-border p-5 shadow-card">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-lux-cobalt-subtle text-lux-cobalt flex items-center justify-center flex-shrink-0 border border-lux-cobalt-border mt-0.5">
            <Bot className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-lux-secondary">
                Career Assessment Summary
              </h2>
              {isAi ? (
                <span className="inline-flex items-center gap-1 text-2xs font-semibold px-2 py-0.5 rounded-full bg-lux-cobalt-subtle text-lux-cobalt border border-lux-cobalt-border">
                  <Sparkles className="w-2.5 h-2.5 text-lux-cobalt" />
                  AI Guided
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-2xs font-medium px-2 py-0.5 rounded-full bg-lux-bg text-lux-secondary border border-lux-border">
                  <Sliders className="w-2.5 h-2.5 text-lux-muted" />
                  Standard Assessment
                </span>
              )}
            </div>
            <p className="text-xs text-lux-text leading-relaxed font-normal">
              {summary || 'Review your matched competencies and targeted skill recommendations to advance towards role readiness.'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Skill Priority Explanation */}
      {skillPriorities && skillPriorities.length > 0 && (
        <div className="bg-lux-surface rounded-card border border-lux-border p-5 shadow-card space-y-3.5">
          <div className="flex items-center gap-2 pb-2.5 border-b border-lux-border-subtle">
            <span className="w-6 h-6 rounded-md bg-lux-cobalt-subtle text-lux-cobalt flex items-center justify-center font-bold text-xs border border-lux-cobalt-border">
              <Layers className="w-3.5 h-3.5" />
            </span>
            <div>
              <h3 className="text-xs font-semibold text-lux-text">Skill Priority Assessment</h3>
              <p className="text-2xs text-lux-muted">Strategic importance of each missing requirement</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {skillPriorities.map((item) => (
              <div
                key={item.skill}
                className="p-3.5 rounded-lg border border-lux-border bg-lux-bg hover:bg-lux-surface transition-colors flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-xs text-lux-text">{item.skill}</span>
                  <span
                    className={`text-2xs font-semibold px-2 py-0.5 rounded-full border ${
                      PRIORITY_STYLES[item.priority] || PRIORITY_STYLES.Medium
                    }`}
                  >
                    {item.priority} Priority
                  </span>
                </div>
                <div className="space-y-1 text-2xs text-lux-secondary leading-relaxed">
                  {item.reason && (
                    <p>
                      <strong className="text-lux-text font-medium">Relevance: </strong>
                      {item.reason}
                    </p>
                  )}
                  {item.whyItMatters && (
                    <p>
                      <strong className="text-lux-text font-medium">Impact: </strong>
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
        <div className="bg-lux-surface rounded-card border border-lux-border p-5 shadow-card space-y-3.5">
          <div className="flex items-center gap-2 pb-2.5 border-b border-lux-border-subtle">
            <span className="w-6 h-6 rounded-md bg-lux-cobalt-subtle text-lux-cobalt flex items-center justify-center font-bold text-xs border border-lux-cobalt-border">
              <BookOpen className="w-3.5 h-3.5" />
            </span>
            <div>
              <h3 className="text-xs font-semibold text-lux-text">Actionable Recommendations</h3>
              <p className="text-2xs text-lux-muted">Suggested learning strategies and practical portfolio evidence</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendations.map((rec) => (
              <div
                key={rec.skill}
                className="p-3.5 rounded-lg border border-lux-border bg-lux-bg hover:bg-lux-surface transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-lux-text">{rec.skill}</span>
                  {rec.priority && (
                    <span
                      className={`text-2xs font-semibold px-2 py-0.5 rounded-full border ${
                        PRIORITY_STYLES[rec.priority] || PRIORITY_STYLES.Medium
                      }`}
                    >
                      {rec.priority}
                    </span>
                  )}
                </div>

                <p className="text-2xs text-lux-secondary leading-relaxed">
                  {rec.recommendation || rec.reason}
                </p>

                {rec.practiceProject && (
                  <div className="pt-2 border-t border-lux-border-subtle flex items-start gap-2 text-2xs text-lux-text bg-lux-surface p-2.5 rounded-md border border-lux-border">
                    <Code2 className="w-3.5 h-3.5 flex-shrink-0 text-lux-cobalt mt-0.5" />
                    <div>
                      <span className="font-medium block text-lux-secondary text-2xs uppercase tracking-wider">
                        Practice Project
                      </span>
                      <span className="text-lux-text font-normal">{rec.practiceProject}</span>
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
