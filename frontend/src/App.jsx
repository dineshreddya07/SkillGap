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
    <div className="min-h-screen bg-lux-bg text-lux-text flex flex-col font-sans selection:bg-lux-cobalt-subtle selection:text-lux-cobalt">
      {/* ── Top Navigation Bar: Linear / Stripe luxury standard ── */}
      <header className="border-b border-lux-border bg-lux-surface/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Brand Wordmark & Tag */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-lux-cobalt text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-2xs group-hover:bg-lux-cobalt-hover transition-colors">
              SG
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-sm tracking-tight text-lux-text">SkillGap</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-2xs font-medium px-2 py-0.5 rounded-full bg-lux-cobalt-subtle text-lux-cobalt border border-lux-cobalt-border">
                <Sparkles className="w-2.5 h-2.5 text-lux-cobalt" />
                Intelligence
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links — calm, confident segmented control */}
          <nav className="hidden md:flex items-center gap-0.5 bg-lux-bg p-1 rounded-lg border border-lux-border shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-lux-surface text-lux-text shadow-2xs font-semibold'
                  : 'text-lux-secondary hover:text-lux-text'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('new')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'new'
                  ? 'bg-lux-surface text-lux-text shadow-2xs font-semibold'
                  : 'text-lux-secondary hover:text-lux-text'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              New Analysis
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'history' || activeTab === 'detail'
                  ? 'bg-lux-surface text-lux-text shadow-2xs font-semibold'
                  : 'text-lux-secondary hover:text-lux-text'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              History
              {history.length > 0 && (
                <span className="tabular-nums px-1.5 py-0.2 rounded-full text-2xs bg-lux-border text-lux-secondary font-medium">
                  {history.length}
                </span>
              )}
            </button>
          </nav>

          {/* Right Actions: System Health & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 text-2xs font-medium text-lux-secondary">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-lux-surface border border-lux-border shadow-2xs">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    health.backend === 'Connected' ? 'bg-lux-success ring-2 ring-emerald-100' : 'bg-lux-warning'
                  }`}
                />
                <span className="text-lux-secondary">API</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-lux-surface border border-lux-border shadow-2xs">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    health.database === 'Connected' ? 'bg-lux-success ring-2 ring-emerald-100' : 'bg-lux-warning'
                  }`}
                />
                <Database className="w-3 h-3 text-lux-muted" />
                <span className="text-lux-secondary">Neon DB</span>
              </div>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-1.5 rounded-md text-lux-secondary hover:text-lux-text hover:bg-lux-border-subtle border border-lux-border transition-colors"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-lux-border bg-lux-surface px-4 py-3 space-y-1 shadow-dropdown">
            <button
              type="button"
              onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium ${
                activeTab === 'dashboard' ? 'bg-lux-cobalt-subtle text-lux-cobalt font-semibold' : 'text-lux-secondary hover:text-lux-text'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('new'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium ${
                activeTab === 'new' ? 'bg-lux-cobalt-subtle text-lux-cobalt font-semibold' : 'text-lux-secondary hover:text-lux-text'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              New Analysis
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('history'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium ${
                activeTab === 'history' || activeTab === 'detail' ? 'bg-lux-cobalt-subtle text-lux-cobalt font-semibold' : 'text-lux-secondary hover:text-lux-text'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <History className="w-4 h-4" />
                Analysis History
              </span>
              <span className="tabular-nums px-2 py-0.5 rounded-full text-2xs bg-lux-border text-lux-secondary">
                {history.length}
              </span>
            </button>
          </div>
        )}
      </header>

      {/* ── Main View Content Area ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1 w-full">
        {activeTab === 'dashboard' && (
          <DashboardView
            currentAnalysis={currentAnalysis}
            historyList={history}
            onNewAnalysis={() => setActiveTab('new')}
            onViewHistory={() => setActiveTab('history')}
            onSelectAnalysis={handleSelectAnalysis}
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
      <footer className="border-t border-lux-border bg-lux-surface py-6 text-center text-2xs text-lux-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium text-lux-secondary">
            SkillGap &middot; Precision Career &amp; Skill Gap Intelligence
          </p>
          <p className="text-lux-muted">
            Powered by Deterministic Extraction, Postgres &amp; AI Guidance
          </p>
        </div>
      </footer>
    </div>
  );
}
