import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Phone, User, MapPin, Maximize2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const STEPS = ['account', 'farm', 'done'];

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', farmName: '', location: '', acres: '', unit: 'acres',
  });
  const [errors, setErrors] = useState({});

  const set = (field, val) => { setForm(f => ({ ...f, [field]: val })); setErrors(e => ({ ...e, [field]: '' })); };

  const validateStep0 = () => {
    const e = {};
    if (!form.name.trim())  e.name  = 'Please enter your name.';
    if (!form.phone.trim()) e.phone = 'Please enter your phone or email.';
    return e;
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.farmName.trim()) e.farmName = 'Give your farm a name.';
    return e;
  };

  const next = async () => {
    if (step === 0) {
      const e = validateStep0();
      if (Object.keys(e).length) { setErrors(e); return; }
    }
    if (step === 1) {
      const e = validateStep1();
      if (Object.keys(e).length) { setErrors(e); return; }
      setLoading(true);
      await login({ name: form.name, phone: form.phone });
      setLoading(false);
    }
    setStep(s => s + 1);
  };

  const Field = ({ id, label, hint, children }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-charcoal-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-charcoal-400 mt-1.5">{hint}</p>}
      {errors[id] && <p className="text-xs text-red-600 mt-1">{errors[id]}</p>}
    </div>
  );

  const inputCls = (field) =>
    `w-full px-4 py-3 rounded-xl border ${errors[field] ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'} text-charcoal-800 text-sm focus:outline-none focus:border-field-500 focus:ring-1 focus:ring-field-500 transition placeholder:text-charcoal-300`;

  return (
    <div className="min-h-screen hero-mesh flex items-center justify-center px-4 py-12">
      <Link to="/" className="fixed top-5 left-5 flex items-center gap-2 group">
        <div className="w-9 h-9 bg-field-600 rounded-xl flex items-center justify-center shadow-md group-hover:bg-field-500 transition">
          <Leaf size={18} className="text-white" />
        </div>
        <span className="font-display font-bold text-field-800 text-lg hidden sm:block">
          Green<span className="text-harvest-500">AgriX</span>
        </span>
      </Link>

      <div className="w-full max-w-sm animate-fade-up">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {['Your account', 'Your farm', 'Ready!'].map((label, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full transition-all ${i <= step ? 'bg-field-600 w-6' : 'bg-slate-200'}`} />
              {i < 2 && <div className="w-6 h-px bg-slate-200" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-card-hover border border-slate-100 p-8">
          {/* STEP 0 — Account */}
          {step === 0 && (
            <>
              <div className="mb-7">
                <h1 className="font-display text-2xl font-bold text-charcoal-900">Create your account</h1>
                <p className="text-charcoal-500 text-sm mt-1">Takes less than 2 minutes. No credit card needed.</p>
              </div>
              <div className="space-y-5">
                <Field id="name" label="Full name" hint="So we know what to call you.">
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                    <input id="name" type="text" placeholder="Rajesh Kumar" value={form.name}
                      onChange={e => set('name', e.target.value)} className={`${inputCls('name')} pl-10`} autoFocus />
                  </div>
                </Field>
                <Field id="phone" label="Phone or Email" hint="We'll send a verification code. No spam, ever.">
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                    <input id="phone" type="text" placeholder="+91 98765 43210" value={form.phone}
                      onChange={e => set('phone', e.target.value)} className={`${inputCls('phone')} pl-10`} />
                  </div>
                </Field>
              </div>
            </>
          )}

          {/* STEP 1 — Farm */}
          {step === 1 && (
            <>
              <div className="mb-7">
                <h1 className="font-display text-2xl font-bold text-charcoal-900">Tell us about your farm</h1>
                <p className="text-charcoal-500 text-sm mt-1">You can always edit this or add more farms later.</p>
              </div>
              <div className="space-y-5">
                <Field id="farmName" label="Farm name" hint="E.g. Kumar Fields, North Plot, Home Farm.">
                  <input id="farmName" type="text" placeholder="Kumar Fields" value={form.farmName}
                    onChange={e => set('farmName', e.target.value)} className={inputCls('farmName')} autoFocus />
                </Field>
                <Field id="location" label="Location (optional)" hint="Helps us give you hyperlocal weather.">
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                    <input id="location" type="text" placeholder="Nashik, Maharashtra" value={form.location}
                      onChange={e => set('location', e.target.value)} className={`${inputCls('location')} pl-10`} />
                  </div>
                </Field>
                <Field id="acres" label="Farm size (optional)" hint="Helps calculate yield and irrigation estimates.">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Maximize2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                      <input id="acres" type="number" min="0" placeholder="12.5" value={form.acres}
                        onChange={e => set('acres', e.target.value)} className={`${inputCls('acres')} pl-10`} />
                    </div>
                    <select value={form.unit} onChange={e => set('unit', e.target.value)}
                      className="px-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-charcoal-700 text-sm focus:outline-none focus:border-field-500 transition">
                      <option value="acres">acres</option>
                      <option value="hectares">hectares</option>
                    </select>
                  </div>
                </Field>
              </div>
            </>
          )}

          {/* STEP 2 — Done */}
          {step === 2 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-field-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={32} className="text-field-600" />
              </div>
              <h1 className="font-display text-2xl font-bold text-charcoal-900 mb-2">You're all set, {form.name.split(' ')[0]}!</h1>
              <p className="text-charcoal-500 text-sm mb-8">Welcome to Green AgriX. Your dashboard is ready.</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full flex items-center justify-center gap-2 bg-field-600 hover:bg-field-700 text-white font-semibold py-3 rounded-xl transition focus-ring"
              >
                Go to Dashboard <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step < 2 && (
            <>
              <button
                onClick={next}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-field-600 hover:bg-field-700 text-white font-semibold py-3 rounded-xl transition mt-7 focus-ring disabled:opacity-60"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>{step === 1 ? 'Create Account' : 'Continue'} <ArrowRight size={16} /></>
                )}
              </button>
              {step === 0 && (
                <p className="text-center text-sm text-charcoal-500 mt-5">
                  Already have an account?{' '}
                  <Link to="/login" className="text-field-600 font-semibold hover:underline">Sign in</Link>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
