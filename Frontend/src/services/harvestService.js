// ─── Harvest Recommendation Service ─────────────────────────────────────────
// Calculates optimal harvest window based on physiological maturity, market demand, and weather forecasts

export const HARVEST_RECOMMENDATION_DATA = {
  Tomato: {
    crop: 'Tomato',
    emoji: '🍅',
    recommendedWindow: 'September 12–16, 2026',
    daysRemaining: 12,
    urgency: 'Optimal Window Approaching',
    readinessScore: 82, // percentage
    statusColor: 'emerald',
    primaryDriver: 'Fruit physiological maturity aligns with peak regional Mandi pricing.',
    drivers: [
      {
        title: 'Crop Maturity',
        icon: '🍅',
        detail: 'Breaker to pink turning stage expected on Sep 11. Ideal for long transport.',
        status: 'Optimal',
      },
      {
        title: 'Weather Forecast',
        icon: '☀️',
        detail: 'Dry, sunny weather forecast for Sep 12–17. Zero rain damage risk during picking.',
        status: 'Ideal',
      },
      {
        title: 'Market Demand Window',
        icon: '📈',
        detail: 'Nashik & Mumbai mandis showing 18% supply deficit, promising ₹2,100–2,350/qtl.',
        status: 'Favorable',
      },
      {
        title: 'Field Access Conditions',
        icon: '🚜',
        detail: 'Soil trafficability is dry and solid for crates and transport vehicles.',
        status: 'Good',
      },
    ],
    guidance: 'Begin spot-picking early in the morning (6:00 AM – 9:30 AM) to maintain fruit firmness and extend shelf life.',
  },
  Wheat: {
    crop: 'Wheat',
    emoji: '🌾',
    recommendedWindow: 'October 10–14, 2026',
    daysRemaining: 42,
    urgency: 'Scheduled Maturation',
    readinessScore: 65,
    statusColor: 'emerald',
    primaryDriver: 'Grain moisture target (12–14%) will be reached under dry October sunshine.',
    drivers: [
      {
        title: 'Crop Maturity',
        icon: '🌾',
        detail: 'Hard dough stage scheduled for early October.',
        status: 'On Track',
      },
      {
        title: 'Weather Forecast',
        icon: '☀️',
        detail: 'Clear dry post-monsoon weather forecasted.',
        status: 'Optimal',
      },
      {
        title: 'Market Demand Window',
        icon: '📈',
        detail: 'Government procurement centers open at MSP ₹2,275/qtl.',
        status: 'Stable',
      },
    ],
    guidance: 'Ensure combine harvester blades are sharp and grain moisture is verified under 13% before bagging.',
  },
};

export const harvestService = {
  getHarvestRecommendation(crop = 'Tomato') {
    return HARVEST_RECOMMENDATION_DATA[crop] || HARVEST_RECOMMENDATION_DATA.Tomato;
  },
};
