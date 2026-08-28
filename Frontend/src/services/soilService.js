// ─── Soil Service ──────────────────────────────────────────────────────────
// Modular service for soil parameters, historical trends, AI advisories, crop suitability, and fertilizers

export const SOIL_METRICS_DATA = {
  moisture: 32,
  moistureIdeal: [40, 70],
  ph: 6.4,
  phIdeal: [6.0, 7.0],
  nitrogen: 42,
  phosphorus: 61,
  potassium: 55,
  temperature: 28,
  organicMatter: 2.8,
  ec: 1.2, // Electrical Conductivity in dS/m
  lastTested: '2 days ago',
  soilType: 'Loamy Soil',
};

export const CROP_SUITABILITY_LIST = [
  {
    id: 'crop_tomato',
    name: 'Tomato',
    emoji: '🍅',
    suitability: 'High',
    suitabilityScore: 94,
    color: 'emerald',
    waterReq: 'Moderate (20–25 mm/week)',
    phMatch: 'Optimal (Ideal 6.0–6.8)',
    notes: 'Well-drained loamy soil with current pH 6.4 provides excellent nutrient absorption.',
  },
  {
    id: 'crop_wheat',
    name: 'Wheat',
    emoji: '🌾',
    suitability: 'High',
    suitabilityScore: 91,
    color: 'emerald',
    waterReq: 'Low to Moderate (15–20 mm/week)',
    phMatch: 'Optimal (Ideal 6.0–7.5)',
    notes: 'Current soil texture and moderate nitrogen level are highly suitable for flowering stage.',
  },
  {
    id: 'crop_maize',
    name: 'Maize',
    emoji: '🌽',
    suitability: 'Medium',
    suitabilityScore: 76,
    color: 'amber',
    waterReq: 'High (30–35 mm/week)',
    phMatch: 'Good (Ideal 5.8–7.0)',
    notes: 'Requires supplemental nitrogen boost (Urea/Compost) before silking stage.',
  },
  {
    id: 'crop_cotton',
    name: 'Cotton',
    emoji: '🪴',
    suitability: 'Medium',
    suitabilityScore: 72,
    color: 'amber',
    waterReq: 'Moderate to High',
    phMatch: 'Good (Ideal 6.2–7.8)',
    notes: 'Current potassium level (55%) supports boll formation; ensure drainage.',
  },
  {
    id: 'crop_potato',
    name: 'Potato',
    emoji: '🥔',
    suitability: 'High',
    suitabilityScore: 88,
    color: 'emerald',
    waterReq: 'Moderate (Frequent light irrigation)',
    phMatch: 'Optimal (Ideal 5.5–6.5)',
    notes: 'Loose loamy soil structure allows unrestricted tuber enlargement.',
  },
];

export const SOIL_TRENDS_DATA = {
  '7d': [
    { day: 'Day 1', moisture: 45, ph: 6.4, n: 44, p: 60, k: 56, temp: 27 },
    { day: 'Day 2', moisture: 42, ph: 6.4, n: 43, p: 60, k: 55, temp: 28 },
    { day: 'Day 3', moisture: 40, ph: 6.5, n: 43, p: 61, k: 55, temp: 28 },
    { day: 'Day 4', moisture: 38, ph: 6.4, n: 42, p: 61, k: 55, temp: 29 },
    { day: 'Day 5', moisture: 35, ph: 6.4, n: 42, p: 61, k: 55, temp: 28 },
    { day: 'Day 6', moisture: 34, ph: 6.4, n: 42, p: 61, k: 54, temp: 28 },
    { day: 'Day 7 (Today)', moisture: 32, ph: 6.4, n: 42, p: 61, k: 55, temp: 28 },
  ],
  '30d': [
    { day: 'Aug 1', moisture: 62, ph: 6.5, n: 48, p: 62, k: 58, temp: 26 },
    { day: 'Aug 5', moisture: 55, ph: 6.4, n: 47, p: 62, k: 57, temp: 27 },
    { day: 'Aug 10', moisture: 48, ph: 6.4, n: 45, p: 61, k: 56, temp: 28 },
    { day: 'Aug 15', moisture: 50, ph: 6.3, n: 44, p: 61, k: 56, temp: 28 },
    { day: 'Aug 20', moisture: 44, ph: 6.4, n: 43, p: 61, k: 55, temp: 29 },
    { day: 'Aug 25', moisture: 38, ph: 6.4, n: 42, p: 61, k: 55, temp: 28 },
    { day: 'Today', moisture: 32, ph: 6.4, n: 42, p: 61, k: 55, temp: 28 },
  ],
  '90d': [
    { day: 'Jun 1', moisture: 68, ph: 6.6, n: 55, p: 65, k: 60, temp: 25 },
    { day: 'Jun 15', moisture: 60, ph: 6.5, n: 52, p: 64, k: 59, temp: 26 },
    { day: 'Jul 1', moisture: 58, ph: 6.5, n: 50, p: 63, k: 58, temp: 27 },
    { day: 'Jul 15', moisture: 52, ph: 6.4, n: 48, p: 62, k: 57, temp: 28 },
    { day: 'Aug 1', moisture: 46, ph: 6.4, n: 45, p: 61, k: 56, temp: 28 },
    { day: 'Today', moisture: 32, ph: 6.4, n: 42, p: 61, k: 55, temp: 28 },
  ],
};

export const FERTILIZER_ADVISORY_MATRIX = {
  Wheat: {
    Sowing: {
      category: 'Basal Nitrogen & Phosphorus',
      recommendation: 'Apply DAP (Di-Ammonium Phosphate) @ 50 kg/acre + Zinc Sulfate @ 10 kg/acre.',
      timing: 'At time of seed drilling',
      reason: 'Promotes rapid root anchoring and early tiller formation.',
    },
    Flowering: {
      category: 'Nitrogen & Micronutrient Boost',
      recommendation: 'Top-dress with Urea @ 25–30 kg/acre + Foliar spray of 19:19:19 (NPK) @ 1.5 kg/acre.',
      timing: 'Before next scheduled irrigation or post-rainfall',
      reason: 'Current Nitrogen is medium (42%); extra nitrogen supports grain filling and head emergence.',
    },
    Maturing: {
      category: 'Potash Finishing',
      recommendation: 'Foliar spray of Potassium Nitrate (13:0:45) @ 1 kg/acre.',
      timing: 'Early morning during mild sunlight',
      reason: 'Improves grain weight, test weight, and disease tolerance during ripening.',
    },
  },
  Tomato: {
    Vegetative: {
      category: 'Balanced Starter NPK',
      recommendation: 'NPK 10-26-26 @ 40 kg/acre or Vermicompost @ 2 tonnes/acre.',
      timing: '15 days after transplanting',
      reason: 'Encourages sturdy branching and broad foliage development.',
    },
    Flowering: {
      category: 'Calcium + Boron + Potassium',
      recommendation: 'Apply Calcium Nitrate @ 15 kg/acre + Boron spray @ 1 g/L water.',
      timing: 'At flower bud opening',
      reason: 'Prevents blossom end rot and improves pollen viability in humid conditions.',
    },
    Fruiting: {
      category: 'High Potassium (K)',
      recommendation: 'Sulfate of Potash (0:0:50) @ 25 kg/acre via drip fertigation.',
      timing: 'Weekly in split doses during fruit swelling',
      reason: 'Enhances fruit size, color, firmness, and shelf life.',
    },
  },
  Maize: {
    Vegetative: {
      category: 'High Nitrogen Starter',
      recommendation: 'Urea @ 35 kg/acre + Single Super Phosphate (SSP) @ 50 kg/acre.',
      timing: 'Knee-high stage (25–30 DAS)',
      reason: 'Stimulates robust stem thickness and photosynthetic surface.',
    },
    Flowering: {
      category: 'Tasseling Nutrition',
      recommendation: 'Urea @ 25 kg/acre + MOP (Muriate of Potash) @ 15 kg/acre.',
      timing: 'Just prior to tassel emergence',
      reason: 'Ensures full cob length and dense kernel set.',
    },
  },
};

export const soilService = {
  getSoilMetrics() {
    return { ...SOIL_METRICS_DATA };
  },

  getSoilTrends(period = '30d') {
    return SOIL_TRENDS_DATA[period] || SOIL_TRENDS_DATA['30d'];
  },

  getCropSuitability() {
    return [...CROP_SUITABILITY_LIST];
  },

  getFertilizerAdvisory(crop = 'Wheat', stage = 'Flowering') {
    const cropData = FERTILIZER_ADVISORY_MATRIX[crop] || FERTILIZER_ADVISORY_MATRIX.Wheat;
    const stageData = cropData[stage] || cropData.Flowering || Object.values(cropData)[0];

    return {
      crop,
      stage,
      ...stageData,
      currentN: SOIL_METRICS_DATA.nitrogen,
      currentP: SOIL_METRICS_DATA.phosphorus,
      currentK: SOIL_METRICS_DATA.potassium,
      disclaimer:
        'Recommendations are estimates based on available soil parameters and crop growth stage. Verify with local agricultural guidance or an agronomist before application.',
    };
  },

  getImprovementSuggestions() {
    return [
      {
        id: 'sug_1',
        title: 'Maintain Soil Moisture in Ideal Zone',
        desc: 'Keep root zone moisture between 40% and 70% to optimize microbial activity and nutrient solubility.',
        priority: 'high',
        status: 'actionable',
      },
      {
        id: 'sug_2',
        title: 'Supplement Nitrogen Before Irrigation',
        desc: 'Nitrogen is currently at 42% (Medium). Apply split-dose urea or enriched vermicompost for flowering crops.',
        priority: 'medium',
        status: 'recommended',
      },
      {
        id: 'sug_3',
        title: 'Preserve Organic Carbon Layer',
        desc: 'Mulching with farm crop residue reduces surface evaporation by up to 35% and moderates soil temperature.',
        priority: 'medium',
        status: 'best-practice',
      },
      {
        id: 'sug_4',
        title: 'Continue Regular Soil Testing',
        desc: 'Perform seasonal laboratory testing every 6 months to benchmark micro-nutrient (Zinc, Iron, Boron) levels.',
        priority: 'low',
        status: 'routine',
      },
    ];
  },
};
