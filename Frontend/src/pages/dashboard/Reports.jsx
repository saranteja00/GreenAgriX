import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { MOCK_DASHBOARD as D } from '../../data/mockDashboard';
import { Card, Badge, StatBlock } from '../../components/ui/index';
import {
  BarChart3, Download, TrendingUp, TrendingDown, IndianRupee,
  Leaf, Package, Printer, FileText
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell, Legend,
} from 'recharts';

const INR = (v) => {
  if (typeof v === 'number') return `₹${v.toLocaleString('en-IN')}`;
  if (!v) return '₹0';
  return `₹${v}`;
};

const CustomTooltip = ({ active, payload, label, isTamil }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-charcoal-900 text-white border border-white/10 rounded-xl shadow-card px-3 py-2 text-xs space-y-1">
      <p className="font-semibold text-slate-300">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.fill }} className="font-bold">
          {isTamil ? 'வருவாய்' : p.name}: {p.dataKey === 'yield' ? `${p.value} t` : INR(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function Reports() {
  const { isTamil } = useLanguage();
  const [season, setSeason] = useState(D?.reports?.seasons?.[0] || 'Kharif 2026');
  const summary = D?.reports?.summary || { revenue: 142500, expenses: 58200, profit: 84300, margin: 59.2, yieldTons: 28.4 };
  const cropWise = D?.reports?.cropWise || [];
  const monthlyRevenue = D?.reports?.monthlyRevenue || [];

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6 stagger-children animate-fade-in pb-16">
      {/* Header + controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-charcoal-900 flex items-center gap-2">
            <FileText size={24} className="text-field-600" />
            {isTamil ? 'பண்ணை அறிக்கைகள் & நிதி பகுப்பாய்வு' : 'Reports & Analytics'}
          </h2>
          <p className="text-sm text-charcoal-500 font-medium mt-1">
            {isTamil 
              ? 'பருவக்கால சுருக்கம் · வங்கி மற்றும் அரசு மானிய விண்ணப்பங்களுக்கான அறிக்கை'
              : 'Season summary · export-ready for bank / subsidy applications'}
          </p>
        </div>
        <div className="flex items-center gap-3 no-print">
          <select
            value={season}
            onChange={e => setSeason(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-2xl text-xs font-bold text-charcoal-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-field-400/50 cursor-pointer"
          >
            {(D?.reports?.seasons || ['Kharif 2026', 'Rabi 2025-26', 'Kharif 2025']).map(s => (
              <option key={s} value={s}>
                {isTamil ? (s.includes('Kharif') ? s.replace('Kharif', 'காரிஃப் பருவம்') : s.replace('Rabi', 'ரபி பருவம்')) : s}
              </option>
            ))}
          </select>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-field-600 text-white rounded-2xl text-xs font-bold hover:bg-field-700 shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <Printer size={15} /> {isTamil ? 'அறிக்கையை பதிவிறக்க (PDF)' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print-card">
        {[
          { 
            label: isTamil ? 'மொத்த வருவாய்' : 'Total Revenue', 
            value: INR(summary.revenue), 
            icon: IndianRupee, 
            trend: isTamil ? '+12.4% கடந்த பருவத்தை விட' : '+12.4% vs last season', 
            trendPositive: true  
          },
          { 
            label: isTamil ? 'மொத்த செலவுகள்' : 'Total Expenses', 
            value: INR(summary.expenses), 
            icon: Package,     
            trend: isTamil ? '+3.1% உரம்/பாசனம்' : '+3.1% vs last season',  
            trendPositive: false 
          },
          { 
            label: isTamil ? 'நிகர லாபம்' : 'Net Profit',     
            value: INR(summary.profit),   
            icon: TrendingUp,  
            trend: isTamil ? `${summary.margin}% லாப வரம்பு` : `${summary.margin}% margin`, 
            trendPositive: true 
          },
          { 
            label: isTamil ? 'மொத்த விளைச்சல்' : 'Yield',          
            value: `${summary.yieldTons} ${isTamil ? 'டன்' : 't'}`, 
            icon: Leaf,     
            trend: isTamil ? '18.5 ஏக்கர் அறுவடை' : '18.5 ac harvested',     
            trendPositive: true  
          },
        ].map(s => (
          <Card key={s.label} className="p-5 border border-slate-200/90 rounded-3xl hover:shadow-md transition-all">
            <StatBlock {...s} />
          </Card>
        ))}
      </div>

      {/* Revenue chart */}
      <Card className="p-6 md:p-7 border border-slate-200/90 rounded-3xl print-card shadow-sm space-y-4">
        <h3 className="font-display font-bold text-charcoal-900 text-lg">
          {isTamil ? `மாதாந்திர வருவாய் — ${season.includes('Kharif') ? season.replace('Kharif', 'காரிஃப்') : season}` : `Monthly Revenue — ${season}`}
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthlyRevenue} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={v => `₹${v/1000}k`} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip isTamil={isTamil} />} />
            <Bar dataKey="revenue" name="Revenue" radius={[8,8,0,0]} fill="#2e7d4f" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Crop-wise breakdown */}
      <Card className="p-6 md:p-7 border border-slate-200/90 rounded-3xl print-card shadow-sm space-y-4">
        <h3 className="font-display font-bold text-charcoal-900 text-lg">
          {isTamil ? 'பயிர் வாரியான செயல்திறன் & வருமானம்' : 'Crop-wise Performance'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-charcoal-400">
                <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider">{isTamil ? 'பயிர்' : 'Crop'}</th>
                <th className="text-right py-3 px-4 text-xs font-bold uppercase tracking-wider">{isTamil ? 'வருவாய்' : 'Revenue'}</th>
                <th className="text-right py-3 px-4 text-xs font-bold uppercase tracking-wider">{isTamil ? 'செலவுகள்' : 'Expenses'}</th>
                <th className="text-right py-3 px-4 text-xs font-bold uppercase tracking-wider">{isTamil ? 'நிகர லாபம்' : 'Profit'}</th>
                <th className="text-right py-3 px-4 text-xs font-bold uppercase tracking-wider">{isTamil ? 'விளைச்சல் (டன்)' : 'Yield (t)'}</th>
                <th className="text-right py-3 px-4 text-xs font-bold uppercase tracking-wider">{isTamil ? 'லாப விகிதம்' : 'Margin'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cropWise.map(c => {
                const profit = c.profit ?? (c.revenue - c.expenses);
                const margin = c.margin ?? (c.revenue > 0 ? ((profit / c.revenue) * 100).toFixed(1) : 0);

                return (
                  <tr key={c.crop} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-bold text-charcoal-900">
                      {isTamil ? (c.crop === 'Wheat' ? '🌾 கோதுமை' : c.crop === 'Tomato' ? '🍅 தக்காளி' : c.crop === 'Maize' ? '🌽 மக்காச்சோளம்' : c.crop === 'Cotton' ? '🪴 பருத்தி' : c.crop) : c.crop}
                    </td>
                    <td className="text-right py-3.5 px-4 font-bold text-charcoal-900">{INR(c.revenue)}</td>
                    <td className="text-right py-3.5 px-4 text-charcoal-600 font-medium">{INR(c.expenses)}</td>
                    <td className="text-right py-3.5 px-4 font-black text-emerald-600">{INR(profit)}</td>
                    <td className="text-right py-3.5 px-4 text-charcoal-700 font-medium">{c.yield} {isTamil ? 'டன்' : 't'}</td>
                    <td className="text-right py-3.5 px-4">
                      <span className="font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs border border-emerald-200">
                        {margin}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
