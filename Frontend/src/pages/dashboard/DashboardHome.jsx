import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { MOCK_DASHBOARD as D } from '../../data/mockDashboard';
import { Card } from '../../components/ui/index';
import { 
  Bell, CloudSun, Camera, FlaskConical, Droplets, Store, 
  MapPin, AlertTriangle, ArrowRight, HeartPulse, Sprout,
  Calendar, Thermometer, Wind, X, CheckCircle2, ShieldAlert,
  ArrowUpRight, Clock, Globe
} from 'lucide-react';

// ─── High Priority Action Details Modal ───────────────────────────────────────
function HighPriorityActionModal({ onClose }) {
  const navigate = useNavigate();
  const { isTamil, t } = useLanguage();

  const [checklist, setChecklist] = useState([
    {
      id: 1,
      en: 'Clear primary field drainage channels and unblock tail-end outlets',
      ta: 'முதன்மை வடிகால் வாய்க்கால்களை தூர்வாரி, அடைப்புகளை உடனடியாக நீக்கவும்',
      done: false
    },
    {
      id: 2,
      en: 'Pause all automated drip and sprinkler irrigation cycles immediately',
      ta: 'அனைத்து தானியங்கி சொட்டுநீர் மற்றும் தெளிப்பு பாசன சுழற்சிகளை உடனடியாக நிறுத்தவும்',
      done: true
    },
    {
      id: 3,
      en: 'Postpone chemical/organic foliar spray applications until after rainfall',
      ta: 'மழை நிற்கும் வரை பூச்சிக்கொல்லி அல்லது இலைவழி உரத்தெளிப்பை ஒத்திவைக்கவும்',
      done: true
    },
    {
      id: 4,
      en: 'Stake and secure tender vegetable branches in Plot B (Tomato)',
      ta: 'தக்காளி பயிர்களில் உள்ள மெல்லிய கிளைகளுக்கு முட்டுக் கொடுத்து பலப்படுத்தவும்',
      done: false
    },
    {
      id: 5,
      en: 'Inspect peripheral bunds to prevent soil run-off and erosion',
      ta: 'மண் அரிப்பைத் தடுக்க பண்ணை வரப்புகளை சரிபார்த்து பலப்படுத்தவும்',
      done: false
    },
  ]);

  const toggleCheck = (id) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  return (
    <div className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-3 z-50 animate-fade-in">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-t-[2rem] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <AlertTriangle size={22} className="text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full text-white">
                {isTamil ? 'அவசர முதன்மை வழிகாட்டல்' : 'High Priority Advisory'}
              </span>
              <h2 className="font-display font-bold text-xl mt-0.5">
                {isTamil ? 'கனமழை முன்னெச்சரிக்கை & வடிகால் மேலாண்மை' : 'Heavy Rainfall & Drainage Action'}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-sm text-charcoal-700">
          {/* Situation Summary */}
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-red-900">
              <span>{isTamil ? 'மழை காலம்: நாளை, மதியம் 2:00 – இரவு 8:00' : 'Forecast Window: Tomorrow, 2:00 PM – 8:00 PM'}</span>
              <span className="bg-red-200 text-red-900 px-2 py-0.5 rounded-md text-[10px]">
                {isTamil ? '🔴 75% வாய்ப்பு' : '🔴 75% Probability'}
              </span>
            </div>
            <p className="text-xs font-medium text-red-950 leading-relaxed">
              {isTamil
                ? 'வானிலை ஆய்வின்படி 35–45 மி.மீ வரை கனமழை பெய்ய வாய்ப்புள்ளது. காய்கறி மற்றும் பயிர் நிலங்களில் நீர் தேங்குவது வேர் அழுகல் மற்றும் பூஞ்சை நோய்களை உருவாக்கலாம்.'
                : 'Meteorological models indicate heavy precipitation of 35–45 mm. Standing water in vegetable and grain plots can cause root suffocation, anaerobic root rot, and increased fungal vulnerability.'
              }
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3">
              <p className="text-[10px] font-bold text-charcoal-400 uppercase">{isTamil ? 'மழை அளவு' : 'Rain Volume'}</p>
              <p className="font-black text-base text-red-700 mt-0.5">35–45 mm</p>
              <p className="text-[10px] text-charcoal-500">{isTamil ? 'கனமழை தீவிரம்' : 'Heavy Intensity'}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3">
              <p className="text-[10px] font-bold text-charcoal-400 uppercase">{isTamil ? 'மண் ஈரப்பதம்' : 'Soil Moisture'}</p>
              <p className="font-black text-base text-charcoal-900 mt-0.5">32%</p>
              <p className="text-[10px] text-charcoal-500">{isTamil ? 'ஏற்கும் திறன்: நன்று' : 'Capacity: High'}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3">
              <p className="text-[10px] font-bold text-charcoal-400 uppercase">{isTamil ? 'காற்று வேகம்' : 'Wind Gusts'}</p>
              <p className="font-black text-base text-charcoal-900 mt-0.5">24 km/h</p>
              <p className="text-[10px] text-charcoal-500">{isTamil ? 'திசை: வடமேற்கு' : 'Direction: NW'}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3">
              <p className="text-[10px] font-bold text-charcoal-400 uppercase">{isTamil ? 'பாதிக்கப்படும் பயிர்கள்' : 'Affected Plots'}</p>
              <p className="font-black text-base text-field-700 mt-0.5">{isTamil ? 'பிளாட் A & B' : 'Plot A & B'}</p>
              <p className="text-[10px] text-charcoal-500">{isTamil ? 'தக்காளி & கோதுமை' : 'Tomato & Wheat'}</p>
            </div>
          </div>

          {/* Action Checklist */}
          <div>
            <h3 className="font-display font-bold text-charcoal-900 text-base mb-3 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-field-600" /> 
              {isTamil ? 'கட்டாய பாதுகாப்பு சரிபார்ப்புப் பட்டியல்' : 'Mandatory Prevention Checklist'}
            </h3>
            <div className="space-y-2.5">
              {checklist.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                    item.done
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-charcoal-800'
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                    item.done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {item.done && <CheckCircle2 size={14} />}
                  </div>
                  <span className={`text-xs font-medium leading-snug ${item.done ? 'line-through opacity-80' : ''}`}>
                    {isTamil ? item.ta : item.en}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Direct Navigation Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => { onClose(); navigate('/dashboard/weather'); }}
              className="py-3 px-4 rounded-xl bg-field-50 hover:bg-field-100 text-field-800 border border-field-200 text-xs font-bold transition flex items-center justify-center gap-2"
            >
              {isTamil ? 'வானிலை ஆலோசனையை திறக்க' : 'Open Weather & Crop Advisory'} <ArrowUpRight size={14} />
            </button>
            <button
              onClick={() => { onClose(); navigate('/dashboard/soil'); }}
              className="py-3 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold transition flex items-center justify-center gap-2"
            >
              {isTamil ? 'மண் & பாசன நிலவரம் பார்க்க' : 'Check Soil & Irrigation Status'} <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-bold transition shadow-md"
          >
            {isTamil ? 'புரிந்தது / மூடுக' : 'Acknowledge & Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 1. DashboardHeader ───────────────────────────────────────────────────────
function DashboardHeader({ user, activeFarm }) {
  const { language, toggleLanguage, t, isTamil } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-charcoal-900 flex items-center gap-2">
          {t('greeting_morning', 'Good Morning')}, {user?.name?.split(' ')[0] || (isTamil ? 'ராஜேஷ்' : 'Rajesh')} <span role="img" aria-label="sprout">🌱</span>
        </h1>
        <button 
          onClick={() => navigate('/dashboard/farms')}
          className="text-sm font-medium text-field-700 flex items-center gap-1.5 mt-1.5 bg-field-50 hover:bg-field-100 transition w-fit px-3.5 py-1 rounded-full border border-field-200 cursor-pointer"
        >
          <MapPin size={14} /> {activeFarm?.name || t('my_farm', 'Kumar Fields')}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 md:gap-4">
        <button 
          onClick={() => navigate('/dashboard/weather')}
          className="flex items-center gap-3 text-charcoal-800 font-bold bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <CloudSun size={20} className="text-amber-500" />
          <div className="flex flex-col">
            <span className="text-sm leading-none">28°C</span>
            <span className="text-[10px] text-charcoal-400 uppercase tracking-wider mt-0.5">
              {t('weather_partly_cloudy', 'Partly Cloudy')}
            </span>
          </div>
        </button>
        
        <button 
          onClick={() => navigate('/dashboard/alerts')}
          className="relative text-charcoal-500 hover:text-field-600 transition p-2.5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md focus-ring"
          title="Pest & Farm Alerts"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </div>
  );
}

// ─── 2. ActionRecommendation ─────────────────────────────────────────────────
function ActionRecommendation({ onOpenDetails }) {
  const { t, isTamil } = useLanguage();

  return (
    <Card className="mb-8 p-0 overflow-hidden border-none shadow-md bg-gradient-to-r from-red-500 to-red-600 text-white relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      <div className="p-6 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm shrink-0">
            <AlertTriangle size={28} className="text-white" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-red-100 mb-1">
              {t('alert_high_priority', 'High Priority Action')}
            </div>
            <h2 className="font-bold text-xl mb-1.5 shadow-sm">
              {t('alert_rainfall_title', 'Heavy rainfall expected tomorrow')}
            </h2>
            <p className="text-red-50 text-sm md:text-base font-medium">
              {t('alert_rainfall_desc', 'Check field drainage immediately to prevent waterlogging.')}
            </p>
          </div>
        </div>
        <button 
          onClick={onOpenDetails}
          className="shrink-0 bg-white text-red-600 hover:bg-red-50 font-bold py-2.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          {t('btn_view_details', 'View Details')} <ArrowRight size={16} />
        </button>
      </div>
    </Card>
  );
}

// ─── 3. CropSummary ──────────────────────────────────────────────────────────
function CropSummary() {
  const navigate = useNavigate();
  const { t, isTamil } = useLanguage();

  const stats = [
    {
      label: t('label_current_crop', 'Current Crop'),
      value: isTamil ? 'தக்காளி' : 'Tomato',
      icon: '🍅',
      color: 'bg-red-50 text-red-600',
      to: '/dashboard/farms'
    },
    {
      label: t('label_growth_stage', 'Growth Stage'),
      value: isTamil ? 'பூக்கும் நிலை' : 'Flowering',
      icon: '🌼',
      color: 'bg-yellow-50 text-yellow-600',
      to: '/dashboard/farms'
    },
    {
      label: t('label_farm_area', 'Farm Area'),
      value: isTamil ? '2.5 ஏக்கர்' : '2.5 Acres',
      icon: <MapPin size={18} />,
      color: 'bg-slate-50 text-slate-600',
      to: '/dashboard/farms'
    },
    {
      label: t('label_soil_moisture', 'Soil Moisture'),
      value: '32%',
      icon: <Droplets size={18} />,
      color: 'bg-blue-50 text-blue-600',
      to: '/dashboard/soil'
    },
    {
      label: t('label_crop_health', 'Crop Health'),
      value: isTamil ? 'ஆரோக்கியமானது' : 'Healthy',
      icon: <HeartPulse size={18} />,
      color: 'bg-field-50 text-field-600',
      to: '/dashboard/farms'
    },
    {
      label: t('label_expected_yield', 'Expected Yield'),
      value: isTamil ? '4.5 டன்' : '4.5 Tons',
      icon: <Sprout size={18} />,
      color: 'bg-emerald-50 text-emerald-600',
      to: '/dashboard/reports'
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-charcoal-900 font-display flex items-center gap-2">
          <Sprout size={20} className="text-field-500" /> {t('section_crop_summary', 'My Crop Summary')}
        </h2>
        <button 
          onClick={() => navigate('/dashboard/farms')}
          className="text-xs font-bold text-field-600 hover:underline"
        >
          {t('manage_farm', 'Manage Farm →')}
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <Card 
            key={i} 
            onClick={() => navigate(stat.to)}
            className="p-4 bg-white border border-slate-100 hover:border-field-200 hover:shadow-md transition-all duration-300 group flex items-center gap-4 cursor-pointer"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${stat.color} group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs text-charcoal-400 font-bold uppercase tracking-wider mb-0.5">{stat.label}</p>
              <p className="font-bold text-charcoal-900 text-sm md:text-base">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── 4. QuickActions ──────────────────────────────────────────────────────────
function QuickActions() {
  const navigate = useNavigate();
  const { t, isTamil } = useLanguage();

  const actions = [
    {
      label: t('action_scan', 'Scan Plant'),
      desc: t('action_scan_desc', 'Check health'),
      icon: Camera,
      to: '/dashboard/scanner',
      color: 'text-field-600',
      bg: 'bg-gradient-to-br from-field-50 to-field-100',
      hover: 'hover:border-field-300'
    },
    {
      label: t('action_soil', 'Check Soil'),
      desc: t('action_soil_desc', 'Analyze nutrients'),
      icon: FlaskConical,
      to: '/dashboard/soil',
      color: 'text-amber-600',
      bg: 'bg-gradient-to-br from-amber-50 to-amber-100',
      hover: 'hover:border-amber-300'
    },
    {
      label: t('action_irrigation', 'Irrigation'),
      desc: t('action_irrigation_desc', 'Watering schedule'),
      icon: Droplets,
      to: '/dashboard/soil',
      color: 'text-blue-600',
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
      hover: 'hover:border-blue-300'
    },
    {
      label: t('action_buyers', 'Find Buyers'),
      desc: t('action_buyers_desc', 'Marketplace'),
      icon: Store,
      to: '/dashboard/market',
      color: 'text-purple-600',
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
      hover: 'hover:border-purple-300'
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-charcoal-900 font-display">
          {t('section_quick_actions', 'Quick Actions')}
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {actions.map(a => (
          <button
            key={a.label}
            onClick={() => navigate(a.to)}
            className={`flex flex-col items-center justify-center p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl ${a.hover} hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden text-left`}
          >
            <div className={`w-16 h-16 ${a.bg} ${a.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm`}>
              <a.icon size={28} />
            </div>
            <h3 className="font-bold text-charcoal-900 text-base mb-1">{a.label}</h3>
            <p className="text-xs text-charcoal-500 font-medium text-center">{a.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DashboardHome() {
  const { user, activeFarm } = useAuth();
  const [showActionModal, setShowActionModal] = useState(false);

  return (
    <div className="pb-12 max-w-6xl mx-auto animate-fade-in pt-4">
      <DashboardHeader user={user} activeFarm={activeFarm} />
      
      <ActionRecommendation onOpenDetails={() => setShowActionModal(true)} />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          <CropSummary />
        </div>
      </div>
      
      <QuickActions />

      {/* ── High Priority Action Details Modal ── */}
      {showActionModal && (
        <HighPriorityActionModal onClose={() => setShowActionModal(false)} />
      )}
    </div>
  );
}
