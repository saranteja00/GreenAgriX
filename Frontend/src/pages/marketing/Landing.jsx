import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Leaf, ArrowRight, CheckCircle2, CloudSun, BarChart3, Droplets,
  Bug, CalendarDays, Map, TrendingUp, Star, ChevronRight,
  Smartphone, Users, Shield, Zap, Globe, Menu, X,
} from 'lucide-react';

// ── Animated weather widget ──────────────────────────────────────────────────
function WeatherWidget() {
  const [temp, setTemp] = useState(28);
  useEffect(() => {
    const t = setInterval(() => setTemp(v => v + (Math.random() > 0.5 ? 0.1 : -0.1)), 3000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="glass-card rounded-2xl p-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-charcoal-500">Nashik, Maharashtra</p>
          <p className="text-2xl font-bold text-charcoal-900 tabular-nums">{temp.toFixed(1)}°C</p>
        </div>
        <div className="w-12 h-12 bg-harvest-100 rounded-xl flex items-center justify-center">
          <CloudSun size={24} className="text-harvest-500" />
        </div>
      </div>
      <div className="flex gap-2">
        {['Mon','Tue','Wed','Thu','Fri'].map((d, i) => (
          <div key={d} className="flex-1 flex flex-col items-center gap-1 text-center">
            <span className="text-[10px] text-charcoal-400 font-medium">{d}</span>
            <div className={`w-6 h-6 rounded-full ${i === 2 ? 'bg-blue-100' : 'bg-harvest-100'} flex items-center justify-center`}>
              {i === 2 ? <span className="text-[10px]">🌧</span> : <span className="text-[10px]">☀️</span>}
            </div>
            <span className="text-[10px] text-charcoal-600 tabular-nums">{26 + i}°</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Animated Farm Health gauge widget ───────────────────────────────────────
function HealthWidget() {
  const [score, setScore] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setScore(78), 400);
    return () => clearTimeout(timer);
  }, []);
  const dash = 2 * Math.PI * 40;
  const half = dash / 2;
  const offset = half - (score / 100) * half;
  return (
    <div className="glass-card rounded-2xl p-4 animate-fade-up" style={{ animationDelay: '0.5s' }}>
      <p className="text-xs font-semibold text-charcoal-500 mb-3">Farm Health</p>
      <div className="flex items-center gap-4">
        <svg width="80" height="50" viewBox="0 0 80 80" style={{ transform: 'rotate(-180deg)' }}>
          <circle cx="40" cy="40" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" strokeDasharray={`${half} ${half}`} />
          <circle cx="40" cy="40" r="40" fill="none" stroke="#2e7d4f" strokeWidth="8"
            strokeDasharray={`${half} ${half}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)' }}
          />
        </svg>
        <div>
          <p className="tabular-nums text-3xl font-bold text-field-600">{score}<span className="text-sm text-charcoal-400">/100</span></p>
          <p className="text-xs text-charcoal-500">↑ Good condition</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[['Soil', '82%', 'text-field-600'], ['Crop', '74%', 'text-harvest-500'],['Water', '80%', 'text-signal-600'], ['Pest Risk', 'Low', 'text-field-600']].map(([l, v, c]) => (
          <div key={l} className="bg-white/70 rounded-lg px-2 py-1.5">
            <p className="text-[10px] text-charcoal-400">{l}</p>
            <p className={`text-sm font-bold ${c} tabular-nums`}>{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Price ticker widget ──────────────────────────────────────────────────────
function PriceWidget() {
  const prices = [
    { crop: '🌾 Wheat',  price: '₹2,240', trend: '+2.7%', up: true  },
    { crop: '🍅 Tomato', price: '₹1,850', trend: '-11.9%', up: false },
    { crop: '🌽 Maize',  price: '₹1,820', trend: '+1.7%', up: true  },
  ];
  return (
    <div className="glass-card rounded-2xl p-4 animate-fade-up" style={{ animationDelay: '0.7s' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-charcoal-500">Mandi Prices</p>
        <span className="text-[10px] text-signal-600 font-semibold bg-signal-50 px-2 py-0.5 rounded-full">Live</span>
      </div>
      <div className="space-y-2">
        {prices.map(p => (
          <div key={p.crop} className="flex items-center justify-between">
            <span className="text-sm text-charcoal-700">{p.crop}</span>
            <div className="flex items-center gap-2">
              <span className="tabular-nums text-sm font-bold text-charcoal-900">{p.price}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${p.up ? 'bg-field-50 text-field-600' : 'bg-red-50 text-red-600'}`}>{p.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Features data ─────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: CloudSun,    color: 'bg-blue-50 text-blue-600',   title: 'Weather & Risk',     problem: 'Unexpected rain ruined your fertilizer plan', solution: 'Get hyperlocal 7-day forecasts + plain-language advisories before every field operation' },
  { icon: Map,         color: 'bg-field-50 text-field-600', title: 'Field Mapping',      problem: 'You manage 5 fields but can\'t track each one', solution: 'Map every plot, assign crops, track growth stages and last activity from one view' },
  { icon: Bug,         color: 'bg-red-50 text-red-600',     title: 'Pest Alerts',        problem: 'A pest outbreak spread before you noticed',   solution: 'Photo-based diagnosis in seconds, with confidence score and expert fallback' },
  { icon: BarChart3,   color: 'bg-harvest-50 text-harvest-600', title: 'Crop Planning', problem: 'You forget which field needs what, and when',  solution: 'A visual crop calendar from sowing to harvest with reminders and smart suggestions' },
  { icon: Droplets,    color: 'bg-signal-50 text-signal-600', title: 'Soil & Irrigation', problem: 'Over-irrigating wastes water and damages roots', solution: 'Soil moisture trends, NPK tracking, and irrigation schedule recommendations' },
  { icon: TrendingUp,  color: 'bg-harvest-50 text-harvest-600', title: 'Market Prices', problem: 'You sold early and missed peak mandi price',   solution: '"Sell now vs. wait" signals for every crop you grow, based on real mandi data' },
];

const TESTIMONIALS = [
  { name: 'Rajesh Patil', location: 'Nashik, MH', crop: 'Tomato & Wheat', rating: 5, quote: 'The pest alert caught early blight on my tomatoes before I could even see it with my eyes. Saved me 40% of that crop.' },
  { name: 'Sunita Devi',  location: 'Khargone, MP', crop: 'Cotton & Soybean', rating: 5, quote: "I check the mandi price signal every morning before loading my truck. It's like having a trader friend who tells me when to go." },
  { name: 'Arjun Reddy',  location: 'Warangal, TS', crop: 'Maize & Chilli', rating: 5, quote: 'Even my field workers use it now — the Tamil voice assistant means everyone on the farm can ask questions.' },
];



// ── Public Navbar ─────────────────────────────────────────────────────────────
function PublicNavbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-field-600 rounded-xl flex items-center justify-center">
            <Leaf size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl text-charcoal-900">Green<span className="text-field-600">AgriX</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-charcoal-600">
          <a href="#features" className="hover:text-field-600 transition">Features</a>
          <a href="#testimonials" className="hover:text-field-600 transition">Stories</a>
          <Link to="/login" className="hover:text-field-600 transition">Login</Link>
          <Link to="/signup" className="bg-field-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-field-700 transition shadow-sm">Get Started</Link>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg text-charcoal-600 hover:bg-slate-100">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3">
          {['Features','Stories'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)} className="block py-2 text-charcoal-600 font-medium">{l}</a>
          ))}
          <Link to="/login" onClick={() => setOpen(false)} className="block py-2 text-charcoal-600 font-medium">Login</Link>
          <Link to="/signup" onClick={() => setOpen(false)} className="block w-full bg-field-600 text-white py-3 rounded-xl text-center font-semibold">Get Started</Link>
        </div>
      )}
    </nav>
  );
}

// ── LANDING PAGE ─────────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-cream font-body">
      <PublicNavbar />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="hero-mesh pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <div className="space-y-7 animate-fade-up text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-field-100 text-field-700 text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-field-500 animate-pulse" />
                50,000+ FARMS ACROSS INDIA
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal-950 leading-[1.1]">
                Your farm.<br />
                <span className="text-field-600">Smarter</span> every<br />
                single day.
              </h1>
              <p className="text-lg text-charcoal-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Crops, irrigation, weather, and market prices — all in one place. Built for Indian farmers who don't have time to explore dashboards.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button
                  onClick={() => navigate('/signup')}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 bg-field-600 text-white font-bold rounded-2xl shadow-glow-green hover:bg-field-700 transition-all duration-200 text-base"
                >
                  Get Started <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-charcoal-700 font-semibold rounded-2xl border border-slate-200 hover:border-field-300 hover:bg-field-50 transition text-base"
                >
                  See a Demo
                </button>
              </div>
              <div className="flex items-center gap-6 text-sm text-charcoal-500 justify-center lg:justify-start pt-2">
                {['100% Free Forever', 'Works offline', 'Available in Hindi'].map(t => (
                  <span key={t} className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-field-500" />{t}</span>
                ))}
              </div>
            </div>

            {/* Right: live product widgets */}
            <div className="space-y-3 max-w-sm mx-auto lg:max-w-none">
              <WeatherWidget />
              <HealthWidget />
              <PriceWidget />
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAND ─────────────────────────────────────────────── */}
      <section className="bg-field-700 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {[
              ['50,000+', 'Active Farms'],
              ['2M+', 'Acres Tracked'],
              ['98%', 'Uptime'],
              ['12', 'Indian Languages'],
              ['4.8★', 'App Rating'],
            ].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="tabular-nums text-2xl font-bold text-white">{num}</div>
                <div className="text-xs text-field-200 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-signal-600 tracking-widest uppercase">Why Green AgriX</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-charcoal-900 mt-3 mb-4">Built for real farming problems</h2>
            <p className="text-charcoal-500">Not for pitch decks. Each feature exists because real farmers asked for it.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-200 group">
                <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mb-5`}>
                  <f.icon size={22} />
                </div>
                <h3 className="font-display text-lg font-bold text-charcoal-900 mb-2">{f.title}</h3>
                <div className="mb-4 p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-charcoal-400 font-medium mb-1">THE PROBLEM</p>
                  <p className="text-sm text-charcoal-600 italic">"{f.problem}"</p>
                </div>
                <p className="text-sm text-charcoal-600 leading-relaxed">
                  <span className="text-field-600 font-semibold">Green AgriX:</span> {f.solution}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-field-950 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold text-signal-400 tracking-widest uppercase">Getting Started</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3 mb-16">Up and running in 3 minutes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create your farm', desc: 'Add your farm name, location and fields. Takes under 2 minutes.' },
              { step: '02', title: 'Add your crops',   desc: 'Select your crops and planting dates. We set up your calendar automatically.' },
              { step: '03', title: 'Get your dashboard', desc: 'Your weather, alerts, and prices are live the moment you finish.' },
            ].map((s, i) => (
              <div key={s.step} className="flex flex-col items-center animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-14 h-14 rounded-2xl bg-harvest-400 text-white flex items-center justify-center font-display font-bold text-xl mb-5 shadow-glow-teal">
                  {s.step}
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-field-300 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/signup')} className="mt-14 inline-flex items-center gap-2 px-7 py-4 bg-harvest-400 text-field-950 font-bold rounded-2xl hover:bg-harvest-300 transition text-base shadow-glow-teal">
            Start for Free <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold text-signal-600 tracking-widest uppercase">Farmer Stories</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-charcoal-900 mt-3">What farmers actually say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} className="fill-harvest-400 text-harvest-400" />)}
                </div>
                <p className="text-charcoal-600 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                  <div className="w-9 h-9 rounded-full bg-field-100 text-field-700 flex items-center justify-center font-bold text-sm">{t.name[0]}</div>
                  <div>
                    <div className="font-semibold text-charcoal-800 text-sm">{t.name}</div>
                    <div className="text-xs text-charcoal-400">{t.location} · {t.crop}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="bg-field-950 text-field-300 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-harvest-400 rounded-xl flex items-center justify-center"><Leaf size={16} className="text-white" /></div>
                <span className="font-display font-bold text-white text-lg">Green<span className="text-harvest-300">AgriX</span></span>
              </div>
              <p className="text-sm text-field-400 leading-relaxed">A farmer's trusted partner for crop management, market intelligence, and farm health monitoring.</p>
            </div>
            {[
              { title: 'Product',  links: ['Features', 'Changelog', 'API'] },
              { title: 'Support',  links: ['Help Center', 'Community', 'Contact', 'Status'] },
              { title: 'Company',  links: ['About', 'Blog', 'Careers', 'Privacy'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-semibold text-white text-sm mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(l => <li key={l}><a href="#" className="text-sm text-field-400 hover:text-white transition">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-field-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-field-500">© 2026 Green AgriX. Made with 🌱 for Indian farmers.</p>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-field-700 text-xs text-field-300 hover:border-field-500 transition">
                <Globe size={12} /> English
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-field-700 text-xs text-field-300 hover:border-field-500 transition">
                हिंदी
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
