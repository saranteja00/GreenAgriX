import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  LayoutDashboard, Map, CalendarDays, CloudSun, Droplets,
  Bug, TrendingUp, BarChart3, Users, Bell, Settings,
  ChevronRight, ChevronDown, LogOut, UserCircle,
  Leaf, Menu, X, Scan, Mic, History, Globe, Store, Landmark
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, activeFarm, logout, switchFarm } = useAuth();
  const { language, toggleLanguage, t, isTamil } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [farmDropOpen, setFarmDropOpen] = useState(false);
  const [userDropOpen, setUserDropOpen] = useState(false);

  const unreadAlerts = 2;

  const NAV_ITEMS = [
    { to: '/dashboard',             label: t('nav_home', 'Home'),                     icon: LayoutDashboard, end: true },
    { to: '/dashboard/scanner',     label: t('nav_scanner', 'Scan Crop'),             icon: Scan                       },
    { to: '/dashboard/voice',       label: t('nav_voice', 'Voice AI'),                icon: Mic                        },
    { to: '/dashboard/farms',       label: t('nav_farms', 'My Farms'),                icon: Map                        },
    { to: '/dashboard/marketplace', label: t('nav_marketplace', 'Marketplace'),       icon: Store                      },
    { to: '/dashboard/market',      label: t('nav_market', 'Market Analysis'),        icon: TrendingUp                 },
    { to: '/dashboard/weather',     label: t('nav_weather', 'Weather & Advisory'),    icon: CloudSun                   },
    { to: '/dashboard/soil',        label: t('nav_soil', 'Soil & Water'),             icon: Droplets                   },
    { to: '/dashboard/alerts',      label: t('nav_alerts', 'Pest Alerts'),            icon: Bug                        },
    { to: '/dashboard/schemes',     label: t('nav_schemes', 'Govt Schemes'),          icon: Landmark                   },
    { to: '/dashboard/reports',     label: t('nav_reports', 'Reports'),               icon: BarChart3                  },
    { to: '/dashboard/history',     label: t('nav_history', 'Scan History'),          icon: History                    },
  ];

  const BOTTOM_TABS = [
    { to: '/dashboard',          label: t('nav_home', 'Home'),       icon: LayoutDashboard, end: true },
    { to: '/dashboard/farms',    label: t('nav_farms', 'Farms'),     icon: Map                        },
    { to: '/dashboard/calendar', label: t('nav_calendar', 'Calendar'),icon: CalendarDays             },
    { to: '/dashboard/market',   label: t('nav_market', 'Market'),   icon: TrendingUp                 },
    { to: '/dashboard/alerts',   label: t('nav_alerts', 'Alerts'),   icon: Bug                        },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const pageTitle = (() => {
    const found = NAV_ITEMS.find(n => n.end ? location.pathname === n.to : location.pathname.startsWith(n.to));
    return found?.label || (isTamil ? 'முகப்பு பலகை' : 'Dashboard');
  })();

  return (
    <div className="flex h-screen bg-cream overflow-hidden">
      {/* ── Desktop Sidebar ───────────────────────────────── */}
      <aside
        className={`hidden lg:flex flex-col sidebar-gradient sidebar-scroll overflow-y-auto transition-all duration-300 shrink-0
          ${collapsed ? 'w-[68px]' : 'w-[240px]'}`}
      >
        {/* Brand */}
        <div className={`flex items-center h-16 border-b border-white/10 shrink-0 px-4 ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-8 h-8 bg-harvest-400 rounded-xl flex items-center justify-center shrink-0 shadow-md">
            <Leaf size={16} className="text-white" />
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-white text-lg leading-none">
              Green<span className="text-harvest-300">AgriX</span>
            </span>
          )}
        </div>

        {/* Farm selector */}
        {!collapsed && (
          <div className="px-3 py-3 border-b border-white/10">
            <button
              onClick={() => setFarmDropOpen(!farmDropOpen)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition text-white text-sm"
            >
              <div className="w-6 h-6 bg-harvest-400/80 rounded-lg flex items-center justify-center">
                <Leaf size={12} className="text-white" />
              </div>
              <span className="flex-1 text-left truncate font-medium">{activeFarm?.name || t('my_farm', 'My Farm')}</span>
              <ChevronDown size={14} className={`text-white/60 transition ${farmDropOpen ? 'rotate-180' : ''}`} />
            </button>
            {farmDropOpen && (
              <div className="mt-1 bg-white/10 rounded-xl overflow-hidden shadow-lg animate-fade-in">
                {user?.farms?.map(f => (
                  <button
                    key={f.id}
                    onClick={() => { switchFarm(f.id); setFarmDropOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-sm transition ${f.id === user?.activeFarm ? 'text-white bg-white/10 font-bold' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                  >
                    {f.name}
                    <span className="text-white/40 ml-1 text-xs">· {f.acres} ac</span>
                  </button>
                ))}
                <button
                  onClick={() => { navigate('/dashboard/farms'); setFarmDropOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs text-signal-300 hover:text-signal-200 transition border-t border-white/10 font-bold"
                >
                  {t('nav_add_farm', '+ Add New Farm')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group
                ${isActive
                  ? 'bg-white/15 text-white shadow-sm font-bold'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
                }
                ${collapsed ? 'justify-center px-0' : ''}`
              }
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle + user */}
        <div className="px-2 py-3 border-t border-white/10 space-y-1">
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/60 hover:bg-white/10 hover:text-white text-sm transition"
            >
              <LogOut size={16} />
              <span>{t('nav_sign_out', 'Sign Out')}</span>
            </button>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-white/40 hover:bg-white/10 hover:text-white text-xs transition"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronRight size={14} className={`transition ${collapsed ? '' : 'rotate-180'}`} />
            {!collapsed && (isTamil ? 'சுருக்கு' : 'Collapse')}
          </button>
        </div>
      </aside>

      {/* ── Mobile Sidebar Overlay ────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 sidebar-gradient flex flex-col sidebar-scroll overflow-y-auto">
            <div className="flex items-center justify-between h-16 border-b border-white/10 px-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-harvest-400 rounded-xl flex items-center justify-center">
                  <Leaf size={16} className="text-white" />
                </div>
                <span className="font-display font-bold text-white text-lg">Green<span className="text-harvest-300">AgriX</span></span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-white/60 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 px-2 py-3 space-y-0.5">
              {NAV_ITEMS.map(item => (
                <NavLink
                  key={item.to} to={item.to} end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all
                    ${isActive ? 'bg-white/15 text-white font-bold' : 'text-white/60 hover:bg-white/10 hover:text-white'}`
                  }
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
            <div className="px-2 py-3 border-t border-white/10">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/60 hover:bg-white/10 hover:text-white text-sm transition">
                <LogOut size={16} /><span>{t('nav_sign_out', 'Sign Out')}</span>
              </button>
            </div>
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* ── Main Content Area ─────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-6 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-charcoal-500 hover:bg-slate-100 transition"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold text-charcoal-900 font-display">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Language Toggle in Header */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-xs font-bold text-field-700 bg-field-50 hover:bg-field-100 px-3.5 py-2 rounded-2xl border border-field-200 shadow-sm transition-all focus-ring"
              title="Switch Language / மொழியை மாற்ற"
            >
              <Globe size={14} className="text-field-600" />
              <span>{isTamil ? 'தமிழ் | EN' : 'EN | தமிழ்'}</span>
            </button>

            {/* Alerts bell */}
            <button
              onClick={() => navigate('/dashboard/alerts')}
              className="relative p-2 rounded-xl text-charcoal-500 hover:bg-slate-100 transition focus-ring"
              aria-label={`${unreadAlerts} unread alerts`}
            >
              <Bell size={20} />
              {unreadAlerts > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadAlerts}
                </span>
              )}
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserDropOpen(!userDropOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 transition focus-ring"
              >
                <div className="w-7 h-7 rounded-full bg-field-100 text-field-700 flex items-center justify-center text-sm font-bold">
                  {user?.name?.[0] || 'U'}
                </div>
                <span className="hidden sm:block text-sm font-medium text-charcoal-700 max-w-[120px] truncate">{user?.name}</span>
                <ChevronDown size={14} className="text-charcoal-400 hidden sm:block" />
              </button>
              {userDropOpen && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-2xl shadow-card-hover border border-slate-100 py-1 z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="font-semibold text-charcoal-800 text-sm">{user?.name}</div>
                    <div className="text-xs text-charcoal-500">{user?.email}</div>
                  </div>
                  <button onClick={() => { navigate('/dashboard/settings'); setUserDropOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal-600 hover:bg-slate-50 transition">
                    <Settings size={15} />{t('nav_settings', 'Settings')}
                  </button>
                  <button onClick={() => { handleLogout(); setUserDropOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition">
                    <LogOut size={15} />{t('nav_sign_out', 'Sign Out')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 pb-24 lg:pb-6">
          {children || <Outlet />}
        </main>

        {/* ── Mobile Bottom Tab Bar ───────────────────────── */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 flex">
          {BOTTOM_TABS.map(tab => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-semibold transition
                ${isActive ? 'text-field-600 font-bold' : 'text-charcoal-400 hover:text-charcoal-600'}`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-xl transition ${isActive ? 'bg-field-50' : ''}`}>
                    <tab.icon size={18} />
                  </div>
                  <span>{tab.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
