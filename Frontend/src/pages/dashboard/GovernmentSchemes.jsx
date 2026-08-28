import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { schemesService, FALLBACK_SCHEMES } from '../../services/schemesService';
import {
  Landmark, ShieldCheck, Droplets, Sun, Sparkles, FileText,
  ExternalLink, CheckCircle2, AlertCircle, ChevronRight, X,
  Search, Filter, Calculator, HelpCircle, Download, Check, Award
} from 'lucide-react';
import { Card } from '../../components/ui/index';

export default function GovernmentSchemes() {
  const { activeFarm } = useAuth();
  const { isTamil } = useLanguage();

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [acreageSlider, setAcreageSlider] = useState(3.5);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [checkedDocs, setCheckedDocs] = useState({});
  const [schemesData, setSchemesData] = useState({
    eligible_schemes_count: 6,
    total_potential_subsidy_savings_inr: 558000,
    matched_schemes: FALLBACK_SCHEMES
  });
  const [loading, setLoading] = useState(false);

  const activeCrop = activeFarm?.crop || 'Tomato';
  const farmArea = activeFarm?.area || '3.5 acres';

  useEffect(() => {
    loadSchemes();
  }, [activeCrop, acreageSlider, activeCategory]);

  const loadSchemes = async () => {
    setLoading(true);
    try {
      const res = await schemesService.fetchEligibleSchemes({
        crop: activeCrop,
        acreage: acreageSlider,
        farmerCategory: acreageSlider <= 5 ? 'Small / Marginal' : 'General',
        categoryFilter: activeCategory
      });
      if (res && res.matched_schemes) {
        setSchemesData(res);
      }
    } catch (err) {
      console.warn('Error loading schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'All', labelEn: 'All Schemes', labelTa: 'அனைத்து திட்டங்கள்', icon: Landmark },
    { id: 'Irrigation & Water', labelEn: '💧 Irrigation (100% Subsidy)', labelTa: '💧 பாசனம் & சொட்டுநீர்', icon: Droplets },
    { id: 'Solar Energy & Machinery', labelEn: '☀️ Solar & Machinery', labelTa: '☀️ சோலார் & கருவிகள்', icon: Sun },
    { id: 'Crop Insurance & Risk', labelEn: '🛡️ Crop Insurance (PMFBY)', labelTa: '🛡️ பயிர் காப்பீடு', icon: ShieldCheck },
    { id: 'Direct Income Support', labelEn: '💵 Direct Cash (PM-KISAN)', labelTa: '💵 நேரடி பண உதவி', icon: Award },
    { id: 'Seeds & Fertilizers', labelEn: '🌱 Seeds & Soil Health', labelTa: '🌱 மண் வளம் & விதைகள்', icon: Sparkles }
  ];

  const filteredSchemes = schemesData.matched_schemes.filter(s => {
    const nameMatch = isTamil 
      ? (s.name_ta.toLowerCase().includes(searchQuery.toLowerCase()) || s.category_ta.toLowerCase().includes(searchQuery.toLowerCase()))
      : (s.name_en.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return nameMatch;
  });

  const toggleDocCheck = (docIdx) => {
    setCheckedDocs(prev => ({
      ...prev,
      [docIdx]: !prev[docIdx]
    }));
  };

  return (
    <div className="space-y-6 stagger-children animate-fade-in pb-20 max-w-6xl mx-auto pt-2">
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="border-b border-slate-200/80 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal-900 flex items-center gap-2.5">
              <Landmark size={28} className="text-field-600" />
              {isTamil ? 'அரசு நலத்திட்டங்கள் & மானியங்கள்' : 'Government Schemes & Subsidies'}
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                {isTamil ? 'நேரலை' : 'Verified'}
              </span>
            </h2>
            <p className="text-sm text-charcoal-500 font-medium mt-1">
              {isTamil
                ? 'உங்கள் பயிர், நிலப்பரப்பு மற்றும் தகுதியின் அடிப்படையில் மத்திய & மாநில அரசு மானியங்கள்'
                : 'Central & State Government financial assistance and subsidies tailored to your farm profile.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-2xl border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-600" />
              {isTamil ? 'டிஜிட்டல் e-KYC தயார்' : 'DBT Enabled'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Active Farm Match Hero Banner ───────────────────────────────────── */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-field-900 via-field-800 to-field-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm text-emerald-100">
              <Sparkles size={14} className="text-amber-300" />
              {isTamil ? 'உங்கள் பண்ணை விவரம் அடிப்படையிலான தகுதி' : 'Auto-Matched to Active Farm Profile'}
            </div>
            <h3 className="font-display font-bold text-2xl md:text-3xl text-white">
              {isTamil ? `${activeFarm?.name || 'நிலப்பிரிவு A'} — ${activeCrop === 'Tomato' ? 'தக்காளி' : activeCrop} பயிருக்கு ${schemesData.eligible_schemes_count} திட்டங்கள்` : `${schemesData.eligible_schemes_count} Schemes Matched for ${activeCrop} Farm`}
            </h3>
            <p className="text-xs md:text-sm text-emerald-100/90 max-w-xl leading-relaxed">
              {isTamil
                ? `உங்கள் ${acreageSlider} ஏக்கர் நிலப்பரப்புக்கு ₹${(schemesData.total_potential_subsidy_savings_inr / 100000).toFixed(2)} லட்சம் வரையிலான நிதி உதவி & 100% சொட்டுநீர் பாசன மானியம் பெற தகுதி உள்ளது.`
                : `Your ${acreageSlider} acre holding qualifies for up to ₹${(schemesData.total_potential_subsidy_savings_inr / 100000).toFixed(2)} Lakhs in cumulative financial aid & 100% micro-irrigation subsidies.`}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 min-w-[240px] text-center space-y-1">
            <p className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider">
              {isTamil ? 'மொத்த சாத்தியமான மானிய மதிப்பு' : 'Total Potential Aid Value'}
            </p>
            <p className="text-3xl font-black text-amber-300 font-display">
              ₹{(schemesData.total_potential_subsidy_savings_inr).toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-white/80 font-medium">
              {isTamil ? 'சிறு/குறு விவசாயி முன்னுரிமை ஒதுக்கீடு' : 'Small/Marginal Farmer Priority'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Interactive Subsidy Calculator & Filter Bar ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Acreage Slider & Crop profile */}
        <Card className="p-5 md:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 lg:col-span-1">
          <div className="flex items-center gap-2">
            <Calculator size={18} className="text-field-600" />
            <h4 className="font-bold text-charcoal-900 text-sm">
              {isTamil ? 'மானியம் கணக்கீட்டு கருவி' : 'Subsidy Eligibility Calculator'}
            </h4>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-charcoal-700">
              <span>{isTamil ? 'நிலப்பரப்பு (ஏக்கர்):' : 'Farm Acreage:'}</span>
              <span className="text-field-700 font-black text-sm">{acreageSlider} {isTamil ? 'ஏக்கர்' : 'Acres'}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="15.0"
              step="0.5"
              value={acreageSlider}
              onChange={(e) => setAcreageSlider(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-field-600"
            />
            <div className="flex justify-between text-[10px] text-charcoal-400 font-medium">
              <span>0.5 {isTamil ? 'ஏக்' : 'Ac'}</span>
              <span>5.0 {isTamil ? 'ஏக் (சிறு விவசாயி)' : 'Ac (Small Farmer)'}</span>
              <span>15.0 {isTamil ? 'ஏக்' : 'Ac'}</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-semibold space-y-1">
            <p className="font-bold">
              {acreageSlider <= 5.0 
                ? (isTamil ? '✓ சிறு/குறு விவசாயி (100% முழு மானியம்)' : '✓ Small/Marginal Farmer (100% Subsidy)')
                : (isTamil ? '✓ பிற விவசாயி (75% மானியம்)' : '✓ General Farmer (75% Subsidy)')}
            </p>
            <p className="text-[11px] text-emerald-800 font-medium">
              {isTamil ? 'தோட்டக்கலை பயிர்களுக்கு முன்னுரிமை உண்டு.' : 'Eligible for priority DBT state allotment.'}
            </p>
          </div>
        </Card>

        {/* Search & Category Pills */}
        <Card className="p-5 md:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isTamil ? 'திட்டத்தின் பெயர் அல்லது துறையை தேடவும்...' : 'Search scheme name, department or category...'}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-charcoal-800 focus:outline-none focus:border-field-500"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === c.id
                    ? 'bg-field-900 text-white shadow-md'
                    : 'bg-slate-100 text-charcoal-600 hover:bg-slate-200'
                }`}
              >
                <span>{isTamil ? c.labelTa : c.labelEn}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Schemes Grid ────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-charcoal-900 flex items-center gap-2">
            <Award size={20} className="text-field-600" />
            {isTamil ? `தகுதியான திட்டங்கள் (${filteredSchemes.length})` : `Eligible Agricultural Schemes (${filteredSchemes.length})`}
          </h3>
          <span className="text-xs text-charcoal-400 font-medium">
            {isTamil ? 'நேரடி இணையதள விண்ணப்ப இணைப்புடன்' : 'With Direct Application Portals'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-3">
                {/* Badges */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                    {isTamil ? scheme.department_ta : scheme.department_en}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                    {scheme.applicable_subsidy_percentage}% {isTamil ? 'மானியம்' : 'Subsidy'}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h4 className="font-display font-bold text-charcoal-900 text-lg group-hover:text-field-700 transition">
                    {isTamil ? scheme.name_ta : scheme.name_en}
                  </h4>
                  <p className="text-xs text-charcoal-500 font-medium mt-1 leading-relaxed">
                    {isTamil ? scheme.description_ta : scheme.description_en}
                  </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-charcoal-400 uppercase">{isTamil ? 'மதிப்பிடப்பட்ட நிதி உதவி' : 'Max Financial Aid'}</span>
                    <p className="font-black text-field-700 text-base mt-0.5">
                      ₹{scheme.calculated_financial_aid_inr?.toLocaleString('en-IN') || scheme.max_subsidy_amount_inr?.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-charcoal-400 uppercase">{isTamil ? 'பொருத்தப்பாடு' : 'Match Score'}</span>
                    <p className="font-bold text-emerald-700 text-sm mt-0.5 flex items-center gap-1">
                      <CheckCircle2 size={14} /> {scheme.match_score || 98}% {isTamil ? 'பொருத்தம்' : 'Match'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setSelectedScheme(scheme);
                    setCheckedDocs({});
                  }}
                  className="flex-1 py-2.5 px-4 bg-field-900 hover:bg-field-800 text-white font-bold rounded-2xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <FileText size={14} />
                  <span>{isTamil ? 'விவரம் & ஆவணங்கள் சரிபார்ப்பு' : 'View Checklist & Details'}</span>
                </button>

                <a
                  href={scheme.portal_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-charcoal-700 font-bold rounded-2xl text-xs transition flex items-center gap-1 cursor-pointer"
                  title="Official Govt Portal"
                >
                  <ExternalLink size={14} />
                  <span>{isTamil ? 'விண்ணப்பிக்க' : 'Apply'}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MODAL: SCHEME DETAILS & DOCUMENT CHECKLIST */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-3 z-50 animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-field-900 to-field-800 text-white rounded-t-[2rem] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Landmark size={22} className="text-amber-300" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    {isTamil ? selectedScheme.name_ta : selectedScheme.name_en}
                  </h3>
                  <p className="text-xs text-emerald-100 font-semibold mt-0.5">
                    {isTamil ? selectedScheme.department_ta : selectedScheme.department_en} · {selectedScheme.applicable_subsidy_percentage}% {isTamil ? 'மானியம்' : 'Subsidy'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-xs text-charcoal-700">
              {/* Financial Aid Card */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-emerald-800 uppercase">{isTamil ? 'உங்களுக்கு கிடைக்கும் மானியத் தொகை' : 'Your Eligible Financial Subsidy'}</p>
                  <p className="text-2xl font-black text-emerald-950 mt-0.5">
                    ₹{selectedScheme.calculated_financial_aid_inr?.toLocaleString('en-IN') || selectedScheme.max_subsidy_amount_inr?.toLocaleString('en-IN')}
                  </p>
                </div>
                <span className="text-xs font-bold bg-emerald-200 text-emerald-900 px-3 py-1 rounded-full">
                  {selectedScheme.applicable_subsidy_percentage}% {isTamil ? 'அரசு மானியம்' : 'Govt Subsidy'}
                </span>
              </div>

              {/* Required Documents Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-charcoal-900 text-sm flex items-center gap-2">
                    <FileText size={16} className="text-field-600" />
                    {isTamil ? 'விண்ணப்பிக்க தேவையான ஆவணங்கள் (Checklist):' : 'Mandatory Application Documents:'}
                  </h4>
                  <span className="text-[10px] font-bold text-charcoal-400">
                    {Object.values(checkedDocs).filter(Boolean).length} / {(isTamil ? selectedScheme.required_documents_ta : selectedScheme.required_documents_en).length} {isTamil ? 'தயார்' : 'Ready'}
                  </span>
                </div>

                <div className="space-y-2">
                  {(isTamil ? selectedScheme.required_documents_ta : selectedScheme.required_documents_en).map((doc, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleDocCheck(idx)}
                      className={`p-3 rounded-2xl border flex items-center gap-3 transition cursor-pointer ${
                        checkedDocs[idx]
                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-charcoal-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                        checkedDocs[idx] ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {checkedDocs[idx] && <Check size={12} />}
                      </div>
                      <span className="flex-1">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step by Step Application Guide */}
              <div className="space-y-3">
                <h4 className="font-bold text-charcoal-900 text-sm flex items-center gap-2">
                  <Sparkles size={16} className="text-field-600" />
                  {isTamil ? 'விண்ணப்பிக்கும் வழிமுறைகள்:' : 'Step-by-Step Application Process:'}
                </h4>
                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  {(isTamil ? selectedScheme.application_steps_ta : selectedScheme.application_steps_en).map((step, idx) => (
                    <p key={idx} className="font-medium text-charcoal-700 leading-relaxed">
                      {step}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
              <button
                onClick={() => setSelectedScheme(null)}
                className="px-4 py-2 border border-slate-200 text-charcoal-600 font-bold rounded-xl hover:bg-slate-100 transition cursor-pointer text-xs"
              >
                {isTamil ? 'மூடு' : 'Close'}
              </button>
              <a
                href={selectedScheme.portal_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-field-900 hover:bg-field-800 text-white font-bold rounded-xl transition flex items-center gap-2 cursor-pointer text-xs shadow-sm"
              >
                <ExternalLink size={14} />
                <span>{isTamil ? 'அதிகாரப்பூர்வ தளத்தில் விண்ணப்பிக்க' : 'Apply on Official Portal'}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
