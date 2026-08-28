import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Leaf, ArrowRight, Eye, EyeOff, Smartphone } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState('credentials'); // credentials | otp
  const [form, setForm] = useState({ phone: '', otp: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!form.phone || form.phone.length < 10) { setError('Enter a valid 10-digit mobile number'); return; }
    setError('');
    setStep('otp');
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (form.otp !== '123456') { setError('Incorrect OTP. Use 123456 for demo.'); return; }
    setLoading(true);
    await login({ phone: form.phone });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left — Brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 sidebar-gradient p-12">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-harvest-400 rounded-xl flex items-center justify-center"><Leaf size={18} className="text-white" /></div>
          <span className="font-display font-bold text-xl text-white">Green<span className="text-harvest-300">AgriX</span></span>
        </Link>
        <div className="space-y-6">
          <h2 className="font-display text-4xl font-bold text-white leading-tight">
            Your farm is waiting<br />for you.
          </h2>
          <p className="text-field-300 text-lg leading-relaxed max-w-sm">
            Log in to check today's weather risk, your crop calendar, and live mandi prices — all in one place.
          </p>
          <div className="space-y-3">
            {[
              'Today\'s weather alert for your fields',
              'Crop task reminders for today',
              'Live price movements at your nearest mandi',
            ].map(item => (
              <div key={item} className="flex items-center gap-3 text-field-200 text-sm">
                <div className="w-5 h-5 rounded-full bg-harvest-400/30 flex items-center justify-center">
                  <span className="text-harvest-300 text-xs">✓</span>
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
        <p className="text-field-500 text-xs">© 2026 Green AgriX · Trusted by 50,000+ Indian Farmers</p>
      </div>

      {/* Right — Auth form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <div className="w-8 h-8 bg-field-600 rounded-xl flex items-center justify-center"><Leaf size={16} className="text-white" /></div>
            <span className="font-display font-bold text-xl text-charcoal-900">Green<span className="text-field-600">AgriX</span></span>
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-charcoal-900 mb-2">Welcome back</h1>
            <p className="text-charcoal-500">
              {step === 'credentials' ? 'Enter your mobile number to continue' : `We sent a 6-digit OTP to +91 ${form.phone}`}
            </p>
          </div>

          {step === 'credentials' ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-charcoal-700 mb-1.5" htmlFor="phone">Mobile Number</label>
                <div className="flex">
                  <div className="flex items-center justify-center px-3 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-charcoal-600 text-sm font-medium gap-1">
                    <Smartphone size={14} /> +91
                  </div>
                  <input
                    id="phone" type="tel" inputMode="numeric" maxLength={10}
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g,'') }))}
                    placeholder="98765 43210"
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-r-xl text-charcoal-900 placeholder-charcoal-300 text-base focus:outline-none focus:ring-2 focus:ring-field-500/50 focus:border-field-500 transition"
                    required
                  />
                </div>
                <p className="text-xs text-charcoal-400 mt-1.5">We'll send an OTP to verify your number. No password needed.</p>
              </div>
              {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-xl">{error}</p>}
              <button type="submit" className="w-full py-3.5 bg-field-600 text-white font-bold rounded-xl hover:bg-field-700 transition flex items-center justify-center gap-2 text-base">
                Send OTP <ArrowRight size={18} />
              </button>
              <div className="relative flex items-center">
                <div className="flex-1 border-t border-slate-200" /><span className="px-4 text-xs text-charcoal-400">or</span><div className="flex-1 border-t border-slate-200" />
              </div>
              <button
                type="button"
                onClick={async () => { await login({}); navigate('/dashboard'); }}
                className="w-full py-3.5 bg-white text-charcoal-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition text-sm"
              >
                Continue with Demo Account
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-charcoal-700 mb-1.5" htmlFor="otp">One-Time Password</label>
                <input
                  id="otp" type="text" inputMode="numeric" maxLength={6}
                  value={form.otp}
                  onChange={e => setForm(f => ({ ...f, otp: e.target.value.replace(/\D/,'') }))}
                  placeholder="123456"
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-charcoal-900 text-center text-xl font-bold tracking-[0.5em] placeholder-charcoal-300 focus:outline-none focus:ring-2 focus:ring-field-500/50 focus:border-field-500 transition"
                />
                <p className="text-xs text-charcoal-400 mt-1.5">Demo OTP: <span className="font-bold text-field-600">123456</span></p>
              </div>
              {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-xl">{error}</p>}
              <button type="submit" disabled={loading} className="w-full py-3.5 bg-field-600 text-white font-bold rounded-xl hover:bg-field-700 transition flex items-center justify-center gap-2 text-base disabled:opacity-70">
                {loading ? 'Verifying…' : 'Verify & Enter Dashboard'} {!loading && <ArrowRight size={18} />}
              </button>
              <button type="button" onClick={() => { setStep('credentials'); setError(''); }} className="w-full text-sm text-charcoal-500 hover:text-charcoal-700 transition">
                ← Change number
              </button>
            </form>
          )}

          <p className="text-center text-sm text-charcoal-500 mt-8">
            New to Green AgriX? <Link to="/signup" className="text-field-600 font-semibold hover:text-field-700">Create a free account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
