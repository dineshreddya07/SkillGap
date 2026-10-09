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

export default function NewAnalysisView({ onAnalysisComplete = () => {} }) {
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
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          Skill Gap Analysis Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Create a New SkillGap Analysis
        </h1>
        <p className="mt-1.5 text-slate-600 text-xs sm:text-sm">
          Upload your resume, add the job description, and get instant skill match percentages with an AI-guided learning roadmap.
        </p>
      </div>

      {/* SECTION 1: RESUME UPLOAD */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all duration-200 p-6 sm:p-7">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-100 shadow-2xs">
              1
            </span>
            <h2 className="text-base font-bold text-slate-900">Upload Candidate Resume</h2>
          </div>
          {uploadResult && (
            <span className="text-2xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
              <Check className="w-3.5 h-3.5" /> Resume Ready
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

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files?.[0]) handleFileSelection(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-600 bg-indigo-50/50'
              : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/60'
          }`}
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/60 shadow-2xs">
            {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
          </div>
          <p className="text-sm font-semibold text-slate-900 mb-0.5">
            {isUploading ? 'Extracting readable resume text...' : 'Click to upload or drag & drop resume'}
          </p>
          <p className="text-xs text-slate-500 mb-3">Supported formats: PDF, DOCX, TXT (Max 5MB)</p>
          <button
            type="button"
            disabled={isUploading}
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm transition-colors"
          >
            Choose Resume
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
            <div>
              <p className="font-semibold text-xs sm:text-sm">Upload Error</p>
              <p className="mt-0.5 text-red-600 text-xs">{error}</p>
            </div>
          </div>
        )}

        {uploadResult && (
          <div className="mt-5 space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
              <div>
                <span className="font-semibold text-slate-800">{uploadResult.originalFilename}</span>
                <span className="text-slate-400 mx-1.5">•</span>
                <span>{uploadResult.detectedFileType}</span>
                <span className="text-slate-400 mx-1.5">•</span>
                <span>{uploadResult.textLength.toLocaleString()} characters</span>
              </div>
              <span className="text-emerald-700 font-semibold">Text parsed successfully</span>
            </div>

            <div>
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Detected Resume Skills ({resumeSkills.length})
              </span>
              {resumeSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2 p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl">
                  {resumeSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No technical skills detected in uploaded resume.</p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* SECTION 2: JOB DESCRIPTION */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all duration-200 p-6 sm:p-7">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-100 shadow-2xs">
            2
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900">Add Target Job Description</h2>
            <p className="text-xs text-slate-500">Provide the requirements for the job you are targeting</p>
          </div>
        </div>

        <form onSubmit={handleAnalyzeJob} className="space-y-4">
          <div>
            <label htmlFor="jobTitle" className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Target Job Title
            </label>
            <input
              id="jobTitle"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Java Software Developer"
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors shadow-2xs"
            />
          </div>

          <div>
            <label htmlFor="jobDesc" className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Job Description
            </label>
            <textarea
              id="jobDesc"
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors shadow-2xs"
            />
          </div>

          {jobError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{jobError}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isAnalyzingJob || !jobDescription.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm transition-colors disabled:opacity-50"
            >
              {isAnalyzingJob ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing Job...
                </>
              ) : (
                <>
                  <Briefcase className="w-4 h-4" />
                  Extract Job Skills
                </>
              )}
            </button>
          </div>
        </form>

        {requiredSkills && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Extracted Job Requirements ({requiredSkills.length})
            </span>
            <div className="flex flex-wrap gap-2 p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl">
              {requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-100/80 text-indigo-800 border border-indigo-200 shadow-2xs"
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
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={handleCalculateMatch}
            disabled={isMatching}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm hover:shadow-md transition-all"
          >
            {isMatching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Calculating Skill Match...
              </>
            ) : (
              <>
                <Target className="w-4 h-4" />
                Calculate Match Score
              </>
            )}
          </button>
        </div>
      )}

      {/* SECTION 4: MATCH BREAKDOWN & AI GENERATE BUTTON */}
      {matchResult && (
        <section className="bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all duration-200 p-6 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-2xs font-bold text-indigo-600 uppercase tracking-wider">Analysis Summary</span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">Match for {matchResult.jobTitle}</h2>
              <p className="text-xs text-slate-500 mt-1">{matchResult.explanation}</p>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div
                className={`w-14 h-14 rounded-full flex flex-col items-center justify-center font-extrabold text-base border-4 ${
                  matchResult.matchScore >= 70
                    ? 'border-emerald-500 text-emerald-700 bg-emerald-50'
                    : matchResult.matchScore >= 40
                    ? 'border-amber-500 text-amber-700 bg-amber-50'
                    : 'border-rose-500 text-rose-700 bg-rose-50'
                }`}
              >
                <span>{matchResult.matchScore}%</span>
              </div>
              <div>
                <span className="text-2xs font-bold text-slate-700 block uppercase tracking-wider">Score</span>
                <span className="text-xs font-semibold text-slate-600">
                  {matchResult.totalMatched} of {matchResult.totalRequired} matched
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Matching Skills
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                  {matchResult.totalMatched}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.matchedSkills.map((s) => (
                  <span key={s} className="px-2 py-0.5 text-xs rounded-md font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-amber-600" /> Missing Skills
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                  {matchResult.totalMissing}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.missingSkills.map((s) => (
                  <span key={s} className="px-2 py-0.5 text-xs rounded-md font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                    ✗ {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Trigger Full Career Analysis & Save */}
          <div className="border-t border-slate-100 pt-5 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={handleSaveAndAnalyze}
              disabled={isSaving}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing your skill gaps with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  Save &amp; Generate AI Career Guidance
                </>
              )}
            </button>
            {saveError && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {saveError}
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
