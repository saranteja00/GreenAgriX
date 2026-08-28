import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { MOCK_DASHBOARD as D } from '../../data/mockDashboard';
import { Card, Badge } from '../../components/ui/index';
import { CalendarDays, Check, Clock, ChevronRight, Lightbulb, Sprout } from 'lucide-react';

const SUGGESTIONS = {
  Wheat: {
    en: ['Apply top-dress nitrogen now — heading stage benefits most', 'Scout for stem rust in next 3 days'],
    ta: ['தழைச்சத்து உரத்தை இப்போது இடவும் — கதிர் வெளிவரும் பருவத்திற்கு மிகவும் பயனுள்ளது', 'அடுத்த 3 நாட்களில் தண்டு துரு நோய் உள்ளதா என கண்காணிக்கவும்']
  },
  Maize: {
    en: ['Check for fall armyworm on lower leaves', 'Tasseling complete — stop nitrogen application'],
    ta: ['கீழ் இலைகளில் படைப்புழு தாக்குதல் உள்ளதா என ஆய்வு செய்யவும்', 'ஆண்மஞ்சரி முடிந்தது — தழைச்சத்து உரமிடுவதை நிறுத்தவும்']
  },
  Tomato: {
    en: ['Stake tall plants before next rain', 'Apply calcium spray to prevent blossom-end rot'],
    ta: ['அடுத்த மழைக்கு முன் உயரமான செடிகளுக்கு முட்டுக் கொடுத்து கட்டவும்', 'பூ முனை அழுகலைத் தடுக்க கால்சியம் தெளிக்கவும்']
  }
};

const STAGE_TA = {
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
  'Tasseling': 'ஆண்மஞ்சரி',
  'Silking': 'பெண்மஞ்சரி',
  'Maturing': 'முதிர்ச்சி பருவம்',
  'Fruiting': 'காய் பிடிக்கும் பருவம்',
  'Ripening': 'பழுக்கும் பருவம்',
};

const CROP_TA = {
  Wheat: 'கோதுமை',
  Tomato: 'தக்காளி',
  Maize: 'மக்காச்சோளம்',
  Cotton: 'பருத்தி',
};

function MilestoneTimeline({ milestones, isTamil }) {
  return (
    <ol className="relative border-l-2 border-field-100 ml-3 space-y-3 mt-3">
      {milestones.map((m) => (
        <li key={m.name} className="pl-5 relative">
          <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center
            ${m.done ? 'bg-field-600 border-field-600' : 'bg-white border-slate-300'}`}>
            {m.done && <Check size={9} className="text-white" />}
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${m.done ? 'text-charcoal-400 line-through' : 'text-charcoal-800'}`}>
              {isTamil ? (STAGE_TA[m.name] || m.name) : m.name}
            </span>
            <span className="text-xs text-charcoal-400 tabular-nums">{m.date}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

function CropCard({ entry, isTamil }) {
  const [open, setOpen] = useState(false);
  const total    = entry.milestones.length;
  const done     = entry.milestones.filter(m => m.done).length;
  const progress = Math.round((done / total) * 100);
  const cropName = isTamil ? (CROP_TA[entry.crop] || entry.crop) : entry.crop;
  const stageName = isTamil ? (STAGE_TA[entry.currentStage] || entry.currentStage) : entry.currentStage;
  const suggestions = SUGGESTIONS[entry.crop]?.[isTamil ? 'ta' : 'en'] || [];

  return (
    <Card className="overflow-hidden border border-slate-100 rounded-3xl shadow-sm">
      <div className="p-6">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-3 self-stretch rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <h3 className="font-display font-bold text-charcoal-900 text-lg">{cropName}</h3>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                {stageName}
              </span>
            </div>
            <p className="text-xs text-charcoal-500 font-medium">{entry.field} · {isTamil ? 'அறுவடை' : 'Harvest'} {entry.harvestDate}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-charcoal-400 mb-1 font-bold">
            <span>{isTamil ? 'வளர்ச்சி முன்னேற்றம்' : 'Progress'}</span>
            <span className="tabular-nums">{done}/{total} {isTamil ? 'நிலைகள்' : 'stages'} · {progress}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, backgroundColor: entry.color }} />
          </div>
        </div>

        {/* Dates */}
        <div className="flex gap-4 text-xs text-charcoal-500 font-medium mb-4">
          <span>🌱 {isTamil ? 'விதைப்பு' : 'Sown'}: {entry.sowDate}</span>
          <span>🌾 {isTamil ? 'அறுவடை' : 'Harvest'}: {entry.harvestDate}</span>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
            <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1.5">
              <Lightbulb size={14} className="text-amber-600" /> {isTamil ? 'முக்கிய ஆலோசனைகள்' : 'Smart Suggestions'}
            </p>
            <ul className="space-y-1">
              {suggestions.map(s => (
                <li key={s} className="text-xs text-amber-800 flex items-start gap-1.5 font-medium">
                  <span className="shrink-0 mt-0.5">→</span>{s}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 text-xs text-field-700 hover:text-field-800 transition font-bold cursor-pointer">
          <CalendarDays size={14} /> {open ? (isTamil ? 'மைல்கற்களை மறைக்க' : 'Hide milestones') : (isTamil ? 'அனைத்து மைல்கற்களையும் பார்க்க' : 'View all milestones')}
          <ChevronRight size={13} className={`transition ${open ? 'rotate-90' : ''}`} />
        </button>
        {open && <MilestoneTimeline milestones={entry.milestones} isTamil={isTamil} />}
      </div>
    </Card>
  );
}

export default function CropCalendar() {
  const { isTamil } = useLanguage();

  return (
    <div className="space-y-6 stagger-children animate-fade-in pb-16 max-w-5xl mx-auto pt-2">
      <div className="border-b border-slate-200/80 pb-4">
        <h2 className="font-display text-2xl font-bold text-charcoal-900 flex items-center gap-2">
          <CalendarDays size={24} className="text-field-600" />
          {isTamil ? 'பயிர் காலண்டர் & வளர்ச்சி நிலைகள்' : 'Crop Calendar & Milestones'}
        </h2>
        <p className="text-sm text-charcoal-500 font-medium mt-1">
          {isTamil 
            ? 'உங்கள் பண்ணைப் பயிர்களின் வளர்ச்சி நிலை, முக்கிய பணிகள் மற்றும் அறுவடை அட்டவணை'
            : 'Track growth stages, tasks, and expected harvest timelines.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {D.cropCalendar.map(entry => (
          <CropCard key={entry.id} entry={entry} isTamil={isTamil} />
        ))}
      </div>
    </div>
  );
}
