import React, { Suspense, lazy, Component } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import DashboardLayout from './layouts/DashboardLayout';

// ── Error Boundary ────────────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-xl mx-auto my-12 bg-white rounded-3xl border border-red-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-slate-900">ஏதோ தவறு நடந்துள்ளது / Something went wrong</h2>
          <p className="text-xs text-slate-500 font-medium">
            {this.state.error?.message || 'Unexpected rendering error.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition"
          >
            மீண்டும் ஏற்றவும் / Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Skeleton fallback ─────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-cream">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-field-100 animate-pulse flex items-center justify-center">
          <div className="w-5 h-5 bg-field-400 rounded-lg animate-pulse" />
        </div>
        <div className="h-2 w-24 bg-slate-200 rounded-full skeleton-shimmer" />
      </div>
    </div>
  );
}

// ── Lazy-loaded pages ─────────────────────────────────────────────────────────
// Marketing
const Landing    = lazy(() => import('./pages/marketing/Landing'));
const Login      = lazy(() => import('./pages/marketing/Login'));
const Signup     = lazy(() => import('./pages/marketing/Signup'));

// Dashboard
const DashHome   = lazy(() => import('./pages/dashboard/DashboardHome'));
const Farms      = lazy(() => import('./pages/dashboard/Farms'));
const Marketplace = lazy(() => import('./pages/dashboard/Marketplace'));
const Calendar   = lazy(() => import('./pages/dashboard/CropCalendar'));
const Weather    = lazy(() => import('./pages/dashboard/Weather'));
const Soil       = lazy(() => import('./pages/dashboard/SoilIrrigation'));
const Alerts     = lazy(() => import('./pages/dashboard/PestAlerts'));
const Market     = lazy(() => import('./pages/dashboard/MarketPrices'));
const Schemes    = lazy(() => import('./pages/dashboard/GovernmentSchemes'));
const ReportsP   = lazy(() => import('./pages/dashboard/Reports'));
const Community  = lazy(() => import('./pages/dashboard/Community'));

// Existing pages (re-skinned)
const Scanner    = lazy(() => import('./pages/Scanner'));
const Voice      = lazy(() => import('./pages/Voice'));
const History    = lazy(() => import('./pages/History'));

// ── Auth Guard ────────────────────────────────────────────────────────────────
function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function RedirectIfAuth({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

// ── Dashboard wrapper ─────────────────────────────────────────────────────────
function DashRoute({ element }) {
  return (
    <RequireAuth>
      <DashboardLayout>
        <ErrorBoundary>
          <Suspense fallback={
            <div className="animate-pulse space-y-4 max-w-5xl mx-auto pt-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-28 bg-slate-100/80 rounded-3xl skeleton-shimmer" />
              ))}
            </div>
          }>
            {element}
          </Suspense>
        </ErrorBoundary>
      </DashboardLayout>
    </RequireAuth>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public marketing pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login"  element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
        <Route path="/signup" element={<RedirectIfAuth><Signup /></RedirectIfAuth>} />

        {/* Authenticated dashboard */}
        <Route path="/dashboard"             element={<DashRoute element={<DashHome />} />} />
        <Route path="/dashboard/farms"       element={<DashRoute element={<Farms />} />} />
        <Route path="/dashboard/marketplace" element={<DashRoute element={<Marketplace />} />} />
        <Route path="/dashboard/calendar"    element={<DashRoute element={<Calendar />} />} />
        <Route path="/dashboard/weather"   element={<DashRoute element={<Weather />} />} />
        <Route path="/dashboard/soil"      element={<DashRoute element={<Soil />} />} />
        <Route path="/dashboard/alerts"    element={<DashRoute element={<Alerts />} />} />
        <Route path="/dashboard/schemes"   element={<DashRoute element={<Schemes />} />} />
        <Route path="/dashboard/market"    element={<DashRoute element={<Market />} />} />
        <Route path="/dashboard/reports"   element={<DashRoute element={<ReportsP />} />} />
        <Route path="/dashboard/community" element={<DashRoute element={<Community />} />} />

        {/* Existing tool pages inside dashboard */}
        <Route path="/dashboard/scanner"   element={<DashRoute element={<Scanner selectedCrop="" setSelectedCrop={() => {}} setDiagnosisResult={() => {}} setActivePage={() => {}} onSaveHistory={() => {}} />} />} />
        <Route path="/dashboard/voice"     element={<DashRoute element={<Voice />} />} />
        <Route path="/dashboard/history"   element={<DashRoute element={<History historyItems={[]} setActivePage={() => {}} />} />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}