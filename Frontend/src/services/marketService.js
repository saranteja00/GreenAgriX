// ─── Market Data Service ────────────────────────────────────────────────────
// Modular service for real-time Mandi pricing, predictive market demand, and inter-mandi comparison for 12 major crops

export const MANDIS = [
  'Nashik Mandi',
  'Koyambedu Mandi (Chennai)',
  'Azadpur Mandi (Delhi)',
  'Ottanchathiram Mandi',
  'Yeshwanthpur APMC (Bangalore)',
  'Kolar APMC',
];

// Per-mandi price offsets so each mandi has realistic different prices
const MANDI_OFFSETS = {
  'Nashik Mandi':                 { multiplier: 1.00, arrivals: 450, distanceKm: 180, freightPerQtl: 95, state: 'Maharashtra', mandiTa: 'நாசிக் மண்டி' },
  'Koyambedu Mandi (Chennai)':    { multiplier: 1.14, arrivals: 820, distanceKm: 42,  freightPerQtl: 40, state: 'Tamil Nadu',   mandiTa: 'கோயம்பேடு மண்டி (சென்னை)' },
  'Azadpur Mandi (Delhi)':        { multiplier: 1.18, arrivals: 1200, distanceKm: 450, freightPerQtl: 220, state: 'Delhi NCR',  mandiTa: 'ஆசாத்பூர் மண்டி (டெல்லி)' },
  'Ottanchathiram Mandi':         { multiplier: 1.08, arrivals: 610, distanceKm: 95,  freightPerQtl: 60, state: 'Tamil Nadu',   mandiTa: 'ஒட்டன்சத்திரம் சந்தை' },
  'Yeshwanthpur APMC (Bangalore)':{ multiplier: 1.10, arrivals: 730, distanceKm: 140, freightPerQtl: 80, state: 'Karnataka',    mandiTa: 'யஷ்வந்த்பூர் APMC (பெங்களூரு)' },
  'Kolar APMC':                   { multiplier: 1.05, arrivals: 950, distanceKm: 110, freightPerQtl: 70, state: 'Karnataka',    mandiTa: 'கோலார் APMC' },
};

const MANDI_PRICE_CHANGES = {
  'Nashik Mandi':                 [4.8, 2.1, 0.5, -2.4, 1.2, 3.1, 2.5, 4.0, 1.8, 3.5, 2.2, 1.9],
  'Koyambedu Mandi (Chennai)':    [5.4, 3.2, 1.2, -1.0, 2.0, 4.0, 3.8, 5.2, 2.6, 4.2, 3.1, 2.7],
  'Azadpur Mandi (Delhi)':        [6.2, 4.0, 1.5, 0.5, 2.8, 4.5, 4.1, 5.8, 3.2, 4.9, 3.6, 3.0],
  'Ottanchathiram Mandi':         [3.8, 1.9, 0.8, -1.8, 0.9, 2.5, 3.0, 3.9, 1.5, 3.1, 2.0, 1.6],
  'Yeshwanthpur APMC (Bangalore)':[4.2, 2.5, 1.0, -1.2, 1.5, 3.2, 3.4, 4.5, 2.0, 3.8, 2.5, 2.1],
  'Kolar APMC':                   [3.5, 1.8, 0.6, -2.0, 1.0, 2.8, 2.9, 3.6, 1.4, 3.0, 1.8, 1.5],
};

export const BASE_CROPS = [
  {
    id: 1,
    crop: 'Tomato',
    icon: '🍅',
    basePrice: 1850,
    historicalPrice: 1780,
    marketArrivals: 420,
    predictedDemand: 510,
    forecastPeriod: '30 Days',
    demandLevel: 'High Demand',
    demandStatus: '🟢',
    demandTrend: 'Increasing',
    trendIcon: '↑',
    history: [
      { date: 'Mar', price: 1500, predicted: 1500, volume: 380 },
      { date: 'Apr', price: 1650, predicted: 1600, volume: 410 },
      { date: 'May', price: 1550, predicted: 1580, volume: 460 },
      { date: 'Jun', price: 1780, predicted: 1750, volume: 490 },
      { date: 'Jul', price: 1850, predicted: 1900, volume: 510 },
      { date: 'Aug', price: null, predicted: 2100, volume: 550 },
    ],
  },
  {
    id: 2,
    crop: 'Potato',
    icon: '🥔',
    basePrice: 1650,
    historicalPrice: 1580,
    marketArrivals: 720,
    predictedDemand: 830,
    forecastPeriod: '30 Days',
    demandLevel: 'High Demand',
    demandStatus: '🟢',
    demandTrend: 'Increasing',
    trendIcon: '↑',
    history: [
      { date: 'Mar', price: 1350, predicted: 1350, volume: 680 },
      { date: 'Apr', price: 1420, predicted: 1400, volume: 710 },
      { date: 'May', price: 1490, predicted: 1480, volume: 750 },
      { date: 'Jun', price: 1580, predicted: 1550, volume: 790 },
      { date: 'Jul', price: 1650, predicted: 1720, volume: 830 },
      { date: 'Aug', price: null, predicted: 1850, volume: 880 },
    ],
  },
  {
    id: 3,
    crop: 'Maize',
    icon: '🌽',
    basePrice: 1950,
    historicalPrice: 2020,
    marketArrivals: 580,
    predictedDemand: 490,
    forecastPeriod: '30 Days',
    demandLevel: 'Low Demand',
    demandStatus: '🔴',
    demandTrend: 'Decreasing',
    trendIcon: '↓',
    history: [
      { date: 'Mar', price: 2100, predicted: 2100, volume: 620 },
      { date: 'Apr', price: 2080, predicted: 2060, volume: 590 },
      { date: 'May', price: 2050, predicted: 2020, volume: 560 },
      { date: 'Jun', price: 2020, predicted: 1980, volume: 520 },
      { date: 'Jul', price: 1950, predicted: 1920, volume: 490 },
      { date: 'Aug', price: null, predicted: 1880, volume: 460 },
    ],
  },
  {
    id: 4,
    crop: 'Wheat',
    icon: '🌾',
    basePrice: 2275,
    historicalPrice: 2250,
    marketArrivals: 890,
    predictedDemand: 910,
    forecastPeriod: '30 Days',
    demandLevel: 'Medium Demand',
    demandStatus: '🟡',
    demandTrend: 'Stable',
    trendIcon: '→',
    history: [
      { date: 'Mar', price: 2100, predicted: 2100, volume: 850 },
      { date: 'Apr', price: 2150, predicted: 2150, volume: 870 },
      { date: 'May', price: 2200, predicted: 2200, volume: 890 },
      { date: 'Jun', price: 2250, predicted: 2240, volume: 900 },
      { date: 'Jul', price: 2275, predicted: 2280, volume: 910 },
      { date: 'Aug', price: null, predicted: 2300, volume: 920 },
    ],
  },
  {
    id: 5,
    crop: 'Rice',
    icon: '🌾',
    basePrice: 3200,
    historicalPrice: 3100,
    marketArrivals: 940,
    predictedDemand: 1050,
    forecastPeriod: '30 Days',
    demandLevel: 'High Demand',
    demandStatus: '🟢',
    demandTrend: 'Increasing',
    trendIcon: '↑',
    history: [
      { date: 'Mar', price: 2900, predicted: 2900, volume: 890 },
      { date: 'Apr', price: 2980, predicted: 2950, volume: 920 },
      { date: 'May', price: 3050, predicted: 3040, volume: 960 },
      { date: 'Jun', price: 3100, predicted: 3120, volume: 990 },
      { date: 'Jul', price: 3200, predicted: 3280, volume: 1050 },
      { date: 'Aug', price: null, predicted: 3400, volume: 1100 },
    ],
  },
  {
    id: 6,
    crop: 'Onion',
    icon: '🧅',
    basePrice: 2100,
    historicalPrice: 2000,
    marketArrivals: 650,
    predictedDemand: 760,
    forecastPeriod: '30 Days',
    demandLevel: 'High Demand',
    demandStatus: '🟢',
    demandTrend: 'Increasing',
    trendIcon: '↑',
    history: [
      { date: 'Mar', price: 1800, predicted: 1800, volume: 600 },
      { date: 'Apr', price: 1950, predicted: 1900, volume: 640 },
      { date: 'May', price: 1900, predicted: 1950, volume: 690 },
      { date: 'Jun', price: 2000, predicted: 2050, volume: 730 },
      { date: 'Jul', price: 2100, predicted: 2200, volume: 760 },
      { date: 'Aug', price: null, predicted: 2350, volume: 810 },
    ],
  },
  {
    id: 7,
    crop: 'Brinjal',
    icon: '🍆',
    basePrice: 2400,
    historicalPrice: 2280,
    marketArrivals: 360,
    predictedDemand: 420,
    forecastPeriod: '30 Days',
    demandLevel: 'High Demand',
    demandStatus: '🟢',
    demandTrend: 'Increasing',
    trendIcon: '↑',
    history: [
      { date: 'Mar', price: 2000, predicted: 2000, volume: 320 },
      { date: 'Apr', price: 2100, predicted: 2080, volume: 340 },
      { date: 'May', price: 2180, predicted: 2200, volume: 360 },
      { date: 'Jun', price: 2280, predicted: 2300, volume: 390 },
      { date: 'Jul', price: 2400, predicted: 2500, volume: 420 },
      { date: 'Aug', price: null, predicted: 2650, volume: 450 },
    ],
  },
  {
    id: 8,
    crop: 'Chilli',
    icon: '🌶️',
    basePrice: 14500,
    historicalPrice: 14000,
    marketArrivals: 210,
    predictedDemand: 260,
    forecastPeriod: '30 Days',
    demandLevel: 'High Demand',
    demandStatus: '🟢',
    demandTrend: 'Increasing',
    trendIcon: '↑',
    history: [
      { date: 'Mar', price: 12500, predicted: 12500, volume: 180 },
      { date: 'Apr', price: 13000, predicted: 12800, volume: 190 },
      { date: 'May', price: 13500, predicted: 13400, volume: 200 },
      { date: 'Jun', price: 14000, predicted: 14200, volume: 220 },
      { date: 'Jul', price: 14500, predicted: 15200, volume: 260 },
      { date: 'Aug', price: null, predicted: 16000, volume: 290 },
    ],
  },
  {
    id: 9,
    crop: 'Carrot',
    icon: '🥕',
    basePrice: 2800,
    historicalPrice: 2700,
    marketArrivals: 340,
    predictedDemand: 380,
    forecastPeriod: '30 Days',
    demandLevel: 'Medium Demand',
    demandStatus: '🟡',
    demandTrend: 'Increasing',
    trendIcon: '↑',
    history: [
      { date: 'Mar', price: 2400, predicted: 2400, volume: 300 },
      { date: 'Apr', price: 2500, predicted: 2480, volume: 320 },
      { date: 'May', price: 2600, predicted: 2620, volume: 340 },
      { date: 'Jun', price: 2700, predicted: 2750, volume: 360 },
      { date: 'Jul', price: 2800, predicted: 2900, volume: 380 },
      { date: 'Aug', price: null, predicted: 3050, volume: 410 },
    ],
  },
  {
    id: 10,
    crop: 'Cotton',
    icon: '🧶',
    basePrice: 6800,
    historicalPrice: 6750,
    marketArrivals: 310,
    predictedDemand: 340,
    forecastPeriod: '30 Days',
    demandLevel: 'Medium Demand',
    demandStatus: '🟡',
    demandTrend: 'Increasing',
    trendIcon: '↑',
    history: [
      { date: 'Mar', price: 6200, predicted: 6200, volume: 290 },
      { date: 'Apr', price: 6400, predicted: 6350, volume: 310 },
      { date: 'May', price: 6500, predicted: 6500, volume: 320 },
      { date: 'Jun', price: 6600, predicted: 6650, volume: 330 },
      { date: 'Jul', price: 6750, predicted: 6800, volume: 340 },
      { date: 'Aug', price: null, predicted: 6950, volume: 360 },
    ],
  },
  {
    id: 11,
    crop: 'Groundnut',
    icon: '🥜',
    basePrice: 6100,
    historicalPrice: 5950,
    marketArrivals: 280,
    predictedDemand: 320,
    forecastPeriod: '30 Days',
    demandLevel: 'High Demand',
    demandStatus: '🟢',
    demandTrend: 'Increasing',
    trendIcon: '↑',
    history: [
      { date: 'Mar', price: 5600, predicted: 5600, volume: 240 },
      { date: 'Apr', price: 5750, predicted: 5700, volume: 260 },
      { date: 'May', price: 5850, predicted: 5820, volume: 270 },
      { date: 'Jun', price: 5950, predicted: 6000, volume: 290 },
      { date: 'Jul', price: 6100, predicted: 6250, volume: 320 },
      { date: 'Aug', price: null, predicted: 6450, volume: 350 },
    ],
  },
  {
    id: 12,
    crop: 'Soybean',
    icon: '🌱',
    basePrice: 4200,
    historicalPrice: 4150,
    marketArrivals: 410,
    predictedDemand: 460,
    forecastPeriod: '30 Days',
    demandLevel: 'Medium Demand',
    demandStatus: '🟡',
    demandTrend: 'Increasing',
    trendIcon: '↑',
    history: [
      { date: 'Mar', price: 3900, predicted: 3900, volume: 380 },
      { date: 'Apr', price: 4000, predicted: 4020, volume: 410 },
      { date: 'May', price: 4100, predicted: 4100, volume: 430 },
      { date: 'Jun', price: 4150, predicted: 4180, volume: 450 },
      { date: 'Jul', price: 4200, predicted: 4250, volume: 460 },
      { date: 'Aug', price: null, predicted: 4320, volume: 480 },
    ],
  },
];

function buildCropForMandi(crop, mandi, cropIndex, forecastPeriod = '30 Days') {
  const { multiplier } = MANDI_OFFSETS[mandi] || { multiplier: 1 };
  const priceChanges = MANDI_PRICE_CHANGES[mandi] || [];
  const currentPrice = Math.round(crop.basePrice * multiplier);
  const priceChange = priceChanges[cropIndex] ?? 0;

  return {
    ...crop,
    market: mandi,
    mandi,
    forecastPeriod: forecastPeriod || crop.forecastPeriod || '30 Days',
    currentPrice,
    priceChange,
    updatedAt: new Date().toISOString(),
    history: crop.history.map(h => ({
      ...h,
      price: h.price !== null ? Math.round(h.price * multiplier) : null,
      predicted: Math.round(h.predicted * multiplier),
    })),
  };
}

/** Returns all crops for a given mandi */
export function getMandiData(mandi = 'Nashik Mandi', forecastPeriod = '30 Days') {
  return BASE_CROPS.map((crop, i) => buildCropForMandi(crop, mandi, i, forecastPeriod));
}

/** Returns per-mandi price rows for a single crop (for Inter-Market Comparison Graph) */
export function getMarketComparisonForCrop(cropId) {
  const crop = BASE_CROPS.find(c => c.id === cropId || c.crop.toLowerCase() === String(cropId).toLowerCase()) || BASE_CROPS[0];
  
  const comparisonList = MANDIS.map(mandi => {
    const meta = MANDI_OFFSETS[mandi] || { multiplier: 1.0, arrivals: 500, distanceKm: 100, freightPerQtl: 70, state: 'State', mandiTa: mandi };
    const mandiPrice = Math.round(crop.basePrice * meta.multiplier);
    const netReturn = mandiPrice - meta.freightPerQtl;

    return {
      mandi,
      mandiTa: meta.mandiTa,
      state: meta.state,
      price: mandiPrice,
      arrivals: meta.arrivals,
      distanceKm: meta.distanceKm,
      freightPerQtl: meta.freightPerQtl,
      netReturn,
      crop: crop.crop,
      cropIcon: crop.icon
    };
  }).sort((a, b) => b.price - a.price);

  // Mark the highest net return market
  if (comparisonList.length > 0) {
    comparisonList[0].isBest = true;
  }

  return comparisonList;
}

export const marketService = {
  getMarketDataSync: getMandiData,
  getMarketComparisonForCropSync: getMarketComparisonForCrop,
  getMandiData,
  getMarketComparisonForCrop,

  async getMarketData(mandi = 'Nashik Mandi', forecastPeriod = '30 Days') {
    return getMandiData(mandi, forecastPeriod);
  },

  async searchMarketData(query, mandi = 'Nashik Mandi') {
    const lq = (query || '').toLowerCase();
    return getMandiData(mandi).filter(
      item =>
        item.crop.toLowerCase().includes(lq) ||
        item.market.toLowerCase().includes(lq),
    );
  },

  async getMarketComparison(cropId) {
    return getMarketComparisonForCrop(cropId);
  },
};
