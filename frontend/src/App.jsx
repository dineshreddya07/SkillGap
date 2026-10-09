import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Database,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';
import { checkHealth, fetchHistory, fetchAnalysisById } from './services/api';
import DashboardView from './components/DashboardView';
import NewAnalysisView from './components/NewAnalysisView';
import HistoryView from './components/HistoryView';
import AnalysisDetailView from './components/AnalysisDetailView';

export default function App() {
  // Navigation tabs: 'dashboard' | 'new' | 'history' | 'detail'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAnalysisId, setSelectedAnalysisId] = useState(null);

  // Data states
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  // System Health
  const [health, setHealth] = useState({ backend: null, database: null });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initial load
  useEffect(() => {
    async function init() {
      // 1. Health check
      try {
        const res = await checkHealth();
        if (res && res.success) setHealth(res.data);
      } catch (err) {
        console.error('Health check failed:', err);
      }

      // 2. Load History & initial current analysis
      loadHistoryList(true);
    }
    init();
  }, []);

  const loadHistoryList = async (autoSetLatest = false) => {
    setIsLoadingHistory(true);
    setHistoryError(null);
    try {
      const res = await fetchHistory();
      if (res && res.success) {
        const list = res.data.analyses || [];
        setHistory(list);

        // If no active current analysis and history has items, load latest into dashboard
        if (autoSetLatest && list.length > 0) {
          try {
            const detailRes = await fetchAnalysisById(list[0].id);
            if (detailRes && detailRes.success) {
              setCurrentAnalysis(detailRes.data);
            }
          } catch {
            // Ignore failure, dashboard can display summary
          }
        }
      }
    } catch {
      setHistoryError('Could not load analysis history.');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Called when a new analysis completes in NewAnalysisView
  const handleAnalysisComplete = (newResult) => {
    setCurrentAnalysis(newResult);
    setActiveTab('dashboard');
    // Refresh history in the background
    loadHistoryList(false);
  };

  // Called when user clicks "View Analysis" from History
  const handleSelectAnalysis = (id) => {
    setSelectedAnalysisId(id);
    setActiveTab('detail');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* ── Top Navigation Header ── */}
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-base shadow-sm ring-1 ring-indigo-500/20 group-hover:scale-105 transition-transform">
              SG
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900">SkillGap</span>
                <span className="inline-flex items-center gap-1 text-2xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                  <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
                  AI-Powered
                </span>
              </div>
              <p className="text-2xs text-slate-500 hidden sm:block font-medium">Career Intelligence &amp; Skill Gap Platform</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('new')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'new'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              New Analysis
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'history' || activeTab === 'detail'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              History
              {history.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-2xs bg-slate-200 text-slate-700 font-bold">
                  {history.length}
                </span>
              )}
            </button>
          </nav>

          {/* System Health Badges & Mobile Menu Toggle */}
          <div className="flex items-center gap-2.5">
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-2xs text-slate-600">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    health.backend === 'Connected' ? 'bg-emerald-500 ring-2 ring-emerald-100' : 'bg-amber-500'
                  }`}
                />
                <span className="font-semibold">API</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-2xs text-slate-600">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    health.database === 'Connected' ? 'bg-emerald-500 ring-2 ring-emerald-100' : 'bg-amber-500'
                  }`}
                />
                <Database className="w-3 h-3 text-slate-400" />
                <span className="font-semibold">Neon DB</span>
              </div>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1.5 shadow-md">
            <button
              type="button"
              onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${
                activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('new'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${
                activeTab === 'new' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              New Analysis
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('history'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${
                activeTab === 'history' || activeTab === 'detail' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'
              }`}
            >
              <History className="w-4 h-4" />
              History ({history.length})
            </button>
          </div>
        )}
      </header>

      {/* ── Main View Content Area ── */}
      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-10 flex-1 w-full">
        {activeTab === 'dashboard' && (
          <DashboardView
            currentAnalysis={currentAnalysis}
            onNewAnalysis={() => setActiveTab('new')}
            onViewHistory={() => setActiveTab('history')}
          />
        )}

        {activeTab === 'new' && (
          <NewAnalysisView
            onAnalysisComplete={handleAnalysisComplete}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            history={history}
            isLoading={isLoadingHistory}
            error={historyError}
            onRefresh={() => loadHistoryList(false)}
            onSelectAnalysis={handleSelectAnalysis}
            onNewAnalysis={() => setActiveTab('new')}
          />
        )}

        {activeTab === 'detail' && (
          <AnalysisDetailView
            analysisId={selectedAnalysisId}
            onBackToHistory={() => setActiveTab('history')}
            onNewAnalysis={() => setActiveTab('new')}
          />
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-2xs text-slate-400">
        <p>SkillGap Dashboard · AI-Powered Career Skill Analyzer</p>
        <p className="mt-1">Built with React, Express, Prisma &amp; Neon PostgreSQL</p>
      </footer>
    </div>
  );
}
