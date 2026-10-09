import React from 'react';
import {
  Sparkles,
  PlusCircle,
  History,
  Briefcase,
  Layers,
  Map,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import ScoreCard, { getScoreInterpretation, formatDate } from './ScoreCard';
import SkillList from './SkillList';
import CareerInsights from './CareerInsights';
import RoadmapTimeline from './RoadmapTimeline';

export default function DashboardView({
  currentAnalysis = null,
  historyList = [],
  onNewAnalysis = () => {},
  onViewHistory = () => {},
  onSelectAnalysis = () => {},
}) {
  // Real metrics computed from application history
  const totalAnalyses = historyList.length;
  const avgScore = totalAnalyses > 0
    ? Math.round(historyList.reduce((acc, curr) => acc + (curr.matchScore || 0), 0) / totalAnalyses)
    : (currentAnalysis?.matchScore || 0);

  const highestScore = totalAnalyses > 0
    ? Math.max(...historyList.map((h) => h.matchScore || 0))
    : (currentAnalysis?.matchScore || 0);

  // Empty Dashboard State
  if (!currentAnalysis && totalAnalyses === 0) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto py-4">
        {/* Clean, calm hero area */}
        <div className="text-center max-w-xl mx-auto pt-4 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-lux-cobalt-subtle text-lux-cobalt border border-lux-cobalt-border">
            <Sparkles className="w-2.5 h-2.5 text-lux-cobalt" />
            Precision Career Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-lux-text">
            Analyze Resume &amp; Role Fit
          </h1>
          <p className="text-xs text-lux-secondary leading-relaxed">
            Deterministic competency extraction against job requirements with intelligent learning roadmaps.
          </p>
        </div>

        {/* Action Panel */}
        <div className="bg-lux-surface rounded-panel border border-lux-border p-8 sm:p-10 text-center shadow-card hover:shadow-card-hover transition-all space-y-5 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-xl bg-lux-cobalt-subtle text-lux-cobalt flex items-center justify-center mx-auto border border-lux-cobalt-border shadow-2xs">
            <Briefcase className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-lux-text tracking-tight">
              No analyses created yet
            </h2>
            <p className="text-2xs text-lux-secondary max-w-xs mx-auto leading-relaxed">
              Upload your resume and evaluate a target job description to generate your first match report.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={onNewAnalysis}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md text-xs font-medium text-white bg-lux-cobalt hover:bg-lux-cobalt-hover active:bg-lux-cobalt-active transition-colors shadow-2xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Create First Analysis
            </button>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
          <div className="bg-lux-surface p-4 rounded-card border border-lux-border shadow-card space-y-1.5">
            <div className="w-6 h-6 rounded-md bg-lux-success-subtle text-lux-success flex items-center justify-center font-bold text-2xs border border-lux-success-border">
              ✓
            </div>
            <h3 className="font-semibold text-xs text-lux-text">Deterministic Matching</h3>
            <p className="text-2xs text-lux-secondary leading-relaxed">
              Normalizes technical skills across 50+ core domains with transparent, rule-backed scoring.
            </p>
          </div>

          <div className="bg-lux-surface p-4 rounded-card border border-lux-border shadow-card space-y-1.5">
            <div className="w-6 h-6 rounded-md bg-lux-cobalt-subtle text-lux-cobalt flex items-center justify-center font-bold text-2xs border border-lux-cobalt-border">
              ✨
            </div>
            <h3 className="font-semibold text-xs text-lux-text">AI Career Insights</h3>
            <p className="text-2xs text-lux-secondary leading-relaxed">
              Prioritizes skill gaps by role relevance and generates concrete portfolio project ideas.
            </p>
          </div>

          <div className="bg-lux-surface p-4 rounded-card border border-lux-border shadow-card space-y-1.5">
            <div className="w-6 h-6 rounded-md bg-lux-cobalt-subtle text-lux-cobalt flex items-center justify-center font-bold text-2xs border border-lux-cobalt-border">
              🗺
            </div>
            <h3 className="font-semibold text-xs text-lux-text">Structured Roadmaps</h3>
            <p className="text-2xs text-lux-secondary leading-relaxed">
              Step-by-step milestones ordered by prerequisite foundations, frameworks, and deployment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Active Dashboard with Current Analysis or computed history
  const roadmapObj = currentAnalysis?.roadmap || currentAnalysis?.learningRoadmap || {};
  const roadmapSteps = roadmapObj.steps || (Array.isArray(roadmapObj) ? roadmapObj : []);
  const roadmapMessage = roadmapObj.message || roadmapObj.summary || '';
  const source = currentAnalysis?.source || roadmapObj.source || 'fallback';
  const skillPriorities = currentAnalysis?.skillPriorities || roadmapObj.skillPriorities || [];
  const recommendations = currentAnalysis?.recommendations || [];

  const matchedList = currentAnalysis?.matchedSkills || currentAnalysis?.matchingSkills || [];
  const missingList = currentAnalysis?.missingSkills || [];

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-lux-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-semibold tracking-tight text-lux-text">
              Workspace Dashboard
            </h1>
            <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-lux-cobalt-subtle text-lux-cobalt border border-lux-cobalt-border">
              Active Evaluation
            </span>
          </div>
          <p className="text-2xs text-lux-secondary mt-0.5">
            Resume evaluation overview for <span className="font-medium text-lux-text">{currentAnalysis?.jobTitle || 'Target Position'}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onViewHistory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-lux-border bg-lux-surface text-lux-secondary hover:text-lux-text hover:bg-lux-bg transition-colors shadow-2xs"
          >
            <History className="w-3.5 h-3.5 text-lux-muted" />
            History ({totalAnalyses})
          </button>
          <button
            type="button"
            onClick={onNewAnalysis}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-white bg-lux-cobalt hover:bg-lux-cobalt-hover active:bg-lux-cobalt-active transition-colors shadow-2xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            New Analysis
          </button>
        </div>
      </div>

      {/* ── Real Metric Summary Cards ── */}
      {totalAnalyses > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-lux-surface p-3.5 rounded-card border border-lux-border shadow-card">
            <span className="text-2xs font-medium uppercase tracking-wider text-lux-secondary block">
              Total Analyses
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="tabular-nums text-xl font-bold text-lux-text">{totalAnalyses}</span>
              <span className="text-2xs text-lux-muted">evaluations</span>
            </div>
          </div>

          <div className="bg-lux-surface p-3.5 rounded-card border border-lux-border shadow-card">
            <span className="text-2xs font-medium uppercase tracking-wider text-lux-secondary block">
              Average Score
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="tabular-nums text-xl font-bold text-lux-cobalt">{avgScore}%</span>
              <span className="text-2xs text-lux-muted">across roles</span>
            </div>
          </div>

          <div className="bg-lux-surface p-3.5 rounded-card border border-lux-border shadow-card">
            <span className="text-2xs font-medium uppercase tracking-wider text-lux-secondary block">
              Highest Fit
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="tabular-nums text-xl font-bold text-lux-success">{highestScore}%</span>
              <span className="text-2xs text-lux-muted">best match</span>
            </div>
          </div>

          <div className="bg-lux-surface p-3.5 rounded-card border border-lux-border shadow-card">
            <span className="text-2xs font-medium uppercase tracking-wider text-lux-secondary block">
              Latest Target
            </span>
            <div className="mt-1">
              <span className="text-xs font-semibold text-lux-text truncate block" title={currentAnalysis?.jobTitle}>
                {currentAnalysis?.jobTitle || 'Role'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Active Analysis Results ── */}
      {currentAnalysis && (
        <>
          {/* 4 Summary Score Cards */}
          <ScoreCard
            matchScore={currentAnalysis.matchScore || 0}
            matchedCount={matchedList.length}
            missingCount={missingList.length}
            jobTitle={currentAnalysis.jobTitle || 'Target Role'}
            resumeFileName={currentAnalysis.resumeFileName || 'Uploaded Resume'}
            createdAt={currentAnalysis.savedAt || currentAnalysis.createdAt}
          />

          {/* Skill Overview: Matched vs Missing */}
          <section className="space-y-2">
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-lux-cobalt" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-lux-secondary">Competency Breakdown</h2>
            </div>
            <SkillList
              matchingSkills={matchedList}
              missingSkills={missingList}
              additionalSkills={currentAnalysis.additionalSkills || []}
            />
          </section>

          {/* AI Career Insights */}
          <section className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-lux-cobalt" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-lux-secondary">Career Insights &amp; Priorities</h2>
            </div>
            <CareerInsights
              summary={currentAnalysis.summary || roadmapObj.summary || ''}
              skillPriorities={skillPriorities}
              recommendations={recommendations}
              source={source}
            />
          </section>

          {/* Learning Roadmap Vertical Timeline */}
          <section className="space-y-2">
            <div className="flex items-center gap-2">
              <Map className="w-3.5 h-3.5 text-lux-cobalt" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-lux-secondary">Milestone Learning Path</h2>
            </div>
            <RoadmapTimeline
              roadmap={{
                message: roadmapMessage,
                steps: roadmapSteps,
              }}
            />
          </section>
        </>
      )}

      {/* ── Recent Analyses Table ── */}
      {historyList.length > 0 && (
        <section className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-3.5 h-3.5 text-lux-cobalt" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-lux-secondary">
                Recent Evaluations
              </h2>
            </div>
            <button
              type="button"
              onClick={onViewHistory}
              className="text-2xs font-medium text-lux-cobalt hover:underline inline-flex items-center gap-1"
            >
              View all ({historyList.length}) &rarr;
            </button>
          </div>

          <div className="bg-lux-surface rounded-card border border-lux-border shadow-card overflow-hidden">
            <div className="divide-y divide-lux-border-subtle">
              {historyList.slice(0, 4).map((item) => {
                const interpretation = getScoreInterpretation(item.matchScore);
                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectAnalysis(item.id)}
                    className="p-3.5 sm:px-4 flex items-center justify-between gap-3 hover:bg-lux-bg transition-colors cursor-pointer group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-lux-text truncate group-hover:text-lux-cobalt transition-colors">
                          {item.jobTitle || 'Target Role'}
                        </span>
                        {item.source === 'ai' && (
                          <span className="text-2xs px-1.5 py-0.2 rounded bg-lux-cobalt-subtle text-lux-cobalt border border-lux-cobalt-border font-medium">
                            AI
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-2xs text-lux-muted mt-0.5">
                        <span className="truncate">{item.resumeFileName || 'Resume'}</span>
                        <span>&middot;</span>
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <span className={`tabular-nums text-xs font-bold ${interpretation.color}`}>
                          {item.matchScore}%
                        </span>
                        <span className="block text-2xs text-lux-muted">
                          {interpretation.label}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-lux-muted group-hover:text-lux-cobalt group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
