import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../../components/ui/index';
import { soilService } from '../../services/soilService';
import { irrigationService } from '../../services/irrigationService';
import { sensorService } from '../../services/sensorService';
import { growthTrackingService } from '../../services/growthTrackingService';
import { yieldPredictionService } from '../../services/yieldPredictionService';
import { harvestService } from '../../services/harvestService';
import {
  Droplets, FlaskConical, Thermometer, Calendar, Plus, AlertTriangle,
  RefreshCw, CheckCircle2, XCircle, ChevronDown, ChevronRight, X,
  Radio, Sparkles, Sprout, Leaf, Activity, Info, ShieldAlert,
  ArrowUpRight, ArrowRight, Clock, Battery, Wifi, Layers, HelpCircle,
  Play, Pause, Check, TrendingUp, TrendingDown, Sun, Wind,
  LineChart as ChartIcon, CheckSquare, Eye, Award, BarChart3,
  CalendarDays, Scissors, ShieldCheck, Zap
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ReferenceLine, AreaChart, Area
} from 'recharts';

function LiveDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
    </span>
  );
}

// ─── Custom Tooltip for Charts ────────────────────────────────────────────────
const CustomChartTooltip = ({ active, payload, label, unit = '%', isTamil = false }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-charcoal-900 text-white rounded-2xl p-3 shadow-xl text-xs space-y-1 border border-white/10">
      <p className="font-bold text-slate-300">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5" style={{ color: p.color || p.stroke }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.color || p.stroke }} />
            {p.name}:
          </span>
          <span className="font-bold text-white tabular-nums">
            {p.value} {unit}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MODALS
// ─────────────────────────────────────────────────────────────────────────────

// 1. Detailed Advisory Modal
function DetailedAdvisoryModal({ onClose, soilMetrics, activeCrop, isTamil }) {
  const cropDisplay = isTamil ? (activeCrop === 'Tomato' ? 'தக்காளி' : activeCrop === 'Wheat' ? 'கோதுமை' : activeCrop === 'Maize' ? 'மக்காச்சோளம்' : activeCrop) : activeCrop;

  return (
    <div className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-3 z-50 animate-fade-in">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-field-900 to-field-800 text-white rounded-t-[2rem] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Sparkles size={20} className="text-harvest-300" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-white">
                {isTamil ? 'விரிவான AI மண் ஆலோசனை' : 'Detailed AI Soil Advisory'}
              </h2>
              <p className="text-field-200 text-xs font-semibold mt-0.5">
                {isTamil ? `${cropDisplay} பயிருக்கான வேளாண் ஆய்வு` : `Holistic Agronomic Analysis for ${cropDisplay}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-sm text-charcoal-700">
          {/* Soil Physics */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h4 className="font-bold text-charcoal-900 flex items-center gap-2">
              <Layers size={16} className="text-field-600" /> 
              {isTamil ? 'மண் அமைப்பு & காற்றோட்டம்' : 'Soil Physical Structure & Aeration'}
            </h4>
            <p className="leading-relaxed text-xs">
              {isTamil
                ? 'உங்கள் நிலத்தின் மண் வண்டல் மண் வகையைச் சேர்ந்தது. இதில் 2.8% இயற்கை கரிமச்சத்து உள்ளது. இது வேர் வளர்ச்சிக்கும் நீர் வடியவும் மிகவும் ஏற்றது.'
                : 'Your field soil is classified as Loamy Soil with an estimated Organic Matter content of 2.8%. Loam provides an optimal balance between water retention and root zone drainage.'
              }
            </p>
          </div>

          {/* Root Zone Water Dynamics */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
            <h4 className="font-bold text-blue-900 flex items-center gap-2">
              <Droplets size={16} className="text-blue-600" /> 
              {isTamil ? 'வேர் மண்டல ஈரப்பதம்' : 'Root Zone Moisture Dynamics'}
            </h4>
            <p className="leading-relaxed text-blue-950 text-xs">
              {isTamil
                ? `மேல்மண் ஈரப்பதம் ${soilMetrics.moisture}% ஆக உள்ளது. 12 மணிநேரத்திற்குள் மழை வாய்ப்பு இருப்பதால், செயற்கை பாசனத்தை தவிர்ப்பது வேரழுகலை தடுக்கும்.`
                : `Current topsoil moisture is at ${soilMetrics.moisture}%. With high rain probability within 12 hours, natural capillary action will replenish the upper root profile without requiring mechanical irrigation.`
              }
            </p>
          </div>

          {/* Agronomist Advisory */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <h4 className="font-bold text-emerald-900 mb-1 text-xs uppercase tracking-wider">
              {isTamil ? 'பரிந்துரைக்கப்பட்ட நடவடிக்கைகள்' : 'Recommended Action Protocol'}
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-emerald-950 text-xs font-medium">
              <li>{isTamil ? 'மழை பொழியும் வரை சொட்டுநீர் பாசனத்தை நிறுத்தி வைக்கவும்.' : 'Hold off on all drip/sprinkler runs until post-rain soil assessment.'}</li>
              <li>{isTamil ? 'மழை நின்ற 24 மணி நேரத்திற்குப் பிறகு யூரியா @ 25 கிலோ/ஏக்கர் இடவும்.' : 'Plan top-dress Nitrogen application (Urea @ 25 kg/acre) 24h after rainfall.'}</li>
              <li>{isTamil ? 'அதிக ஈரப்பதம் நீடித்தால் இலைப்புள்ளி நோய்களை கண்காணிக்கவும்.' : 'Inspect lower leaves for fungal leaf spot if high humidity continues.'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Crop Recommendations Modal
function CropRecommendationsModal({ onClose, crops, isTamil }) {
  return (
    <div className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-3 z-50 animate-fade-in">
      <div className="bg-white rounded-[2rem] w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-field-900 to-field-800 text-white rounded-t-[2rem] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Sprout size={20} className="text-harvest-300" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-white">
                {isTamil ? 'பயிர் பொருத்தப்பாடு அட்டவணை' : 'Crop Suitability Matrix'}
              </h2>
              <p className="text-field-200 text-xs font-semibold mt-0.5">
                {isTamil ? 'மண் pH 6.4 & நீர் வளத்தின் அடிப்படையில் தரவரிசை' : 'Ranked by pH 6.4, Loamy Soil & Water Availability'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto space-y-4 flex-1">
          {crops.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-field-300 hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{c.emoji}</span>
                  <div>
                    <h3 className="font-bold text-charcoal-900 text-lg">
                      {isTamil ? (c.name === 'Tomato' ? 'தக்காளி' : c.name === 'Wheat' ? 'கோதுமை' : c.name === 'Maize' ? 'மக்காச்சோளம்' : c.name === 'Cotton' ? 'பருத்தி' : c.name === 'Potato' ? 'உருளைக்கிழங்கு' : c.name) : c.name}
                    </h3>
                    <p className="text-xs text-charcoal-500 font-medium">pH Match: {c.phMatch}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                    c.suitability === 'High' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {c.suitability === 'High' ? (isTamil ? '🟢 அதிக பொருத்தம்' : '🟢 High Suitability') : (isTamil ? '🟡 நடுத்தர பொருத்தம்' : '🟡 Medium Suitability')} ({c.suitabilityScore}%)
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-charcoal-600 bg-slate-50 p-3 rounded-xl">
                <p><strong>{isTamil ? 'நீர் தேவை:' : 'Water Requirement:'}</strong> {c.waterReq}</p>
                <p><strong>{isTamil ? 'பொருத்தம் குறிப்பு:' : 'Agronomic Note:'}</strong> {c.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 3. Hydration & Irrigation Review Modal
function HydrationReviewModal({ onClose, soilMetrics, isTamil }) {
  const [dripPaused, setDripPaused] = useState(true);
  const [runningOverride, setRunningOverride] = useState(false);
  const [overrideDone, setOverrideDone] = useState(false);

  const handleTriggerOverride = () => {
    setRunningOverride(true);
    setTimeout(() => {
      setRunningOverride(false);
      setOverrideDone(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-3 z-50 animate-fade-in">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-t-[2rem] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Droplets size={22} className="text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full text-white">
                {isTamil ? 'பாசன நிலை ஆய்வு' : 'Hydration Diagnostic'}
              </span>
              <h2 className="font-display font-bold text-xl text-white mt-0.5">
                {isTamil ? 'மண் ஈரப்பதம் & பாசன ஆலோசனை' : 'Soil Moisture & Hydration Review'}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-sm text-charcoal-700">
          {/* Situation Card */}
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle size={15} className="text-amber-700" />
                {isTamil ? 'தற்போதைய ஈரப்பதம்: 32% (குறைவு)' : 'Current Moisture: 32% (Below Optimal)'}
              </span>
              <span className="text-xs font-bold text-amber-800 bg-amber-200/70 px-2.5 py-0.5 rounded-full">
                {isTamil ? 'உகந்த அளவு: 40–70%' : 'Ideal: 40–70%'}
              </span>
            </div>

            {/* Visual Gauge Bar */}
            <div className="space-y-1">
              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500" 
                  style={{ width: '32%' }}
                />
                <div 
                  className="absolute top-0 bottom-0 border-l border-r border-emerald-500 bg-emerald-500/20 pointer-events-none"
                  style={{ left: '40%', width: '30%' }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-charcoal-400 font-bold px-0.5">
                <span>0% ({isTamil ? 'உலர்' : 'Dry'})</span>
                <span className="text-emerald-700">40%–70% ({isTamil ? 'உகந்த மண்டலம்' : 'Optimal Zone'})</span>
                <span>100% ({isTamil ? 'அதிக நீர்' : 'Saturated'})</span>
              </div>
            </div>
          </div>

          {/* AI Decision overlay */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-blue-900">
              <span className="flex items-center gap-1.5">
                🌧️ {isTamil ? 'வானிலை: அடுத்த 12 மணி நேரத்தில் 75% கனமழை வாய்ப்பு' : 'Weather: 75% Rain Probability in next 12h'}
              </span>
              <span className="bg-blue-200 text-blue-900 px-2 py-0.5 rounded-md text-[10px]">
                15–25 mm
              </span>
            </div>
            <p className="text-xs font-medium text-blue-950 leading-relaxed">
              {isTamil
                ? '🤖 AI ஆலோசனை: தற்போது தானியங்கி பாசனத்தை ஒத்திவைக்கவும். எதிர்பார்க்கப்படும் மழை மண்ணின் ஈரப்பதத்தை 40%–60% நிலைக்கு இயற்கையாகவே உயர்த்தும். இப்போது பாசனம் செய்தால் நிலத்தில் நீர் தேங்கி வேரழுகல் அபாயம் ஏற்படும்.'
                : '🤖 AI Recommendation: Postpone mechanical irrigation. Natural precipitation will restore root zone moisture into the 40–60% zone. Adding irrigation now will cause saturation and anaerobic root stress.'}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => setDripPaused(prev => !prev)}
              className={`w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                dripPaused
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-200 hover:bg-slate-300 text-charcoal-800'
              }`}
            >
              {dripPaused ? <Check size={16} /> : <Pause size={16} />}
              {dripPaused
                ? (isTamil ? 'தானியங்கி பாசனம் இடைநிறுத்தப்பட்டது ✓' : 'Irrigation Schedule Paused ✓')
                : (isTamil ? 'பாசனத்தை இடைநிறுத்துக' : 'Pause Automated Irrigation')}
            </button>

            <button
              onClick={handleTriggerOverride}
              disabled={runningOverride || overrideDone}
              className="w-full sm:w-auto py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-charcoal-800 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Play size={14} className={runningOverride ? 'animate-spin' : ''} />
              {runningOverride
                ? (isTamil ? 'இயக்கப்படுகிறது...' : 'Starting...')
                : overrideDone
                ? (isTamil ? 'பாசனம் தொடங்கப்பட்டது (30 நிமி)' : 'Drip Started (30 mins)')
                : (isTamil ? 'கட்டாய பாசனம் (30 நிமி)' : 'Override & Run 30 Mins')}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-xs text-charcoal-400 font-medium">
            {isTamil ? 'அடுத்த தானியங்கி ஆய்வு: 6 மணி நேரத்தில்' : 'Next Scheduled Review: In 6 hours'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            {isTamil ? 'முடிந்தது' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

// 4. Nutrient Advisory Modal
function NutrientAdvisoryModal({ onClose, isTamil }) {
  return (
    <div className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-3 z-50 animate-fade-in">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-emerald-800 to-emerald-700 text-white rounded-t-[2rem] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <FlaskConical size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-white">
                {isTamil ? 'மண் ஊட்டச்சத்து மேலாண்மை வழிகாட்டல்' : 'Soil Nutrient & NPK Advisory'}
              </h2>
              <p className="text-emerald-100 text-xs font-semibold mt-0.5">
                {isTamil ? 'தழைச்சத்து, மணிச்சத்து, சாம்பல் சத்து சமநிலை' : 'Nitrogen, Phosphorus & Potassium Optimization'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto space-y-5 flex-1 text-sm text-charcoal-700">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <h4 className="font-bold text-amber-900 flex items-center gap-2 mb-1">
              <AlertTriangle size={16} className="text-amber-700" />
              {isTamil ? 'தழைச்சத்து (Nitrogen) கவனம் தேவை' : 'Nitrogen Needs Mild Supplementation'}
            </h4>
            <p className="text-xs text-amber-950 leading-relaxed font-medium">
              {isTamil 
                ? 'தற்போதைய தழைச்சத்து அளவு 42% (நடுத்தரம்). பூக்கும் மற்றும் காய் பிடிக்கும் பருவத்தில் நைட்ரஜன் பற்றாக்குறை மகசூலை பாதிக்கலாம். மழைக்குப் பிறகு யூரியா அல்லது மண்புழு உரம் இடுவது சிறந்தது.'
                : 'Nitrogen index is at 42% (Medium). During flowering and fruit setting, nitrogen demand spikes. A planned split-dose urea application (25 kg/acre) post-rainfall will support canopy vigor.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <p className="font-bold text-xs text-charcoal-900 mb-1">🟢 {isTamil ? 'மணிச்சத்து (P) — 61% (அதிகம்)' : 'Phosphorus (P) — 61% (High)'}</p>
              <p className="text-xs text-charcoal-600 font-medium">{isTamil ? 'வேர் அமைப்பு வலுவாக உள்ளது. கூடுதல் பாஸ்பரஸ் இடத் தேவையில்லை.' : 'Excellent root establishment. No additional phosphate fertilizer required.'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <p className="font-bold text-xs text-charcoal-900 mb-1">🟡 {isTamil ? 'சாம்பல் சத்து (K) — 55% (நடுத்தரம்)' : 'Potassium (K) — 55% (Medium)'}</p>
              <p className="text-xs text-charcoal-600 font-medium">{isTamil ? 'பழங்களின் அளவு மற்றும் நிறத்தை அதிகரிக்க பொட்டாஷ் தெளிக்கலாம்.' : 'Adequate for flowering; foliar potassium nitrate spray will boost fruit size.'}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
            <p className="font-bold uppercase tracking-wider">{isTamil ? 'மண் வள மேலாண்மை குறிப்பு' : 'Agronomist Guidance'}</p>
            <p className="font-medium leading-relaxed">
              {isTamil 
                ? 'மண்ணின் கரிம சத்தை (Organic Carbon 2.8%) பராமரிக்க பயிர் கழிவுகளை மூடாக்காக பயன்படுத்தவும். இது நுண்ணுயிர்களின் பெருக்கத்திற்கு உதவும்.'
                : 'Maintain organic mulch to conserve moisture and encourage soil microbiology for natural nitrogen mineralization.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. Irrigation History Modal
function IrrigationHistoryModal({ onClose, history, isTamil }) {
  return (
    <div className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-3 z-50 animate-fade-in">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-t-[2rem] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Droplets size={20} className="text-blue-300" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-white">
                {isTamil ? 'முழு பாசன பதிவுகள் & வரலாறு' : 'Full Irrigation Logs & History'}
              </h2>
              <p className="text-blue-100 text-xs font-semibold mt-0.5">
                {isTamil ? 'நிலப்பிரிவு வாரியான கடந்த கால பாசன பதிவுகள்' : 'Historical water volumes, run durations & methods'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto space-y-3 flex-1">
          {history.map((log) => (
            <div key={log.id} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-sm text-charcoal-900">{log.field} · <span className="text-field-700">{log.date}</span></p>
                <p className="text-xs text-charcoal-500 font-medium mt-0.5">{log.method} · {log.notes}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="font-black text-sm text-charcoal-900">{log.amount}</span>
                <p className="text-[10px] font-bold text-charcoal-400">{log.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SOIL & WATER PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function SoilIrrigation() {
  const { activeFarm } = useAuth();
  const { isTamil } = useLanguage();

  // Core Data & State
  const [soilMetrics, setSoilMetrics] = useState(soilService.getSoilMetrics());
  const [activeTrendPeriod, setActiveTrendPeriod] = useState('30d'); // 7d | 30d | 90d
  const [activeHistoryTab, setActiveHistoryTab] = useState('moisture'); // moisture | ph | npk

  // Fertilizer interactive selectors
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [selectedStage, setSelectedStage] = useState('Flowering');

  // Sensor online simulation
  const [isSensorOnline, setIsSensorOnline] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState(isTamil ? 'சற்றுமுன்' : 'Just now');

  // Modals state
  const [modalType, setModalType] = useState(null);

  // Dynamic calculations from services
  const cropSuitability = useMemo(() => soilService.getCropSuitability(), []);
  const fertilizerAdvisory = useMemo(
    () => soilService.getFertilizerAdvisory(selectedCrop, selectedStage),
    [selectedCrop, selectedStage]
  );
  const irrigationHistory = useMemo(() => irrigationService.getIrrigationHistory(), []);
  const primarySensor = useMemo(() => sensorService.getPrimarySensorReading(isSensorOnline), [isSensorOnline]);
  const trendData = useMemo(() => soilService.getSoilTrends(activeTrendPeriod), [activeTrendPeriod]);

  // Growth, Yield & Harvest services
  const growthTracking = useMemo(() => growthTrackingService.getGrowthTracking(selectedCrop), [selectedCrop]);
  const yieldPrediction = useMemo(() => yieldPredictionService.getYieldPrediction(selectedCrop), [selectedCrop]);
  const harvestRecommendation = useMemo(() => harvestService.getHarvestRecommendation(selectedCrop), [selectedCrop]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdatedTime(isTamil ? 'சற்றுமுன்' : 'Just now');
    }, 400);
  };

  return (
    <div className="pb-24 max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* ── 1. Page Header ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal-900 flex items-center gap-2">
            {isTamil ? 'மண் & நீர் வளம்' : 'Soil & Water'} <span role="img" aria-label="droplets">💧</span>
          </h1>
          <p className="text-charcoal-500 font-medium text-sm mt-1">
            {isTamil 
              ? 'மண் வளம், ஈரப்பதம் மற்றும் பாசன வழிகாட்டல்களை கண்காணிக்கவும்.'
              : 'Monitor soil health, water conditions, and irrigation recommendations.'}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Sensor connection pill */}
          <button
            onClick={() => setIsSensorOnline((prev) => !prev)}
            title="Click to toggle online/offline sensor simulator"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
              isSensorOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              {isSensorOnline && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isSensorOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            </span>
            {isSensorOnline ? (isTamil ? 'சென்சார் இணைப்பில் உள்ளது' : 'Sensors Online') : (isTamil ? 'சென்சார் இணைப்பு இல்லை' : 'Sensors Offline')}
          </button>

          {/* Last updated */}
          <span className="text-xs text-charcoal-400 font-medium flex items-center gap-1">
            <Clock size={13} /> {isTamil ? 'புதுப்பிக்கப்பட்டது' : 'Updated'} {lastUpdatedTime}
          </span>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-charcoal-500 hover:text-charcoal-900 hover:bg-white bg-slate-100 rounded-full border border-slate-200 shadow-sm transition disabled:opacity-50 cursor-pointer"
            title="Refresh Soil & Water telemetry"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin text-field-600' : ''} />
          </button>
        </div>
      </div>

      {/* ── 2. Priority Alert ──────────────────────────────────────────────── */}
      <div className="rounded-3xl p-5 md:p-6 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0 shadow-inner">
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                {isTamil ? 'கவனம் தேவை' : 'Attention Required'}
              </span>
              <span className="text-xs text-charcoal-400 font-medium">{isTamil ? 'நிலப்பிரிவு: பிளாட் A வடக்கு' : 'Field: Plot A North'}</span>
            </div>
            <h2 className="font-display font-bold text-lg text-charcoal-900 mt-1">
              {isTamil ? 'மண் ஈரப்பதம் உகந்த அளவை விட குறைவாக உள்ளது' : 'Soil moisture is below the ideal range'}
            </h2>
            <p className="text-xs text-charcoal-600 font-medium mt-0.5">
              {isTamil 
                ? `தற்போதைய அளவு: ${soilMetrics.moisture}% · உகந்த அளவு: 40–70% · பரிந்துரை: மழை வாய்ப்பு உள்ளதால் பாசனம் ஒத்திவைக்கப்பட்டுள்ளது.`
                : `Current: ${soilMetrics.moisture}% · Ideal Range: 40–70% · Recommended: Irrigation review scheduled due to forecasted rainfall.`}
            </p>
          </div>
        </div>

        <button
          onClick={() => setModalType('irrigation')}
          className="self-start md:self-center bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition transform hover:-translate-y-0.5 shrink-0 cursor-pointer"
        >
          {isTamil ? 'பாசனத்தை சரிபார்க்க' : 'Review Hydration'}
        </button>
      </div>

      {/* ── 3. Soil Health Overview (6 Compact Cards) ──────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-charcoal-900 flex items-center gap-2">
            <Sprout size={20} className="text-field-600" /> 
            {isTamil ? '🌱 மண் வள நிலவரம்' : '🌱 Soil Health'}
          </h2>
          <span className="text-xs text-charcoal-400 font-medium">
            {isTamil ? 'மண் வகை: வண்டல் மண்' : `Type: ${soilMetrics.soilType}`}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Moisture */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Droplets size={20} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                {isTamil ? 'குறைவு' : 'Low'}
              </span>
            </div>
            <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">{isTamil ? 'மண் ஈரப்பதம்' : 'Soil Moisture'}</p>
            <p className="font-black text-2xl text-charcoal-900 mt-0.5">{soilMetrics.moisture}%</p>
            <p className="text-[10px] text-charcoal-400 font-medium mt-1">{isTamil ? 'உகந்தது: 40–70%' : 'Ideal: 40–70%'}</p>
          </div>

          {/* pH */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FlaskConical size={20} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {isTamil ? 'சிறந்தது' : 'Optimal'}
              </span>
            </div>
            <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">{isTamil ? 'மண் pH' : 'Soil pH'}</p>
            <p className="font-black text-2xl text-charcoal-900 mt-0.5">{soilMetrics.ph}</p>
            <p className="text-[10px] text-charcoal-400 font-medium mt-1">{isTamil ? 'உகந்தது: 6.0–7.0' : 'Ideal: 6.0–7.0'}</p>
          </div>

          {/* Nitrogen */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Leaf size={20} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                {isTamil ? 'நடுத்தரம்' : 'Medium'}
              </span>
            </div>
            <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">{isTamil ? 'தழைச்சத்து (N)' : 'Nitrogen'}</p>
            <p className="font-black text-2xl text-charcoal-900 mt-0.5">{isTamil ? 'நடுத்தரம்' : 'Medium'}</p>
            <p className="text-[10px] text-charcoal-400 font-medium mt-1">{isTamil ? 'அளவு: 42%' : 'Index: 42%'}</p>
          </div>

          {/* Phosphorus */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FlaskConical size={20} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {isTamil ? 'அதிகம்' : 'High'}
              </span>
            </div>
            <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">{isTamil ? 'மணிச்சத்து (P)' : 'Phosphorus'}</p>
            <p className="font-black text-2xl text-charcoal-900 mt-0.5">{isTamil ? 'அதிகம்' : 'High'}</p>
            <p className="text-[10px] text-charcoal-400 font-medium mt-1">{isTamil ? 'அளவு: 61%' : 'Index: 61%'}</p>
          </div>

          {/* Potassium */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity size={20} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                {isTamil ? 'நடுத்தரம்' : 'Medium'}
              </span>
            </div>
            <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">{isTamil ? 'சாம்பல் சத்து (K)' : 'Potassium'}</p>
            <p className="font-black text-2xl text-charcoal-900 mt-0.5">{isTamil ? 'நடுத்தரம்' : 'Medium'}</p>
            <p className="text-[10px] text-charcoal-400 font-medium mt-1">{isTamil ? 'அளவு: 55%' : 'Index: 55%'}</p>
          </div>

          {/* Soil Temp */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Thermometer size={20} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {isTamil ? 'சிறந்தது' : 'Optimal'}
              </span>
            </div>
            <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">{isTamil ? 'மண் வெப்பநிலை' : 'Soil Temp.'}</p>
            <p className="font-black text-2xl text-charcoal-900 mt-0.5">{soilMetrics.temperature}°C</p>
            <p className="text-[10px] text-charcoal-400 font-medium mt-1">{isTamil ? 'உகந்தது: 24–30°C' : 'Optimal Range'}</p>
          </div>
        </div>
      </div>

      {/* ── 4. Overall Soil Health Status & 5. AI Soil Advisory (2-Column Grid) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 4: Overall Soil Health */}
        <Card className="p-6 md:p-7 bg-white border border-slate-200/90 rounded-3xl shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
                {isTamil ? 'ஒட்டுமொத்த மண் ஆரோக்கியம்' : 'Overall Soil Health'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black">
                🟢 {isTamil ? 'நல்ல நிலை' : 'Good'}
              </span>
            </div>
            <p className="font-display font-bold text-xl text-charcoal-900 leading-snug">
              {isTamil ? '“தற்போதைய பயிர் வளர்ச்சிக்கு மண் நிலைமைகள் மிகவும் உகந்ததாக உள்ளன.”' : '“Soil conditions are generally suitable for the current crop.”'}
            </p>

            {/* Quick scan breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-5">
              {[
                { name: isTamil ? 'ஈரப்பதம்' : 'Moisture', status: isTamil ? 'கவனம் தேவை' : 'Needs attention', color: 'bg-amber-50 text-amber-800 border-amber-200' },
                { name: 'pH', status: isTamil ? 'சிறந்தது' : 'Optimal', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                { name: isTamil ? 'தழைச்சத்து N' : 'Nitrogen', status: isTamil ? 'நடுத்தரம்' : 'Medium', color: 'bg-amber-50 text-amber-800 border-amber-200' },
                { name: isTamil ? 'மணிச்சத்து P' : 'Phosphorus', status: isTamil ? 'நல்லது' : 'Good', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                { name: isTamil ? 'சாம்பல் சத்து K' : 'Potassium', status: isTamil ? 'நடுத்தரம்' : 'Medium', color: 'bg-amber-50 text-amber-800 border-amber-200' },
              ].map((item, i) => (
                <div key={i} className={`p-2.5 rounded-2xl border ${item.color} text-center`}>
                  <p className="text-[10px] font-bold opacity-80">{item.name}</p>
                  <p className="font-bold text-xs mt-0.5">{item.status}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Section 5: AI Soil Advisory */}
        <Card className="p-6 md:p-7 bg-gradient-to-br from-field-900 to-field-950 text-white rounded-3xl shadow-md space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-harvest-300" />
              <h3 className="font-display font-bold text-lg text-white">
                {isTamil ? '🤖 AI மண் ஆலோசனை' : '🤖 AI Soil Advisory'}
              </h3>
            </div>
            <p className="text-field-100 text-sm font-medium leading-relaxed mb-4">
              🌱 {isTamil ? 'மண் தற்போதைய தக்காளி/கோதுமை சாகுபடிக்கு மிகவும் பொருத்தமானது.' : 'Soil is generally suitable for current crop cultivation.'}
            </p>

            <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10 space-y-2 text-xs">
              <p className="font-bold text-harvest-300 uppercase tracking-wider text-[10px]">
                {isTamil ? 'பரிந்துரைக்கப்பட்ட நடவடிக்கை' : 'Recommended Action'}
              </p>
              <p className="text-field-100 font-medium leading-relaxed">
                {isTamil
                  ? 'அடுத்த களப்பணிக்கு முன் பாசன தேவையை மறுஆய்வு செய்யவும். ஈரப்பதம் விரும்பிய அளவை விட குறைவாக இருப்பதால் உன்னிப்பாக கண்காணிக்கவும்.'
                  : 'Review irrigation needs before the next field activity. Monitor moisture closely because it is below the preferred range.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setModalType('advisory')}
            className="w-full py-3 bg-white text-field-950 font-bold text-xs rounded-2xl hover:bg-harvest-100 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            {isTamil ? 'முழு ஆலோசனையை பார்க்க' : 'View Detailed Advisory'} <ArrowRight size={14} />
          </button>
        </Card>
      </div>

      {/* ── 9. Irrigation Advisory & 10. Irrigation Decision Card ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section 9: Irrigation Advisory */}
        <Card className="lg:col-span-8 p-6 md:p-7 bg-white border border-slate-200/90 rounded-3xl shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
                {isTamil ? 'பாசன ஆலோசனை' : '💧 Irrigation Advisory'}
              </span>
              <h3 className="font-display font-bold text-xl text-charcoal-900 mt-0.5">
                {isTamil ? 'இப்போது பாசனம் செய்ய வேண்டுமா?' : 'Should the farmer irrigate now?'}
              </h3>
            </div>
            <div className="self-start sm:self-center px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-black text-sm tracking-wider">
              {isTamil ? 'காத்திருக்கவும் — மழை வாய்ப்பு' : 'WAIT — Rain Expected'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
            <Info size={18} className="text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-950 font-medium leading-relaxed">
              <strong>{isTamil ? 'காரணம்:' : 'Reason:'}</strong> {isTamil ? 'அடுத்த 12 மணி நேரத்தில் 75% வாய்ப்புடன் மழை பெய்யும் என கணிக்கப்பட்டுள்ளது. இப்போது பாசனம் செய்வது பயிர்களுக்கு அதிக நீர் தேக்கத்தை ஏற்படுத்தும்.' : 'Rain is expected within the next 12 hours. Additional irrigation now may cause waterlogging and root suffocation.'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <p className="text-[10px] font-bold text-charcoal-400">{isTamil ? 'மண் ஈரப்பதம்' : 'Soil Moisture'}</p>
              <p className="font-black text-base text-charcoal-900 mt-0.5">{soilMetrics.moisture}%</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <p className="text-[10px] font-bold text-charcoal-400">{isTamil ? 'மழை சாத்தியம்' : 'Rain Probability'}</p>
              <p className="font-black text-base text-blue-700 mt-0.5">75%</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <p className="text-[10px] font-bold text-charcoal-400">{isTamil ? 'கடைசி பாசனம்' : 'Last Irrigation'}</p>
              <p className="font-bold text-base text-charcoal-800 mt-0.5">{isTamil ? '2 நாட்களுக்கு முன்' : '2 days ago'}</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <p className="text-[10px] font-bold text-charcoal-400">{isTamil ? 'அடுத்த ஆய்வு' : 'Next Review'}</p>
              <p className="font-bold text-base text-emerald-700 mt-0.5">{isTamil ? '6 மணி நேரத்தில்' : '6 hours'}</p>
            </div>
          </div>
        </Card>

        {/* Section 10: Irrigation Decision Card & Section 11: Water Requirement */}
        <Card className="lg:col-span-4 p-6 md:p-7 bg-gradient-to-br from-blue-900 to-blue-950 text-white rounded-3xl shadow-md space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Droplets size={18} className="text-blue-300" />
              <h3 className="font-display font-bold text-lg text-white">
                {isTamil ? '💧 நான் என்ன செய்ய வேண்டும்?' : '💧 What Should I Do?'}
              </h3>
            </div>
            <p className="text-blue-100 font-bold text-base leading-snug mb-3">
              {isTamil ? 'பாசனம் செய்யாமல் காத்திருக்கவும்.' : 'Wait before irrigating.'}
            </p>
            <p className="text-xs text-blue-200/90 leading-relaxed">
              {isTamil 
                ? 'மழை பெய்ய அதிக வாய்ப்பு உள்ளதால் கூடுதல் பாசனம் தேவைப்படாது.'
                : 'Rain probability is high and additional irrigation may not be necessary.'}
            </p>

            {/* Section 11: Water Requirement */}
            <div className="mt-4 p-3.5 bg-white/10 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-300">{isTamil ? 'தண்ணீர் தேவை (மதிப்பீடு)' : 'Estimated Water Requirement'}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="font-black text-lg text-white">18–22 mm</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {isTamil ? 'மிதமானது (24 மணி)' : 'Moderate (Next 24h)'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setModalType('irrigation')}
            className="w-full py-3 bg-white text-blue-950 font-bold text-xs rounded-2xl hover:bg-blue-50 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            {isTamil ? 'பாசன விவரங்களை பார்க்க' : 'View Irrigation Details'} <ArrowRight size={14} />
          </button>
        </Card>
      </div>

      {/* ── 8. Live Sensor Data ─────────────────────────────────────────────── */}
      <Card className="p-6 md:p-7 bg-white border border-slate-200/90 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-field-100 text-field-700 flex items-center justify-center">
              <Radio size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-charcoal-900 flex items-center gap-2">
                {isTamil ? '📡 நேரலை சென்சார் அளவீடுகள்' : '📡 Live Sensor Data'}
              </h3>
              <p className="text-xs text-charcoal-400 font-medium">
                {primarySensor.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
              isSensorOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              <LiveDot /> {isSensorOnline ? (isTamil ? 'இணைப்பில் உள்ளது' : 'Sensors Online') : (isTamil ? 'இணைப்பற்றுள்ளது' : 'Sensors Offline')}
            </span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1 text-xs font-bold text-field-700 hover:text-field-800 bg-field-50 px-3 py-1.5 rounded-xl border border-field-200 cursor-pointer"
            >
              <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
              {isTamil ? 'சென்சார் புதுப்பி' : 'Refresh Sensor Data'}
            </button>
          </div>
        </div>

        {isSensorOnline ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl">
              <p className="text-[10px] font-bold text-charcoal-400 uppercase">{isTamil ? 'மண் ஈரப்பதம்' : 'Soil Moisture'}</p>
              <p className="font-black text-2xl text-charcoal-900 mt-1">{soilMetrics.moisture}%</p>
              <p className="text-[10px] text-amber-700 font-bold mt-1">🟡 {isTamil ? 'கவனம் தேவை' : 'Attention'}</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl">
              <p className="text-[10px] font-bold text-charcoal-400 uppercase">{isTamil ? 'மண் வெப்பநிலை' : 'Soil Temperature'}</p>
              <p className="font-black text-2xl text-charcoal-900 mt-1">{primarySensor.soilTemp}°C</p>
              <p className="text-[10px] text-emerald-700 font-bold mt-1">🟢 {isTamil ? 'உகந்தது' : 'Optimal'}</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl">
              <p className="text-[10px] font-bold text-charcoal-400 uppercase">{isTamil ? 'காற்று வெப்பநிலை' : 'Air Temperature'}</p>
              <p className="font-black text-2xl text-charcoal-900 mt-1">{primarySensor.airTemp}°C</p>
              <p className="text-[10px] text-charcoal-500 font-medium mt-1">{isTamil ? 'மிதமான வெயில்' : 'Warm Daylight'}</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl">
              <p className="text-[10px] font-bold text-charcoal-400 uppercase">{isTamil ? 'காற்று ஈரப்பதம்' : 'Air Humidity'}</p>
              <p className="font-black text-2xl text-charcoal-900 mt-1">{primarySensor.humidity}%</p>
              <p className="text-[10px] text-blue-700 font-bold mt-1">🌧️ {isTamil ? 'அதிகரிக்கும் ஈரப்பதம்' : 'Rising Humidity'}</p>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-3">
            <p className="font-bold text-rose-900 text-sm">
              🔴 {isTamil ? 'சென்சார் இணைப்பு துண்டிக்கப்பட்டுள்ளது' : 'Sensors Offline'}
            </p>
            <p className="text-xs text-rose-700 font-medium">
              {isTamil ? 'கடைசி அளவீடு 18 நிமிடங்களுக்கு முன் பெறப்பட்டது.' : 'Last reading received 18 minutes ago.'}
            </p>
            <button
              onClick={() => setIsSensorOnline(true)}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              {isTamil ? 'மீண்டும் இணைக்க' : 'Retry Connection'}
            </button>
          </div>
        )}
      </Card>

      {/* ── 22. Crop Growth Tracking & 23. Yield Prediction & 24. Harvest Recommendation ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section 22: Crop Growth Tracking */}
        <Card className="p-6 md:p-7 bg-white border border-slate-200/90 rounded-3xl shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{growthTracking.emoji}</span>
                <div>
                  <h3 className="font-display font-bold text-base text-charcoal-900">
                    {growthTracking.crop} — {isTamil ? `நாள் ${growthTracking.currentDay}` : `Day ${growthTracking.currentDay}`}
                  </h3>
                  <p className="text-[10px] text-charcoal-400 font-medium">{growthTracking.field}</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black">
                {growthTracking.healthScore}% {isTamil ? 'ஆரோக்கியம்' : 'Health'}
              </span>
            </div>

            {/* Lifecycle Stages Step Bar */}
            <div className="space-y-2 py-1">
              <div className="flex items-center justify-between text-xs font-bold text-charcoal-700">
                <span>🌱 {isTamil ? 'முளைப்பு' : 'Germination'}</span>
                <span>🌿 {isTamil ? 'வளர்ச்சி' : 'Vegetative'}</span>
                <span className="text-field-700 font-black">🌼 {isTamil ? 'பூக்கும் பருவம்' : 'Flowering'} ←</span>
                <span>🌾 {isTamil ? 'அறுவடை' : 'Harvest'}</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-600 w-1/3" />
                <div className="h-full bg-emerald-600 w-1/3" />
                <div className="h-full bg-field-500 w-1/6 animate-pulse" />
                <div className="h-full bg-slate-200 w-1/6" />
              </div>
            </div>

            <p className="text-xs text-charcoal-600 font-medium leading-relaxed mt-4 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              {growthTracking.growthInsights}
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] text-charcoal-500 pt-2 border-t border-slate-100 font-medium">
            <span>{isTamil ? 'கண்டறியப்பட்ட பூச்சிகள்:' : 'Problems Detected:'} <strong className="text-emerald-700">{isTamil ? 'இல்லை (0)' : 'None (0)'}</strong></span>
            <span>{isTamil ? 'பயிரிடப்பட்ட நாள்:' : 'Planted:'} {growthTracking.plantedDate}</span>
          </div>
        </Card>

        {/* Section 23: Yield Prediction */}
        <Card className="p-6 md:p-7 bg-white border border-slate-200/90 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-base text-charcoal-900 flex items-center gap-2">
                <BarChart3 size={18} className="text-field-600" />
                {isTamil ? '📊 மகசூல் கணிப்பு' : '📊 Yield Prediction'}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                {yieldPrediction.confidence} {isTamil ? 'துல்லியம்' : 'Confidence'}
              </span>
            </div>

            <div className="bg-gradient-to-br from-field-50 to-emerald-50/50 p-4 rounded-2xl border border-field-200">
              <p className="text-[10px] font-bold text-field-800 uppercase tracking-wider">{isTamil ? 'எதிர்பார்க்கப்படும் மகசூல்' : 'Expected Yield'}</p>
              <p className="font-display font-black text-2xl text-field-950 mt-0.5">{yieldPrediction.expectedRange}</p>
              <p className="text-[10px] text-field-700 font-semibold mt-1">
                {isTamil ? 'வழக்கமான மகசூலை விட +18% அதிகம்' : '+18% above regional baseline average'}
              </p>
            </div>

            {/* Progression */}
            <div className="space-y-1.5 mt-3 text-xs">
              <p className="text-[10px] font-bold text-charcoal-400 uppercase">{isTamil ? 'கால வாரியான கணிப்பு முன்னேற்றம்' : 'Projection Progression'}</p>
              {yieldPrediction.progression.map((p, i) => (
                <div key={i} className="flex justify-between items-center py-1 border-b border-slate-100 last:border-none font-medium">
                  <span className="text-charcoal-600">{p.week}</span>
                  <span className="font-bold text-charcoal-900">{p.range}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-charcoal-400 italic leading-tight pt-2 border-t border-slate-100">
            {isTamil ? '*இது ஒரு மாதிரி மதிப்பீடு மட்டுமே. இறுதிக்கட்ட வானிலைக்கேற்ப மாறுபடலாம்.' : '*Algorithmic projection based on current sensor parameters.'}
          </p>
        </Card>

        {/* Section 24: Harvest Recommendation */}
        <Card className="p-6 md:p-7 bg-white border border-slate-200/90 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-base text-charcoal-900 flex items-center gap-2">
                <CalendarDays size={18} className="text-amber-600" />
                {isTamil ? '📅 அறுவடை பரிந்துரை' : '📅 Harvest Window'}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {harvestRecommendation.daysRemaining} {isTamil ? 'நாட்கள் மீதம்' : 'Days Left'}
              </span>
            </div>

            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
              <p className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">{isTamil ? 'பரிந்துரைக்கப்படும் அறுவடை காலம்' : 'Recommended Harvest Period'}</p>
              <p className="font-display font-black text-xl text-amber-950 mt-0.5">{harvestRecommendation.recommendedWindow}</p>
              <p className="text-[10px] text-amber-800 font-semibold mt-1">
                {harvestRecommendation.primaryDriver}
              </p>
            </div>

            <div className="space-y-1.5 mt-3 text-xs">
              {harvestRecommendation.drivers.slice(0, 3).map((d, i) => (
                <div key={i} className="flex items-start gap-2 py-1 font-medium">
                  <span className="shrink-0">{d.icon}</span>
                  <div>
                    <span className="font-bold text-charcoal-800">{d.title}: </span>
                    <span className="text-charcoal-500 text-[11px]">{d.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-charcoal-600 font-medium">
            💡 {harvestRecommendation.guidance}
          </div>
        </Card>
      </div>

      {/* ── 7. Nutrient Status & 6. Suitable Crops (2-Column Grid) ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 7: Nutrient Status */}
        <Card className="p-6 md:p-7 bg-white border border-slate-200/90 rounded-3xl shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-display font-bold text-lg text-charcoal-900 flex items-center gap-2">
              <FlaskConical size={20} className="text-emerald-600" />
              {isTamil ? '🧪 மண் சத்துக்கள் நிலை' : '🧪 Nutrient Status'}
            </h3>
            <button
              onClick={() => setModalType('nutrient')}
              className="text-xs font-bold text-field-700 hover:text-field-800 hover:underline cursor-pointer"
            >
              {isTamil ? 'ஊட்டச்சத்து வழிகாட்டல் →' : 'View Nutrient Advisory →'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl text-center">
              <p className="text-xs font-bold text-amber-900">{isTamil ? 'தழைச்சத்து (N)' : 'Nitrogen'}</p>
              <p className="font-black text-xl text-amber-950 mt-1">🟡 {isTamil ? 'நடுத்தரம்' : 'Medium'}</p>
              <p className="text-[10px] text-charcoal-400 mt-0.5">42%</p>
            </div>
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl text-center">
              <p className="text-xs font-bold text-emerald-900">{isTamil ? 'மணிச்சத்து (P)' : 'Phosphorus'}</p>
              <p className="font-black text-xl text-emerald-950 mt-1">🟢 {isTamil ? 'அதிகம்' : 'High'}</p>
              <p className="text-[10px] text-charcoal-400 mt-0.5">61%</p>
            </div>
            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl text-center">
              <p className="text-xs font-bold text-amber-900">{isTamil ? 'சாம்பல் சத்து (K)' : 'Potassium'}</p>
              <p className="font-black text-xl text-amber-950 mt-1">🟡 {isTamil ? 'நடுத்தரம்' : 'Medium'}</p>
              <p className="text-[10px] text-charcoal-400 mt-0.5">55%</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-charcoal-600 space-y-1">
            <p className="font-bold text-charcoal-800 flex items-center gap-1.5">
              <ShieldAlert size={14} className="text-amber-600" />
              {isTamil ? 'ஊட்டச்சத்து சமநிலை ஆய்வு' : 'Nutrient Diagnostic Notice'}
            </p>
            <p className="leading-relaxed font-medium">
              {isTamil 
                ? 'தழைச்சத்து அளவு நடுத்தரமாக உள்ளது. தேர்ந்தெடுக்கப்பட்ட பயிர் பூக்கும் நிலைக்கு நைட்ரஜன் அளவை சிறிது உயர்த்துவது மகசூலை அதிகரிக்க உதவும்.'
                : 'Nitrogen appears lower than the preferred level for peak flowering. Consider planned top-dress application post rainfall.'}
            </p>
          </div>
        </Card>

        {/* Section 6: Suitable Crops */}
        <Card className="p-6 md:p-7 bg-white border border-slate-200/90 rounded-3xl shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-display font-bold text-lg text-charcoal-900 flex items-center gap-2">
              <Sprout size={20} className="text-field-600" />
              {isTamil ? '🌾 ஏற்ற பயிர்கள்' : '🌾 Suitable Crops'}
            </h3>
            <button
              onClick={() => setModalType('crops')}
              className="text-xs font-bold text-field-700 hover:text-field-800 hover:underline cursor-pointer"
            >
              {isTamil ? 'அனைத்து பயிர்களையும் பார்க்க →' : 'View Crop Recommendations →'}
            </button>
          </div>

          <div className="space-y-2.5">
            {[
              { name: isTamil ? 'தக்காளி' : 'Tomato', emoji: '🍅', score: '94%', suit: isTamil ? 'அதிக பொருத்தம்' : 'High suitability', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
              { name: isTamil ? 'கோதுமை' : 'Wheat', emoji: '🌾', score: '91%', suit: isTamil ? 'அதிக பொருத்தம்' : 'High suitability', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
              { name: isTamil ? 'மக்காச்சோளம்' : 'Maize', emoji: '🌽', score: '76%', suit: isTamil ? 'மிதமான பொருத்தம்' : 'Medium suitability', color: 'bg-amber-50 text-amber-800 border-amber-200' },
            ].map((c, i) => (
              <div key={i} className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{c.emoji}</span>
                  <div>
                    <p className="font-bold text-sm text-charcoal-900">{c.name}</p>
                    <p className="text-[10px] text-charcoal-400 font-medium">pH 6.4 · Loam compatibility</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${c.color}`}>
                  {c.suit} ({c.score})
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── 12. Soil Moisture Trend & 16. Soil History Tabs ─────────────────── */}
      <Card className="p-6 md:p-8 bg-white border border-slate-200/90 rounded-3xl shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="font-display font-bold text-xl text-charcoal-900 flex items-center gap-2">
              <ChartIcon size={20} className="text-blue-600" />
              {isTamil ? 'மண் ஈரப்பதம் & வரலாற்று வரைபடம்' : 'Soil Moisture & Parameter Trends'}
            </h3>
            <p className="text-xs text-charcoal-500 font-medium mt-0.5">
              {isTamil ? 'தேர்ந்தெடுக்கப்பட்ட காலத்திற்கான மண் அளவீடுகளின் போக்கு' : 'Clean telemetry trends over time with safe benchmark boundaries.'}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* History metric tab */}
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              {[
                { id: 'moisture', label: isTamil ? 'ஈரப்பதம்' : 'Moisture' },
                { id: 'ph', label: 'pH' },
                { id: 'npk', label: 'NPK' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveHistoryTab(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeHistoryTab === t.id ? 'bg-white text-charcoal-900 shadow-sm' : 'text-charcoal-500 hover:text-charcoal-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Period selector */}
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              {['7d', '30d', '90d'].map(p => (
                <button
                  key={p}
                  onClick={() => setActiveTrendPeriod(p)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTrendPeriod === p ? 'bg-white text-charcoal-900 shadow-sm' : 'text-charcoal-500 hover:text-charcoal-900'
                  }`}
                >
                  {p === '7d' ? (isTamil ? '7 நாட்கள்' : '7 Days') : p === '30d' ? (isTamil ? '30 நாட்கள்' : '30 Days') : (isTamil ? '90 நாட்கள்' : '90 Days')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* The Recharts graph */}
        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="moistGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={{ stroke: '#e2e8f0' }} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip content={<CustomChartTooltip unit={activeHistoryTab === 'ph' ? '' : '%'} isTamil={isTamil} />} />

              {activeHistoryTab === 'moisture' && (
                <>
                  <ReferenceLine y={40} stroke="#16a34a" strokeDasharray="4 4" label={{ value: 'Ideal Min (40%)', fill: '#16a34a', fontSize: 10 }} />
                  <ReferenceLine y={70} stroke="#16a34a" strokeDasharray="4 4" label={{ value: 'Ideal Max (70%)', fill: '#16a34a', fontSize: 10 }} />
                  <Area
                    type="monotone"
                    dataKey="moisture"
                    name={isTamil ? 'மண் ஈரப்பதம்' : 'Soil Moisture'}
                    stroke="#0284c7"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#moistGrad)"
                    activeDot={{ r: 6, fill: '#0284c7', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </>
              )}

              {activeHistoryTab === 'ph' && (
                <Line
                  type="monotone"
                  dataKey="ph"
                  name="pH"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#16a34a' }}
                />
              )}

              {activeHistoryTab === 'npk' && (
                <>
                  <Line type="monotone" dataKey="n" name="Nitrogen (N)" stroke="#eab308" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="p" name="Phosphorus (P)" stroke="#16a34a" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="k" name="Potassium (K)" stroke="#9333ea" strokeWidth={2.5} dot={false} />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* ── 14. Fertilizer Recommendation & 15. Soil Improvement Suggestions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section 14: Fertilizer Advisory */}
        <Card className="lg:col-span-7 p-6 md:p-7 bg-white border border-slate-200/90 rounded-3xl shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-display font-bold text-lg text-charcoal-900 flex items-center gap-2">
                <FlaskConical size={20} className="text-amber-600" />
                {isTamil ? '🧪 உர மேலாண்மை வழிகாட்டல்' : '🧪 Fertilizer Advisory'}
              </h3>
              <p className="text-xs text-charcoal-400 font-medium mt-0.5">
                {isTamil ? 'பயிர் மற்றும் வளர்ச்சி நிலைக்கு ஏற்ப உரப்பரிந்துரை' : 'Targeted nutrition for active crop & stage'}
              </p>
            </div>

            {/* Selectors */}
            <div className="flex items-center gap-2">
              <select
                value={selectedCrop}
                onChange={e => setSelectedCrop(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-charcoal-800 cursor-pointer shadow-sm"
              >
                <option value="Tomato">{isTamil ? 'தக்காளி' : 'Tomato'}</option>
                <option value="Wheat">{isTamil ? 'கோதுமை' : 'Wheat'}</option>
                <option value="Maize">{isTamil ? 'மக்காச்சோளம்' : 'Maize'}</option>
              </select>
              <select
                value={selectedStage}
                onChange={e => setSelectedStage(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-charcoal-800 cursor-pointer shadow-sm"
              >
                <option value="Vegetative">{isTamil ? 'வளர்ச்சி பருவம்' : 'Vegetative'}</option>
                <option value="Flowering">{isTamil ? 'பூக்கும் பருவம்' : 'Flowering'}</option>
                <option value="Fruiting">{isTamil ? 'காய் பிடிக்கும் பருவம்' : 'Fruiting'}</option>
                <option value="Maturing">{isTamil ? 'முதிர்ச்சி பருவம்' : 'Maturing'}</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200 px-2 py-0.5 rounded-md">
                {fertilizerAdvisory.category}
              </span>
              <span className="text-xs text-charcoal-500 font-medium">{fertilizerAdvisory.timing}</span>
            </div>
            <p className="font-bold text-sm text-charcoal-900 leading-snug">
              {fertilizerAdvisory.recommendation}
            </p>
            <p className="text-xs text-charcoal-600 font-medium">
              <strong>{isTamil ? 'காரணம்:' : 'Reason:'}</strong> {fertilizerAdvisory.reason}
            </p>
          </div>

          <p className="text-[10px] text-charcoal-400 italic">
            *{fertilizerAdvisory.disclaimer}
          </p>
        </Card>

        {/* Section 15: Soil Improvement Suggestions & 13. Irrigation History */}
        <Card className="lg:col-span-5 p-6 md:p-7 bg-white border border-slate-200/90 rounded-3xl shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-charcoal-900 flex items-center gap-2 mb-3">
              <CheckSquare size={18} className="text-emerald-600" />
              {isTamil ? '🌱 மண் வளத்தை மேம்படுத்தும் வழிகள்' : '🌱 Improve Soil Health'}
            </h3>

            <div className="space-y-2.5">
              {[
                { title: isTamil ? 'உகந்த ஈரப்பதத்தை பராமரிக்கவும்' : 'Maintain adequate moisture', desc: isTamil ? '40%–70% வரம்பில் நீரை பராமரிப்பது சத்துக்கள் உறிஞ்சுதலை அதிகரிக்கும்.' : 'Keeps microbial activity active.' },
                { title: isTamil ? 'நைட்ரஜன் அளவை கண்காணிக்கவும்' : 'Monitor nitrogen levels', desc: isTamil ? 'பூக்கும் முன் யூரியா அல்லது மண்புழு உரம் இடுங்கள்.' : 'Apply split doses before flowering.' },
                { title: isTamil ? 'தேவையற்ற பாசனத்தை தவிர்க்கவும்' : 'Avoid unnecessary irrigation', desc: isTamil ? 'மழைக்கு முன் பாசனம் செய்வதைத் தவிர்க்கவும்.' : 'Prevents root suffocation & waterlogging.' },
                { title: isTamil ? 'தொடர் மண் பரிசோதனை செய்யுங்கள்' : 'Continue regular soil testing', desc: isTamil ? '6 மாதத்திற்கு ஒருமுறை ஆய்வு செய்யவும்.' : 'Keep seasonal nutrient baseline.' },
              ].map((sug, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-xs text-charcoal-900">{sug.title}</p>
                    <p className="text-[11px] text-charcoal-500 font-medium">{sug.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 13: Irrigation History Button */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-charcoal-500 font-medium">{isTamil ? 'கடந்த பாசன பதிவுகள்' : 'Irrigation Logs'}</span>
            <button
              onClick={() => setModalType('history')}
              className="text-xs font-bold text-field-700 hover:text-field-800 hover:underline cursor-pointer"
            >
              {isTamil ? 'முழு வரலாற்றை பார்க்க →' : 'View Full History →'}
            </button>
          </div>
        </Card>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MODALS RENDER */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {modalType === 'advisory' && (
        <DetailedAdvisoryModal
          onClose={() => setModalType(null)}
          soilMetrics={soilMetrics}
          activeCrop={selectedCrop}
          isTamil={isTamil}
        />
      )}

      {modalType === 'crops' && (
        <CropRecommendationsModal
          onClose={() => setModalType(null)}
          crops={cropSuitability}
          isTamil={isTamil}
        />
      )}

      {modalType === 'irrigation' && (
        <HydrationReviewModal
          onClose={() => setModalType(null)}
          soilMetrics={soilMetrics}
          isTamil={isTamil}
        />
      )}

      {modalType === 'nutrient' && (
        <NutrientAdvisoryModal
          onClose={() => setModalType(null)}
          isTamil={isTamil}
        />
      )}

      {modalType === 'history' && (
        <IrrigationHistoryModal
          onClose={() => setModalType(null)}
          history={irrigationHistory}
          isTamil={isTamil}
        />
      )}
    </div>
  );
}
