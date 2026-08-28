import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Phone, Lock, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState('credentials'); // 'credentials' | 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone.trim()) { setError('Please enter your phone number or email.'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setStep('otp');
  };

  const handleOtpChange = (val, idx) => {
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { setError('Enter the 6-digit OTP sent to your number.'); return; }
    setError('');
    setLoading(true);
    await login({ phone });
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen hero-mesh flex items-center justify-center px-4 py-12">
      {/* Brand mark top-left */}
      <Link to="/" className="fixed top-5 left-5 flex items-center gap-2 group">
        <div className="w-9 h-9 bg-field-600 rounded-xl flex items-center justify-center shadow-md group-hover:bg-field-500 transition">
          <Leaf size={18} className="text-white" />
        </div>
        <span className="font-display font-bold text-field-800 text-lg hidden sm:block">
          Green<span className="text-harvest-500">AgriX</span>
        </span>
      </Link>

      <div className="w-full max-w-sm animate-fade-up">
        <div className="bg-white rounded-3xl shadow-card-hover border border-slate-100 p-8">

          {step === 'credentials' ? (
            <>
              <div className="mb-8">
                <h1 className="font-display text-2xl font-bold text-charcoal-900">Welcome back</h1>
                <p className="text-charcoal-500 text-sm mt-1">Enter your phone or email to continue.</p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-charcoal-700 mb-1.5">
                    Phone number or Email
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                    <input
                      id="phone"
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98765 43210 or you@email.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-charcoal-800 text-sm focus:outline-none focus:border-field-500 focus:ring-1 focus:ring-field-500 transition placeholder:text-charcoal-300"
                      autoComplete="tel"
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-charcoal-400 mt-1.5">We'll send a one-time code to verify it's you.</p>
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-field-600 hover:bg-field-700 text-white font-semibold py-3 rounded-xl transition focus-ring disabled:opacity-60"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Send OTP <ArrowRight size={16} /></>
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-charcoal-500 mt-6">
                New to Green AgriX?{' '}
                <Link to="/signup" className="text-field-600 font-semibold hover:underline">Create account</Link>
              </p>
            </>
          ) : (
            <>
              <div className="mb-8">
                <div className="w-12 h-12 bg-field-50 rounded-2xl flex items-center justify-center mb-4">
                  <Lock size={22} className="text-field-600" />
                </div>
                <h1 className="font-display text-2xl font-bold text-charcoal-900">Enter OTP</h1>
                <p className="text-charcoal-500 text-sm mt-1">
                  A 6-digit code was sent to <span className="font-semibold text-charcoal-700">{phone}</span>
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-5">
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(e.target.value, idx)}
                      onKeyDown={e => handleOtpKeyDown(e, idx)}
                      className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-slate-200 bg-slate-50 text-charcoal-900 focus:outline-none focus:border-field-500 focus:ring-1 focus:ring-field-500 transition tabular-nums"
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2 text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-field-600 hover:bg-field-700 text-white font-semibold py-3 rounded-xl transition focus-ring disabled:opacity-60"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Verify & Sign In <CheckCircle2 size={16} /></>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => { setStep('credentials'); setOtp(['','','','','','']); setError(''); }}
                  className="w-full text-sm text-charcoal-500 hover:text-charcoal-700 transition"
                >
                  ← Use a different number
                </button>
              </form>

              {/* Demo shortcut */}
              <div className="mt-6 p-3 bg-field-50 rounded-xl border border-field-100 text-center">
                <p className="text-xs text-field-700 font-medium">Demo mode — any 6 digits will work ✓</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
