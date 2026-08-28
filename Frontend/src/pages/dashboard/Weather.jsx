import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { MOCK_DASHBOARD as D } from '../../data/mockDashboard';
import { weatherService, LOCATIONS } from '../../services/weatherService';
import {
  RefreshCw, MapPin, ChevronDown, Droplets, AlertTriangle,
  CheckCircle2, XCircle, Clock, Sprout, Bug, Search, X,
} from 'lucide-react';

const BASE_WEATHER = weatherService.getWeatherSync?.() ?? {
  condition: 'Sunny', temp: 28, feelsLike: 30, high: 32, low: 24,
  rainfall: 12, rainChance: 75, windSpeed: 18, windDir: 'NW',
  humidity: 72, uvIndex: 7, soilMoisture: 32,
  hourly: [
    { time: '6 AM',  icon: '🌤️', temp: 26 }, { time: '9 AM',  icon: '☀️', temp: 28 },
    { time: '12 PM', icon: '☀️', temp: 31 }, { time: '3 PM',  icon: '🌦️', temp: 30 },
    { time: '6 PM',  icon: '🌧️', temp: 27 }, { time: '9 PM',  icon: '☁️', temp: 25 },
    { time: '12 AM', icon: '☁️', temp: 23 },
  ],
  weekly: [
    { day: 'Today',     icon: '☀️',  high: 32, low: 24, rain: 10 },
    { day: 'Tomorrow',  icon: '🌧️', high: 27, low: 22, rain: 80 },
    { day: 'Saturday',  icon: '🌦️', high: 29, low: 23, rain: 45 },
    { day: 'Sunday',    icon: '☁️',  high: 30, low: 24, rain: 20 },
    { day: 'Monday',    icon: '☀️',  high: 31, low: 25, rain: 5  },
    { day: 'Tuesday',   icon: '🌧️', high: 28, low: 22, rain: 70 },
    { day: 'Wednesday', icon: '☀️',  high: 30, low: 24, rain: 10 },
  ],
  alerts: [
    { id: 'a1', priority: 'high',   title: 'Heavy Rainfall Expected Tomorrow',     titleTa: 'நாளை கனமழை எதிர்பார்க்கப்படுகிறது', description: 'Check drainage and protect vulnerable crops before 2 PM tomorrow.', descriptionTa: 'நாளை மதியம் 2 மணிக்குள் வடிகால் வாய்க்கால்களை சரிபார்க்கவும்.' },
    { id: 'a2', priority: 'medium', title: 'High Humidity Tonight',                titleTa: 'இன்றிரவு அதிக ஈரப்பதம்', description: 'Humidity may exceed 85% overnight. Monitor for early fungal symptoms.', descriptionTa: 'இரவில் ஈரப்பதம் 85% மேல் உயரலாம். பூஞ்சை அறிகுறிகளை கண்காணிக்கவும்.' },
    { id: 'a3', priority: 'low',    title: 'Morning Suitable for Field Work',      titleTa: 'காலை வேளையில் களப்பணிக்கு உகந்தது', description: 'Clear skies until noon — good time for inspection and weeding.', descriptionTa: 'நண்பகல் வரை தெளிவான வானிலை நிலவும் - கள ஆய்வு மற்றும் களையெடுக்க உகந்த நேரம்.' },
  ],
};

const CONDITIONS = {
  Sunny:  { bg: 'from-amber-400 via-orange-300 to-yellow-200', text: 'text-amber-900', sub: 'text-amber-800/70',  icon: '☀️', nameTa: 'வெயில் காலம்' },
  Cloudy: { bg: 'from-slate-400 via-blue-300 to-slate-200',    text: 'text-slate-800', sub: 'text-slate-600',     icon: '☁️', nameTa: 'மேகமூட்டம்' },
  Rain:   { bg: 'from-blue-600 via-blue-400 to-cyan-300',      text: 'text-blue-50',  sub: 'text-blue-100/80',   icon: '🌧️', nameTa: 'மழைப்பொழிவு' },
  Storm:  { bg: 'from-slate-700 via-blue-600 to-slate-500',    text: 'text-white',    sub: 'text-white/70',      icon: '⛈️', nameTa: 'புயல் மழை' },
};

const CROP  = D.fields[0]?.crop  ?? 'Wheat';
const STAGE = D.fields[0]?.stage ?? 'Flowering';

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ weather, location, isTamil }) {
  const c = CONDITIONS[weather.condition] ?? CONDITIONS.Sunny;
  return (
    <div className={`relative bg-gradient-to-br ${c.bg} rounded-3xl p-7 md:p-10 overflow-hidden mb-6 shadow-lg`}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <div className="text-7xl md:text-8xl mb-1">{c.icon}</div>
          <p className={`font-display font-black text-6xl md:text-7xl ${c.text} leading-none`}>
            {weather.temp}°<span className="text-4xl">C</span>
          </p>
          <p className={`text-xl font-bold mt-2 ${c.sub}`}>
            {isTamil ? c.nameTa : weather.condition}
          </p>
          <p className={`text-sm mt-1 ${c.sub} flex items-center gap-1.5`}><MapPin size={13} />{location}</p>
        </div>
        <div className="flex flex-col gap-3 min-w-[180px]">
          {[
            { label: isTamil ? 'உணரப்படும் வெப்பநிலை' : 'Feels Like',  value: `${weather.feelsLike}°C` },
            { label: isTamil ? 'இன்றைய அதிகபட்சம்' : "Today's High", value: `${weather.high}°C`      },
            { label: isTamil ? 'இன்றைய குறைந்தபட்சம்' : "Today's Low",  value: `${weather.low}°C`       },
            { label: isTamil ? 'புற ஊதா (UV) குறியீடு' : 'UV Index',     value: `${weather.uvIndex}`      },
          ].map(d => (
            <div key={d.label} className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2.5 flex justify-between items-center">
              <span className={`text-xs font-bold ${c.sub}`}>{d.label}</span>
              <span className={`text-sm font-black ${c.text}`}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Metrics ─────────────────────────────────────────────────────────────────
function Metrics({ weather, isTamil }) {
  const items = [
    { 
      icon: '🌡️', 
      label: isTamil ? 'வெப்பநிலை' : 'Temperature', 
      primary: `${weather.temp}°C`, 
      secondary: isTamil ? `உணரப்படுவது ${weather.feelsLike}°C` : `Feels ${weather.feelsLike}°C`, 
      color: 'text-orange-500', 
      bg: 'bg-orange-50' 
    },
    { 
      icon: '🌧️', 
      label: isTamil ? 'மழைப்பொழிவு' : 'Rainfall', 
      primary: `${weather.rainfall} mm`, 
      secondary: isTamil ? `வாய்ப்பு: ${weather.rainChance}%` : `Chance: ${weather.rainChance}%`, 
      color: 'text-blue-500', 
      bg: 'bg-blue-50' 
    },
    { 
      icon: '💨', 
      label: isTamil ? 'காற்று வேகம்' : 'Wind', 
      primary: `${weather.windSpeed} km/h`, 
      secondary: isTamil ? `திசை: ${weather.windDir}` : `Dir: ${weather.windDir}`, 
      color: 'text-cyan-500', 
      bg: 'bg-cyan-50' 
    },
    { 
      icon: '💧', 
      label: isTamil ? 'ஈரப்பதம்' : 'Humidity', 
      primary: `${weather.humidity}%`, 
      secondary: weather.humidity > 75 ? (isTamil ? 'அதிக ஈரப்பதம்' : 'Very Humid') : (isTamil ? 'மிதமானது' : 'Moderate'), 
      color: 'text-indigo-500', 
      bg: 'bg-indigo-50' 
    },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {items.map(m => (
        <div key={m.label} className="bg-white border border-slate-100 rounded-3xl p-5 flex items-center gap-4 shadow-sm">
          <div className={`${m.bg} w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0`}>{m.icon}</div>
          <div>
            <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider mb-0.5">{m.label}</p>
            <p className={`text-xl font-black ${m.color}`}>{m.primary}</p>
            <p className="text-xs font-medium text-charcoal-500">{m.secondary}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Hourly ───────────────────────────────────────────────────────────────────
function Hourly({ hourly, isTamil }) {
  const [active, setActive] = useState(1);
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 mb-6 shadow-sm">
      <h3 className="font-display font-bold text-charcoal-900 mb-4">
        {isTamil ? 'இன்றைய மணிநேர வானிலை' : 'Today — Hourly'}
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {hourly.map((h, i) => (
          <button key={h.time} onClick={() => setActive(i)}
            className={`flex flex-col items-center gap-2 px-4 py-3 rounded-2xl shrink-0 min-w-[72px] transition-all cursor-pointer ${active === i ? 'bg-field-600 text-white shadow-md scale-105' : 'bg-slate-50 text-charcoal-700 hover:bg-slate-100'}`}>
            <span className="text-xs font-bold">{h.time}</span>
            <span className="text-2xl">{h.icon}</span>
            <span className="font-black text-sm">{h.temp}°</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Weekly ───────────────────────────────────────────────────────────────────
function Weekly({ weekly, isTamil }) {
  const dayMap = {
    'Today': 'இன்று',
    'Tomorrow': 'நாளை',
    'Saturday': 'சனிக்கிழமை',
    'Sunday': 'ஞாயிற்றுக்கிழமை',
    'Monday': 'திங்கட்கிழமை',
    'Tuesday': 'செவ்வாய்க்கிழமை',
    'Wednesday': 'புதன்கிழமை'
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 mb-6 shadow-sm">
      <h3 className="font-display font-bold text-charcoal-900 mb-4">
        {isTamil ? '7-நாள் வானிலை முன்னறிவிப்பு' : '7-Day Forecast'}
      </h3>
      <div className="space-y-1">
        {weekly.map((d, i) => (
          <div key={d.day} className={`flex items-center justify-between px-4 py-3 rounded-2xl ${i === 0 ? 'bg-field-50 border border-field-100' : 'hover:bg-slate-50'}`}>
            <span className={`font-bold text-sm w-28 ${i === 0 ? 'text-field-700' : 'text-charcoal-700'}`}>
              {isTamil ? (dayMap[d.day] || d.day) : d.day}
            </span>
            <span className="text-2xl mx-4">{d.icon}</span>
            <div className="flex items-center gap-1 text-xs font-medium text-blue-500 mr-4">
              <Droplets size={12} />{d.rain}%
            </div>
            <div className="flex items-center gap-2 text-sm font-bold min-w-[80px] justify-end">
              <span className="text-orange-500">{d.high}°</span>
              <span className="text-slate-300">/</span>
              <span className="text-blue-400">{d.low}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Weather() {
  const { activeFarm }  = useAuth();
  const { isTamil, t }  = useLanguage();
  const [location, setLocation] = useState(activeFarm?.location ?? 'Coimbatore, Tamil Nadu');
  const [weather,  setWeather]  = useState({ ...BASE_WEATHER, location: activeFarm?.location ?? 'Coimbatore, Tamil Nadu' });
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const refresh = (loc = location) => {
    const w = { ...BASE_WEATHER, location: loc };
    setWeather(w);
    setLastUpdated(new Date());
  };

  const adv = weatherService.buildCropAdvisory(weather, CROP, STAGE);

  return (
    <div className="pb-16 max-w-5xl mx-auto pt-6 px-4 sm:px-6 lg:px-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal-900 flex items-center gap-2">
            {isTamil ? 'வானிலை & பயிர் ஆலோசனை' : 'Weather & Crop Advisory'} <span>☀️</span>
          </h1>
          <p className="text-sm text-charcoal-500 font-medium mt-1">
            {isTamil 
              ? 'வானிலை மாற்றங்களும் உங்கள் பண்ணைக்கான வழிகாட்டல்களும்.' 
              : 'Weather conditions and their impact on your farm.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-full border border-emerald-200">
            <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"/><span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500"/></span>
            {isTamil ? 'நேரலை' : 'Live'}
          </span>
          <span className="text-xs text-charcoal-400 flex items-center gap-1 font-medium"><Clock size={12}/>{isTamil ? 'சற்றுமுன்' : 'Just now'}</span>
          <button onClick={() => refresh()} className="p-2 text-charcoal-500 hover:text-charcoal-900 hover:bg-slate-100 rounded-full transition cursor-pointer" title="Refresh">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <Hero weather={weather} location={location} isTamil={isTamil} />
      <Metrics weather={weather} isTamil={isTamil} />
      <Hourly hourly={weather.hourly} isTamil={isTamil} />
      <Weekly weekly={weather.weekly} isTamil={isTamil} />
    </div>
  );
}
