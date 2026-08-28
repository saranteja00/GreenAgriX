import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// StatCard — icon + label + value + optional trend chip
// ─────────────────────────────────────────────────────────────────────────────
export function StatCard({ icon: Icon, iconColor = 'text-field-600', iconBg = 'bg-field-50', label, value, trend, trendLabel, className = '' }) {
  const trendColor =
    trend === 'up'   ? 'text-field-600 bg-field-50'   :
    trend === 'down' ? 'text-red-600 bg-red-50'        :
    'text-charcoal-500 bg-slate-100';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div className={`bg-white rounded-2xl shadow-card border border-slate-100 p-5 flex flex-col gap-3 hover:shadow-card-hover transition-shadow duration-200 ${className}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon size={20} className={iconColor} />
      </div>
      <div>
        <p className="text-xs font-semibold text-charcoal-400 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-charcoal-900 tabular-nums mt-0.5">{value}</p>
      </div>
      {trendLabel && (
        <span className={`self-start flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${trendColor}`}>
          <TrendIcon size={11} />
          {trendLabel}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AlertBadge — severity pill
// ─────────────────────────────────────────────────────────────────────────────
const BADGE_STYLES = {
  critical: 'bg-red-100 text-red-700 border-red-200',
  caution:  'bg-harvest-100 text-harvest-700 border-harvest-200',
  info:     'bg-signal-50 text-signal-700 border-signal-200',
  healthy:  'bg-field-50 text-field-700 border-field-200',
};
const BADGE_DOTS = {
  critical: 'bg-red-500',
  caution:  'bg-harvest-500',
  info:     'bg-signal-500',
  healthy:  'bg-field-500',
};
export function AlertBadge({ type = 'info', label, className = '' }) {
  const style = BADGE_STYLES[type] ?? BADGE_STYLES.info;
  const dot   = BADGE_DOTS[type]   ?? BADGE_DOTS.info;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${style} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label ?? type}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HealthBar — thin progress bar with color zones
// ─────────────────────────────────────────────────────────────────────────────
function healthColor(value) {
  if (value >= 80) return 'bg-field-500';
  if (value >= 55) return 'bg-harvest-400';
  return 'bg-red-500';
}
export function HealthBar({ value = 0, showLabel = false, className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${healthColor(value)}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showLabel && (
        <span className={`text-xs font-bold tabular-nums ${value >= 80 ? 'text-field-600' : value >= 55 ? 'text-harvest-600' : 'text-red-600'}`}>
          {value}%
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SectionHeader — title + optional subtitle + optional right-side action
// ─────────────────────────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div>
        <h2 className="text-lg font-bold text-charcoal-900 font-display">{title}</h2>
        {subtitle && <p className="text-sm text-charcoal-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EmptyState — icon + heading + description + optional CTA
// ─────────────────────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}>
      {Icon && (
        <div className="w-14 h-14 bg-field-50 rounded-2xl flex items-center justify-center mb-4">
          <Icon size={26} className="text-field-400" />
        </div>
      )}
      <h3 className="font-display font-bold text-charcoal-800 text-lg mb-1">{title}</h3>
      {description && <p className="text-charcoal-500 text-sm max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SkeletonCard — shimmer placeholder
// ─────────────────────────────────────────────────────────────────────────────
export function SkeletonCard({ lines = 3, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl shadow-card border border-slate-100 p-5 space-y-3 ${className}`}>
      <div className="skeleton-shimmer h-4 w-2/3 rounded-lg" />
      <div className="skeleton-shimmer h-7 w-1/2 rounded-lg" />
      {lines >= 3 && <div className="skeleton-shimmer h-3 w-full rounded-lg" />}
      {lines >= 4 && <div className="skeleton-shimmer h-3 w-4/5 rounded-lg" />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MiniGauge — semicircle SVG gauge (used for farm health etc.)
// ─────────────────────────────────────────────────────────────────────────────
export function MiniGauge({ value = 0, size = 120, strokeWidth = 10 }) {
  const r = (size / 2) - strokeWidth;
  const circ = Math.PI * r;            // half-circle circumference
  const offset = circ - (value / 100) * circ;
  const color = value >= 80 ? '#2e7d4f' : value >= 55 ? '#E8A33D' : '#C0392B';

  return (
    <svg width={size} height={size / 2 + strokeWidth} viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`} aria-hidden="true">
      {/* Track */}
      <path
        d={`M ${strokeWidth} ${size / 2} A ${r} ${r} 0 0 1 ${size - strokeWidth} ${size / 2}`}
        fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} strokeLinecap="round"
      />
      {/* Fill */}
      <path
        d={`M ${strokeWidth} ${size / 2} A ${r} ${r} 0 0 1 ${size - strokeWidth} ${size / 2}`}
        fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
        strokeDasharray={`${circ} ${circ}`}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)' }}
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NutrientBar — labeled progress bar for NPK / pH etc.
// ─────────────────────────────────────────────────────────────────────────────
export function NutrientBar({ label, value, max = 100, color = 'bg-signal-500', unit = '%' }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold text-charcoal-500 w-8 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%`, transition: 'width 0.8s ease-out' }} />
      </div>
      <span className="text-xs font-bold tabular-nums text-charcoal-700 w-10 text-right">{value}{unit}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Card — generic white rounded card (alias used by existing pages)
// ─────────────────────────────────────────────────────────────────────────────
export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl shadow-card border border-slate-100 ${className}`}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Badge — colored pill variant (alias: variant = healthy|caution|critical|info)
// ─────────────────────────────────────────────────────────────────────────────
const VARIANT_STYLES = {
  healthy:  'bg-field-50 text-field-700 border-field-200',
  caution:  'bg-harvest-100 text-harvest-700 border-harvest-200',
  critical: 'bg-red-100 text-red-700 border-red-200',
  info:     'bg-signal-50 text-signal-700 border-signal-200',
};
const VARIANT_DOTS = {
  healthy: 'bg-field-500', caution: 'bg-harvest-500',
  critical: 'bg-red-500',  info: 'bg-signal-500',
};
export function Badge({ variant = 'info', children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${VARIANT_STYLES[variant] ?? VARIANT_STYLES.info} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${VARIANT_DOTS[variant] ?? VARIANT_DOTS.info}`} />
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AlertBanner — full-width contextual alert strip
// ─────────────────────────────────────────────────────────────────────────────
const BANNER_STYLES = {
  caution:  'bg-harvest-50 border-harvest-200 text-harvest-800',
  critical: 'bg-red-50 border-red-200 text-red-800',
  info:     'bg-signal-50 border-signal-200 text-signal-800',
  healthy:  'bg-field-50 border-field-200 text-field-800',
};
export function AlertBanner({ type = 'info', message, icon: Icon, className = '' }) {
  return (
    <div className={`flex items-start gap-2.5 px-4 py-3 rounded-xl border text-sm ${BANNER_STYLES[type] ?? BANNER_STYLES.info} ${className}`}>
      {Icon && <Icon size={16} className="mt-0.5 shrink-0" />}
      <p className="text-xs leading-relaxed">{message}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ProgressBar — thin bar (color prop: 'green' | 'amber' | 'red' | any bg-* class)
// ─────────────────────────────────────────────────────────────────────────────
const BAR_COLORS = {
  green: 'bg-field-500', amber: 'bg-harvest-400', red: 'bg-red-500',
  blue: 'bg-signal-500', teal: 'bg-signal-500',
};
export function ProgressBar({ value = 0, color = 'green', height = 6, showValue = false, className = '' }) {
  const bar = BAR_COLORS[color] ?? color;
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex-1 bg-slate-100 rounded-full overflow-hidden`} style={{ height }}>
        <div
          className={`h-full rounded-full ${bar}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%`, transition: 'width 0.7s ease-out' }}
        />
      </div>
      {showValue && (
        <span className="text-xs font-bold tabular-nums text-charcoal-700 w-8 text-right">{value}%</span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// StatBlock — compact label + big value block (used by DashboardHome)
// ─────────────────────────────────────────────────────────────────────────────
export function StatBlock({ label, value, sub, className = '' }) {
  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      <p className="text-xs font-semibold text-charcoal-400 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-charcoal-900 tabular-nums">{value}</p>
      {sub && <p className="text-xs text-charcoal-500">{sub}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GaugeChart — semicircle SVG gauge (alias of MiniGauge for existing pages)
// ─────────────────────────────────────────────────────────────────────────────
export function GaugeChart({ value = 0, size = 120, strokeWidth = 10, label }) {
  const r = (size / 2) - strokeWidth;
  const circ = Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color = value >= 80 ? '#2e7d4f' : value >= 55 ? '#E8A33D' : '#C0392B';
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <svg width={size} height={size / 2 + strokeWidth} viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`} aria-hidden="true">
          <path d={`M ${strokeWidth} ${size/2} A ${r} ${r} 0 0 1 ${size-strokeWidth} ${size/2}`}
            fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d={`M ${strokeWidth} ${size/2} A ${r} ${r} 0 0 1 ${size-strokeWidth} ${size/2}`}
            fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
            strokeDasharray={`${circ} ${circ}`} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)' }} />
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center">
          <span className="text-2xl font-bold tabular-nums text-charcoal-900">{value}</span>
        </div>
      </div>
      {label && <span className="text-xs text-charcoal-500">{label}</span>}
    </div>
  );
}
