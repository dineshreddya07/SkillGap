import React from 'react';
import {
  History,
  FileText,
  Clock,
  ArrowRight,
  Loader2,
  AlertCircle,
  PlusCircle,
  Sparkles,
  Sliders,
  RefreshCw,
} from 'lucide-react';
import { getScoreInterpretation, formatDate } from './ScoreCard';

export default function HistoryView({
  history = [],
  isLoading = false,
  error = null,
  onRefresh = () => {},
  onSelectAnalysis = () => {},
  onNewAnalysis = () => {},
}) {
  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-lux-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-semibold tracking-tight text-lux-text">
              Analysis History
            </h1>
            <span className="tabular-nums text-2xs font-medium px-2 py-0.5 rounded-full bg-lux-bg text-lux-secondary border border-lux-border">
              {history.length} saved
            </span>
          </div>
          <p className="text-2xs text-lux-secondary mt-0.5">
            Past evaluations and candidate skill matching records stored in Neon PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-lux-border bg-lux-surface text-lux-secondary hover:text-lux-text hover:bg-lux-bg transition-colors shadow-2xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={onNewAnalysis}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md text-white bg-lux-cobalt hover:bg-lux-cobalt-hover active:bg-lux-cobalt-active transition-colors shadow-2xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            New Analysis
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-3 rounded-md bg-lux-error-subtle border border-lux-error-border text-lux-error flex items-start gap-2.5 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-lux-error mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-2xs uppercase tracking-wider">Database Fetch Error</p>
            <p className="text-2xs mt-0.5">{error}</p>
          </div>
          <button
            onClick={onRefresh}
            className="text-2xs font-semibold underline hover:no-underline text-lux-error"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-lux-surface rounded-card border border-lux-border p-10 text-center shadow-card space-y-2">
          <Loader2 className="w-6 h-6 text-lux-cobalt animate-spin mx-auto" />
          <p className="text-xs font-medium text-lux-text">Loading historical records...</p>
          <p className="text-2xs text-lux-muted">Fetching evaluations from database</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && history.length === 0 && (
        <div className="bg-lux-surface rounded-panel border border-lux-border p-10 text-center shadow-card space-y-3.5 max-w-sm mx-auto">
          <div className="w-10 h-10 rounded-lg bg-lux-cobalt-subtle text-lux-cobalt flex items-center justify-center mx-auto border border-lux-cobalt-border">
            <FileText className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-lux-text">No evaluations on record</h2>
            <p className="text-2xs text-lux-secondary leading-relaxed">
              Upload a resume and evaluate against a job description to populate your history.
            </p>
          </div>
          <button
            type="button"
            onClick={onNewAnalysis}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium text-white bg-lux-cobalt hover:bg-lux-cobalt-hover transition-colors shadow-2xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Create First Evaluation
          </button>
        </div>
      )}

      {/* History Cards List */}
      {!isLoading && history.length > 0 && (
        <div className="bg-lux-surface rounded-card border border-lux-border shadow-card overflow-hidden">
          <div className="divide-y divide-lux-border-subtle">
            {history.map((item) => {
              const interpretation = getScoreInterpretation(item.matchScore);
              const isAi = item.source === 'ai';

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectAnalysis(item.id)}
                  className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-lux-bg transition-colors cursor-pointer group"
                >
                  {/* Left: Job Info */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xs font-semibold text-lux-text truncate group-hover:text-lux-cobalt transition-colors">
                        {item.jobTitle || 'Target Role'}
                      </h2>
                      {isAi ? (
                        <span className="inline-flex items-center gap-1 text-2xs font-medium px-2 py-0.2 rounded-full bg-lux-cobalt-subtle text-lux-cobalt border border-lux-cobalt-border">
                          <Sparkles className="w-2.5 h-2.5 text-lux-cobalt" />
                          AI
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-2xs font-medium px-2 py-0.2 rounded-full bg-lux-bg text-lux-secondary border border-lux-border">
                          <Sliders className="w-2.5 h-2.5 text-lux-muted" />
                          Standard
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 text-2xs text-lux-secondary flex-wrap">
                      {item.resumeFileName && (
                        <span className="flex items-center gap-1 truncate text-lux-secondary">
                          <FileText className="w-3 h-3 flex-shrink-0 text-lux-muted" />
                          <span className="truncate">{item.resumeFileName}</span>
                        </span>
                      )}
                      <span>&middot;</span>
                      <span className="flex items-center gap-1 text-lux-muted">
                        <Clock className="w-3 h-3 text-lux-muted" />
                        {formatDate(item.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-0.5 text-2xs font-medium">
                      <span className="tabular-nums px-2 py-0.5 rounded bg-lux-success-subtle text-lux-success border border-lux-success-border">
                        ✓ {item.matchedCount} matched
                      </span>
                      <span className="tabular-nums px-2 py-0.5 rounded bg-lux-warning-subtle text-lux-warning border border-lux-warning-border">
                        ✗ {item.missingCount} gaps
                      </span>
                    </div>
                  </div>

                  {/* Right: Score & View Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-3.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-lux-border-subtle flex-shrink-0">
                    <div className="text-right">
                      <div className="flex items-baseline justify-end gap-1">
                        <span className={`tabular-nums text-sm font-bold ${interpretation.color}`}>
                          {item.matchScore}%
                        </span>
                      </div>
                      <span className="block text-2xs text-lux-muted">
                        {interpretation.label}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAnalysis(item.id);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-2xs font-medium text-lux-secondary bg-lux-surface hover:text-lux-cobalt hover:border-lux-cobalt-border border border-lux-border transition-all shadow-2xs"
                    >
                      View
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
