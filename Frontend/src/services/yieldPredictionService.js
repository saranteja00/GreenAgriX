// ─── Yield Prediction Service ──────────────────────────────────────────────
// Estimates expected harvest volume, contributing agronomic drivers, and progression

export const YIELD_PREDICTION_DATA = {
  Tomato: {
    crop: 'Tomato',
    emoji: '🍅',
    unit: 'tonnes/acre',
    expectedRange: '4.0–4.5 tonnes',
    expectedAverage: 4.25,
    benchmarkAverage: 3.5,
    status: 'Optimal Projected Harvest',
    confidence: '92%',
    factors: [
      { name: 'Crop Health Index', score: 94, impact: '+15%', status: 'optimal', note: 'Disease-free canopy' },
      { name: 'Soil Nutrient Balance', score: 88, impact: '+12%', status: 'optimal', note: 'Optimal phosphorus & pH' },
      { name: 'Irrigation Timing', score: 82, impact: '+10%', status: 'optimal', note: 'Timed moisture replenishment' },
      { name: 'Weather Suitability', score: 78, impact: '+8%', status: 'good', note: 'Favorable temp & sunlight' },
      { name: 'Disease History', score: 95, impact: '0%', status: 'optimal', note: 'Zero major infestations' },
    ],
    progression: [
      { week: 'Week 3', range: '3.2–3.8 tonnes', avg: 3.5, note: 'Early seedling establishment' },
      { week: 'Week 6', range: '3.7–4.2 tonnes', avg: 3.95, note: 'Vigorous branch development' },
      { week: 'Week 9 (Current)', range: '4.0–4.5 tonnes', avg: 4.25, note: 'High flower setting rate' },
    ],
    disclaimer: 'Yield values are algorithmic projections based on current sensor readings and agricultural models. Actual results may vary with late-season weather events.',
  },
  Wheat: {
    crop: 'Wheat',
    emoji: '🌾',
    unit: 'tonnes/acre',
    expectedRange: '2.4–2.8 tonnes',
    expectedAverage: 2.6,
    benchmarkAverage: 2.1,
    status: 'High Yield Trajectory',
    confidence: '90%',
    factors: [
      { name: 'Tiller Density', score: 92, impact: '+14%', status: 'optimal', note: 'Strong tiller count/sq meter' },
      { name: 'Soil Organic Matter', score: 86, impact: '+10%', status: 'optimal', note: 'Loamy water holding capacity' },
      { name: 'Rainfall Alignment', score: 84, impact: '+9%', status: 'optimal', note: 'Timely moisture availability' },
      { name: 'Temperature Regime', score: 80, impact: '+6%', status: 'good', note: 'Cool heading weather' },
    ],
    progression: [
      { week: 'Week 4', range: '2.0–2.3 tonnes', avg: 2.15, note: 'Tillering phase' },
      { week: 'Week 8', range: '2.2–2.5 tonnes', avg: 2.35, note: 'Jointing phase' },
      { week: 'Week 11 (Current)', range: '2.4–2.8 tonnes', avg: 2.6, note: 'Head emergence & pollination' },
    ],
    disclaimer: 'Yield values are algorithmic projections based on current sensor readings and agricultural models. Actual results may vary with late-season weather events.',
  },
};

export const yieldPredictionService = {
  getYieldPrediction(crop = 'Tomato') {
    return YIELD_PREDICTION_DATA[crop] || YIELD_PREDICTION_DATA.Tomato;
  },
};
