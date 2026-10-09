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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
            <History className="w-6 h-6 text-indigo-600" />
            Analysis History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse and review your past SkillGap analyses and track your matching progress.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={onNewAnalysis}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-2xs"
          >
            <PlusCircle className="w-4 h-4" />
            + New Analysis
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-xs sm:text-sm">Unable to load analysis history</p>
            <p className="text-xs text-red-600 mt-0.5">{error}</p>
          </div>
          <button
            onClick={onRefresh}
            className="text-xs font-bold underline hover:no-underline text-red-800"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-2xs space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Loading your analyses...</p>
          <p className="text-xs text-slate-400">Fetching records from database</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && history.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 sm:p-14 text-center shadow-2xs space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">No analyses yet.</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Upload your resume and analyze a job description to get your first SkillGap report.
            </p>
          </div>
          <button
            type="button"
            onClick={onNewAnalysis}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Start Your First Analysis
          </button>
        </div>
      )}

      {/* History Cards List */}
      {!isLoading && history.length > 0 && (
        <div className="space-y-3.5">
          {history.map((item) => {
            const interpretation = getScoreInterpretation(item.matchScore);
            const isAi = item.source === 'ai';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-indigo-200 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Left: Job Info */}
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-slate-900 truncate">
                      {item.jobTitle || 'Target Role'}
                    </h2>
                    {isAi ? (
                      <span className="inline-flex items-center gap-1 text-2xs font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200">
                        <Sparkles className="w-3 h-3 text-violet-600" />
                        AI Generated
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-2xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        <Sliders className="w-3 h-3 text-slate-500" />
                        Standard
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                    {item.resumeFileName && (
                      <span className="flex items-center gap-1 truncate text-slate-600">
                        <FileText className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                        <span className="truncate">{item.resumeFileName}</span>
                      </span>
                    )}
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 text-2xs font-semibold">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                      ✓ {item.matchedCount} matched
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                      ✗ {item.missingCount} gaps
                    </span>
                  </div>
                </div>

                {/* Right: Score & View Action */}
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <div className="text-right">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl font-extrabold text-base border-2 ${interpretation.border} ${interpretation.color} ${interpretation.bg}`}
                    >
                      {item.matchScore}%
                    </div>
                    <span className="block text-2xs font-bold text-slate-400 mt-0.5 text-center">
                      {interpretation.label}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectAnalysis(item.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 transition-colors shadow-2xs"
                  >
                    View Analysis
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
