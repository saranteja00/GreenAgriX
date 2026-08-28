import React, { useState } from 'react';
import { MOCK_DASHBOARD as D } from '../../data/mockDashboard';
import { Card, Badge, AlertBanner } from '../../components/ui/index';
import {
  Bug, Camera, ChevronDown, ChevronUp, AlertTriangle, Info,
  ShieldCheck, Upload, X, CheckCircle2,
} from 'lucide-react';

const TYPE_CONFIG = {
  critical: { label: 'Critical', color: 'bg-red-500', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
  caution:  { label: 'Caution',  color: 'bg-harvest-400', bg: 'bg-harvest-50', border: 'border-harvest-200', text: 'text-harvest-700' },
  info:     { label: 'Info',     color: 'bg-signal-500', bg: 'bg-signal-50', border: 'border-signal-200', text: 'text-signal-700' },
};

const MOCK_ALERTS = [
  ...D.alerts,
  { id: 'a4', type: 'caution',  title: 'High UV Index Today',         field: 'All Fields',  time: '6h ago', read: true },
  { id: 'a5', type: 'info',     title: 'Irrigation Cycle Complete',   field: 'Plot D (Cotton)', time: '8h ago', read: true },
  { id: 'a6', type: 'critical', title: 'Root Rot Risk — Overwatering',field: 'Plot B (Tomato)', time: '1d ago', read: true },
];

const ACTIONS = {
  'Pest Detected — Aphid':     'Apply neem oil spray at dusk. Re-inspect in 48 hours. Avoid broad-spectrum pesticides that harm beneficial insects.',
  'Soil Moisture Low':         'Irrigate Plot A now — run drip system for 45 minutes. Check for leaks in the line nearest the eastern edge.',
  'Harvest Window Opens':      'Begin harvesting Maize from Plot C. Morning harvest preferred. Moisture content should be 18–20% at harvest.',
  'High UV Index Today':       'Consider using shade nets during peak hours (11am–3pm) for high-value crops. Ensure adequate soil moisture.',
  'Irrigation Cycle Complete': 'No action needed. Log confirmed if you need a record for your farm diary.',
  'Root Rot Risk — Overwatering': 'Reduce irrigation frequency immediately. Allow soil to dry to 50% moisture before next cycle. Check drainage.',
};

function AlertItem({ alert, onToggleRead }) {
  const [expanded, setExpanded] = useState(!alert.read);
  const cfg = TYPE_CONFIG[alert.type] ?? TYPE_CONFIG.info;
  const Icon = alert.type === 'critical' ? AlertTriangle : alert.type === 'caution' ? AlertTriangle : Info;

  return (
    <div className={`rounded-2xl border transition-all duration-200 ${!alert.read ? `${cfg.border} ${cfg.bg}` : 'border-slate-100 bg-white'}`}>
      <button
        className="w-full flex items-start gap-3 p-4 text-left"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
      >
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${!alert.read ? cfg.bg : 'bg-slate-50'} border ${cfg.border}`}>
          <Icon size={15} className={cfg.text} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-charcoal-900 text-sm">{alert.title}</span>
            {!alert.read && <span className={`w-1.5 h-1.5 rounded-full ${cfg.color} shrink-0`} />}
          </div>
          <p className="text-xs text-charcoal-500 mt-0.5">{alert.field} · {alert.time}</p>
        </div>
        <Badge variant={alert.type === 'critical' ? 'critical' : alert.type === 'caution' ? 'caution' : 'info'}>
          {cfg.label}
        </Badge>
        <span className="text-charcoal-400 shrink-0 ml-1 mt-0.5">
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 animate-fade-in">
          <div className="bg-white rounded-xl p-3 border border-slate-100 mb-3">
            <p className="text-xs font-semibold text-charcoal-500 mb-1">Recommended Action</p>
            <p className="text-sm text-charcoal-700 leading-relaxed">
              {ACTIONS[alert.title] ?? 'Monitor closely and consult an agronomist if symptoms persist.'}
            </p>
          </div>
          {!alert.read && (
            <button
              onClick={() => onToggleRead(alert.id)}
              className="text-xs text-field-600 font-semibold hover:underline flex items-center gap-1"
            >
              <CheckCircle2 size={13} /> Mark as resolved
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function PhotoUpload() {
  const [file, setFile] = useState(null);
  const [diagnosing, setDiagnosing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(URL.createObjectURL(f));
      setResult(null);
    }
  };

  const diagnose = async () => {
    setDiagnosing(true);
    await new Promise(r => setTimeout(r, 1800));
    setDiagnosing(false);
    setResult({ disease: 'Aphid Infestation (Aphis gossypii)', confidence: 87, action: 'Apply neem oil or insecticidal soap spray. Remove heavily infested leaves. Re-inspect after 3 days.' });
  };

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Camera size={18} className="text-signal-600" />
        <h3 className="font-display font-bold text-charcoal-900">Photo Diagnosis</h3>
      </div>
      <p className="text-sm text-charcoal-500 mb-4">Upload a photo of the affected area for AI-assisted diagnosis.</p>

      {!file ? (
        <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-200 rounded-xl py-10 cursor-pointer hover:border-field-300 hover:bg-field-50 transition group">
          <div className="w-12 h-12 bg-slate-100 group-hover:bg-field-100 rounded-xl flex items-center justify-center transition">
            <Upload size={22} className="text-charcoal-400 group-hover:text-field-600 transition" />
          </div>
          <span className="text-sm text-charcoal-500">Tap to upload or drag & drop</span>
          <span className="text-xs text-charcoal-400">JPG, PNG up to 10MB</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden">
            <img src={file} alt="Uploaded crop" className="w-full h-40 object-cover" />
            <button onClick={() => { setFile(null); setResult(null); }}
              className="absolute top-2 right-2 w-7 h-7 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition">
              <X size={13} />
            </button>
          </div>

          {!result && (
            <button onClick={diagnose} disabled={diagnosing}
              className="w-full bg-signal-600 hover:bg-signal-700 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-60">
              {diagnosing
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing…</>
                : <><Bug size={15} /> Diagnose Crop</>}
            </button>
          )}

          {result && (
            <div className="bg-field-50 border border-field-200 rounded-xl p-4 animate-fade-up">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-field-800 text-sm">{result.disease}</p>
                <span className="text-xs font-bold text-signal-700 bg-signal-100 px-2 py-0.5 rounded-full">{result.confidence}% match</span>
              </div>
              <p className="text-xs text-field-700 leading-relaxed">{result.action}</p>
              <p className="text-[10px] text-charcoal-400 mt-2">
                AI output — not a substitute for professional agronomist advice.
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const unread = alerts.filter(a => !a.read);

  const toggleRead = (id) =>
    setAlerts(as => as.map(a => a.id === id ? { ...a, read: true } : a));

  const sections = [
    { key: 'critical', label: 'Critical' },
    { key: 'caution',  label: 'Caution' },
    { key: 'info',     label: 'Info' },
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal-900">Pest & Disease Alerts</h1>
          <p className="text-charcoal-500 text-sm mt-0.5">
            {unread.length > 0 ? `${unread.length} alert${unread.length > 1 ? 's' : ''} need attention` : 'All clear — no unread alerts.'}
          </p>
        </div>
        {unread.length > 0 && (
          <button onClick={() => setAlerts(as => as.map(a => ({ ...a, read: true })))}
            className="text-sm text-field-600 font-semibold hover:underline flex items-center gap-1">
            <CheckCircle2 size={14} /> Mark all resolved
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {sections.map(({ key, label }) => {
            const group = alerts.filter(a => a.type === key);
            if (!group.length) return null;
            return (
              <div key={key}>
                <p className="text-xs font-bold text-charcoal-400 uppercase tracking-wider mb-2">{label}</p>
                <div className="space-y-2">
                  {group.map(alert => (
                    <AlertItem key={alert.id} alert={alert} onToggleRead={toggleRead} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <PhotoUpload />
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={16} className="text-field-600" />
              <h3 className="font-semibold text-charcoal-900 text-sm">Prevention Tips</h3>
            </div>
            <ul className="space-y-2 text-xs text-charcoal-600">
              {[
                'Scout crops 2–3 times a week during peak pest season',
                'Maintain field hygiene — remove crop debris promptly',
                'Use yellow sticky traps to monitor aphid populations',
                'Rotate crops each season to break pest cycles',
                'Encourage natural predators (ladybugs, lacewings)',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-field-400 mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
