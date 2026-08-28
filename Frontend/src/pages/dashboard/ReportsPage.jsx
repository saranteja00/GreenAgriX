import React, { useState } from 'react';
import { MOCK_DASHBOARD as D } from '../../data/mockDashboard';
import { Card, Badge } from '../../components/ui/index';
import {
  BarChart3, Download, ChevronDown, TrendingUp, TrendingDown, Minus,
  Wheat, Leaf, DollarSign, Package,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend,
} from 'recharts';

const CROP_ICONS = { Wheat: '🌾', Tomato: '🍅', Maize: '🌽', Cotton: '🪴', Soybean: '🫘' };

const CustomTooltip = ({ active, payload, label, prefix = '₹' }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-100 shadow-card rounded-xl px-3 py-2 text-xs">
        <p className="font-semibold text-charcoal-700 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {prefix}{p.value.toLocaleString()}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ReportsPage() {
  const { seasons, summary, cropWise, monthlyRevenue } = D.reports;
  const [season, setSeason] = useState(seasons[0]);

  const handlePrint = () => window.print();

  const summaryCards = [
    { label: 'Revenue',  value: `₹${(summary.revenue/1000).toFixed(0)}K`,  icon: TrendingUp,    color: 'text-field-600',   bg: 'bg-field-50' },
    { label: 'Expenses', value: `₹${(summary.expenses/1000).toFixed(0)}K`, icon: TrendingDown,  color: 'text-red-500',     bg: 'bg-red-50' },
    { label: 'Profit',   value: `₹${(summary.profit/1000).toFixed(0)}K`,   icon: DollarSign,    color: 'text-signal-600',  bg: 'bg-signal-50' },
    { label: 'Margin',   value: `${summary.margin}%`,                      icon: Minus,         color: 'text-harvest-600', bg: 'bg-harvest-50' },
    { label: 'Yield',    value: `${summary.yieldTons}T`,                   icon: Package,       color: 'text-charcoal-600',bg: 'bg-slate-50' },
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal-900">Reports & Analytics</h1>
          <p className="text-charcoal-500 text-sm mt-0.5">Financial summary and crop performance.</p>
        </div>
        <div className="flex gap-2 flex-wrap no-print">
          <div className="relative">
            <select
              value={season}
              onChange={e => setSeason(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-sm text-charcoal-700 focus:outline-none focus:border-field-500 cursor-pointer"
            >
              {seasons.map(s => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-charcoal-400 pointer-events-none" />
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-field-600 hover:bg-field-700 text-white text-sm font-semibold rounded-xl transition"
          >
            <Download size={15} /> Export PDF
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 print-card">
        {summaryCards.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="p-4 flex flex-col gap-2">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg}`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="text-xs text-charcoal-400 font-semibold uppercase tracking-wide">{label}</p>
              <p className={`text-xl font-bold tabular-nums ${color}`}>{value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly revenue bar */}
        <Card className="p-5 print-card">
          <h3 className="font-display font-bold text-charcoal-900 mb-4">Monthly Revenue (₹)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyRevenue} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f4" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9aada2' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9aada2' }} axisLine={false} tickLine={false}
                tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" name="Revenue" fill="#2e7d4f" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Crop-wise revenue vs expenses */}
        <Card className="p-5 print-card">
          <h3 className="font-display font-bold text-charcoal-900 mb-4">Crop-wise P&L (₹)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cropWise} barSize={20} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f4" vertical={false} />
              <XAxis dataKey="crop" tick={{ fontSize: 11, fill: '#9aada2' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9aada2' }} axisLine={false} tickLine={false}
                tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="revenue"  name="Revenue"  fill="#2e7d4f" radius={[4,4,0,0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#E8A33D" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Crop table */}
      <Card className="p-5 print-card overflow-x-auto">
        <h3 className="font-display font-bold text-charcoal-900 mb-4">Crop Performance Breakdown</h3>
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="border-b border-slate-100">
              {['Crop', 'Revenue', 'Expenses', 'Profit', 'Margin', 'Yield (T)'].map(h => (
                <th key={h} className="text-left text-xs font-bold text-charcoal-400 uppercase tracking-wide py-2 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {cropWise.map(row => {
              const profit = row.revenue - row.expenses;
              const margin = ((profit / row.revenue) * 100).toFixed(1);
              return (
                <tr key={row.crop} className="hover:bg-slate-50 transition">
                  <td className="py-3 pr-4 font-medium text-charcoal-800">
                    <span className="mr-1">{CROP_ICONS[row.crop] || '🌱'}</span>{row.crop}
                  </td>
                  <td className="py-3 pr-4 tabular-nums text-field-700 font-semibold">₹{row.revenue.toLocaleString()}</td>
                  <td className="py-3 pr-4 tabular-nums text-red-600">₹{row.expenses.toLocaleString()}</td>
                  <td className="py-3 pr-4 tabular-nums text-signal-700 font-semibold">₹{profit.toLocaleString()}</td>
                  <td className="py-3 pr-4">
                    <Badge variant={parseFloat(margin) > 50 ? 'healthy' : parseFloat(margin) > 30 ? 'caution' : 'critical'}>
                      {margin}%
                    </Badge>
                  </td>
                  <td className="py-3 tabular-nums text-charcoal-700">{row.yield}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
