import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LanguageContext = createContext(null);

export const TRANSLATIONS = {
  en: {
    // Navigation
    nav_home: 'Home',
    nav_scanner: 'Scan Crop',
    nav_voice: 'Voice AI',
    nav_farms: 'My Farms',
    nav_marketplace: 'Marketplace',
    nav_market: 'Market Analysis',
    nav_weather: 'Weather & Advisory',
    nav_soil: 'Soil & Water',
    nav_alerts: 'Pest Alerts',
    nav_schemes: 'Govt Schemes',
    nav_reports: 'Reports',
    nav_history: 'Scan History',
    nav_calendar: 'Crop Calendar',
    nav_community: 'Community',
    nav_settings: 'Settings',
    nav_sign_out: 'Sign Out',
    nav_add_farm: '+ Add New Farm',

    // Dashboard Header
    greeting_morning: 'Good Morning',
    greeting_afternoon: 'Good Afternoon',
    greeting_evening: 'Good Evening',
    farmer_default: 'Farmer',
    weather_partly_cloudy: 'Partly Cloudy',
    weather_sunny: 'Sunny',
    weather_rain: 'Rainy',
    lang_toggle: 'தமிழ்',
    my_farm: 'My Farm',

    // High Priority Action Banner
    alert_high_priority: 'High Priority Action',
    alert_rainfall_title: 'Heavy rainfall expected tomorrow',
    alert_rainfall_desc: 'Check field drainage immediately to prevent waterlogging.',
    btn_view_details: 'View Details',

    // Crop Summary
    section_crop_summary: 'My Crop Summary',
    manage_farm: 'Manage Farm →',
    label_current_crop: 'Current Crop',
    label_growth_stage: 'Growth Stage',
    label_farm_area: 'Farm Area',
    label_soil_moisture: 'Soil Moisture',
    label_crop_health: 'Crop Health',
    label_expected_yield: 'Expected Yield',
    crop_tomato: 'Tomato',
    crop_wheat: 'Wheat',
    crop_maize: 'Maize',
    crop_cotton: 'Cotton',
    stage_flowering: 'Flowering',
    stage_vegetative: 'Vegetative',
    stage_fruiting: 'Fruiting',
    stage_maturing: 'Maturing',
    health_healthy: 'Healthy',

    // Quick Actions
    section_quick_actions: 'Quick Actions',
    action_scan: 'Scan Plant',
    action_scan_desc: 'Check health & diseases',
    action_soil: 'Check Soil',
    action_soil_desc: 'Analyze nutrients & pH',
    action_irrigation: 'Irrigation',
    action_irrigation_desc: 'Watering schedule',
    action_buyers: 'Find Buyers',
    action_buyers_desc: 'Marketplace & Mandis',

    // Weather Page
    weather_title: 'Weather & Crop Advisory ☀️',
    weather_subtitle: 'Weather conditions and their impact on your farm.',
    weather_live: 'Live Weather',
    weather_hourly: 'Today — Hourly',
    weather_7day: '7-Day Forecast',
    crop_impact_title: 'Crop Impact',
    crop_impact_subtitle: 'How today’s weather may affect your crop.',
    weather_risk_title: 'Heavy Rainfall Warning',
    rec_actions_title: 'Recommended Actions',
    weather_alerts_title: 'Weather Alerts',
    today_activities_title: 'Today’s Farm Activities',
    today_activities_sub: 'Based on current weather conditions',
    irrigation_advisory_title: 'Irrigation Advisory',
    disease_risk_title: 'Disease Risk',
    btn_view_advisory: 'View Full Advisory',
    btn_irrigation_details: 'View Irrigation Details →',
    btn_check_crop_health: 'Check Crop Health →',

    // Soil Page
    soil_title: 'Soil & Water 💧',
    soil_subtitle: 'Monitor soil health, water conditions, and irrigation recommendations.',
    soil_sensors_online: 'Sensors Online',
    soil_sensors_offline: 'Sensors Offline',
    soil_overview_title: '🌱 Soil Health Overview',
    soil_overall_title: 'Overall Soil Health',
    ai_soil_advisory_title: '🤖 AI Soil Advisory',
    suitable_crops_title: '🌾 Suitable Crops for Current Soil',
    nutrient_status_title: '🧪 Nutrient Status (NPK)',
    fertilizer_advisory_title: '🧪 Interactive Fertilizer Advisory',
    soil_improvement_title: '🌱 Practical Steps to Improve Soil Health',

    // Common
    loading: 'Loading...',
    refresh: 'Refresh',
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    optimal: 'Optimal',
    attention: 'Attention',
    medium: 'Medium',
    high: 'High',
    low: 'Low',
  },
  ta: {
    // Navigation
    nav_home: 'முகப்பு',
    nav_scanner: 'பயிர் ஸ்கேனர்',
    nav_voice: 'குரல் AI உதவியாளர்',
    nav_farms: 'எனது பண்ணை',
    nav_marketplace: 'சந்தை வர்த்தகம்',
    nav_market: 'சந்தை நிலவரம்',
    nav_weather: 'வானிலை & ஆலோசனை',
    nav_soil: 'மண் & நீர் வளம்',
    nav_alerts: 'பூச்சி எச்சரிக்கை',
    nav_schemes: 'அரசு மானியங்கள்',
    nav_reports: 'பண்ணை அறிக்கைகள்',
    nav_history: 'ஸ்கேன் வரலாறு',
    nav_calendar: 'பயிர் காலண்டர்',
    nav_community: 'விவசாயிகள் சமூகம்',
    nav_settings: 'அமைப்புகள்',
    nav_sign_out: 'வெளியேறு',
    nav_add_farm: '+ புதிய பண்ணை சேர்க்க',

    // Dashboard Header
    greeting_morning: 'காலை வணக்கம்',
    greeting_afternoon: 'மதிய வணக்கம்',
    greeting_evening: 'மாலை வணக்கம்',
    farmer_default: 'விவசாயி',
    weather_partly_cloudy: 'மிதமான மேகமூட்டம்',
    weather_sunny: 'வெயில் காலம்',
    weather_rain: 'மழைப்பொழிவு',
    lang_toggle: 'English',
    my_farm: 'எனது பண்ணை',

    // High Priority Action Banner
    alert_high_priority: 'அவசர முதன்மை நடவடிக்கை',
    alert_rainfall_title: 'நாளை கனமழை எதிர்பார்க்கப்படுகிறது',
    alert_rainfall_desc: 'நீர் தேங்குவதைத் தடுக்க உடனடியாக வடிகால் வாய்க்கால்களை சரிபார்க்கவும்.',
    btn_view_details: 'விவரங்களை பார்க்க',

    // Crop Summary
    section_crop_summary: 'பயிர் நிலவரச் சுருக்கம்',
    manage_farm: 'பண்ணை மேலாண்மை →',
    label_current_crop: 'தற்போதைய பயிர்',
    label_growth_stage: 'வளர்ச்சி நிலை',
    label_farm_area: 'பண்ணை பரப்பளவு',
    label_soil_moisture: 'மண் ஈரப்பதம்',
    label_crop_health: 'பயிர் நலம்',
    label_expected_yield: 'எதிர்பார்க்கப்படும் மகசூல்',
    crop_tomato: 'தக்காளி',
    crop_wheat: 'கோதுமை',
    crop_maize: 'மக்காச்சோளம்',
    crop_cotton: 'பருத்தி',
    stage_flowering: 'பூக்கும் நிலை',
    stage_vegetative: 'வளரும் நிலை',
    stage_fruiting: 'காய் பிடிக்கும் நிலை',
    stage_maturing: 'முதிர்வு நிலை',
    health_healthy: 'ஆரோக்கியமானது',

    // Quick Actions
    section_quick_actions: 'விரைவுச் சேவைகள்',
    action_scan: 'பயிர் பரிசோதனை',
    action_scan_desc: 'நோய் மற்றும் நலம் கண்டறிதல்',
    action_soil: 'மண் பரிசோதனை',
    action_soil_desc: 'சத்துக்கள் & pH பகுப்பாய்வு',
    action_irrigation: 'பாசன அட்டவணை',
    action_irrigation_desc: 'நீர் மேலாண்மை முறை',
    action_buyers: 'சந்தை வாங்குவோர்',
    action_buyers_desc: 'நேரடி கொள்முதல் & விலை',

    // Weather Page
    weather_title: 'வானிலை & பயிர் ஆலோசனை ☀️',
    weather_subtitle: 'வானிலை மாற்றங்களும் உங்கள் பண்ணைக்கான வழிகாட்டல்களும்.',
    weather_live: 'நேரலை வானிலை',
    weather_hourly: 'இன்றைய மணிநேர வானிலை',
    weather_7day: '7-நாள் வானிலை முன்னறிவிப்பு',
    crop_impact_title: 'பயிருக்கு ஏற்படும் தாக்கம்',
    crop_impact_subtitle: 'இன்றைய வானிலை உங்கள் பயிரை எவ்வாறு பாதிக்கும்.',
    weather_risk_title: 'கனமழை முன்னெச்சரிக்கை',
    rec_actions_title: 'பரிந்துரைக்கப்பட்ட நடவடிக்கைகள்',
    weather_alerts_title: 'வானிலை எச்சரிக்கைகள்',
    today_activities_title: 'இன்றைய பண்ணை பணிகள்',
    today_activities_sub: 'வானிலை நிலவரப்படி மேற்கொள்ள வேண்டிய பணிகள்',
    irrigation_advisory_title: 'பாசன ஆலோசனை',
    disease_risk_title: 'நோய் அபாய எச்சரிக்கை',
    btn_view_advisory: 'முழு ஆலோசனையை பார்க்க',
    btn_irrigation_details: 'பாசன விவரங்களை பார்க்க →',
    btn_check_crop_health: 'பயிர் நலனை சரிபார்க்க →',

    // Soil Page
    soil_title: 'மண் & நீர் மேலாண்மை 💧',
    soil_subtitle: 'மண் வளம், ஈரப்பதம் மற்றும் பாசன வழிகாட்டல்களை கண்காணிக்கவும்.',
    soil_sensors_online: 'சென்சார் இணைப்பில் உள்ளது',
    soil_sensors_offline: 'சென்சார் இணைப்பு இல்லை',
    soil_overview_title: '🌱 மண் வள நிலவரம்',
    soil_overall_title: 'ஒட்டுமொத்த மண் ஆரோக்கியம்',
    ai_soil_advisory_title: '🤖 AI மண் ஆலோசனை',
    suitable_crops_title: '🌾 தற்போதைய மண்ணுக்கு ஏற்ற பயிர்கள்',
    nutrient_status_title: '🧪 சத்துக்கள் நிலை (NPK)',
    fertilizer_advisory_title: '🧪 ஊடாடும் உர மேலாண்மை ஆலோசனை',
    soil_improvement_title: '🌱 மண் வளத்தை மேம்படுத்தும் வழிகள்',

    // Common
    loading: 'ஏற்றப்படுகிறது...',
    refresh: 'புதுப்பி',
    close: 'மூடு',
    save: 'சேமிக்க',
    cancel: 'ரத்து செய்',
    optimal: 'சிறந்தது',
    attention: 'கவனம் தேவை',
    medium: 'நடுத்தரம்',
    high: 'அதிகம்',
    low: 'குறைவு',
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('agrix_language') || 'en';
  });

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    localStorage.setItem('agrix_language', lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next = prev === 'en' ? 'ta' : 'en';
      localStorage.setItem('agrix_language', next);
      return next;
    });
  }, []);

  const t = useCallback((key, defaultVal = '') => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en?.[key] || defaultVal || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isTamil: language === 'ta' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
