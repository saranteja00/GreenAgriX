import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { MOCK_DASHBOARD as D } from '../../data/mockDashboard';
import { Card, Badge, EmptyState } from '../../components/ui/index';
import {
  MessageSquare, CheckCircle2, ChevronDown, ChevronUp,
  Tag, ExternalLink, Plus, IndianRupee, Calendar, Users
} from 'lucide-react';

function QuestionCard({ q, isTamil }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="overflow-hidden border border-slate-100 rounded-3xl shadow-sm">
      <button
        className="w-full text-left p-5 cursor-pointer"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-field-100 text-field-700 flex items-center justify-center font-bold text-sm shrink-0">
            {q.author[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-charcoal-900 text-sm leading-snug">{q.question}</p>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="text-xs text-charcoal-400 font-medium">{q.author} · {q.location}</span>
              <span className="text-xs text-charcoal-400">·</span>
              <span className="text-xs text-charcoal-400">{q.time}</span>
              <span className="text-xs text-charcoal-400">·</span>
              <span className="text-xs text-charcoal-500 font-medium flex items-center gap-1">
                <MessageSquare size={11} /> {q.answers} {isTamil ? 'பதில்கள்' : 'answers'}
              </span>
              {q.verified && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-field-700 bg-field-100 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 size={10} /> {isTamil ? 'நிபுணர் சரிபார்த்தது' : 'Expert Verified'}
                </span>
              )}
            </div>
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {q.tags.map(t => (
                <span key={t} className="flex items-center gap-0.5 text-[10px] text-field-800 bg-field-50 px-2.5 py-0.5 rounded-full font-bold border border-field-100">
                  <Tag size={9} /> {t}
                </span>
              ))}
            </div>
          </div>
          <div className="shrink-0">
            {open ? <ChevronUp size={18} className="text-charcoal-400" /> : <ChevronDown size={18} className="text-charcoal-400" />}
          </div>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 animate-fade-in border-t border-slate-50">
          {q.verified && q.verifiedAnswer ? (
            <div className="mt-4 p-4 bg-field-50 border border-field-100 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={15} className="text-field-600" />
                <span className="text-xs font-bold text-field-700 uppercase tracking-wide">
                  {isTamil ? 'வேளாண் நிபுணரின் சரிபார்க்கப்பட்ட பதில்' : 'Verified Expert Answer'}
                </span>
              </div>
              <p className="text-xs font-medium text-field-950 leading-relaxed">{q.verifiedAnswer}</p>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-slate-50 rounded-2xl text-xs text-charcoal-500 font-medium">
              {isTamil ? 'இன்னும் பதிலளிக்கப்படவில்லை.' : 'No verified answer yet.'} <button className="text-field-600 font-bold hover:underline cursor-pointer">{isTamil ? 'முதலில் பதிலளிக்க →' : 'Be the first to answer →'}</button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function SchemeCard({ scheme, isTamil }) {
  return (
    <div className="flex items-start gap-3 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
      <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
        <IndianRupee size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-charcoal-900 text-sm">{scheme.name}</p>
        <p className="text-xs text-charcoal-500 mt-0.5 font-medium">{isTamil ? 'மானிய உதவி:' : 'Benefit:'} <span className="font-bold text-emerald-700">{scheme.amount}</span></p>
        <p className="text-xs text-charcoal-400 flex items-center gap-1 mt-1 font-medium">
          <Calendar size={11} /> {isTamil ? 'கடைசி தேதி:' : 'Deadline:'} {scheme.deadline}
        </p>
      </div>
      <button className="text-field-600 hover:text-field-800 transition shrink-0 p-1 cursor-pointer" aria-label="Open scheme">
        <ExternalLink size={16} />
      </button>
    </div>
  );
}

export default function Community() {
  const { isTamil } = useLanguage();
  const [tab, setTab] = useState('qa');
  const [askOpen, setAskOpen] = useState(false);
  const [question, setQuestion] = useState('');

  return (
    <div className="space-y-6 stagger-children animate-fade-in pb-16 max-w-5xl mx-auto pt-2">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-charcoal-900 flex items-center gap-2">
            <Users size={24} className="text-field-600" />
            {isTamil ? 'விவசாயிகள் சமூகம் & அரசு திட்டங்கள்' : 'Community & Government Schemes'}
          </h2>
          <p className="text-sm text-charcoal-500 font-medium mt-1">
            {isTamil 
              ? 'விவசாய சந்தேகங்களுக்கு நிபுணர் பதில்கள் மற்றும் மத்திய/மாநில அரசு திட்டங்கள்'
              : 'Agronomist-verified answers, peer farmer forum, and active agricultural schemes.'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl w-fit">
        <button
          onClick={() => setTab('qa')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${tab === 'qa' ? 'bg-white text-charcoal-900 shadow-sm' : 'text-charcoal-500 hover:text-charcoal-900'}`}
        >
          {isTamil ? 'கேள்வி & பதில் மன்றம்' : 'Q&A Forum'}
        </button>
        <button
          onClick={() => setTab('schemes')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${tab === 'schemes' ? 'bg-white text-charcoal-900 shadow-sm' : 'text-charcoal-500 hover:text-charcoal-900'}`}
        >
          {isTamil ? 'அரசு திட்டங்கள் & மானியங்கள்' : 'Govt Schemes'}
        </button>
      </div>

      {tab === 'qa' && (
        <div className="space-y-4">
          {D.community.map(q => (
            <QuestionCard key={q.id} q={q} isTamil={isTamil} />
          ))}
        </div>
      )}

      {tab === 'schemes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {D.schemes.map(s => (
            <SchemeCard key={s.id} scheme={s} isTamil={isTamil} />
          ))}
        </div>
      )}
    </div>
  );
}
