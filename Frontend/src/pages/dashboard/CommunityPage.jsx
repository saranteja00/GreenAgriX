import React, { useState } from 'react';
import { MOCK_DASHBOARD as D } from '../../data/mockDashboard';
import { Card, Badge } from '../../components/ui/index';
import {
  Users, MessageSquare, CheckCircle2, ChevronDown, ChevronUp,
  Tag, ExternalLink, Plus, X, BookOpen, BadgeCheck,
} from 'lucide-react';

function SchemeCard({ scheme }) {
  const urgent = new Date(scheme.deadline) < new Date(Date.now() + 14 * 86400000);
  return (
    <div className="flex items-start gap-3 p-3 bg-white border border-field-100 rounded-xl hover:shadow-card transition">
      <div className="w-8 h-8 bg-field-50 rounded-xl flex items-center justify-center shrink-0">
        <BookOpen size={15} className="text-field-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-charcoal-800 text-sm leading-tight">{scheme.name}</p>
        <p className="text-xs text-charcoal-500 mt-0.5">Amount: <span className="font-semibold text-field-700">{scheme.amount}</span></p>
        <p className={`text-xs mt-0.5 ${urgent ? 'text-red-600 font-semibold' : 'text-charcoal-400'}`}>
          Deadline: {scheme.deadline}{urgent ? ' ⚠️' : ''}
        </p>
      </div>
      <button className="text-signal-600 hover:text-signal-700 transition shrink-0">
        <ExternalLink size={14} />
      </button>
    </div>
  );
}

function QuestionCard({ q }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card className="p-5">
      <button className="w-full text-left" onClick={() => setExpanded(e => !e)}>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-field-100 text-field-700 flex items-center justify-center text-sm font-bold shrink-0">
            {q.author[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-charcoal-800 text-sm leading-snug">{q.question}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-xs text-charcoal-400">{q.author} · {q.location} · {q.time}</span>
              <span className="text-xs text-charcoal-400 flex items-center gap-1">
                <MessageSquare size={10} /> {q.answers}
              </span>
              {q.verified && (
                <span className="flex items-center gap-1 text-xs font-semibold text-field-700 bg-field-50 border border-field-200 px-1.5 py-0.5 rounded-full">
                  <BadgeCheck size={11} /> Expert Verified
                </span>
              )}
            </div>
          </div>
          <span className="text-charcoal-400 shrink-0 mt-0.5">
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </span>
        </div>
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {q.tags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 text-[10px] font-semibold text-charcoal-500 bg-slate-100 px-2 py-0.5 rounded-full">
              <Tag size={9} /> {tag}
            </span>
          ))}
        </div>
      </button>

      {expanded && q.verifiedAnswer && (
        <div className="mt-4 p-3 bg-field-50 border border-field-200 rounded-xl animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <BadgeCheck size={14} className="text-field-600" />
            <span className="text-xs font-bold text-field-700">Expert Answer</span>
          </div>
          <p className="text-sm text-charcoal-700 leading-relaxed">{q.verifiedAnswer}</p>
        </div>
      )}

      {expanded && !q.verifiedAnswer && (
        <div className="mt-4 p-3 bg-slate-50 rounded-xl animate-fade-in">
          <p className="text-sm text-charcoal-500">No verified answer yet. Be the first to help!</p>
        </div>
      )}
    </Card>
  );
}

function AskModal({ onClose }) {
  const [text, setText] = useState('');
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-fade-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-charcoal-900">Ask the Community</h2>
          <button onClick={onClose} className="text-charcoal-400 hover:text-charcoal-700 transition"><X size={18} /></button>
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Describe your crop issue or question in detail…"
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-charcoal-800 text-sm resize-none focus:outline-none focus:border-field-500 focus:ring-1 focus:ring-field-500 transition placeholder:text-charcoal-300"
          autoFocus
        />
        <p className="text-xs text-charcoal-400 mt-2">Be specific — mention crop type, growth stage, and symptoms.</p>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-charcoal-600 text-sm font-semibold hover:bg-slate-50 transition">
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-field-600 hover:bg-field-700 text-white text-sm font-semibold transition disabled:opacity-50"
            disabled={!text.trim()}
          >
            Post Question
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6 animate-fade-up">
      {showModal && <AskModal onClose={() => setShowModal(false)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal-900">Community & Knowledge Hub</h1>
          <p className="text-charcoal-500 text-sm mt-0.5">Peer answers, expert guidance, and government schemes.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-field-600 hover:bg-field-700 text-white text-sm font-semibold rounded-xl transition"
        >
          <Plus size={15} /> Ask a Question
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Q&A feed */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-charcoal-400 uppercase tracking-wider">
            <MessageSquare size={13} /> Recent Questions
          </div>
          {D.community.map(q => (
            <QuestionCard key={q.id} q={q} />
          ))}
        </div>

        {/* Schemes sidebar */}
        <div className="space-y-4">
          <div className="bg-field-600 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={16} className="text-harvest-300" />
              <h3 className="font-display font-bold">Government Schemes</h3>
            </div>
            <p className="text-xs text-white/70 mb-4">Relevant to your crops & region.</p>
            <div className="space-y-2">
              {D.schemes.map(s => (
                <SchemeCard key={s.id} scheme={s} />
              ))}
            </div>
          </div>

          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Users size={15} className="text-signal-600" />
              <h3 className="font-semibold text-charcoal-900 text-sm">Community Stats</h3>
            </div>
            <div className="space-y-2">
              {[['Questions answered', '12,840'], ['Expert agronomists', '48'], ['Active this week', '3,200']].map(([l, v]) => (
                <div key={l} className="flex justify-between text-xs">
                  <span className="text-charcoal-500">{l}</span>
                  <span className="font-bold text-charcoal-800 tabular-nums">{v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
