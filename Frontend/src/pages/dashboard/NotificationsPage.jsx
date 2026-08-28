import React, { useState } from 'react';
import { MOCK_DASHBOARD as D } from '../../data/mockDashboard';
import { Card } from '../../components/ui/index';
import { Bell, CheckCheck, Bug, Droplets, TrendingUp, CalendarDays, Scan, Clock } from 'lucide-react';

const ICON_MAP = {
  bug: Bug, droplets: Droplets, 'trending-up': TrendingUp, calendar: CalendarDays, scan: Scan,
};
const TYPE_STYLE = {
  critical: 'bg-red-50 border-red-200 text-red-700',
  caution:  'bg-harvest-50 border-harvest-200 text-harvest-700',
  info:     'bg-signal-50 border-signal-200 text-signal-700',
};

const ALL_NOTIFICATIONS = [
  { id: 'n1', type: 'critical', title: 'Pest Detected — Aphid on Plot B', desc: 'AI diagnosis confidence 87%. Take action within 24h.', time: '2 hours ago', icon: 'bug',          read: false, date: 'Today' },
  { id: 'n2', type: 'caution',  title: 'Soil Moisture Low — Plot A',      desc: 'Current moisture 38% — below optimal range of 40–70%.', time: '5 hours ago', icon: 'droplets',  read: false, date: 'Today' },
  { id: 'n3', type: 'info',     title: 'Market: Cotton price rose 0.7%',  desc: 'Cotton now at ₹6,800/quintal — 2.7% above MSP.', time: '1 day ago', icon: 'trending-up',      read: true,  date: 'Yesterday' },
  { id: 'n4', type: 'info',     title: 'Maize harvest window opens',      desc: 'Maize on Plot C enters optimal harvest window in ~3 days.', time: '1 day ago', icon: 'calendar', read: true,  date: 'Yesterday' },
  { id: 'n5', type: 'caution',  title: 'Heavy rain forecast Wednesday',   desc: 'Delay fertilizer application until Thursday for best uptake.', time: '2 days ago', icon: 'droplets', read: true, date: '25 Aug' },
  { id: 'n6', type: 'info',     title: 'Scan history: New record saved',  desc: 'Your scan of Plot B was saved to history.', time: '2 days ago', icon: 'scan', read: true, date: '25 Aug' },
];

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(ALL_NOTIFICATIONS);
  const unread = notifs.filter(n => !n.read).length;

  const markAll = () => setNotifs(ns => ns.map(n => ({ ...n, read: true })));
  const markOne = (id) => setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));

  const grouped = notifs.reduce((acc, n) => {
    (acc[n.date] = acc[n.date] || []).push(n);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-up max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal-900">Notifications</h1>
          <p className="text-charcoal-500 text-sm mt-0.5">
            {unread > 0 ? `${unread} unread notification${unread > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unread > 0 && (
          <button onClick={markAll}
            className="flex items-center gap-1.5 text-sm text-field-600 font-semibold hover:underline">
            <CheckCheck size={15} /> Mark all read
          </button>
        )}
      </div>

      {Object.entries(grouped).map(([date, items]) => (
        <div key={date}>
          <p className="text-xs font-bold text-charcoal-400 uppercase tracking-wider mb-3">{date}</p>
          <div className="space-y-2">
            {items.map(n => {
              const Icon = ICON_MAP[n.icon] || Bell;
              const isStyle = TYPE_STYLE[n.type] ?? TYPE_STYLE.info;
              return (
                <button
                  key={n.id}
                  onClick={() => markOne(n.id)}
                  className={`w-full text-left flex items-start gap-3 p-4 rounded-2xl border transition ${!n.read ? `${isStyle} shadow-sm` : 'bg-white border-slate-100 opacity-70 hover:opacity-100 hover:shadow-card'}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${!n.read ? 'bg-white/60' : 'bg-slate-100'}`}>
                    <Icon size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-charcoal-900 truncate">{n.title}</p>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-field-500 shrink-0" />}
                    </div>
                    <p className="text-xs text-charcoal-500 mt-0.5 leading-relaxed">{n.desc}</p>
                    <p className="text-[10px] text-charcoal-400 mt-1 flex items-center gap-1"><Clock size={9} /> {n.time}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
