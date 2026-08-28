export const MOCK_DASHBOARD = {
  // Farm Health
  farmHealth: {
    score: 78,
    trend: '+4 this week',
    breakdown: {
      soilHealth: 82,
      cropCondition: 74,
      irrigationStatus: 80,
      pestRisk: 68,
    },
  },

  // Weather — today
  weather: {
    location: 'Nashik, Maharashtra',
    current: {
      temp: 28,
      feels: 31,
      condition: 'Partly Cloudy',
      humidity: 72,
      windSpeed: 14,
      windDir: 'SW',
      uvIndex: 7,
      icon: 'cloud-sun',
    },
    forecast: [
      { day: 'Today',  high: 30, low: 22, rain: 10, condition: 'Partly Cloudy', icon: 'cloud-sun' },
      { day: 'Wed',    high: 27, low: 20, rain: 75, condition: 'Heavy Rain',    icon: 'cloud-rain' },
      { day: 'Thu',    high: 24, low: 19, rain: 60, condition: 'Rain',          icon: 'cloud-rain' },
      { day: 'Fri',    high: 29, low: 21, rain: 20, condition: 'Sunny',         icon: 'sun' },
      { day: 'Sat',    high: 32, low: 23, rain: 5,  condition: 'Sunny',         icon: 'sun' },
      { day: 'Sun',    high: 31, low: 22, rain: 15, condition: 'Partly Cloudy', icon: 'cloud-sun' },
      { day: 'Mon',    high: 28, low: 20, rain: 40, condition: 'Cloudy',        icon: 'cloud' },
    ],
    alert: {
      level: 'caution',
      message: 'Heavy rain expected Wednesday — delay fertilizer application by 2 days.',
    },
    rainfallTrend: [
      { month: 'Mar', mm: 8  },
      { month: 'Apr', mm: 22 },
      { month: 'May', mm: 45 },
      { month: 'Jun', mm: 180 },
      { month: 'Jul', mm: 210 },
      { month: 'Aug', mm: 165 },
    ],
  },

  // Alerts
  alerts: [
    { id: 'a1', type: 'critical', title: 'Pest Detected — Aphid', field: 'Plot B (Tomato)', time: '2h ago', read: false },
    { id: 'a2', type: 'caution',  title: 'Soil Moisture Low',     field: 'Plot A (Wheat)',  time: '5h ago', read: false },
    { id: 'a3', type: 'info',     title: 'Harvest Window Opens',  field: 'Plot C (Maize)',  time: '1d ago', read: true  },
  ],

  // Tasks due today
  tasks: [
    { id: 't1', title: 'Apply organic fertilizer — Plot A', crop: 'Wheat',  priority: 'high',   done: false },
    { id: 't2', title: 'Irrigate — Plot D (drip zone)',     crop: 'Cotton', priority: 'medium', done: false },
    { id: 't3', title: 'Scout for pest damage — Plot B',    crop: 'Tomato', priority: 'high',   done: true  },
    { id: 't4', title: 'Record growth stage update',        crop: 'Maize',  priority: 'low',    done: false },
  ],

  // Quick stats
  stats: {
    activeCrops:   5,
    acresManaged:  18.5,
    activeAlerts:  2,
    daysToHarvest: 24,
  },

  // Activity feed
  activity: [
    { id: 'ac1', action: 'Scanned Plot B for disease',         time: '2h ago',  icon: 'scan',          result: 'Aphid detected' },
    { id: 'ac2', action: 'Soil moisture logged — Plot A',      time: '4h ago',  icon: 'droplets',      result: '38% (Low)' },
    { id: 'ac3', action: 'Market price checked — Wheat',       time: '1d ago',  icon: 'trending-up',   result: '₹2,240/quintal' },
    { id: 'ac4', action: 'Fertilizer applied — Plot C',        time: '2d ago',  icon: 'sprout',        result: 'NPK 10-26-26' },
    { id: 'ac5', action: 'Harvest date set — Maize (Plot C)',  time: '3d ago',  icon: 'calendar',      result: 'Sep 20, 2026' },
  ],

  // Fields/Farms
  fields: [
    { id: 'f1', name: 'Plot A',  crop: 'Wheat',   acres: 4.5, stage: 'Flowering',   health: 82, lastActivity: '4h ago',  lat: 19.9975, lng: 73.7898 },
    { id: 'f2', name: 'Plot B',  crop: 'Tomato',  acres: 2.0, stage: 'Fruiting',    health: 58, lastActivity: '2h ago',  lat: 19.9980, lng: 73.7910 },
    { id: 'f3', name: 'Plot C',  crop: 'Maize',   acres: 6.0, stage: 'Maturing',    health: 88, lastActivity: '2d ago',  lat: 19.9960, lng: 73.7885 },
    { id: 'f4', name: 'Plot D',  crop: 'Cotton',  acres: 4.0, stage: 'Boll Dev.',   health: 75, lastActivity: '1d ago',  lat: 19.9955, lng: 73.7920 },
    { id: 'f5', name: 'North 1', crop: 'Soybean', acres: 2.0, stage: 'Podding',     health: 91, lastActivity: '3d ago',  lat: 20.0005, lng: 73.7875 },
  ],

  // Crop Calendar
  cropCalendar: [
    {
      id: 'cc1', crop: 'Wheat', field: 'Plot A', color: '#E8A33D',
      sowDate: '2026-06-15', harvestDate: '2026-10-10',
      currentStage: 'Flowering',
      milestones: [
        { name: 'Sowing',        date: '2026-06-15', done: true  },
        { name: 'Germination',   date: '2026-06-25', done: true  },
        { name: 'Tillering',     date: '2026-07-20', done: true  },
        { name: 'Jointing',      date: '2026-08-05', done: true  },
        { name: 'Heading',       date: '2026-08-20', done: true  },
        { name: 'Flowering',     date: '2026-09-01', done: false },
        { name: 'Grain Fill',    date: '2026-09-20', done: false },
        { name: 'Harvest',       date: '2026-10-10', done: false },
      ],
    },
    {
      id: 'cc2', crop: 'Maize', field: 'Plot C', color: '#2e7d4f',
      sowDate: '2026-06-01', harvestDate: '2026-09-20',
      currentStage: 'Maturing',
      milestones: [
        { name: 'Sowing',      date: '2026-06-01', done: true  },
        { name: 'Emergence',   date: '2026-06-10', done: true  },
        { name: 'Vegetative',  date: '2026-07-01', done: true  },
        { name: 'Tasseling',   date: '2026-07-25', done: true  },
        { name: 'Silking',     date: '2026-08-05', done: true  },
        { name: 'Maturing',    date: '2026-08-25', done: false },
        { name: 'Harvest',     date: '2026-09-20', done: false },
      ],
    },
    {
      id: 'cc3', crop: 'Tomato', field: 'Plot B', color: '#C0392B',
      sowDate: '2026-07-01', harvestDate: '2026-10-30',
      currentStage: 'Fruiting',
      milestones: [
        { name: 'Transplant',  date: '2026-07-01', done: true  },
        { name: 'Vegetative',  date: '2026-07-20', done: true  },
        { name: 'Flowering',   date: '2026-08-05', done: true  },
        { name: 'Fruiting',    date: '2026-08-20', done: false },
        { name: 'Ripening',    date: '2026-09-15', done: false },
        { name: 'Harvest',     date: '2026-10-30', done: false },
      ],
    },
  ],

  // Soil & Irrigation
  soil: {
    moisture:     38,
    moistureIdeal: [40, 70],
    ph:           6.4,
    phIdeal:      [6.0, 7.0],
    nitrogen:     42,
    phosphorus:   61,
    potassium:    55,
    trend: [
      { day: 'Aug 1',  moisture: 62, ph: 6.5 },
      { day: 'Aug 5',  moisture: 55, ph: 6.4 },
      { day: 'Aug 10', moisture: 48, ph: 6.4 },
      { day: 'Aug 15', moisture: 50, ph: 6.3 },
      { day: 'Aug 20', moisture: 44, ph: 6.4 },
      { day: 'Aug 25', moisture: 38, ph: 6.4 },
      { day: 'Aug 27', moisture: 38, ph: 6.4 },
    ],
    lastIrrigated: '2d ago',
    nextIrrigation: 'Today (recommended)',
  },

  // Market Prices (₹/quintal)
  marketPrices: [
    {
      crop: 'Wheat',   icon: '🌾', current: 2240, previous: 2180, msp: 2275,
      trend: 'up',     signal: 'hold',
      signalReason: 'Price rising, 1.5% below MSP. Hold 5–7 days.',
      history: [
        { date: 'Mar', price: 2100 }, { date: 'Apr', price: 2150 },
        { date: 'May', price: 2120 }, { date: 'Jun', price: 2180 },
        { date: 'Jul', price: 2200 }, { date: 'Aug', price: 2240 },
      ],
    },
    {
      crop: 'Tomato',  icon: '🍅', current: 1850, previous: 2100, msp: null,
      trend: 'down',   signal: 'sell',
      signalReason: 'Prices falling. Sell now before further decline.',
      history: [
        { date: 'Mar', price: 2800 }, { date: 'Apr', price: 2600 },
        { date: 'May', price: 2200 }, { date: 'Jun', price: 2000 },
        { date: 'Jul', price: 2100 }, { date: 'Aug', price: 1850 },
      ],
    },
    {
      crop: 'Maize',   icon: '🌽', current: 1820, previous: 1790, msp: 1870,
      trend: 'up',     signal: 'hold',
      signalReason: 'Approaching MSP. Harvest first, sell when MSP is met.',
      history: [
        { date: 'Mar', price: 1650 }, { date: 'Apr', price: 1700 },
        { date: 'May', price: 1740 }, { date: 'Jun', price: 1760 },
        { date: 'Jul', price: 1790 }, { date: 'Aug', price: 1820 },
      ],
    },
    {
      crop: 'Cotton',  icon: '🪴', current: 6800, previous: 6750, msp: 6620,
      trend: 'up',     signal: 'sell',
      signalReason: 'Above MSP by 2.7%. Good time to sell for premium.',
      history: [
        { date: 'Mar', price: 6200 }, { date: 'Apr', price: 6400 },
        { date: 'May', price: 6500 }, { date: 'Jun', price: 6600 },
        { date: 'Jul', price: 6750 }, { date: 'Aug', price: 6800 },
      ],
    },
  ],

  // Reports
  reports: {
    seasons: ['Kharif 2026', 'Rabi 2025-26', 'Kharif 2025'],
    summary: {
      revenue:    142500,
      expenses:   58200,
      profit:     84300,
      margin:     59.2,
      yieldTons:  28.4,
    },
    cropWise: [
      { crop: 'Wheat',  revenue: 55000, expenses: 18000, yield: 12.0 },
      { crop: 'Maize',  revenue: 42000, expenses: 16000, yield: 10.5 },
      { crop: 'Tomato', revenue: 32500, expenses: 14200, yield: 4.2  },
      { crop: 'Cotton', revenue: 13000, expenses: 10000, yield: 1.7  },
    ],
    monthlyRevenue: [
      { month: 'Apr', revenue: 0      },
      { month: 'May', revenue: 12000  },
      { month: 'Jun', revenue: 8000   },
      { month: 'Jul', revenue: 35000  },
      { month: 'Aug', revenue: 55000  },
      { month: 'Sep', revenue: 32500  },
    ],
  },

  // Community / Knowledge Hub
  community: [
    {
      id: 'q1',
      question: 'My tomato leaves are turning yellow from the bottom — what could it be?',
      author: 'Suresh P.',  location: 'Pune',  time: '2h ago',
      answers: 3, verified: true,
      verifiedAnswer: 'Likely Septoria leaf spot or early nitrogen deficiency. Check lower leaf undersides for small circular spots with dark edges. If present, apply copper-based fungicide and supplement with urea.',
      tags: ['tomato', 'disease', 'nutrient'],
    },
    {
      id: 'q2',
      question: 'Best time to apply potassium for cotton at boll development stage?',
      author: 'Lakshmi T.',  location: 'Vidarbha', time: '1d ago',
      answers: 5, verified: true,
      verifiedAnswer: 'Apply K2O at 50 kg/ha during early boll development (45–55 DAS). Avoid top-dress during rainfall — wait for soil to be moist but not waterlogged.',
      tags: ['cotton', 'fertilizer', 'potassium'],
    },
    {
      id: 'q3',
      question: 'Is there a PM-KISAN installment due this month?',
      author: 'Ramesh K.', location: 'Nashik', time: '3d ago',
      answers: 2, verified: false,
      verifiedAnswer: null,
      tags: ['scheme', 'government'],
    },
  ],

  // Government schemes
  schemes: [
    { id: 's1', name: 'PM-KISAN 17th Installment', amount: '₹2,000', deadline: 'Sep 15, 2026', relevant: true },
    { id: 's2', name: 'Maharashtra Drip Irrigation Subsidy', amount: 'Up to 55%', deadline: 'Oct 31, 2026', relevant: true },
    { id: 's3', name: 'Crop Insurance — Kharif 2026 (PMFBY)', amount: 'Variable', deadline: 'Aug 31, 2026', relevant: true },
  ],
};
