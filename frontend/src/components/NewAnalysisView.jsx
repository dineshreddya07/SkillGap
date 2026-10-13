import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Briefcase,
  Check,
  Target,
  XCircle,
  PlusCircle,
} from 'lucide-react';
import {
  uploadResume,
  extractResumeSkills,
  analyzeJobDescription,
  matchSkills,
  saveCompleteAnalysis,
} from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function NewAnalysisView({ onAnalysisComplete = () => {}, onOpenAuth = () => {} }) {
  const { isAuthenticated } = useAuth();

  // Resume upload state
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [resumeSkills, setResumeSkills] = useState([]);
  const [error, setError] = useState(null);

  // Job description state
  const [jobTitle, setJobTitle] = useState('Java Software Developer');
  const [jobDescription, setJobDescription] = useState(
    'We are looking for a Java Software Developer with experience in Spring Boot, REST APIs, SQL, PostgreSQL, Git and Docker. Knowledge of React and AWS is a plus.'
  );
  const [isAnalyzingJob, setIsAnalyzingJob] = useState(false);
  const [requiredSkills, setRequiredSkills] = useState(null);
  const [jobError, setJobError] = useState(null);

  // Match state
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  // AI save state
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const fileInputRef = useRef(null);

  // File selection
  const handleFileSelection = (selectedFile) => {
    setError(null);
    if (!selectedFile) return;

    const allowed = ['.pdf', '.docx', '.txt'];
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();

    if (!allowed.includes(ext)) {
      setError(`Unsupported format (${ext}). Please upload a PDF, DOCX, or TXT file.`);
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit.');
      return;
    }

    setFile(selectedFile);
    processUpload(selectedFile);
  };

  const processUpload = async (fileToUpload) => {
    setIsUploading(true);
    setError(null);
    setUploadResult(null);
    setResumeSkills([]);
    setMatchResult(null);

    try {
      const response = await uploadResume(fileToUpload);
      if (response && response.success) {
        setUploadResult(response.data);
        const skillsRes = await extractResumeSkills(response.data.extractedText);
        if (skillsRes && skillsRes.success) {
          setResumeSkills(skillsRes.data.resumeSkills);
        }
      } else {
        setError(response.message || 'Failed to process resume');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Network error occurred during upload';
      setError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  // Job description submission
  const handleAnalyzeJob = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setJobError('Please enter a job description to analyze.');
      return;
    }

    setIsAnalyzingJob(true);
    setJobError(null);
    setMatchResult(null);

    try {
      const res = await analyzeJobDescription(jobTitle, jobDescription);
      if (res && res.success) {
        setRequiredSkills(res.data.requiredSkills);
      } else {
        setJobError(res.message || 'Failed to analyze job description.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error analyzing job description';
      setJobError(msg);
    } finally {
      setIsAnalyzingJob(false);
    }
  };

  // Calculate Match
  const handleCalculateMatch = async () => {
    if (!requiredSkills) return;
    setIsMatching(true);

    try {
      const res = await matchSkills({ jobTitle, resumeSkills, requiredSkills });
      if (res && res.success) setMatchResult(res.data);
    } catch (err) {
      console.error('Matching calculation failed:', err);
    } finally {
      setIsMatching(false);
    }
  };

  // Run AI Career Guidance and Save
  const handleSaveAndAnalyze = async () => {
    if (!matchResult || !jobDescription) return;

    if (!isAuthenticated) {
      setSaveError('Please sign in or create an account to save your evaluation.');
      onOpenAuth();
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const res = await saveCompleteAnalysis({
        resumeSkills,
        requiredSkills,
        jobTitle,
        jobDescription,
        resumeFileName: uploadResult?.originalFilename || null,
      });

      if (res && res.success) {
        onAnalysisComplete(res.data);
      } else {
        setSaveError(res.message || 'Failed to complete analysis.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error analyzing career roadmap.';
      setSaveError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Step Title Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-lux-cobalt-subtle text-lux-cobalt border border-lux-cobalt-border">
          <Sparkles className="w-2.5 h-2.5 text-lux-cobalt" />
          Evaluation Workflow
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-lux-text">
          New Skill Gap Evaluation
        </h1>
        <p className="text-xs text-lux-secondary">
          Upload candidate resume, provide role requirements, and run deterministic skill matching with AI-guided next steps.
        </p>
      </div>

      {/* SECTION 1: RESUME UPLOAD */}
      <section className="bg-lux-surface rounded-card border border-lux-border p-5 sm:p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-lux-border-subtle">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-md bg-lux-cobalt-subtle text-lux-cobalt font-bold text-xs flex items-center justify-center border border-lux-cobalt-border">
              1
            </span>
            <div>
              <h2 className="text-xs font-semibold text-lux-text">Candidate Resume</h2>
              <p className="text-2xs text-lux-muted">Supported formats: PDF, DOCX, TXT (Maximum 5MB)</p>
            </div>
          </div>
          {uploadResult && (
            <span className="text-2xs px-2.5 py-0.5 rounded-full bg-lux-success-subtle text-lux-success font-semibold border border-lux-success-border flex items-center gap-1">
              <Check className="w-3 h-3" /> Text Extracted
            </span>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.docx,.txt"
          onChange={(e) => { if (e.target.files?.[0]) handleFileSelection(e.target.files[0]); }}
        />

        {!uploadResult ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files?.[0]) handleFileSelection(e.dataTransfer.files[0]);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed rounded-lg p-7 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-lux-cobalt bg-lux-cobalt-subtle/50'
                : 'border-lux-border hover:border-lux-cobalt-border hover:bg-lux-bg'
            }`}
          >
            <div className="w-10 h-10 mx-auto mb-2.5 rounded-lg bg-lux-cobalt-subtle text-lux-cobalt flex items-center justify-center border border-lux-cobalt-border">
              {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
            </div>
            <p className="text-xs font-semibold text-lux-text mb-0.5">
              {isUploading ? 'Extracting readable resume text...' : 'Click to select or drag & drop resume file'}
            </p>
            <p className="text-2xs text-lux-muted mb-3">PDF, DOCX, or TXT up to 5MB</p>
            <button
              type="button"
              disabled={isUploading}
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              className="inline-flex items-center px-3.5 py-1.5 text-xs font-medium rounded-md text-white bg-lux-cobalt hover:bg-lux-cobalt-hover active:bg-lux-cobalt-active transition-colors shadow-2xs"
            >
              Browse Local Files
            </button>
          </div>
        ) : (
          <div className="p-3.5 rounded-lg border border-lux-border bg-lux-bg flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-md bg-lux-surface border border-lux-border flex items-center justify-center flex-shrink-0 text-lux-cobalt">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-lux-text truncate">{uploadResult.originalFilename}</p>
                <p className="text-2xs text-lux-muted">
                  {uploadResult.detectedFileType} &middot; <span className="tabular-nums">{uploadResult.textLength.toLocaleString()}</span> chars &middot; {resumeSkills.length} skills found
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-2xs font-medium text-lux-cobalt hover:underline flex-shrink-0"
            >
              Replace File
            </button>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-md bg-lux-error-subtle border border-lux-error-border text-lux-error flex items-start gap-2.5 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-lux-error" />
            <div>
              <p className="font-semibold text-2xs uppercase tracking-wider">Upload Error</p>
              <p className="text-xs">{error}</p>
            </div>
          </div>
        )}

        {uploadResult && (
          <div className="space-y-2 pt-1">
            <span className="text-2xs font-semibold uppercase tracking-wider text-lux-secondary block">
              Extracted Resume Skills ({resumeSkills.length})
            </span>
            {resumeSkills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 p-3 bg-lux-surface border border-lux-border rounded-lg">
                {resumeSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-lux-bg text-lux-text border border-lux-border"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-lux-success" />
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-2xs text-lux-muted italic">No standardized technical skills identified in file text.</p>
            )}
          </div>
        )}
      </section>

      {/* SECTION 2: JOB DESCRIPTION */}
      <section className="bg-lux-surface rounded-card border border-lux-border p-5 sm:p-6 shadow-card space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-lux-border-subtle">
          <span className="w-6 h-6 rounded-md bg-lux-cobalt-subtle text-lux-cobalt font-bold text-xs flex items-center justify-center border border-lux-cobalt-border">
            2
          </span>
          <div>
            <h2 className="text-xs font-semibold text-lux-text">Target Job Specification</h2>
            <p className="text-2xs text-lux-muted">Enter job title and description to extract role requirements</p>
          </div>
        </div>

        <form onSubmit={handleAnalyzeJob} className="space-y-3.5">
          <div>
            <label htmlFor="jobTitle" className="block text-2xs font-semibold text-lux-secondary uppercase tracking-wider mb-1">
              Target Job Title
            </label>
            <input
              id="jobTitle"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Java Software Engineer"
              className="w-full text-xs px-3 py-2 rounded-md border border-lux-border bg-lux-surface text-lux-text focus:outline-none focus:border-lux-cobalt transition-colors"
            />
          </div>

          <div>
            <label htmlFor="jobDesc" className="block text-2xs font-semibold text-lux-secondary uppercase tracking-wider mb-1">
              Job Description
            </label>
            <textarea
              id="jobDesc"
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description or technical requirements here..."
              className="w-full text-xs px-3 py-2 rounded-md border border-lux-border bg-lux-surface text-lux-text focus:outline-none focus:border-lux-cobalt transition-colors leading-relaxed"
            />
          </div>

          {jobError && (
            <div className="p-2.5 rounded-md bg-lux-error-subtle border border-lux-error-border text-lux-error text-2xs flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{jobError}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isAnalyzingJob || !jobDescription.trim()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md text-white bg-lux-cobalt hover:bg-lux-cobalt-hover active:bg-lux-cobalt-active transition-colors shadow-2xs disabled:opacity-50"
            >
              {isAnalyzingJob ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Extracting Requirements...
                </>
              ) : (
                <>
                  <Briefcase className="w-3.5 h-3.5" />
                  Extract Role Requirements
                </>
              )}
            </button>
          </div>
        </form>

        {requiredSkills && (
          <div className="space-y-2 pt-2 border-t border-lux-border-subtle">
            <span className="text-2xs font-semibold uppercase tracking-wider text-lux-secondary block">
              Extracted Role Skills ({requiredSkills.length})
            </span>
            <div className="flex flex-wrap gap-1.5 p-3 bg-lux-bg border border-lux-border rounded-lg">
              {requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-lux-surface text-lux-text border border-lux-border"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* SECTION 3: MATCHING TRIGGER */}
      {requiredSkills && (
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={handleCalculateMatch}
            disabled={isMatching}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-semibold text-white bg-lux-cobalt hover:bg-lux-cobalt-hover active:bg-lux-cobalt-active transition-all shadow-2xs disabled:opacity-50"
          >
            {isMatching ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Evaluating Competencies...
              </>
            ) : (
              <>
                <Target className="w-3.5 h-3.5" />
                Compute Match Score
              </>
            )}
          </button>
        </div>
      )}

      {/* SECTION 4: MATCH BREAKDOWN & AI GENERATE BUTTON */}
      {matchResult && (
        <section className="bg-lux-surface rounded-card border border-lux-border p-5 sm:p-6 shadow-card space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-lux-border-subtle pb-4">
            <div>
              <span className="text-2xs font-semibold text-lux-cobalt uppercase tracking-wider">Evaluation Result</span>
              <h2 className="text-sm font-semibold text-lux-text mt-0.5">{matchResult.jobTitle}</h2>
              <p className="text-2xs text-lux-secondary mt-0.5">{matchResult.explanation}</p>
            </div>

            <div className="flex items-center gap-3 bg-lux-bg px-3.5 py-2 rounded-lg border border-lux-border">
              <div className="text-right">
                <span className="tabular-nums text-lg font-bold text-lux-text block">
                  {matchResult.matchScore}%
                </span>
                <span className="text-2xs text-lux-secondary">
                  {matchResult.totalMatched} of {matchResult.totalRequired} required
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-lg bg-lux-bg border border-lux-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-semibold uppercase tracking-wider text-lux-secondary flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lux-success" /> Matching Competencies
                </span>
                <span className="tabular-nums text-2xs font-semibold px-2 py-0.2 rounded-full bg-lux-success-subtle text-lux-success border border-lux-success-border">
                  {matchResult.totalMatched}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {matchResult.matchedSkills.map((s) => (
                  <span key={s} className="px-2 py-0.5 text-2xs rounded font-medium bg-lux-surface text-lux-text border border-lux-border">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-lux-bg border border-lux-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-semibold uppercase tracking-wider text-lux-secondary flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-lux-warning" /> Skill Gaps
                </span>
                <span className="tabular-nums text-2xs font-semibold px-2 py-0.2 rounded-full bg-lux-warning-subtle text-lux-warning border border-lux-warning-border">
                  {matchResult.totalMissing}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {matchResult.missingSkills.map((s) => (
                  <span key={s} className="px-2 py-0.5 text-2xs rounded font-medium bg-lux-surface text-lux-text border border-lux-border">
                    ✗ {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Trigger Full Career Analysis & Save */}
          <div className="border-t border-lux-border-subtle pt-4 flex flex-col items-center gap-2.5">
            <button
              type="button"
              onClick={handleSaveAndAnalyze}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md text-xs font-semibold text-white bg-lux-cobalt hover:bg-lux-cobalt-hover active:bg-lux-cobalt-active transition-all shadow-2xs disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating Career Insights &amp; Roadmap...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Save &amp; Generate Career Roadmap
                </>
              )}
            </button>
            {saveError && (
              <p className="text-2xs text-lux-error flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" />
                {saveError}
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
