import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  PlusCircle,
  FileText,
  Briefcase,
  Clock,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { fetchAnalysisById } from '../services/api';
import ScoreCard from './ScoreCard';
import SkillList from './SkillList';
import CareerInsights from './CareerInsights';
import RoadmapTimeline from './RoadmapTimeline';

export default function AnalysisDetailView({
  analysisId,
  initialData = null,
  onBackToHistory = () => {},
  onNewAnalysis = () => {},
}) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState(null);
  const [showFullJobDesc, setShowFullJobDesc] = useState(false);

  useEffect(() => {
    if (initialData && initialData.id === analysisId) {
      setData(initialData);
      setIsLoading(false);
      return;
    }

    if (!analysisId) return;

    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetchAnalysisById(analysisId);
        if (isMounted) {
          if (res && res.success) {
            setData(res.data);
          } else {
            setError(res.message || 'Analysis not found.');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || 'Failed to load analysis details.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [analysisId, initialData]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-2xs space-y-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-700">Loading analysis details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-2xs space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <div>
          <h2 className="text-base font-bold text-slate-900">Analysis Not Found</h2>
          <p className="text-xs text-slate-500 mt-1">{error || 'The requested analysis could not be retrieved.'}</p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onBackToHistory}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to History
          </button>
          <button
            type="button"
            onClick={onNewAnalysis}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            New Analysis
          </button>
        </div>
      </div>
    );
  }

  // Parse roadmap data structure
  const roadmapObj = data.learningRoadmap || {};
  const roadmapSteps = roadmapObj.steps || (Array.isArray(roadmapObj) ? roadmapObj : []);
  const roadmapMessage = roadmapObj.summary || roadmapObj.message || '';
  const source = roadmapObj.source || 'fallback';
  const skillPriorities = roadmapObj.skillPriorities || [];
  const recommendations = Array.isArray(data.recommendations) ? data.recommendations : [];

  return (
    <div className="space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-lux-border">
        <button
          type="button"
          onClick={onBackToHistory}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-lux-secondary bg-lux-surface hover:text-lux-text hover:bg-lux-bg border border-lux-border rounded-md transition-all shadow-2xs w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to History
        </button>

        <button
          type="button"
          onClick={onNewAnalysis}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md text-white bg-lux-cobalt hover:bg-lux-cobalt-hover active:bg-lux-cobalt-active transition-colors shadow-2xs w-fit"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          New Analysis
        </button>
      </div>

      {/* Overview Score Cards */}
      <ScoreCard
        matchScore={data.matchScore}
        matchedCount={(data.matchedSkills || data.matchingSkills || []).length}
        missingCount={(data.missingSkills || []).length}
        jobTitle={data.jobTitle || 'Target Role'}
        resumeFileName={data.resumeFileName || 'Resume'}
        createdAt={data.createdAt}
      />

      {/* Collapsible Job Description Context */}
      {data.jobDescription && (
        <div className="bg-lux-surface rounded-card border border-lux-border p-4 shadow-card">
          <button
            type="button"
            onClick={() => setShowFullJobDesc(!showFullJobDesc)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-lux-bg text-lux-secondary flex items-center justify-center font-bold text-xs border border-lux-border">
                <Briefcase className="w-3.5 h-3.5 text-lux-muted" />
              </span>
              <div>
                <span className="text-xs font-semibold text-lux-text block">
                  Job Description Reference
                </span>
                <span className="text-2xs text-lux-muted">Specified role requirements</span>
              </div>
            </div>
            <span className="text-2xs font-medium text-lux-cobalt hover:underline flex items-center gap-1">
              {showFullJobDesc ? 'Collapse' : 'Expand full text'}
              {showFullJobDesc ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </span>
          </button>

          {showFullJobDesc && (
            <div className="mt-3 pt-3 border-t border-lux-border-subtle text-xs text-lux-secondary leading-relaxed max-h-60 overflow-y-auto whitespace-pre-line bg-lux-bg p-3.5 rounded-md border border-lux-border font-mono text-2xs">
              {data.jobDescription}
            </div>
          )}
        </div>
      )}

      {/* Skill Breakdown */}
      <section className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-lux-secondary">Skill Competencies</h2>
        <SkillList
          matchingSkills={data.matchedSkills || data.matchingSkills || []}
          missingSkills={data.missingSkills || []}
          additionalSkills={data.additionalSkills || []}
        />
      </section>

      {/* AI Career Insights */}
      <section className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-lux-secondary">Career Guidance</h2>
        <CareerInsights
          summary={roadmapObj.summary || `Analysis completed with ${data.matchScore}% overall skill match.`}
          skillPriorities={skillPriorities}
          recommendations={recommendations}
          source={source}
        />
      </section>

      {/* Learning Roadmap Timeline */}
      <section className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-lux-secondary">Recommended Roadmap</h2>
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
