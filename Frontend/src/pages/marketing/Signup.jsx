import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Leaf, ArrowRight, Check, ChevronLeft } from 'lucide-react';

const CROPS_LIST = [
  { id: 'Tomato', name: 'Tomato', icon: '🍅' },
  { id: 'Potato', name: 'Potato', icon: '🥔' },
  { id: 'Maize', name: 'Maize', icon: '🌽' },
  { id: 'Wheat', name: 'Wheat', icon: '🌾' },
  { id: 'Rice', name: 'Rice', icon: '🌾' },
  { id: 'Onion', name: 'Onion', icon: '🧅' },
  { id: 'Brinjal', name: 'Brinjal', icon: '🍆' },
  { id: 'Chilli', name: 'Chilli', icon: '🌶️' },
  { id: 'Carrot', name: 'Carrot', icon: '🥕' },
  { id: 'Cotton', name: 'Cotton', icon: '🧶' },
  { id: 'Groundnut', name: 'Groundnut', icon: '🥜' },
  { id: 'Soybean', name: 'Soybean', icon: '🌱' },
];

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', phone: '', farmName: '', location: '', acres: '', primaryCrops: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const toggleCrop = (cropName) => {
    setForm(f => ({
      ...f,
      primaryCrops: f.primaryCrops.includes(cropName)
        ? f.primaryCrops.filter(c => c !== cropName)
        : [...f.primaryCrops, cropName]
    }));
  };

  const validateStep1 = () => {
    if (!form.name.trim()) return 'Enter your name';
    if (form.phone.length < 10) return 'Enter a valid 10-digit mobile number';
    return null;
  };
  const validateStep2 = () => {
    if (!form.farmName.trim()) return 'Enter your farm name';
    if (!form.location.trim()) return 'Enter your village/district';
    return null;
  };

  const handleNext = () => {
    const err = step === 1 ? validateStep1() : validateStep2();
    if (err) { setError(err); return; }
    setError('');
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await login({
      name: form.name,
      phone: form.phone,
      farms: [
        {
          id: 'farm_new',
          name: form.farmName,
          location: form.location,
          acres: parseFloat(form.acres) || 0,
          crops: form.primaryCrops.length > 0 ? form.primaryCrops : ['Tomato']
        }
      ],
      activeFarm: 'farm_new'
    });
    navigate('/dashboard');
  };

  const STEPS = ['Your Details', 'Your Farm', 'Your Crops'];

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Top bar */}
      <div className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-100">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-field-600 rounded-xl flex items-center justify-center"><Leaf size={16} className="text-white" /></div>
          <span className="font-display font-bold text-xl text-charcoal-900">Green<span className="text-field-600">AgriX</span></span>
        </Link>
        <Link to="/login" className="text-sm text-charcoal-500 hover:text-charcoal-700 transition">Already have an account?</Link>
      </div>

      <div className="flex-1 flex items-start justify-center px-4 pt-10 pb-20">
        <div className="w-full max-w-xl">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {STEPS.map((s, i) => {
              const idx = i + 1;
              const done = step > idx;
              const active = step === idx;
              return (
                <React.Fragment key={s}>
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${done ? 'bg-field-600 text-white' : active ? 'bg-field-100 text-field-700 ring-2 ring-field-500' : 'bg-slate-100 text-charcoal-400'}`}>
                      {done ? <Check size={12} /> : idx}
                    </div>
                    <span className={`text-sm font-medium ${active ? 'text-charcoal-800' : done ? 'text-field-600' : 'text-charcoal-400'}`}>{s}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className={`flex-1 h-px ${step > idx ? 'bg-field-400' : 'bg-slate-200'}`} />}
                </React.Fragment>
              );
            })}
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 sm:p-8">
            {/* Step 1 — Your Details */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h2 className="font-display text-2xl font-bold text-charcoal-900 mb-1">Create your GreenAgriX account</h2>
                  <p className="text-charcoal-500 text-sm">Free access to precision advisory, AI diagnostics, and market intelligence.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-1.5" htmlFor="name">Full Name</label>
                  <input id="name" type="text" value={form.name} onChange={e => update('name', e.target.value)}
                    placeholder="Ravi Kumar"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-charcoal-900 text-base placeholder-charcoal-300 focus:outline-none focus:ring-2 focus:ring-field-500/50 focus:border-field-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-1.5" htmlFor="phone">Mobile Number</label>
                  <div className="flex">
                    <div className="flex items-center px-3.5 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-charcoal-500 text-sm font-medium">+91</div>
                    <input id="phone" type="tel" inputMode="numeric" maxLength={10} value={form.phone} onChange={e => update('phone', e.target.value)}
                      placeholder="9876543210"
                      className="flex-1 px-4 py-3 border border-slate-200 rounded-r-xl text-charcoal-900 text-base placeholder-charcoal-300 focus:outline-none focus:ring-2 focus:ring-field-500/50 focus:border-field-500 transition"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 — Farm Details */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h2 className="font-display text-2xl font-bold text-charcoal-900 mb-1">Tell us about your farm</h2>
                  <p className="text-charcoal-500 text-sm">We will tailor soil, weather, and market advisories to your location.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-1.5" htmlFor="farmName">Farm / Plot Name</label>
                  <input id="farmName" type="text" value={form.farmName} onChange={e => update('farmName', e.target.value)}
                    placeholder="Kumar Farms (North Plot)"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-charcoal-900 text-base placeholder-charcoal-300 focus:outline-none focus:ring-2 focus:ring-field-500/50 focus:border-field-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-1.5" htmlFor="location">Village / District / State</label>
                  <input id="location" type="text" value={form.location} onChange={e => update('location', e.target.value)}
                    placeholder="Nashik, Maharashtra"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-charcoal-900 text-base placeholder-charcoal-300 focus:outline-none focus:ring-2 focus:ring-field-500/50 focus:border-field-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-1.5" htmlFor="acres">Total Farm Size</label>
                  <div className="flex">
                    <input id="acres" type="number" inputMode="decimal" value={form.acres} onChange={e => update('acres', e.target.value)}
                      placeholder="12.5"
                      className="flex-1 px-4 py-3 border border-r-0 border-slate-200 rounded-l-xl text-charcoal-900 text-base placeholder-charcoal-300 focus:outline-none focus:ring-2 focus:ring-field-500/50 focus:border-field-500 transition"
                    />
                    <div className="flex items-center px-4 bg-slate-100 border border-slate-200 rounded-r-xl text-charcoal-500 text-sm font-medium">Acres</div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 — Crops */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h2 className="font-display text-2xl font-bold text-charcoal-900 mb-1">What do you grow?</h2>
                  <p className="text-charcoal-500 text-sm">Select all that apply. You can add more crops anytime.</p>
                </div>

                {/* 4-Column Crop Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CROPS_LIST.map(crop => {
                    const selected = form.primaryCrops.includes(crop.name);
                    return (
                      <button
                        key={crop.id}
                        type="button"
                        onClick={() => toggleCrop(crop.name)}
                        className={`p-3.5 rounded-2xl text-center border-2 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer relative group ${
                          selected
                            ? 'bg-field-900 text-white border-field-900 shadow-md scale-[1.02]'
                            : 'bg-white text-charcoal-700 border-slate-200 hover:border-field-400 hover:shadow-sm'
                        }`}
                      >
                        {selected && (
                          <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px]">
                            ✓
                          </div>
                        )}
                        <span className="text-2xl drop-shadow-sm group-hover:scale-110 transition-transform">
                          {crop.icon}
                        </span>
                        <span className="text-xs font-bold">{crop.name}</span>
                      </button>
                    );
                  })}
                </div>

                {form.primaryCrops.length > 0 && (
                  <div className="bg-field-50 rounded-2xl p-4 border border-field-200">
                    <p className="text-xs font-bold text-field-800">
                      ✓ Selected: {form.primaryCrops.join(', ')}
                    </p>
                    <p className="text-[11px] text-field-600 mt-0.5">Your dashboard and advisories will be customized for these crops.</p>
                  </div>
                )}
              </div>
            )}

            {/* Error */}
            {error && <p className="mt-4 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-xl">{error}</p>}

            {/* Actions */}
            <div className="flex items-center justify-between mt-8 gap-3">
              {step > 1 && (
                <button type="button" onClick={() => { setStep(s => s - 1); setError(''); }}
                  className="flex items-center gap-1 text-sm text-charcoal-500 hover:text-charcoal-700 transition px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronLeft size={16} /> Back
                </button>
              )}
              <button
                type="button"
                onClick={step < 3 ? handleNext : handleSubmit}
                disabled={loading}
                className="ml-auto flex items-center gap-2 px-6 py-3.5 bg-field-900 text-white font-bold rounded-xl hover:bg-field-800 transition text-sm disabled:opacity-70 cursor-pointer shadow-md"
              >
                {loading ? 'Creating account…' : step < 3 ? 'Continue' : 'Enter Dashboard'} {!loading && <ArrowRight size={16} />}
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-charcoal-400 mt-6">
            By continuing you agree to our <a href="#" className="text-field-600">Terms</a> and <a href="#" className="text-field-600">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
