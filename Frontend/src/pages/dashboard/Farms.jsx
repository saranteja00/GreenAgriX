import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { MOCK_DASHBOARD as D } from '../../data/mockDashboard';
import {
  MapPin, Settings2, Droplets, FlaskConical, Calendar, ChevronDown,
  Bot, X, Sprout, HeartPulse, LineChart, Bug, Store, CloudSun, Leaf,
  CheckCircle2, Circle, TrendingUp, AlertTriangle, Thermometer, Wind,
  Droplets as DropletsIcon, Sun,
} from 'lucide-react';
import { Card } from '../../components/ui/index';

// ─── Crop emoji & translation helper ──────────────────────────────────────────
const CROP_EMOJI = { Wheat: '🌾', Tomato: '🍅', Maize: '🌽', Cotton: '🪴', Soybean: '🌱', default: '🌿' };
const cropEmoji = (name) => CROP_EMOJI[name] ?? CROP_EMOJI.default;

const STAGE_TRANSLATIONS = {
  'Sowing': 'விதைப்பு',
  'Germination': 'முளைப்பு',
  'Tillering': 'தூர்கட்டுதல்',
  'Jointing': 'கணு உருவாக்கம்',
  'Heading': 'கதிர் வெளிவருதல்',
  'Flowering': 'பூக்கும் பருவம்',
  'Grain Fill': 'பால் பிடிக்கும் பருவம்',
  'Harvest': 'அறுவடை',
  'Transplant': 'நாற்று நடுதல்',
  'Emergence': 'முளைத்தல்',
  'Vegetative': 'வளர்ச்சி பருவம்',
  'Tasseling': 'ஆண்மஞ்சரி தோன்றுதல்',
  'Silking': 'பெண்மஞ்சரி தோன்றுதல்',
  'Maturing': 'முதிர்ச்சி பருவம்',
  'Fruiting': 'காய் பிடிக்கும் பருவம்',
  'Ripening': 'பழுக்கும் பருவம்',
  'Podding': 'காய் உருவாக்கம்',
  'Boll Dev.': 'பருத்தி காய் உருவாக்கம்',
};

const FIELD_TRANSLATIONS = {
  'Plot A': 'நிலப்பிரிவு A',
  'Plot B': 'நிலப்பிரிவு B',
  'Plot C': 'நிலப்பிரிவு C',
  'Plot D': 'நிலப்பிரிவு D',
  'North 1': 'வடக்கு பிரிவு 1',
};

const MONTH_TRANSLATIONS = {
  'Jan': 'ஜன', 'Feb': 'பிப்', 'Mar': 'மார்ச்', 'Apr': 'ஏப்',
  'May': 'மே', 'Jun': 'ஜூன்', 'Jul': 'ஜூலை', 'Aug': 'ஆக',
  'Sep': 'செப்', 'Oct': 'அக்', 'Nov': 'நவ', 'Dec': 'டிச'
};

function formatTamilDate(dateStr, isTamil) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const day = d.getDate();
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const month = monthNames[d.getMonth()];
  if (!isTamil) return `${day} ${month}`;
  return `${day} ${MONTH_TRANSLATIONS[month] || month}`;
}

function translateStage(stage, isTamil) {
  if (!isTamil || !stage) return stage;
  return STAGE_TRANSLATIONS[stage] || stage;
}

function translateField(field, isTamil) {
  if (!isTamil || !field) return field;
  return FIELD_TRANSLATIONS[field] || field;
}

function translateCrop(crop, isTamil) {
  if (!isTamil || !crop) return crop;
  const map = { Wheat: 'கோதுமை', Tomato: 'தக்காளி', Maize: 'மக்காச்சோளம்', Cotton: 'பருத்தி', Soybean: 'சோயாபீன்' };
  return map[crop] || crop;
}

// ─── Crop Details Modal ────────────────────────────────────────────────────────
function CropDetailsModal({ crop, cropCalendar, soil, marketPrices, alerts, onClose }) {
  const { isTamil } = useLanguage();
  const cal  = cropCalendar.find(c => c.crop === crop) ?? cropCalendar[0];
  const mkt  = marketPrices.find(m => m.crop === crop);
  const done = cal?.milestones?.filter(m => m.done).length ?? 0;
  const total = cal?.milestones?.length ?? 0;
  const progress = total ? Math.round((done / total) * 100) : 0;

  // Care tips based on stage
  const CARE_TIPS = {
    Flowering: isTamil
      ? [
          'பூக்கும் தருணத்தில் சீரான மண் ஈரப்பதத்தை பராமரிக்கவும் - நீர் பற்றாக்குறையை தவிர்க்கவும்.',
          'பூக்கள் உதிர்வதைத் தடுத்து காய் பிடிக்க பொட்டாசியம் (K₂O) சத்து இடவும்.',
          'பூக்கும் பருவத்தில் அசுவினி மற்றும் வெள்ளை ஈக்கள் உள்ளதா என வாரம் ஒருமுறை கண்காணிக்கவும்.'
        ]
      : [
          'Maintain consistent soil moisture — avoid water stress during flowering.',
          'Apply potassium (K₂O) to support fruit set and flower retention.',
          'Scout for aphids and whiteflies weekly during flowering stage.'
        ],
    Fruiting: isTamil
      ? [
          'தழைச்சத்தைக் குறைத்து, மணி மற்றும் சாம்பல் சத்தை அதிகரிக்கவும்.',
          'மண்ணை மிதமான ஈரப்பதத்துடன் வைக்கவும் - ஒழுங்கற்ற நீர்ப்பாசனம் காய் வெடிப்பை உருவாக்கும்.',
          'காய் பிடிக்கும் கிளைகளுக்கு முட்டுக் கொடுத்து தாங்கவும்.'
        ]
      : [
          'Reduce nitrogen; increase phosphorus and potassium inputs.',
          'Keep soil evenly moist — irregular watering causes blossom end rot.',
          'Use a trellis or stake to support fruit-heavy branches.'
        ],
    default: isTamil
      ? [
          'மண் ஈரப்பதத்தை தினமும் கண்காணிக்கவும்.',
          'பரிந்துரைக்கப்பட்ட அளவில் NPK உரங்களை இடவும்.',
          'பூச்சி அல்லது பூஞ்சை தாக்குதல் உள்ளதா என தொடர்ந்து பயிரை ஆய்வு செய்யவும்.'
        ]
      : [
          'Monitor soil moisture daily using a soil meter.',
          'Apply balanced NPK fertilizer at the recommended dose.',
          'Regularly scout for early signs of pests or fungal disease.'
        ],
  };
  const tips = CARE_TIPS[cal?.currentStage] ?? CARE_TIPS.default;

  return (
    <div className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-3 z-50 animate-fade-in">
      <div className="bg-white rounded-[2rem] w-full max-w-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-field-900 to-field-800 shrink-0 rounded-t-[2rem]">
          <div className="flex items-center gap-4">
            <span className="text-5xl drop-shadow-lg">{cropEmoji(crop)}</span>
            <div>
              <h2 className="font-display font-bold text-2xl text-white">
                {translateCrop(crop, isTamil)}
              </h2>
              <p className="text-field-200 font-medium text-sm mt-0.5">
                {translateStage(cal?.currentStage, isTamil)} {isTamil ? 'நிலை' : 'Stage'} · {translateField(cal?.field, isTamil)}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 text-white/60 hover:text-white hover:bg-white/20 rounded-full transition cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 md:p-8 space-y-8">
          {/* ── Stat row ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: isTamil ? 'வளர்ச்சி நிலை' : 'Growth Stage', value: translateStage(cal?.currentStage, isTamil) ?? '—', color: 'text-field-600' },
              { label: isTamil ? 'நடவு தேதி' : 'Planted On', value: formatTamilDate(cal?.sowDate, isTamil), color: 'text-charcoal-900' },
              { label: isTamil ? 'அறுவடை தேதி' : 'Harvest Date', value: formatTamilDate(cal?.harvestDate, isTamil), color: 'text-charcoal-900' },
              { label: isTamil ? 'முன்னேற்றம்' : 'Progress', value: `${progress}% ${isTamil ? 'நிறைவு' : 'Complete'}`, color: progress >= 70 ? 'text-emerald-600' : 'text-amber-600' },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider mb-1">{s.label}</p>
                <p className={`font-bold text-base ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* ── Milestone timeline ── */}
          {cal?.milestones && (
            <div>
              <h3 className="font-display font-bold text-lg text-charcoal-900 mb-1 flex items-center gap-2">
                <Calendar size={18} className="text-field-500" /> {isTamil ? 'வளர்ச்சி மைல்கற்கள்' : 'Growth Milestones'}
              </h3>
              {/* Progress bar */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-field-500 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-xs font-bold text-field-600 shrink-0">{done}/{total} {isTamil ? 'முடிந்தது' : 'done'}</span>
              </div>
              <div className="space-y-3">
                {cal.milestones.map((m, i) => (
                  <div key={i} className={`flex items-start gap-4 p-4 rounded-2xl border transition-colors ${
                    m.done ? 'bg-emerald-50 border-emerald-100' : m.name === cal.currentStage ? 'bg-field-50 border-field-200' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <div className={`mt-0.5 shrink-0 ${ m.done ? 'text-emerald-500' : m.name === cal.currentStage ? 'text-field-600' : 'text-slate-300'}`}>
                      {m.done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className={`font-bold ${ m.done ? 'text-emerald-800' : m.name === cal.currentStage ? 'text-field-800' : 'text-charcoal-400'}`}>
                          {translateStage(m.name, isTamil)}
                          {m.name === cal.currentStage && <span className="ml-2 text-[10px] font-bold bg-field-600 text-white px-2 py-0.5 rounded-full">{isTamil ? 'தற்போது' : 'Current'}</span>}
                        </p>
                        <p className="text-xs font-medium text-charcoal-400">{formatTamilDate(m.date, isTamil)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Soil & Conditions ── */}
          <div>
            <h3 className="font-display font-bold text-lg text-charcoal-900 mb-4 flex items-center gap-2">
              <DropletsIcon size={18} className="text-cyan-500" /> {isTamil ? 'மண் & பண்ணை நிலவரம்' : 'Current Soil & Field Conditions'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: isTamil ? 'மண் ஈரப்பதம்' : 'Soil Moisture', value: `${soil.moisture}%`, ideal: isTamil ? `உகந்தது: ${soil.moistureIdeal[0]}–${soil.moistureIdeal[1]}%` : `Ideal: ${soil.moistureIdeal[0]}–${soil.moistureIdeal[1]}%`, color: soil.moisture >= soil.moistureIdeal[0] ? 'text-emerald-600' : 'text-rose-600', icon: <DropletsIcon size={18} /> },
                { label: isTamil ? 'மண் pH' : 'Soil pH', value: soil.ph, ideal: isTamil ? `உகந்தது: ${soil.phIdeal[0]}–${soil.phIdeal[1]}` : `Ideal: ${soil.phIdeal[0]}–${soil.phIdeal[1]}`, color: soil.ph >= soil.phIdeal[0] && soil.ph <= soil.phIdeal[1] ? 'text-emerald-600' : 'text-amber-600', icon: <FlaskConical size={18} /> },
                { label: isTamil ? 'தழைச்சத்து (N)' : 'Nitrogen (N)', value: `${soil.nitrogen}%`, ideal: isTamil ? 'போதுமானது: 40–70%' : 'Adequate: 40–70%', color: soil.nitrogen >= 40 ? 'text-emerald-600' : 'text-rose-600', icon: <Sprout size={18} /> },
                { label: isTamil ? 'மணிச்சத்து (P)' : 'Phosphorus (P)', value: `${soil.phosphorus}%`, ideal: isTamil ? 'போதுமானது: 40–70%' : 'Adequate: 40–70%', color: soil.phosphorus >= 40 ? 'text-emerald-600' : 'text-amber-600', icon: <Leaf size={18} /> },
                { label: isTamil ? 'சாம்பல் சத்து (K)' : 'Potassium (K)', value: `${soil.potassium}%`, ideal: isTamil ? 'போதுமானது: 40–70%' : 'Adequate: 40–70%', color: soil.potassium >= 40 ? 'text-emerald-600' : 'text-amber-600', icon: <Sun size={18} /> },
                { label: isTamil ? 'கடைசி பாசனம்' : 'Last Irrigated', value: isTamil ? soil.lastIrrigated.replace('Yesterday', 'நேற்று').replace('Today', 'இன்று') : soil.lastIrrigated, ideal: isTamil ? `அடுத்தது: ${soil.nextIrrigation.replace('Tomorrow', 'நாளை')}` : `Next: ${soil.nextIrrigation}`, color: 'text-blue-600', icon: <DropletsIcon size={18} /> },
              ].map(s => (
                <div key={s.label} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-slate-200 ${s.color} shadow-sm`}>{s.icon}</div>
                  <div>
                    <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">{s.label}</p>
                    <p className={`font-bold text-lg ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-charcoal-400 font-medium mt-0.5">{s.ideal}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Care Tips ── */}
          <div className="bg-gradient-to-br from-field-50 to-white border border-field-100 rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg text-charcoal-900 mb-3 flex items-center gap-2">
              <Sprout size={18} className="text-field-600" /> {isTamil ? 'பயிர் பராமரிப்பு ஆலோசனைகள்' : `Care Tips for ${cal?.currentStage ?? ''} Stage`}
            </h3>
            <ul className="space-y-2.5">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-medium text-charcoal-700">
                  <CheckCircle2 size={16} className="text-field-500 shrink-0 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditFarmModal({ initialData, onClose, onSave }) {
  const { isTamil } = useLanguage();
  const [form, setForm] = useState(initialData);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-3 z-50 animate-fade-in">
      <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50 shrink-0">
          <h2 className="font-display font-bold text-xl text-charcoal-900">
            {isTamil ? 'பண்ணை விவரங்களை திருத்து' : 'Edit Farm Details'}
          </h2>
          <button onClick={onClose} className="p-2 text-charcoal-400 hover:text-charcoal-700 rounded-full transition cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="block text-xs font-bold text-charcoal-400 uppercase tracking-wider mb-1.5">{isTamil ? 'மண் வகை' : 'Soil Type'}</label>
            <input
              type="text"
              value={form.soilType}
              onChange={e => setForm({ ...form, soilType: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-charcoal-900 focus:outline-none focus:border-field-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-charcoal-400 uppercase tracking-wider mb-1.5">{isTamil ? 'பாசன முறை' : 'Irrigation Type'}</label>
            <input
              type="text"
              value={form.irrigation}
              onChange={e => setForm({ ...form, irrigation: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-charcoal-900 focus:outline-none focus:border-field-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-charcoal-400 uppercase tracking-wider mb-1.5">{isTamil ? 'தற்போதைய பயிர்' : 'Current Crop'}</label>
            <input
              type="text"
              value={form.currentCrop}
              onChange={e => setForm({ ...form, currentCrop: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-charcoal-900 focus:outline-none focus:border-field-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-charcoal-400 uppercase tracking-wider mb-1.5">{isTamil ? 'நடவு தேதி' : 'Planting Date'}</label>
            <input
              type="date"
              value={form.plantingDate}
              onChange={e => setForm({ ...form, plantingDate: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-charcoal-900 focus:outline-none focus:border-field-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-charcoal-600 hover:bg-slate-100 transition cursor-pointer">
              {isTamil ? 'ரத்து செய்' : 'Cancel'}
            </button>
            <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-field-600 hover:bg-field-700 text-white shadow-md transition cursor-pointer">
              {isTamil ? 'சேமிக்கவும்' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── History Accordion Item ───────────────────────────────────────────────────
function HistoryAccordion({ title, icon, colorClass, bgClass, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200/90 rounded-3xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-all mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 transition cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${bgClass} ${colorClass}`}>
            {icon}
          </div>
          <h3 className="font-bold text-charcoal-900 text-base">{title}</h3>
        </div>
        <ChevronDown size={20} className={`text-charcoal-400 transition-transform duration-300 ${open ? 'rotate-180 text-field-600' : ''}`} />
      </button>
      {open && (
        <div className="p-5 bg-slate-50 border-t border-slate-100 text-sm">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Farms() {
  const { user, activeFarm } = useAuth();
  const { isTamil } = useLanguage();

  const firstCropCalendar = D.cropCalendar[0];
  const firstField        = D.fields[0];

  const [farmExtra, setFarmExtra] = useState({
    soilType:    `${D.soil.ph < 6.5 ? (isTamil ? 'மிதமான அமிலத்தன்மை ' : 'Slightly Acidic ') : ''}${isTamil ? 'வண்டல் மண்' : 'Loamy Soil'}`,
    irrigation:  isTamil ? 'சொட்டுநீர் பாசனம்' : 'Drip Irrigation',
    currentCrop: firstField?.crop ?? 'Tomato',
    plantingDate: firstCropCalendar?.sowDate ?? '',
    stage:        firstField?.stage ?? 'Flowering',
    health:       firstField?.health ?? 80,
  });

  const [editing, setEditing]                 = useState(false);
  const [showCropDetails, setShowCropDetails] = useState(false);

  const farm = activeFarm ?? user?.farms?.[0];
  const farmerName = user?.name ?? (isTamil ? 'ராஜேஷ்' : 'Rajesh');

  const handleSave = (form) => {
    setFarmExtra(prev => ({
      ...prev,
      soilType:    form.soilType,
      irrigation:  form.irrigation,
      currentCrop: form.currentCrop,
      plantingDate: form.plantingDate,
    }));
  };

  const profileItems = [
    { label: isTamil ? 'பண்ணை பெயர்' : 'Farm Name', value: farm?.name ?? '—', icon: <Sprout size={24} />, bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100', text: 'text-emerald-700' },
    { label: isTamil ? 'இருப்பிடம்' : 'Location', value: farm?.location ?? '—', icon: <MapPin size={24} />, bg: 'bg-gradient-to-br from-blue-50 to-blue-100', text: 'text-blue-700' },
    { label: isTamil ? 'பண்ணை பரப்பளவு' : 'Farm Size', value: `${farm?.acres ?? '—'} ${isTamil ? 'ஏக்கர்' : 'Acres'}`, icon: <Leaf size={24} />, bg: 'bg-gradient-to-br from-purple-50 to-purple-100', text: 'text-purple-700' },
    { label: isTamil ? 'மண் வகை' : 'Soil Type', value: farmExtra.soilType, icon: <FlaskConical size={24} />, bg: 'bg-gradient-to-br from-amber-50 to-amber-100', text: 'text-amber-700' },
    { label: isTamil ? 'பாசன முறை' : 'Irrigation', value: farmExtra.irrigation, icon: <Droplets size={24} />, bg: 'bg-gradient-to-br from-cyan-50 to-cyan-100', text: 'text-cyan-700' },
    { label: isTamil ? 'நடவு தேதி' : 'Planting Date', value: formatTamilDate(farmExtra.plantingDate, isTamil), icon: <Calendar size={24} />, bg: 'bg-gradient-to-br from-rose-50 to-rose-100', text: 'text-rose-700' },
  ];

  const previousCrops = D.cropCalendar.map(cc => ({
    crop:    translateCrop(cc.crop, isTamil),
    field:   translateField(cc.field, isTamil),
    sow:     cc.sowDate,
    harvest: cc.harvestDate,
    stage:   translateStage(cc.currentStage, isTamil),
  }));

  const healthIcon = (h) => h >= 75 ? (isTamil ? '❤️ ஆரோக்கியமானது' : '❤️ Healthy') : (isTamil ? '⚠️ கவனம் தேவை' : '⚠️ Needs Attention');

  return (
    <div className="pb-16 max-w-7xl mx-auto pt-6 px-4 sm:px-6 lg:px-8 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-charcoal-900 flex items-center gap-2">
            {isTamil ? 'எனது பண்ணை' : 'My Farm'} <span role="img" aria-label="sprout">🌱</span>
          </h1>
          <p className="text-charcoal-500 mt-1.5 font-medium">
            {farmerName} {isTamil ? 'அவர்களின் பண்ணை விவரக்குறிப்பு & சாகுபடி வரலாறு.' : "'s farm profile and farming history."}
          </p>
        </div>
        <button
          onClick={() => setEditing(true)}
          className="text-xs font-bold bg-white text-field-700 border border-slate-200 hover:bg-field-50 hover:border-field-300 px-5 py-2.5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Settings2 size={16} /> {isTamil ? 'பண்ணை விவரங்களை திருத்த' : 'Edit Farm Details'}
        </button>
      </div>

      {/* ── Farm Profile ── */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={20} className="text-field-500" />
          <h2 className="text-lg font-bold text-charcoal-900 font-display">
            {isTamil ? 'பண்ணை விவரங்கள்' : 'Farm Profile'}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {profileItems.map((item, i) => (
            <Card key={i} className="p-5 bg-white border border-slate-100 hover:border-slate-300 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center gap-3 group rounded-3xl">
              <div className={`w-14 h-14 ${item.bg} ${item.text} rounded-2xl flex items-center justify-center shrink-0 shadow-sm`}>
                {item.icon}
              </div>
              <div>
                <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider mb-1">{item.label}</p>
                <p className="font-bold text-charcoal-900 text-xs">{item.value}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Current Crop Highlight ── */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Sprout size={20} className="text-field-500" />
          <h2 className="text-lg font-bold text-charcoal-900 font-display">
            {isTamil ? 'தற்போதைய பயிர் சிறப்பம்சம்' : 'Current Crop Highlight'}
          </h2>
        </div>
        <Card className="p-0 overflow-hidden border-none shadow-lg bg-gradient-to-r from-field-900 to-field-800 text-white relative rounded-3xl">
          <div className="p-6 md:p-8 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="text-7xl drop-shadow-xl">🌾</div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-[10px] font-bold uppercase tracking-wider border border-white/10">
                    {isTamil ? 'செயலில் உள்ள பயிர்' : 'Active Crop'}
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-500/20 backdrop-blur-md rounded-lg text-emerald-100 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
                    <HeartPulse size={12} /> {healthIcon(farmExtra.health)}
                  </span>
                </div>
                <h3 className="font-display font-bold text-3xl md:text-4xl text-white mb-1">
                  {translateCrop(farmExtra.currentCrop, isTamil)}
                </h3>
                <p className="text-field-100 font-medium flex items-center gap-2 text-sm">
                  <span>🌼</span> {translateStage(farmExtra.stage, isTamil)} {isTamil ? 'நிலை' : ''}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 w-full md:w-auto">
              <div className="flex items-center gap-6 text-sm bg-black/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 w-full md:w-auto">
                <span className="flex flex-col items-center md:items-start gap-0.5">
                  <span className="text-[10px] uppercase font-bold text-field-300">{isTamil ? 'நடவு தேதி' : 'Planted On'}</span>
                  <strong className="text-white">
                    {formatTamilDate(farmExtra.plantingDate, isTamil)}
                  </strong>
                </span>
                <div className="w-px h-8 bg-white/20" />
                <span className="flex flex-col items-center md:items-start gap-0.5">
                  <span className="text-[10px] uppercase font-bold text-field-300">{isTamil ? 'பண்ணை பரப்பளவு' : 'Farm Area'}</span>
                  <strong className="text-white">{farm?.acres ?? '—'} {isTamil ? 'ஏக்கர்' : 'Acres'}</strong>
                </span>
              </div>
              <button 
                onClick={() => setShowCropDetails(true)}
                className="w-full md:w-auto bg-white text-field-900 hover:bg-field-50 font-bold px-6 py-3 rounded-2xl transition-colors shadow-lg cursor-pointer text-xs">
                {isTamil ? 'பயிர் விவரங்களை பார்க்க' : 'View Crop Details'}
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Active Fields Summary ── */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Leaf size={20} className="text-field-500" />
          <h2 className="text-lg font-bold text-charcoal-900 font-display">
            {isTamil ? 'அனைத்து நிலப்பிரிவுகள் (Fields)' : 'All Active Fields'}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {D.fields.map(f => (
            <Card key={f.id} className="p-4 border border-slate-100 hover:border-field-200 hover:shadow-md transition-all group bg-white flex items-center gap-4 rounded-3xl">
              <div className="text-3xl">{f.crop === 'Wheat' ? '🌾' : f.crop === 'Tomato' ? '🍅' : f.crop === 'Maize' ? '🌽' : f.crop === 'Cotton' ? '🪴' : '🌱'}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-charcoal-900 text-sm">
                  {translateField(f.name, isTamil)} — {translateCrop(f.crop, isTamil)}
                </p>
                <p className="text-xs text-charcoal-500 font-medium mt-0.5">
                  {translateStage(f.stage, isTamil)} · {f.acres} {isTamil ? 'ஏக்கர்' : 'acres'}
                </p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${f.health >= 75 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : f.health >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                {f.health}% {isTamil ? 'நலம்' : 'Health'}
              </span>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Farm History ── */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <CloudSun size={20} className="text-field-500" />
          <h2 className="text-lg font-bold text-charcoal-900 font-display">
            {isTamil ? 'பண்ணை சாகுபடி வரலாறு 📋' : 'Farm History 📋'}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
          <div>
            <HistoryAccordion title={isTamil ? 'பயிர் காலண்டர் & முந்தைய பயிர்கள்' : 'Crop Calendar / Previous Crops'} icon={<Sprout size={24} />} colorClass="text-emerald-600" bgClass="bg-gradient-to-br from-emerald-50 to-emerald-100" defaultOpen={true}>
              <div className="space-y-3">
                {previousCrops.map((c, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-200 transition-colors flex justify-between items-center">
                    <div>
                      <p className="font-bold text-charcoal-900 text-sm">{c.crop}</p>
                      <p className="text-xs text-charcoal-500 font-medium mt-0.5">
                        {c.field} · {formatTamilDate(c.sow, isTamil)} – {formatTamilDate(c.harvest, isTamil)}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-3 py-1 bg-field-50 text-field-700 rounded-full border border-field-100">
                      {c.stage}
                    </span>
                  </div>
                ))}
              </div>
            </HistoryAccordion>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {showCropDetails && (
        <CropDetailsModal
          crop={farmExtra.currentCrop}
          cropCalendar={D.cropCalendar}
          soil={D.soil}
          marketPrices={D.marketPrices}
          alerts={D.alerts}
          onClose={() => setShowCropDetails(false)}
        />
      )}

      {editing && (
        <EditFarmModal
          initialData={farmExtra}
          onClose={() => setEditing(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
