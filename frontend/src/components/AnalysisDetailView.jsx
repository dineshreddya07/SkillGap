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
    <div className="space-y-8">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <button
          type="button"
          onClick={onBackToHistory}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 hover:text-indigo-600 border border-slate-200 rounded-xl transition-all shadow-2xs w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to History
        </button>

        <button
          type="button"
          onClick={onNewAnalysis}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          + New Analysis
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
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card hover:shadow-card-hover transition-all duration-200">
          <button
            type="button"
            onClick={() => setShowFullJobDesc(!showFullJobDesc)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs border border-slate-200/80">
                <Briefcase className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Job Description Reference
                </span>
                <span className="text-2xs text-slate-400">Target role requirements and specifications</span>
              </div>
            </div>
            <span className="text-2xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100">
              {showFullJobDesc ? 'Hide Details' : 'View Full Text'}
              {showFullJobDesc ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </span>
          </button>

          {showFullJobDesc && (
            <div className="mt-3.5 pt-3.5 border-t border-slate-100 text-xs text-slate-600 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-line bg-slate-50/80 p-4 rounded-xl border border-slate-200/60 font-mono text-2xs">
              {data.jobDescription}
            </div>
          )}
        </div>
      )}

      {/* Skill Breakdown */}
      <SkillList
        matchingSkills={data.matchedSkills || data.matchingSkills || []}
        missingSkills={data.missingSkills || []}
        additionalSkills={data.additionalSkills || []}
      />

      {/* AI Career Insights */}
      <CareerInsights
        summary={roadmapObj.summary || `Analysis completed with ${data.matchScore}% overall skill match.`}
        skillPriorities={skillPriorities}
        recommendations={recommendations}
        source={source}
      />

      {/* Learning Roadmap Timeline */}
      <RoadmapTimeline
        roadmap={{
          message: roadmapMessage,
          steps: roadmapSteps,
        }}
      />
    </div>
  );
}
