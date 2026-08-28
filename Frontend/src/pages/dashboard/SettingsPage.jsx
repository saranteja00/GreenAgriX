import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/index';
import {
  User, Phone, Globe, Bell, Smartphone, MessageSquare,
  Leaf, Plus, Trash2, Save, ChevronRight, Settings, Shield,
} from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
  { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
];

function Toggle({ checked, onChange, label, id }) {
  return (
    <label htmlFor={id} className="flex items-center justify-between cursor-pointer py-2">
      <span className="text-sm text-charcoal-700">{label}</span>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-field-500 ${checked ? 'bg-field-600' : 'bg-slate-200'}`}
        style={{ height: '22px' }}
      >
        <span className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-all duration-200 ${checked ? 'left-5' : 'left-0.5'}`}
          style={{ width: '18px', height: '18px' }} />
      </button>
    </label>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '', language: user?.language || 'en' });
  const [units, setUnits] = useState({ area: 'acres', temp: 'C' });
  const [notifs, setNotifs] = useState({ push: true, sms: false, whatsapp: true });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-up max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal-900">Profile & Settings</h1>
        <p className="text-charcoal-500 text-sm mt-0.5">Manage your account, farms, and preferences.</p>
      </div>

      {/* Profile */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-5">
          <User size={16} className="text-field-600" />
          <h2 className="font-display font-bold text-charcoal-900">Profile</h2>
        </div>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-field-100 text-field-700 flex items-center justify-center text-2xl font-bold shrink-0">
            {profile.name?.[0] || 'U'}
          </div>
          <div>
            <p className="font-semibold text-charcoal-900">{profile.name}</p>
            <p className="text-sm text-charcoal-500">Free Account</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-500 mb-1.5 uppercase tracking-wide">Full Name</label>
            <input type="text" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-charcoal-800 text-sm focus:outline-none focus:border-field-500 focus:ring-1 focus:ring-field-500 transition" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-charcoal-500 mb-1.5 uppercase tracking-wide">Phone / Email</label>
            <input type="text" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-charcoal-800 text-sm focus:outline-none focus:border-field-500 focus:ring-1 focus:ring-field-500 transition" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-charcoal-500 mb-1.5 uppercase tracking-wide">Language</label>
            <select value={profile.language} onChange={e => setProfile(p => ({ ...p, language: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-charcoal-800 text-sm focus:outline-none focus:border-field-500 transition cursor-pointer">
              {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </div>
        </div>
      </Card>

      {/* Farm management */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-5">
          <Leaf size={16} className="text-field-600" />
          <h2 className="font-display font-bold text-charcoal-900">My Farms</h2>
        </div>
        <div className="space-y-2 mb-4">
          {user?.farms?.map(f => (
            <div key={f.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-8 h-8 bg-field-50 rounded-xl flex items-center justify-center shrink-0">
                <Leaf size={14} className="text-field-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-charcoal-800 text-sm truncate">{f.name}</p>
                <p className="text-xs text-charcoal-500">{f.location} · {f.acres} acres</p>
              </div>
              <button className="text-charcoal-300 hover:text-red-500 transition p-1">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button className="flex items-center gap-2 text-sm text-field-600 font-semibold hover:underline">
          <Plus size={14} /> Add Another Farm
        </button>
      </Card>

      {/* Units */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Settings size={16} className="text-signal-600" />
          <h2 className="font-display font-bold text-charcoal-900">Units & Display</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-500 mb-1.5 uppercase tracking-wide">Area Unit</label>
            <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              {['acres', 'hectares'].map(u => (
                <button key={u} onClick={() => setUnits(prev => ({ ...prev, area: u }))}
                  className={`flex-1 py-2 text-sm font-semibold transition ${units.area === u ? 'bg-field-600 text-white' : 'text-charcoal-500 hover:bg-slate-100'}`}>
                  {u}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-charcoal-500 mb-1.5 uppercase tracking-wide">Temperature</label>
            <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              {['C', 'F'].map(u => (
                <button key={u} onClick={() => setUnits(prev => ({ ...prev, temp: u }))}
                  className={`flex-1 py-2 text-sm font-semibold transition ${units.temp === u ? 'bg-field-600 text-white' : 'text-charcoal-500 hover:bg-slate-100'}`}>
                  °{u}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={16} className="text-harvest-600" />
          <h2 className="font-display font-bold text-charcoal-900">Notification Preferences</h2>
        </div>
        <div className="divide-y divide-slate-50">
          <Toggle id="push"     checked={notifs.push}      onChange={v => setNotifs(n => ({ ...n, push: v }))}      label="Push notifications (in-app)" />
          <Toggle id="sms"      checked={notifs.sms}       onChange={v => setNotifs(n => ({ ...n, sms: v }))}       label="SMS alerts (critical only)" />
          <Toggle id="whatsapp" checked={notifs.whatsapp}  onChange={v => setNotifs(n => ({ ...n, whatsapp: v }))}  label="WhatsApp alerts" />
        </div>
      </Card>

      {/* Save */}
      <button
        onClick={handleSave}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition ${saved ? 'bg-field-50 text-field-700 border border-field-200' : 'bg-field-600 hover:bg-field-700 text-white'}`}
      >
        <Save size={15} />
        {saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  );
}
