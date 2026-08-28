// ─── Weather Service ──────────────────────────────────────────────────────────
// Swap mock functions with real API (e.g. OpenWeatherMap) when ready.
// All components consume this service — UI never knows whether data is live or mocked.

export const LOCATIONS = [
  'Coimbatore, Tamil Nadu',
  'Nashik, Maharashtra',
  'Pune, Maharashtra',
  'Salem, Tamil Nadu',
  'Erode, Tamil Nadu',
  'Tiruppur, Tamil Nadu',
];

// Hourly slots for today
const HOURLY = [
  { time: '6 AM',  icon: '🌤️', temp: 26 },
  { time: '9 AM',  icon: '☀️', temp: 28 },
  { time: '12 PM', icon: '☀️', temp: 31 },
  { time: '3 PM',  icon: '🌦️', temp: 30 },
  { time: '6 PM',  icon: '🌧️', temp: 27 },
  { time: '9 PM',  icon: '☁️', temp: 25 },
  { time: '12 AM', icon: '☁️', temp: 23 },
];

// 7-day forecast
const WEEKLY = [
  { day: 'Today',    icon: '☀️',  high: 32, low: 24, rain: 10  },
  { day: 'Tomorrow', icon: '🌧️', high: 27, low: 22, rain: 80  },
  { day: 'Saturday', icon: '🌦️', high: 29, low: 23, rain: 45  },
  { day: 'Sunday',   icon: '☁️',  high: 30, low: 24, rain: 20  },
  { day: 'Monday',   icon: '☀️',  high: 31, low: 25, rain: 5   },
  { day: 'Tuesday',  icon: '🌧️', high: 28, low: 22, rain: 70  },
  { day: 'Wednesday',icon: '☀️',  high: 30, low: 24, rain: 10  },
];

// Alerts
const ALERTS = [
  {
    id: 'a1',
    priority: 'high',
    color: 'rose',
    title: 'Heavy Rainfall Expected Tomorrow',
    description: 'Check drainage and protect vulnerable crops before 2 PM tomorrow.',
  },
  {
    id: 'a2',
    priority: 'medium',
    color: 'amber',
    title: 'High Humidity Tonight',
    description: 'Humidity may exceed 85% overnight. Monitor crops for early fungal symptoms.',
  },
  {
    id: 'a3',
    priority: 'low',
    color: 'emerald',
    title: 'Morning Suitable for Field Work',
    description: 'Clear skies until noon — good time for inspection and weeding.',
  },
];

const MOCK_WEATHER = {
  location: 'Coimbatore, Tamil Nadu',
  condition: 'Sunny',           // Sunny | Cloudy | Rain | Storm
  temp: 28,
  feelsLike: 30,
  high: 32,
  low: 24,
  rainfall: 12,
  rainChance: 75,
  windSpeed: 18,
  windDir: 'NW',
  humidity: 72,
  uvIndex: 7,
  soilMoisture: 32,
  updatedAt: new Date().toISOString(),
  hourly: HOURLY,
  weekly: WEEKLY,
  alerts: ALERTS,
};

function buildWeather(location) {
  return { ...MOCK_WEATHER, location, updatedAt: new Date().toISOString() };
}

export const weatherService = {
  async getWeather(location = 'Coimbatore, Tamil Nadu') {
    // Returns immediately — swap with fetch() call for a real API
    return buildWeather(location);
  },

  buildCropAdvisory(weather, crop = 'Wheat', stage = 'Flowering') {
    const { rainChance, humidity, windSpeed, condition } = weather;

    let riskLevel = 'Low';
    let riskColor = 'emerald';
    let riskExplanation = 'Weather conditions are generally favourable for your crop.';
    let recommendations = [
      'Continue regular field monitoring.',
      'Maintain current irrigation schedule.',
    ];
    let diseaseRisk = 'Low';
    let diseaseReason = 'Temperature and humidity are within safe limits.';
    let irrigationAdvice = 'Maintain your current irrigation schedule.';
    let irrigationReason = 'Soil moisture is adequate and no heavy rain is expected.';
    let needsIrrigation = true;
    let farmActivities = [
      { label: 'Field Inspection',       status: 'good'    },
      { label: 'Weeding',                status: 'good'    },
      { label: 'Fertilizer Application', status: 'caution' },
      { label: 'Spraying',               status: 'good'    },
      { label: 'Irrigation',             status: 'good'    },
    ];

    if (rainChance > 60) {
      riskLevel = 'High';
      riskColor = 'rose';
      riskExplanation = `Heavy rainfall expected tomorrow may increase fungal disease risk during the ${stage} stage.`;
      recommendations = [
        `Check field drainage before tomorrow's rainfall.`,
        'Avoid unnecessary irrigation today.',
        'Consider protective fungicide application before rain.',
      ];
      needsIrrigation = false;
      irrigationAdvice = 'No irrigation recommended today.';
      irrigationReason = 'Rainfall is expected within 12 hours and soil moisture is already adequate.';
      farmActivities = [
        { label: 'Field Inspection',       status: 'good'    },
        { label: 'Weeding',                status: 'caution' },
        { label: 'Fertilizer Application', status: 'avoid'   },
        { label: 'Spraying',               status: 'avoid'   },
        { label: 'Irrigation',             status: 'skip'    },
      ];
    } else if (humidity > 75) {
      riskLevel = 'Moderate';
      riskColor = 'amber';
      riskExplanation = `High humidity combined with ${stage.toLowerCase()} stage increases risk of fungal infection.`;
      recommendations = [
        'Scout leaves daily for early signs of fungal disease.',
        'Ensure good air circulation between rows.',
      ];
    }

    if (humidity > 75 && rainChance > 50) {
      diseaseRisk = 'Moderate';
      diseaseReason = `High humidity (${humidity}%) + expected rainfall + ${stage} stage create conditions for fungal disease.`;
    } else if (humidity > 80 && rainChance > 65) {
      diseaseRisk = 'High';
      diseaseReason = `Very high humidity and heavy rain create critical conditions for fungal and bacterial disease.`;
    }

    return {
      crop, stage,
      riskLevel, riskColor, riskExplanation,
      recommendations, diseaseRisk, diseaseReason,
      irrigationAdvice, irrigationReason, needsIrrigation,
      farmActivities,
      rainExpected: rainChance > 60,
      rainAmount: '35–45 mm',
      rainWindow: 'Tomorrow, 2 PM – 8 PM',
    };
  },
};
