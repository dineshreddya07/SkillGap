import React from 'react';
import {
  Sparkles,
  PlusCircle,
  History,
  FileText,
  Briefcase,
  Layers,
  Map,
  ArrowRight,
} from 'lucide-react';
import ScoreCard from './ScoreCard';
import SkillList from './SkillList';
import CareerInsights from './CareerInsights';
import RoadmapTimeline from './RoadmapTimeline';

export default function DashboardView({
  currentAnalysis = null,
  onNewAnalysis = () => {},
  onViewHistory = () => {},
}) {
  // Empty Dashboard State
  if (!currentAnalysis) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto pt-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            AI Career Skill Analyzer
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Welcome to SkillGap
          </h1>
          <p className="mt-2 text-slate-600 text-xs sm:text-sm leading-relaxed">
            Discover the exact technical skills required for your target jobs, evaluate your resume fit, and get an intelligent learning roadmap to close the gap.
          </p>
        </div>

        {/* Action Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-2xs space-y-6 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100 shadow-2xs">
            <Briefcase className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              No analyses yet
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Upload your resume and analyze a job description to get your first SkillGap report.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onNewAnalysis}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Start Your First Analysis
            </button>
            <button
              type="button"
              onClick={onViewHistory}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <History className="w-4 h-4" />
              View History
            </button>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              ✓
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900">Deterministic Matching</h3>
            <p className="text-2xs text-slate-500 leading-relaxed">
              Compares normalized skills across 50+ industry competencies with zero black-box scoring.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
              ✨
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900">AI Career Insights</h3>
            <p className="text-2xs text-slate-500 leading-relaxed">
              Personalized skill priority matrix and realistic portfolio projects tailored to your target job.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-xs">
              🗺
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900">Intelligent Roadmap</h3>
            <p className="text-2xs text-slate-500 leading-relaxed">
              Structured learning milestones ordered by prerequisite foundations, frameworks, and deployment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Active Dashboard with Current Analysis
  const roadmapObj = currentAnalysis.roadmap || currentAnalysis.learningRoadmap || {};
  const roadmapSteps = roadmapObj.steps || (Array.isArray(roadmapObj) ? roadmapObj : []);
  const roadmapMessage = roadmapObj.message || roadmapObj.summary || '';
  const source = currentAnalysis.source || roadmapObj.source || 'fallback';
  const skillPriorities = currentAnalysis.skillPriorities || roadmapObj.skillPriorities || [];
  const recommendations = currentAnalysis.recommendations || [];

  const matchedList = currentAnalysis.matchedSkills || currentAnalysis.matchingSkills || [];
  const missingList = currentAnalysis.missingSkills || [];

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              Latest Analysis Dashboard
            </h1>
            <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Overview of your current resume evaluation against {currentAnalysis.jobTitle || 'the target job'}.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onViewHistory}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            History
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
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Skill Breakdown</h2>
        </div>
        <SkillList
          matchingSkills={matchedList}
          missingSkills={missingList}
          additionalSkills={currentAnalysis.additionalSkills || []}
        />
      </section>

      {/* AI Career Insights */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Career Insights &amp; Priorities</h2>
        </div>
        <CareerInsights
          summary={currentAnalysis.summary || roadmapObj.summary || ''}
          skillPriorities={skillPriorities}
          recommendations={recommendations}
          source={source}
        />
      </section>

      {/* Learning Roadmap Vertical Timeline */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Milestone Roadmap</h2>
        </div>
        <RoadmapTimeline
          roadmap={{
            message: roadmapMessage,
            steps: roadmapSteps,
          }}
        />
      </section>
    </div>
  );
}
