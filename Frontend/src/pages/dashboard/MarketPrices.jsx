import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../../components/ui/index';
import {
  Search, Bell, User, RefreshCw, ChevronDown, TrendingUp, TrendingDown,
  Minus, Info, X, Trophy, LayoutGrid, List, ArrowUpDown, LineChart as ChartIcon,
  Sparkles, ArrowRight, IndianRupee, Store, Layers, BarChart3, Truck,
  Building2, ExternalLink, CheckCircle2, ArrowUpRight, Award
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, Cell, Legend
} from 'recharts';
import { marketService, MANDIS, getMandiData, getMarketComparisonForCrop } from '../../services/marketService';

// ─── helpers ──────────────────────────────────────────────────────────────────
const demandColor = level =>
  (level || '').includes('High') ? 'emerald' :
    (level || '').includes('Medium') ? 'amber' : 'rose';

function DemandBadge({ level = '', status = '🟢', isTamil }) {
  const c = demandColor(level);
  const label = level.includes('High') ? (isTamil ? 'அதிக தேவை' : 'High Demand') :
    level.includes('Medium') ? (isTamil ? 'மிதமான தேவை' : 'Medium Demand') : (isTamil ? 'குறைந்த தேவை' : 'Low Demand');
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border
      bg-${c}-50 text-${c}-700 border-${c}-200`}>
      {status} {label}
    </span>
  );
}

function TrendPill({ trend = 'Stable', icon = '→', isTamil }) {
  const color = trend === 'Increasing' ? 'text-emerald-600' : trend === 'Decreasing' ? 'text-rose-600' : 'text-amber-600';
  const label = trend === 'Increasing' ? (isTamil ? 'அதிகரிக்கிறது' : 'Increasing') :
    trend === 'Decreasing' ? (isTamil ? 'குறைகிறது' : 'Decreasing') : (isTamil ? 'நிலையானது' : 'Stable');
  return <span className={`font-bold ${color} flex items-center gap-1`}>{icon} {label}</span>;
}

function LiveDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
    </span>
  );
}

const MONTH_NAMES_TA = {
  'Mar': 'மார்ச்',
  'Apr': 'ஏப்ரல்',
  'May': 'மே',
  'Jun': 'ஜூன்',
  'Jul': 'ஜூலை',
  'Aug': 'ஆகஸ்ட்',
  'Sep': 'செப்',
  'Oct': 'அக்',
};

const CROP_TRANSLATIONS = {
  'Tomato': 'தக்காளி',
  'Potato': 'உருளைக்கிழங்கு',
  'Maize': 'மக்காச்சோளம்',
  'Wheat': 'கோதுமை',
  'Rice': 'நெல்',
  'Onion': 'வெங்காயம்',
  'Brinjal': 'கத்தரிக்காய்',
  'Chilli': 'மிளகாய்',
  'Carrot': 'கேரட்',
  'Cotton': 'பருத்தி',
  'Groundnut': 'நிலக்கடலை',
  'Soybean': 'சோயாபீன்',
};

// ─── Custom Recharts Tooltip ──────────────────────────────────────────────────
const CustomMarketTooltip = ({ active, payload, label, isTamil }) => {
  if (!active || !payload?.length) return null;
  const monthDisplay = isTamil ? (MONTH_NAMES_TA[label] || label) : label;

  return (
    <div className="bg-charcoal-900 text-white rounded-2xl p-3.5 shadow-xl text-xs space-y-1.5 border border-white/10">
      <p className="font-bold text-slate-300 border-b border-slate-700/80 pb-1 flex items-center justify-between gap-4">
        <span>{monthDisplay}</span>
        <span className="text-[10px] text-slate-400 font-normal">{isTamil ? 'சந்தை விலை' : 'Mandi Price'}</span>
      </p>
      {payload.map((p, i) => {
        if (p.value === null || p.value === undefined) return null;
        const nameLabel = p.dataKey === 'price'
          ? (isTamil ? 'உண்மையான விலை' : 'Actual Price')
          : (isTamil ? 'AI கணித்த விலை' : 'AI Forecast');
        return (
          <div key={i} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5" style={{ color: p.color || p.stroke }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.color || p.stroke }} />
              {nameLabel}:
            </span>
            <span className="font-bold text-white tabular-nums">
              ₹{p.value?.toLocaleString('en-IN')}/{isTamil ? 'குவிண்டால்' : 'qtl'}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ─── Custom Inter-Mandi Bar Tooltip ──────────────────────────────────────────
const CustomInterMandiTooltip = ({ active, payload, label, isTamil }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;

  return (
    <div className="bg-charcoal-900 text-white rounded-2xl p-4 shadow-xl text-xs space-y-2 border border-white/10 min-w-[200px]">
      <div className="border-b border-slate-700/80 pb-1.5">
        <p className="font-bold text-white text-sm">{isTamil ? data.mandiTa : data.mandi}</p>
        <span className="text-[10px] text-emerald-400 font-semibold">{data.state}</span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between items-center gap-3">
          <span className="text-slate-400">{isTamil ? 'மொத்த விலை:' : 'Wholesale Price:'}</span>
          <span className="font-bold text-emerald-300">₹{data.price?.toLocaleString('en-IN')}/qtl</span>
        </div>
        <div className="flex justify-between items-center gap-3">
          <span className="text-slate-400">{isTamil ? 'தினசரி வரத்து:' : 'Daily Arrivals:'}</span>
          <span className="font-bold text-white">{data.arrivals} qtl/day</span>
        </div>
        <div className="flex justify-between items-center gap-3">
          <span className="text-slate-400">{isTamil ? 'போக்குவரத்து செலவு:' : 'Freight Cost:'}</span>
          <span className="font-medium text-amber-300">₹{data.freightPerQtl}/qtl ({data.distanceKm} km)</span>
        </div>
        <div className="flex justify-between items-center gap-3 pt-1 border-t border-slate-800">
          <span className="text-slate-300 font-bold">{isTamil ? 'நிகர லாப வரவு:' : 'Net Realization:'}</span>
          <span className="font-black text-amber-400">₹{data.netReturn?.toLocaleString('en-IN')}/qtl</span>
        </div>
      </div>
    </div>
  );
};

// ─── Interactive Price Trend & Forecast Graph ─────────────────────────────────
function MarketPriceTrendGraph({ crops, isTamil }) {
  const [selectedCropId, setSelectedCropId] = useState(crops[0]?.id || 1);

  useEffect(() => {
    if (crops && crops.length > 0) {
      if (!crops.some(c => c.id === selectedCropId)) {
        setSelectedCropId(crops[0].id);
      }
    }
  }, [crops]);

  const activeCrop = crops.find(c => c.id === selectedCropId) || crops[0] || {};

  const chartData = useMemo(() => {
    if (!activeCrop?.history) return [];
    return activeCrop.history.map(item => ({
      date: isTamil ? (MONTH_NAMES_TA[item.date] || item.date) : item.date,
      price: item.price,
      predicted: item.predicted,
    }));
  }, [activeCrop, isTamil]);

  const activeCropName = isTamil ? (CROP_TRANSLATIONS[activeCrop.crop] || activeCrop.crop) : activeCrop.crop;
  const currentP = activeCrop.currentPrice || 0;
  const lastPredicted = activeCrop.history?.[activeCrop.history.length - 1]?.predicted || currentP;
  const diffPct = currentP > 0 ? (((lastPredicted - currentP) / currentP) * 100).toFixed(1) : 0;
  const isPositive = Number(diffPct) >= 0;

  return (
    <Card className="p-6 md:p-8 bg-white border border-slate-200/90 rounded-3xl shadow-sm mb-8 space-y-6">
      {/* Header & Crop Selector Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-field-100 text-field-700">
              <ChartIcon size={18} />
            </span>
            <h3 className="font-display font-bold text-xl text-charcoal-900">
              {isTamil ? 'சந்தை விலை போக்கு & AI முன்னறிவிப்பு வரைபடம்' : 'Market Price Trend & AI Forecast Chart'}
            </h3>
          </div>
          <p className="text-xs text-charcoal-500 font-medium">
            {isTamil
              ? 'வரலாற்று கொள்முதல் விலைகள் மற்றும் அடுத்த மாதங்களுக்கான AI விலை மதிப்பீடு'
              : 'Historical mandi prices with machine-learning demand forecasts.'}
          </p>
        </div>

        {/* Crop Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {crops.map(c => {
            const name = isTamil ? (CROP_TRANSLATIONS[c.crop] || c.crop) : c.crop;
            const isSelected = c.id === selectedCropId;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCropId(c.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${isSelected
                  ? 'bg-field-600 text-white shadow-md shadow-field-600/20'
                  : 'bg-slate-100 text-charcoal-600 hover:bg-slate-200/80 hover:text-charcoal-900'
                  }`}
              >
                <span>{c.icon}</span>
                <span>{name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Metric summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200/70 p-4 rounded-2xl">
        <div>
          <p className="text-[10px] font-bold text-charcoal-400 uppercase">{isTamil ? 'தேர்ந்தெடுக்கப்பட்ட பயிர்' : 'Selected Crop'}</p>
          <p className="font-display font-black text-lg text-charcoal-900 mt-0.5">{activeCrop.icon} {activeCropName}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-charcoal-400 uppercase">{isTamil ? 'தற்போதைய விலை' : 'Current Price'}</p>
          <p className="font-black text-lg text-charcoal-900 mt-0.5">₹{currentP.toLocaleString('en-IN')}/{isTamil ? 'குவிண்டால்' : 'qtl'}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-charcoal-400 uppercase">{isTamil ? 'எதிர்பார்க்கப்படும் விலை' : 'Projected Price'}</p>
          <p className="font-black text-lg text-field-700 mt-0.5">₹{lastPredicted.toLocaleString('en-IN')}/{isTamil ? 'குவிண்டால்' : 'qtl'}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-charcoal-400 uppercase">{isTamil ? 'எதிர்பார்க்கப்படும் மாற்றம்' : 'Projected Change'}</p>
          <p className={`font-black text-lg mt-0.5 flex items-center gap-1 ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {isPositive ? '+' : ''}{diffPct}%
          </p>
        </div>
      </div>

      {/* The Main Chart */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="predGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `₹${v}`}
            />
            <Tooltip content={<CustomMarketTooltip isTamil={isTamil} />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#16a34a"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#priceGradient)"
              name={isTamil ? 'உண்மையான விலை' : 'Actual Price'}
              connectNulls={false}
              activeDot={{ r: 6, fill: '#16a34a', stroke: '#fff', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#0284c7"
              strokeWidth={2.5}
              strokeDasharray="5 5"
              dot={{ r: 4, fill: '#0284c7', stroke: '#fff', strokeWidth: 2 }}
              name={isTamil ? 'AI கணித்த விலை' : 'AI Forecast'}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-2 font-bold text-charcoal-700">
            <span className="w-3.5 h-1 bg-emerald-600 rounded-full inline-block" />
            {isTamil ? 'கடந்த மாத கொள்முதல் விலை' : 'Actual Mandi Price (History)'}
          </span>
          <span className="flex items-center gap-2 font-bold text-charcoal-700">
            <span className="w-3.5 h-1 bg-sky-600 rounded-full inline-block border-t-2 border-dashed border-sky-600" />
            {isTamil ? 'AI முன்னறிவிப்பு விலை (அடுத்த மாதங்கள்)' : 'AI Forecast (Next Months)'}
          </span>
        </div>

        <span className="text-[11px] text-charcoal-500 font-medium">
          {isTamil ? 'தரவு ஆதாரம்: தேசிய மண்டி விலை குறியீடு' : 'Source: National Mandi Price Index & AI Model'}
        </span>
      </div>
    </Card>
  );
}

// ─── Opportunity Banner ────────────────────────────────────────────────────────
function MarketOpportunity({ data, isTamil }) {
  if (!data) return null;
  const cropName = isTamil ? (CROP_TRANSLATIONS[data.crop] || data.crop) : data.crop;
  const forecastText = (data.forecastPeriod || '30 Days');

  return (
    <Card className="p-0 overflow-hidden border-field-200 shadow-md bg-gradient-to-br from-field-50 to-white mb-8 rounded-3xl">
      <div className="bg-field-600 text-white px-5 py-2.5 flex items-center gap-2">
        <span className="text-lg">🌱</span>
        <h3 className="font-bold text-sm tracking-wide">
          {isTamil ? 'சாத்தியமான சந்தை வாய்ப்பு' : 'Potential Market Opportunity'}
        </h3>
      </div>
      <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{data.icon}</span>
            <h4 className="font-display font-bold text-2xl text-charcoal-900">{cropName}</h4>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              {data.demandStatus || '🟢'} {isTamil ? 'அதிக தேவை வாய்ப்பு' : 'High Predicted Demand'}
            </div>
          </div>
          <p className="text-sm font-bold text-charcoal-600 flex items-center gap-2">
            {isTamil ? 'தேவை போக்கு:' : 'Demand Trend:'} <TrendPill trend={data.demandTrend} icon={data.trendIcon} isTamil={isTamil} />
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 w-full md:w-auto">
          {[
            { label: isTamil ? 'தற்போதைய விலை' : 'Current Price', value: `₹${(data.currentPrice || 0).toLocaleString('en-IN')}/${isTamil ? 'குவிண்டால்' : 'quintal'}`, bold: false },
            { label: isTamil ? 'எதிர்பார்க்கப்படும் தேவை' : 'Predicted Demand', value: `${data.predictedDemand || 0} ${isTamil ? 'குவிண்டால்/நாள்' : 'quintals/day'}`, bold: true },
            { label: isTamil ? 'கால அளவு' : 'Forecast', value: isTamil ? forecastText.replace('Days', 'நாட்கள்') : forecastText, bold: false },
          ].map(s => (
            <div key={s.label} className={s.label.includes('Forecast') || s.label.includes('கால அளவு') ? 'col-span-2 md:col-span-1' : ''}>
              <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider mb-0.5">{s.label}</p>
              <p className={`font-bold text-lg ${s.bold ? 'text-field-600' : 'text-charcoal-900'}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-start gap-2">
        <Info size={15} className="text-field-500 shrink-0 mt-0.5" />
        <p className="text-xs text-charcoal-600 font-medium">
          <strong>{isTamil ? 'குறிப்பு:' : 'Note:'}</strong>{' '}
          {isTamil
            ? `${cropName} பயிருக்கு தேர்ந்தெடுக்கப்பட்ட காலத்தில் அதிக சந்தை தேவை மற்றும் நல்ல விலை கிடைக்க வாய்ப்புள்ளது.`
            : `${data.crop} is showing a stronger predicted demand trend for the selected forecast period based on available market data.`
          }
        </p>
      </div>
    </Card>
  );
}

// ─── Modal: Detailed Price Graphs & Inter-Market Comparison ───────────────────
function CropMarketDetailModal({ crop, onClose, isTamil }) {
  if (!crop) return null;
  const [activeTab, setActiveTab] = useState('markets'); // 'markets' | 'trend'
  const cropName = isTamil ? (CROP_TRANSLATIONS[crop.crop] || crop.crop) : crop.crop;

  // Inter-Market comparison data
  const marketComparisons = useMemo(() => {
    return getMarketComparisonForCrop(crop.id);
  }, [crop]);

  // Sparkline/History chart data
  const historyData = useMemo(() => {
    if (!crop.history) return [];
    return crop.history.map(item => ({
      date: isTamil ? (MONTH_NAMES_TA[item.date] || item.date) : item.date,
      price: item.price,
      predicted: item.predicted,
      volume: item.volume || 450
    }));
  }, [crop, isTamil]);

  const bestMandi = marketComparisons[0] || {};
  const currentMandiPrice = crop.currentPrice || 1850;
  const highestPrice = bestMandi.price || currentMandiPrice;
  const priceAdvantage = highestPrice - currentMandiPrice;

  return (
    <div className="fixed inset-0 bg-charcoal-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-field-900 via-field-800 to-field-900 text-white rounded-t-[2rem] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-3xl shadow-inner">
              {crop.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-xl text-white">
                  {cropName} {isTamil ? '— சந்தை பகுப்பாய்வு & விலை ஒப்பீடு' : '— Market Analytics & Inter-Mandi Price Comparison'}
                </h3>
                <DemandBadge level={crop.demandLevel} status={crop.demandStatus} isTamil={isTamil} />
              </div>
              <p className="text-xs text-emerald-100 font-semibold mt-0.5">
                {crop.mandi} · ₹{crop.currentPrice?.toLocaleString('en-IN')}/{isTamil ? 'குவிண்டால்' : 'qtl'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
          >
            <X size={22} className="text-white" />
          </button>
        </div>

        {/* Tab Controls & Arbitrage Highlight */}
        <div className="px-6 pt-4 pb-2 bg-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-slate-200/80 p-1 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('markets')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'markets'
                  ? 'bg-white text-charcoal-900 shadow-sm'
                  : 'text-charcoal-500 hover:text-charcoal-900'
              }`}
            >
              <Store size={15} />
              <span>{isTamil ? 'மண்டிகளுக்கு இடையேயான விலை ஒப்பீடு' : 'Price Graph Between Markets'}</span>
            </button>
            <button
              onClick={() => setActiveTab('trend')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'trend'
                  ? 'bg-white text-charcoal-900 shadow-sm'
                  : 'text-charcoal-500 hover:text-charcoal-900'
              }`}
            >
              <ChartIcon size={15} />
              <span>{isTamil ? 'விலை & தேவை போக்கு வரைபடம்' : 'Price & Demand Trend Graph'}</span>
            </button>
          </div>

          {/* Arbitrage Badge */}
          {priceAdvantage > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-100/90 px-3 py-1.5 rounded-xl border border-emerald-300">
              <Sparkles size={14} className="text-amber-500" />
              <span>
                {isTamil
                  ? `${isTamil ? bestMandi.mandiTa : bestMandi.mandi} மண்டியில் ₹${priceAdvantage} வரை அதிக விலை!`
                  : `Top Mandi (${bestMandi.mandi}) pays +₹${priceAdvantage}/qtl higher!`}
              </span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-charcoal-700">
          {activeTab === 'markets' ? (
            /* ── TAB 1: INTER-MARKET PRICE COMPARISON GRAPH ───────────────── */
            <div className="space-y-6 animate-fade-in">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-charcoal-900 text-sm flex items-center gap-2">
                    <BarChart3 size={18} className="text-field-600" />
                    {isTamil ? `${cropName} — முக்கிய மொத்த மண்டிகளின் விலை ஒப்பீட்டு வரைபடம்` : `${cropName} — Wholesale Price Comparison Across Major APMC Mandis`}
                  </h4>
                  <span className="text-[11px] font-bold text-charcoal-400">
                    {isTamil ? 'விலை: ₹/குவிண்டால்' : 'Values in ₹/Quintal'}
                  </span>
                </div>
                <p className="text-xs text-charcoal-500 font-medium">
                  {isTamil
                    ? 'பல்வேறு மாநில மண்டிகளின் கொள்முதல் விலையை ஒப்பிட்டு, போக்குவரத்து செலவு கழித்து அதிக லாபம் தரும் சந்தையை தேர்வு செய்யவும்.'
                    : 'Compare wholesale prices, transport freight, and daily arrivals to discover your most profitable market destination.'}
                </p>
              </div>

              {/* Inter-Mandi Bar Chart */}
              <div className="h-72 w-full bg-slate-50/70 p-4 rounded-3xl border border-slate-200/80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={marketComparisons} margin={{ top: 20, right: 10, left: -10, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey={isTamil ? "mandiTa" : "mandi"}
                      tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                      height={40}
                    />
                    <YAxis
                      domain={['auto', 'auto']}
                      tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={v => `₹${v}`}
                    />
                    <Tooltip content={<CustomInterMandiTooltip isTamil={isTamil} />} />
                    <Bar dataKey="price" radius={[8, 8, 0, 0]}>
                      {marketComparisons.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.isBest ? '#10b981' : index % 2 === 0 ? '#3b82f6' : '#6366f1'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Inter-Mandi Comparison Table */}
              <div className="space-y-3 pt-2">
                <h5 className="font-bold text-charcoal-900 text-xs uppercase tracking-wider">
                  {isTamil ? 'மண்டி வாரியான விரிவான லாப ஒப்பீட்டு அட்டவணை' : 'Mandi-Wise Price & Net Realization Breakdown'}
                </h5>

                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100/90 text-charcoal-600 font-bold border-b border-slate-200">
                        <th className="p-3">{isTamil ? 'மண்டி பெயர்' : 'Market / Mandi'}</th>
                        <th className="p-3">{isTamil ? 'மாநிலம்' : 'State'}</th>
                        <th className="p-3">{isTamil ? 'மொத்த விலை' : 'Price (₹/qtl)'}</th>
                        <th className="p-3">{isTamil ? 'வரத்து' : 'Arrivals (qtl)'}</th>
                        <th className="p-3">{isTamil ? 'தூரம் & லாரி வாடகை' : 'Distance & Freight'}</th>
                        <th className="p-3">{isTamil ? 'நிகர வரவு' : 'Net Return (₹/qtl)'}</th>
                        <th className="p-3 text-right">{isTamil ? 'நிலை' : 'Status'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {marketComparisons.map((m, idx) => (
                        <tr key={idx} className={`hover:bg-slate-50 transition ${m.isBest ? 'bg-emerald-50/50 font-bold' : ''}`}>
                          <td className="p-3 font-bold text-charcoal-900 flex items-center gap-1.5">
                            {m.isBest && <Award size={15} className="text-amber-500 shrink-0" />}
                            <span>{isTamil ? m.mandiTa : m.mandi}</span>
                          </td>
                          <td className="p-3 text-charcoal-500 font-medium">{m.state}</td>
                          <td className="p-3 font-black text-field-700">₹{m.price?.toLocaleString('en-IN')}</td>
                          <td className="p-3 text-charcoal-700 font-semibold">{m.arrivals} qtl</td>
                          <td className="p-3 text-charcoal-600">₹{m.freightPerQtl}/qtl ({m.distanceKm} km)</td>
                          <td className="p-3 font-black text-emerald-800">₹{m.netReturn?.toLocaleString('en-IN')}</td>
                          <td className="p-3 text-right">
                            {m.isBest ? (
                              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black border border-emerald-300">
                                {isTamil ? '🏆 அதிக லாபம்' : '🏆 Best Price'}
                              </span>
                            ) : (
                              <span className="text-[11px] text-charcoal-400 font-medium">
                                -₹{bestMandi.price - m.price}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* ── TAB 2: PRICE & DEMAND TREND GRAPH ────────────────────────── */
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-charcoal-900 text-sm flex items-center gap-2">
                    <ChartIcon size={18} className="text-sky-600" />
                    {isTamil ? `${cropName} — வரலாற்று கொள்முதல் விலை & AI முன்னறிவிப்பு` : `${cropName} — Historical Price & 30-Day Demand Forecast`}
                  </h4>
                  <p className="text-xs text-charcoal-500 font-medium mt-0.5">
                    {isTamil
                      ? 'கடந்த மாதங்களின் உண்மையான விலை போக்கு மற்றும் அடுத்த 30 நாட்களுக்கான கணிக்கப்பட்ட விலை'
                      : 'Actual historical prices and machine-learning predicted demand trend curve.'}
                  </p>
                </div>
              </div>

              {/* Area Chart */}
              <div className="h-72 w-full bg-slate-50/70 p-4 rounded-3xl border border-slate-200/80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="modalPriceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                      axisLine={{ stroke: '#cbd5e1' }}
                    />
                    <YAxis
                      domain={['auto', 'auto']}
                      tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={v => `₹${v}`}
                    />
                    <Tooltip content={<CustomMarketTooltip isTamil={isTamil} />} />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#10b981"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#modalPriceGrad)"
                      name={isTamil ? 'உண்மையான விலை' : 'Actual Price'}
                      connectNulls={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="#0284c7"
                      strokeWidth={2.5}
                      strokeDasharray="5 5"
                      dot={{ r: 4, fill: '#0284c7', stroke: '#fff', strokeWidth: 2 }}
                      name={isTamil ? 'AI கணித்த விலை' : 'AI Forecast'}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Quick Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold text-charcoal-400 uppercase">{isTamil ? 'தற்போதைய கொள்முதல் விலை' : 'Current Mandi Rate'}</span>
                  <p className="text-base font-black text-charcoal-900 mt-0.5">₹{crop.currentPrice?.toLocaleString('en-IN')}/qtl</p>
                </div>
                <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200">
                  <span className="text-[10px] font-bold text-sky-800 uppercase">{isTamil ? '30-நாள் கணித்த விலை' : '30-Day Projected Price'}</span>
                  <p className="text-base font-black text-sky-950 mt-0.5">₹{crop.history?.[crop.history.length - 1]?.predicted?.toLocaleString('en-IN')}/qtl</p>
                </div>
                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase">{isTamil ? 'எதிர்பார்க்கப்படும் தேவை' : 'Predicted Demand Volume'}</span>
                  <p className="text-base font-black text-emerald-950 mt-0.5">{crop.predictedDemand} qtl/day</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-charcoal-500 font-medium">
            {isTamil ? 'நேரலை APMC மற்றும் தேசிய இ-நாம் (e-NAM) சந்தை தரவு' : 'Live APMC & National e-NAM Market Data'}
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-charcoal-700 font-bold rounded-2xl text-xs transition cursor-pointer"
            >
              {isTamil ? 'மூடு' : 'Close'}
            </button>
            <button
              onClick={() => {
                onClose();
                window.location.hash = '#/dashboard/marketplace';
              }}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-field-900 hover:bg-field-800 text-white font-bold rounded-2xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>{isTamil ? 'விற்பனையாளர்களை பார்க்க' : 'Find Buyers for this Crop'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Crop Card with Sparkline & Direct Chart Button ───────────────────────────
function MarketCropCard({ crop, onOpenDetail, isTamil }) {
  const cropName = isTamil ? (CROP_TRANSLATIONS[crop.crop] || crop.crop) : crop.crop;
  const forecastText = crop.forecastPeriod || '30 Days';

  const sparklineData = useMemo(() => {
    if (!crop.history) return [];
    return crop.history.map(h => ({ val: h.price || h.predicted }));
  }, [crop]);

  return (
    <Card className="p-5 md:p-6 bg-white border border-slate-200/90 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{crop.icon}</span>
            <div>
              <h3 className="font-display font-bold text-charcoal-900 text-lg">{cropName}</h3>
              <p className="text-xs text-charcoal-400 font-medium">{crop.mandi}</p>
            </div>
          </div>
          <DemandBadge level={crop.demandLevel} status={crop.demandStatus} isTamil={isTamil} />
        </div>

        {/* Mini Sparkline Chart */}
        <div className="h-14 w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line
                type="monotone"
                dataKey="val"
                stroke={crop.demandTrend === 'Decreasing' ? '#e11d48' : '#16a34a'}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
            <span className="text-charcoal-500 font-medium">{isTamil ? 'தற்போதைய விலை' : 'Current Price'}</span>
            <span className="font-black text-charcoal-900 text-sm">₹{(crop.currentPrice || 0).toLocaleString('en-IN')}/{isTamil ? 'குவிண்டால்' : 'qtl'}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
            <span className="text-charcoal-500 font-medium">{isTamil ? 'தேவை போக்கு' : 'Demand Trend'}</span>
            <TrendPill trend={crop.demandTrend} icon={crop.trendIcon} isTamil={isTamil} />
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
            <span className="text-charcoal-500 font-medium">{isTamil ? 'எதிர்பார்க்கப்படும் தேவை' : 'Predicted Demand'}</span>
            <span className="font-bold text-field-700">{crop.predictedDemand || 0} {isTamil ? 'குவிண்டால்/நாள்' : 'qtl/day'}</span>
          </div>
          <div className="flex justify-between items-center py-1.5">
            <span className="text-charcoal-500 font-medium">{isTamil ? 'முன்னறிவிப்பு காலம்' : 'Forecast'}</span>
            <span className="font-semibold text-charcoal-800">{isTamil ? forecastText.replace('Days', 'நாட்கள்') : forecastText}</span>
          </div>
        </div>
      </div>

      {/* Button to Open Detailed Price & Inter-Market Comparison Graphs */}
      <button
        onClick={() => onOpenDetail(crop)}
        className="w-full mt-2 py-2.5 px-3 rounded-2xl bg-field-50 hover:bg-field-100 text-field-800 border border-field-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm group"
      >
        <ChartIcon size={14} className="text-field-600 group-hover:scale-110 transition-transform" />
        <span>{isTamil ? 'விலை வரைபடம் & சந்தை ஒப்பீடு' : 'View Graphs & Market Comparison'}</span>
        <ArrowRight size={13} className="text-field-600 ml-0.5" />
      </button>
    </Card>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function MarketPrices() {
  const { isTamil } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [mandi, setMandi] = useState('Nashik Mandi');
  const [forecastPeriod, setForecastPeriod] = useState('30 Days');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [selectedModalCrop, setSelectedModalCrop] = useState(null);

  // Synchronous direct load
  const [marketData, setMarketData] = useState(() => getMandiData('Nashik Mandi', '30 Days'));

  const refreshData = (targetMandi = mandi, targetPeriod = forecastPeriod) => {
    setRefreshing(true);
    const data = getMandiData(targetMandi, targetPeriod);
    setMarketData(data);
    setLastUpdated(new Date());
    setTimeout(() => setRefreshing(false), 200);
  };

  const handleMandiChange = (newMandi) => {
    setMandi(newMandi);
    refreshData(newMandi, forecastPeriod);
  };

  const handlePeriodChange = (newPeriod) => {
    setForecastPeriod(newPeriod);
    refreshData(mandi, newPeriod);
  };

  const filteredData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return marketData;
    return marketData.filter(item => {
      const cropEn = (item.crop || '').toLowerCase();
      const cropTa = (CROP_TRANSLATIONS[item.crop] || '').toLowerCase();
      const marketName = (item.market || '').toLowerCase();
      return cropEn.includes(q) || cropTa.includes(q) || marketName.includes(q);
    });
  }, [marketData, searchQuery]);

  const topOpportunity = filteredData.find(c => (c.demandLevel || '').includes('High')) || filteredData[0];

  return (
    <div className="pb-16 max-w-7xl mx-auto pt-6 px-4 sm:px-6 lg:px-8 animate-fade-in space-y-6">
      {/* ── Search Bar ── */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={20} className="text-charcoal-400" />
        </div>
        <input
          type="text"
          placeholder={isTamil ? "பயிர் பெயர் (தக்காளி, வெங்காயம், நெல்...), சந்தையை தேட..." : "Search crop (Tomato, Rice, Potato...), mandi or state..."}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-28 py-3.5 bg-white border border-slate-200 rounded-2xl text-charcoal-900 focus:outline-none focus:border-field-500 focus:ring-2 focus:ring-field-500/20 transition-all shadow-sm font-medium text-sm"
        />
        <div className="absolute inset-y-2 right-2 flex items-center gap-1.5">
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1.5 text-charcoal-400 hover:text-charcoal-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={() => {}}
            className="px-4 py-2 bg-field-600 hover:bg-field-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
          >
            {isTamil ? 'தேடுக' : 'Search'}
          </button>
        </div>
      </div>

      {/* Search Filter Info Indicator */}
      {searchQuery && (
        <div className="flex items-center justify-between bg-emerald-50/80 border border-emerald-200 px-4 py-2.5 rounded-2xl text-xs">
          <span className="font-bold text-emerald-950 flex items-center gap-2">
            <Search size={14} className="text-emerald-700" />
            <span>
              {isTamil
                ? `"${searchQuery}" க்கான தேடல் முடிவுகள்: ${filteredData.length} பயிர்(கள்)`
                : `Search results for "${searchQuery}": ${filteredData.length} crop(s) found`}
            </span>
          </span>
          <button
            onClick={() => setSearchQuery('')}
            className="font-bold text-emerald-700 hover:text-emerald-900 underline transition cursor-pointer"
          >
            {isTamil ? 'அனைத்து பயிர்களையும் காட்டு' : 'Show All Crops'}
          </button>
        </div>
      )}

      {/* ── Market header ── */}
      <div className="border-b border-slate-200/80 pb-5">
        <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest mb-1">
          {isTamil ? 'சந்தை நிலவரம் & விலைப்பட்டியல்' : 'Market Prices'}
        </p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-black text-xl md:text-2xl text-charcoal-900 uppercase tracking-tight">
              {mandi} · {isTamil ? 'புதுப்பிக்கப்பட்டது சற்றுமுன் · விலை ₹/குவிண்டால்' : 'Updated Just now · Prices in ₹/Quintal'}
            </h2>
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <LiveDot /> {isTamil ? 'நேரலை சந்தை நிலவரம்' : 'Live Market Data'}
              </span>
              <button
                onClick={() => refreshData()}
                disabled={refreshing}
                className="flex items-center gap-1.5 text-xs font-bold text-charcoal-500 hover:text-charcoal-900 transition disabled:opacity-40 cursor-pointer"
              >
                <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
                {refreshing ? (isTamil ? 'புதுப்பிக்கப்படுகிறது...' : 'Updating...') : (isTamil ? 'புதுப்பி' : 'Refresh')}
              </button>
            </div>
          </div>

          {/* Mandi selector */}
          <div className="relative shrink-0">
            <select
              value={mandi}
              onChange={e => handleMandiChange(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-2xl font-bold text-charcoal-700 text-xs focus:outline-none focus:border-field-500 cursor-pointer shadow-sm"
            >
              {MANDIS.map(m => <option key={m}>{m}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Interactive Price Trend & Forecast Chart (Auto updates with searched crop) */}
      <MarketPriceTrendGraph crops={filteredData.length > 0 ? filteredData : marketData} isTamil={isTamil} />

      {/* Opportunity */}
      {!searchQuery && topOpportunity && <MarketOpportunity data={topOpportunity} isTamil={isTamil} />}

      {/* Future demand header + controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-charcoal-900 font-display">
            {isTamil ? 'எதிர்கால சந்தை தேவை முன்னறிவிப்பு' : 'Future Market Demand'}
          </h2>
          <p className="text-xs text-charcoal-500 font-medium mt-0.5">
            {isTamil
              ? 'வரலாற்று விலைகள், சந்தை வரத்து, பருவகால போக்குகளின் அடிப்படையிலான தேவை மதிப்பீடு.'
              : 'Predicted demand based on historical prices, market arrivals, seasonal patterns, and available market data.'}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Forecast period */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
            <span className="text-[10px] font-bold text-charcoal-400 px-2">{isTamil ? 'காலம்:' : 'Forecast:'}</span>
            {['7 Days', '30 Days', '60 Days', '90 Days'].map(p => (
              <button key={p} onClick={() => handlePeriodChange(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${forecastPeriod === p ? 'bg-white text-charcoal-900 shadow-sm' : 'text-charcoal-400 hover:text-charcoal-900'}`}>
                {isTamil ? p.replace('Days', 'நாட்கள்') : p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards view with Action Buttons or Empty State */}
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map(crop => (
            <MarketCropCard
              key={crop.id}
              crop={crop}
              onOpenDetail={setSelectedModalCrop}
              isTamil={isTamil}
            />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center bg-white border border-slate-200 rounded-3xl space-y-3">
          <p className="text-4xl">🔍</p>
          <h4 className="font-bold text-charcoal-900 text-base">
            {isTamil ? `"${searchQuery}" க்கான பயிர் தகவல் எதுவும் கிடைக்கவில்லை` : `No crops found matching "${searchQuery}"`}
          </h4>
          <p className="text-xs text-charcoal-500 max-w-md mx-auto">
            {isTamil
              ? 'Tomato (தக்காளி), Potato (உருளைக்கிழங்கு), Onion (வெங்காயம்), Rice (நெல்), Wheat (கோதுமை) போன்ற பயிர்களை தேடிப்பார்க்கவும்.'
              : 'Try searching for Tomato, Potato, Maize, Wheat, Rice, Onion, Brinjal, Chilli, Carrot, Cotton, Groundnut, or Soybean.'}
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-5 py-2.5 bg-field-600 hover:bg-field-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
          >
            {isTamil ? 'அனைத்து பயிர்களையும் மீட்டமை' : 'Reset Search'}
          </button>
        </Card>
      )}

      {/* ── Modal: Inter-Market Price Comparison & Trend Graph ── */}
      {selectedModalCrop && (
        <CropMarketDetailModal
          crop={selectedModalCrop}
          onClose={() => setSelectedModalCrop(null)}
          isTamil={isTamil}
        />
      )}
    </div>
  );
}
