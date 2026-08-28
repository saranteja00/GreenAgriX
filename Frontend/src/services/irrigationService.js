// ─── Irrigation Service ────────────────────────────────────────────────────────
// Manages irrigation advisory decisions, water requirement estimates, schedules, and historical records

export const IRRIGATION_DECISION_DATA = {
  decision: 'WAIT',
  headline: 'Irrigation not required right now',
  badge: 'WAIT — Rain Expected',
  severity: 'monitor', // normal | monitor | attention | critical
  reason: 'Rainfall (75% probability) is expected within the next 12 hours. Adding irrigation now may cause waterlogging.',
  soilMoisture: 32,
  rainProbability: 75,
  expectedRainAmount: '15–25 mm',
  lastIrrigated: '2 days ago',
  nextReview: '6 hours',
  actionTitle: 'What Should I Do?',
  actionSummary: 'Wait before irrigating. Rain probability is high and additional irrigation may not be necessary.',
  estimatedRequirement: '18–22 mm',
  requirementStatus: 'Moderate',
  requirementPeriod: 'Next 24 Hours',
};

export const IRRIGATION_HISTORY_LOGS = [
  {
    id: 'log_0',
    date: 'Today',
    amount: '0 mm',
    method: '—',
    field: 'All Fields',
    status: 'Skipped (Rain expected)',
    notes: 'Advisory paused irrigation due to forecasted shower.',
  },
  {
    id: 'log_1',
    date: 'Yesterday',
    amount: '12 mm',
    method: 'Drip Zone 1',
    field: 'Plot B (Tomato)',
    status: 'Completed',
    duration: '35 mins',
    notes: 'Targeted root zone delivery at 6:30 AM.',
  },
  {
    id: 'log_2',
    date: '2 days ago',
    amount: '18 mm',
    method: 'Drip Irrigation',
    field: 'Plot A (Wheat)',
    status: 'Completed',
    duration: '50 mins',
    notes: 'Combined with water-soluble fertigation.',
  },
  {
    id: 'log_3',
    date: '5 days ago',
    amount: '15 mm',
    method: 'Sprinkler Zone 2',
    field: 'Plot C (Maize)',
    status: 'Completed',
    duration: '45 mins',
    notes: 'Regular vegetative stage rotation.',
  },
  {
    id: 'log_4',
    date: '8 days ago',
    amount: '20 mm',
    method: 'Drip Zone 3',
    field: 'Plot D (Cotton)',
    status: 'Completed',
    duration: '60 mins',
    notes: 'Pre-flowering soil soak.',
  },
];

export const FIELD_IRRIGATION_PLANS = [
  {
    fieldId: 'f1',
    fieldName: 'Plot A — Wheat',
    crop: 'Wheat',
    area: '4.5 Acres',
    method: 'Drip System (Automated)',
    flowRate: '4.2 L/hr/emitter',
    lastSession: '2 days ago (18 mm)',
    nextScheduled: 'Tomorrow evening (post-rain evaluation)',
    status: 'Standby',
  },
  {
    fieldId: 'f2',
    fieldName: 'Plot B — Tomato',
    crop: 'Tomato',
    area: '2.0 Acres',
    method: 'Micro-Drip Lines',
    flowRate: '2.0 L/hr/emitter',
    lastSession: 'Yesterday (12 mm)',
    nextScheduled: 'In 2 days',
    status: 'Optimal',
  },
  {
    fieldId: 'f3',
    fieldName: 'Plot C — Maize',
    crop: 'Maize',
    area: '6.0 Acres',
    method: 'Impact Sprinklers',
    flowRate: '12.5 L/min/nozzle',
    lastSession: '5 days ago (15 mm)',
    nextScheduled: 'Pending rain outcome',
    status: 'Standby',
  },
  {
    fieldId: 'f4',
    fieldName: 'Plot D — Cotton',
    crop: 'Cotton',
    area: '4.0 Acres',
    method: 'Furrow / Drip Hybrid',
    flowRate: '3.8 L/hr/emitter',
    lastSession: '8 days ago (20 mm)',
    nextScheduled: 'In 3 days',
    status: 'Monitoring',
  },
];

export const irrigationService = {
  getIrrigationAdvisory(moisture = 32, rainChance = 75) {
    if (rainChance > 65) {
      return {
        ...IRRIGATION_DECISION_DATA,
        decision: 'WAIT',
        headline: 'Irrigation not required right now',
        badge: 'WAIT — Rain Expected',
        severity: 'monitor',
        reason: `Rainfall (${rainChance}% chance) is forecasted within the next 12 hours. Avoid irrigating to prevent root suffocation.`,
        actionSummary: 'Wait before irrigating. Rain probability is high and natural precipitation will restore soil moisture.',
      };
    } else if (moisture < 35) {
      return {
        ...IRRIGATION_DECISION_DATA,
        decision: 'IRRIGATE SOON',
        headline: 'Irrigate within next 12–24 hours',
        badge: 'ACTION RECOMMENDED',
        severity: 'attention',
        reason: 'Soil moisture is low (32%) and no significant rain is expected soon.',
        actionSummary: 'Run drip irrigation for 40–50 minutes early morning.',
      };
    } else if (moisture < 25) {
      return {
        ...IRRIGATION_DECISION_DATA,
        decision: 'IRRIGATE NOW',
        headline: 'Immediate Irrigation Needed',
        badge: 'URGENT ACTION',
        severity: 'critical',
        reason: 'Soil moisture has dropped below critical threshold (25%). Crop is under water stress.',
        actionSummary: 'Start irrigation cycle immediately to avoid permanent wilting.',
      };
    } else {
      return {
        ...IRRIGATION_DECISION_DATA,
        decision: 'OPTIMAL',
        headline: 'Adequate soil moisture maintained',
        badge: 'OPTIMAL LEVEL',
        severity: 'normal',
        reason: 'Current soil moisture is within the preferred 40–70% range.',
        actionSummary: 'No action needed. Continue routine monitoring.',
      };
    }
  },

  getIrrigationHistory() {
    return [...IRRIGATION_HISTORY_LOGS];
  },

  getFieldPlans() {
    return [...FIELD_IRRIGATION_PLANS];
  },
};
