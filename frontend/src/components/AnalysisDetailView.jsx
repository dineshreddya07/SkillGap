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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <button
          type="button"
          onClick={onBackToHistory}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          ← Back to History
        </button>

        <button
          type="button"
          onClick={onNewAnalysis}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-2xs w-fit"
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
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <button
            type="button"
            onClick={() => setShowFullJobDesc(!showFullJobDesc)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Job Description Reference
              </span>
            </div>
            <span className="text-2xs font-semibold text-indigo-600 flex items-center gap-1">
              {showFullJobDesc ? 'Hide Details' : 'Show Details'}
              {showFullJobDesc ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </span>
          </button>

          {showFullJobDesc && (
            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-line bg-slate-50 p-3 rounded-xl">
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
