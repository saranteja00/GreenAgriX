// ─── Marketplace & Logistics Service ────────────────────────────────────────
// Manages harvest readiness, buyer requirements, crop listings, AI matching, net returns, and transport

export const HARVEST_ADVISORY = {
  crop: 'Tomato',
  cropTa: 'தக்காளி',
  emoji: '🍅',
  varietyEn: 'Arka Rakshak (High Yield Hybrid)',
  varietyTa: 'அர்கா ரக்ஷக் (அதிக மகசூல் கலப்பின ரகம்)',
  recommendedWindowEn: 'September 12–16, 2026',
  recommendedWindowTa: 'செப்டம்பர் 12–16, 2026',
  daysRemaining: 12,
  readinessPercentage: 84,
  drivers: [
    {
      id: 'maturity',
      titleEn: 'Crop Maturity',
      titleTa: 'பயிர் முதிர்ச்சி',
      icon: '🍅',
      headlineEn: 'Breaker to Pink-turning Stage (Day 48 of 90)',
      headlineTa: 'காய் நிறம் மாறும் பருவம் (90 நாட்களில் 48வது நாள்)',
      detailEn: 'Current setting rate is 88%. Fruits will achieve physiological maturity and optimal sugar/acid firmness by September 12.',
      detailTa: 'தற்போது 88% பிஞ்சு பிடிப்பு உள்ளது. செப்டம்பர் 12க்குள் காய்கள் உகந்த முதிர்ச்சியையும் சரியான திடத்தன்மையையும் அடையும்.',
      statusEn: 'Optimal',
      statusTa: 'உகந்தது',
      color: 'emerald',
    },
    {
      id: 'weather',
      titleEn: 'Weather Window',
      titleTa: 'வானிலை சூழல்',
      icon: '☀️',
      headlineEn: 'Sunny, Dry Conditions Forecasted (0% Rain Risk)',
      headlineTa: 'வறண்ட வெயில் வானிலை கணிப்பு (மழை வாய்ப்பு 0%)',
      detailEn: 'Clear daylight (28–31°C) and low humidity during Sep 12–16 minimize skin cracking and mold during harvesting and packing.',
      detailTa: 'செப் 12–16 வரை நல்ல வெயிலும் குறைந்த ஈரப்பதமும் இருப்பதால் காய்கள் வெடிப்பு மற்றும் பூஞ்சை பாதிப்பின்றி அறுவடை செய்யலாம்.',
      statusEn: 'Favorable',
      statusTa: 'சாதகமானது',
      color: 'emerald',
    },
    {
      id: 'demand',
      titleEn: 'Market Demand',
      titleTa: 'சந்தை தேவை',
      icon: '📈',
      headlineEn: 'Rising Regional Demand (+14% Weekly Surge)',
      headlineTa: 'மண்டிகளில் அதிகரிக்கும் தேவை (+14% வாராந்திர உயர்வு)',
      detailEn: 'Wholesale buyers in Chennai, Bangalore, and Coimbatore are experiencing supply shortfalls from southern belts.',
      detailTa: 'சென்னை, பெங்களூரு மற்றும் கோவை மண்டிகளில் தென் மாவட்ட வரத்து குறைந்துள்ளதால் தேவை தொடர்ந்து அதிகரித்து வருகிறது.',
      statusEn: 'Rising Demand',
      statusTa: 'அதிகரிக்கும் தேவை',
      color: 'emerald',
    },
    {
      id: 'conditions',
      titleEn: 'Expected Market Conditions',
      titleTa: 'எதிர்பார்க்கப்படும் விலை',
      icon: '💰',
      headlineEn: 'Projected Peak Price: ₹28–₹34 / kg (Trending Up ↑)',
      headlineTa: 'கணிக்கப்படும் உச்ச விலை: ₹28–₹34 / கிலோ (உயரும் போக்கு ↑)',
      detailEn: 'Harvesting during this 4-day window secures premium pricing before northern mandi arrivals begin the following week.',
      detailTa: 'இந்த 4 நாள் இடைவெளியில் அறுவடை செய்வது வடமாநில வரத்து தொடங்குவதற்கு முன் அதிகபட்ச லாபத்தை ஈட்டித்தரும்.',
      statusEn: 'Trending Up ↑',
      statusTa: 'உயரும் போக்கு ↑',
      color: 'emerald',
    },
  ],
};

export const BUYER_REQUIREMENTS = [
  {
    id: 'buyer_1',
    name: 'FreshBasket Wholesale Hub',
    nameTa: 'ஃப்ரெஷ்பாஸ்கெட் மொத்த கொள்முதல் மையம்',
    buyerTypeEn: 'Supermarket Aggregator',
    buyerTypeTa: 'சூப்பர் மார்க்கெட் சப்ளையர்',
    verified: true,
    rating: 4.8,
    crop: 'Tomato',
    emoji: '🍅',
    gradeEn: 'Grade A',
    gradeTa: 'தரம் A (Grade A)',
    requiredQuantity: 2000,
    unit: 'kg',
    requiredDateEn: 'September 15, 2026',
    requiredDateTa: 'செப்டம்பர் 15, 2026',
    dateShortEn: 'Sep 15',
    dateShortTa: 'செப் 15',
    locationEn: 'Chennai (Koyambedu Hub)',
    locationTa: 'சென்னை (கோயம்பேடு மையம்)',
    distanceKm: 35,
    priceMin: 28,
    priceMax: 32,
    offeredPrice: 30,
    paymentTermsEn: 'Instant Bank Transfer (Same Day)',
    paymentTermsTa: 'வங்கி பரிமாற்றம் (அன்றைய தினமே)',
    matchScore: 94,
    reasonsEn: [
      { text: 'Competitive price (₹30/kg)', positive: true },
      { text: 'Nearby destination (35 km)', positive: true },
      { text: 'Matches harvest date (Sep 15)', positive: true },
      { text: 'Exact quantity fit (2,000 kg)', positive: true },
    ],
    reasonsTa: [
      { text: 'சிறந்த கொள்முதல் விலை (₹30/கிலோ)', positive: true },
      { text: 'அருகிலுள்ள மையம் (35 கி.மீ)', positive: true },
      { text: 'அறுவடை தேதியுடன் பொருந்துகிறது (செப் 15)', positive: true },
      { text: 'சரியான கொள்முதல் அளவு (2,000 கிலோ)', positive: true },
    ],
    transportRatePerKg: 3.5,
  },
  {
    id: 'buyer_2',
    name: 'Coimbatore Direct Agro Connect',
    nameTa: 'கோயம்புத்தூர் டைரக்ட் அக்ரோ கனெக்ட்',
    buyerTypeEn: 'Regional Processing Unit',
    buyerTypeTa: 'மண்டல பதப்படுத்தும் ஆலை',
    verified: true,
    rating: 4.9,
    crop: 'Tomato',
    emoji: '🍅',
    gradeEn: 'Grade A',
    gradeTa: 'தரம் A (Grade A)',
    requiredQuantity: 2500,
    unit: 'kg',
    requiredDateEn: 'September 14, 2026',
    requiredDateTa: 'செப்டம்பர் 14, 2026',
    dateShortEn: 'Sep 14',
    dateShortTa: 'செப் 14',
    locationEn: 'Coimbatore Suburbs',
    locationTa: 'கோயம்புத்தூர் புறநகர்',
    distanceKm: 12,
    priceMin: 27,
    priceMax: 29,
    offeredPrice: 28,
    paymentTermsEn: 'UPI / Cash on Delivery',
    paymentTermsTa: 'UPI / நேரடி பணப்பட்டுவாடா',
    matchScore: 91,
    reasonsEn: [
      { text: 'Ultra-low transit cost (12 km away)', positive: true },
      { text: 'Fast pickup & unloading', positive: true },
      { text: 'Matches required date (Sep 14)', positive: true },
      { text: 'Slightly lower listed price (₹28/kg)', positive: false },
    ],
    reasonsTa: [
      { text: 'மிகக் குறைந்த போக்குவரத்து செலவு (12 கி.மீ)', positive: true },
      { text: 'வேகமான லாரி ஏற்றுதல் & இறக்குதல்', positive: true },
      { text: 'தேவைப்படும் தேதி பொருந்துகிறது (செப் 14)', positive: true },
      { text: 'சற்றே குறைவான விலைப்பட்டியல் (₹28/கிலோ)', positive: false },
    ],
    transportRatePerKg: 1.0,
  },
  {
    id: 'buyer_3',
    name: 'Metro Retail Marts',
    nameTa: 'மெட்ரோ ரீடெய்ல் மார்ட்ஸ்',
    buyerTypeEn: 'Retail Chain',
    buyerTypeTa: 'சில்லறை விற்பனை சங்கிலி',
    verified: true,
    rating: 4.6,
    crop: 'Tomato',
    emoji: '🍅',
    gradeEn: 'Grade A',
    gradeTa: 'தரம் A (Grade A)',
    requiredQuantity: 3000,
    unit: 'kg',
    requiredDateEn: 'September 16, 2026',
    requiredDateTa: 'செப்டம்பர் 16, 2026',
    dateShortEn: 'Sep 16',
    dateShortTa: 'செப் 16',
    locationEn: 'Bangalore Central Depot',
    locationTa: 'பெங்களூரு மத்திய கிடங்கு',
    distanceKm: 180,
    priceMin: 31,
    priceMax: 33,
    offeredPrice: 32,
    paymentTermsEn: 'T+1 Escrow Account',
    paymentTermsTa: 'T+1 எஸ்க்ரோ வங்கி பாதுகாப்பு',
    matchScore: 84,
    reasonsEn: [
      { text: 'High raw price (₹32/kg)', positive: true },
      { text: 'Verified corporate buyer', positive: true },
      { text: 'Higher transport distance (180 km)', positive: false },
      { text: 'Requires strict sorting & grading', positive: true },
    ],
    reasonsTa: [
      { text: 'அதிக கொள்முதல் விலை (₹32/கிலோ)', positive: true },
      { text: 'சரிபார்க்கப்பட்ட கார்ப்பரேட் வாங்குவோர்', positive: true },
      { text: 'அதிக பயண தூரம் (180 கி.மீ)', positive: false },
      { text: 'துல்லியமான தரம் பிரித்தல் அவசியம்', positive: true },
    ],
    transportRatePerKg: 6.0,
  },
  {
    id: 'buyer_4',
    name: 'Apex Global Agro Exports',
    nameTa: 'ஏபெக்ஸ் குளோபல் அக்ரோ ஏற்றுமதி',
    buyerTypeEn: 'Export House',
    buyerTypeTa: 'ஏற்றுமதி நிறுவனம்',
    verified: true,
    rating: 4.7,
    crop: 'Tomato',
    emoji: '🍅',
    gradeEn: 'Export Grade',
    gradeTa: 'ஏற்றுமதி தரம்',
    requiredQuantity: 5000,
    unit: 'kg',
    requiredDateEn: 'September 15, 2026',
    requiredDateTa: 'செப்டம்பர் 15, 2026',
    dateShortEn: 'Sep 15',
    dateShortTa: 'செப் 15',
    locationEn: 'JNPT Port / Mumbai Depot',
    locationTa: 'மும்பை துறைமுக கிடங்கு',
    distanceKm: 240,
    priceMin: 33,
    priceMax: 36,
    offeredPrice: 35,
    paymentTermsEn: 'Bank Wire / Export LC',
    paymentTermsTa: 'வங்கி பரிமாற்றம் / எல்.சி',
    matchScore: 81,
    reasonsEn: [
      { text: 'Premium export pricing (₹35/kg)', positive: true },
      { text: 'Large volume requirement (5,000 kg)', positive: true },
      { text: 'High transportation cost (₹8/kg)', positive: false },
      { text: 'Refrigerated transit recommended', positive: false },
    ],
    reasonsTa: [
      { text: 'உயர்தர ஏற்றுமதி விலை (₹35/கிலோ)', positive: true },
      { text: 'அதிக அளவு தேவை (5,000 கிலோ)', positive: true },
      { text: 'அதிக போக்குவரத்து செலவு (₹8/கிலோ)', positive: false },
      { text: 'குளிரூட்டப்பட்ட வாகனம் பரிந்துரைக்கப்படுகிறது', positive: false },
    ],
    transportRatePerKg: 8.0,
  },
  {
    id: 'buyer_5',
    name: 'Koyambedu Daily Merchants',
    nameTa: 'கோயம்பேடு தினசரி வியாபாரிகள்',
    buyerTypeEn: 'Mandi Commission Agent',
    buyerTypeTa: 'மண்டி கமிஷன் முகவர்',
    verified: false,
    rating: 4.2,
    crop: 'Tomato',
    emoji: '🍅',
    gradeEn: 'Grade B & Mixed',
    gradeTa: 'தரம் B & கலவை',
    requiredQuantity: 1500,
    unit: 'kg',
    requiredDateEn: 'September 13, 2026',
    requiredDateTa: 'செப்டம்பர் 13, 2026',
    dateShortEn: 'Sep 13',
    dateShortTa: 'செப் 13',
    locationEn: 'Chennai Central Mandi',
    locationTa: 'சென்னை சென்ட்ரல் மண்டி',
    distanceKm: 45,
    priceMin: 25,
    priceMax: 27,
    offeredPrice: 26,
    paymentTermsEn: 'Direct Spot Cash',
    paymentTermsTa: 'நேரடி ரொக்கப் பணம்',
    matchScore: 73,
    reasonsEn: [
      { text: 'Accepts mixed & Grade B quality', positive: true },
      { text: 'Spot cash payment on delivery', positive: true },
      { text: 'Lower price margin (₹26/kg)', positive: false },
      { text: 'Standard transit cost (45 km)', positive: true },
    ],
    reasonsTa: [
      { text: 'கலவை மற்றும் நடுத்தர தரத்தை ஏற்கிறார்', positive: true },
      { text: 'இறக்கியவுடன் உடனடி ரொக்கம்', positive: true },
      { text: 'குறைவான விலை வரம்பு (₹26/கிலோ)', positive: false },
      { text: 'மிதமான போக்குவரத்து தூரம் (45 கி.மீ)', positive: true },
    ],
    transportRatePerKg: 4.0,
  },
  {
    id: 'buyer_6',
    name: 'Salem Organic Kitchens',
    nameTa: 'சேலம் ஆர்கானிக் கிச்சன்ஸ்',
    buyerTypeEn: 'Organic Restaurant Chain',
    buyerTypeTa: 'இயற்கை உணவக சங்கிலி',
    verified: true,
    rating: 4.5,
    crop: 'Tomato',
    emoji: '🍅',
    gradeEn: 'Grade A (Residue Free)',
    gradeTa: 'தரம் A (ரசாயனமற்றது)',
    requiredQuantity: 1000,
    unit: 'kg',
    requiredDateEn: 'September 18, 2026',
    requiredDateTa: 'செப்டம்பர் 18, 2026',
    dateShortEn: 'Sep 18',
    dateShortTa: 'செப் 18',
    locationEn: 'Salem Hub',
    locationTa: 'சேலம் மையம்',
    distanceKm: 95,
    priceMin: 28,
    priceMax: 30,
    offeredPrice: 29,
    paymentTermsEn: 'Bank Transfer (48 hrs)',
    paymentTermsTa: 'வங்கி பரிமாற்றம் (48 மணிநேரம்)',
    matchScore: 68,
    reasonsEn: [
      { text: 'Good price for organic produce', positive: true },
      { text: 'Date is 2 days after peak window (Sep 18)', positive: false },
      { text: 'Lower quantity required (1,000 kg)', positive: false },
      { text: 'Moderate transit (95 km)', positive: true },
    ],
    reasonsTa: [
      { text: 'இயற்கை பயிருக்கு நல்ல விலை', positive: true },
      { text: 'உச்ச தேதியை விட 2 நாள் பிந்தியது (செப் 18)', positive: false },
      { text: 'குறைந்த அளவு தேவை (1,000 கிலோ)', positive: false },
      { text: 'மிதமான போக்குவரத்து (95 கி.மீ)', positive: true },
    ],
    transportRatePerKg: 5.0,
  },
];

export const INITIAL_MY_LISTINGS = [
  {
    id: 'list_1',
    crop: 'Tomato',
    cropTa: 'தக்காளி',
    emoji: '🍅',
    varietyEn: 'Arka Rakshak',
    varietyTa: 'அர்கா ரக்ஷக்',
    quantity: 2000,
    unit: 'kg',
    gradeEn: 'Grade A',
    gradeTa: 'தரம் A',
    expectedHarvestDate: '2026-09-14',
    expectedPrice: 30,
    locationEn: 'Kumar Fields, Plot B South',
    locationTa: 'குமார் நிலம், பிளாட் B தெற்கு',
    statusEn: 'Active',
    statusTa: 'நேரலை',
    viewsCount: 48,
    inquiriesCount: 6,
    postedOnEn: 'Aug 26, 2026',
    postedOnTa: 'ஆக 26, 2026',
    photos: [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 'list_2',
    crop: 'Wheat',
    cropTa: 'கோதுமை',
    emoji: '🌾',
    varietyEn: 'Sharbati Premium',
    varietyTa: 'சர்பதி பிரீமியம்',
    quantity: 4500,
    unit: 'kg',
    gradeEn: 'Grade A',
    gradeTa: 'தரம் A',
    expectedHarvestDate: '2026-10-12',
    expectedPrice: 26,
    locationEn: 'Kumar Fields, Plot A North',
    locationTa: 'குமார் நிலம், பிளாட் A வடக்கு',
    statusEn: 'Active',
    statusTa: 'நேரலை',
    viewsCount: 22,
    inquiriesCount: 2,
    postedOnEn: 'Aug 27, 2026',
    postedOnTa: 'ஆக 27, 2026',
    photos: [],
  },
];

export const FLEET_VEHICLES = [
  {
    id: 'v1',
    typeEn: 'Mini Pickup (Bolero Maxi / Tata Ace)',
    typeTa: 'மினி பிக்கப் (பொலிரோ / டாடா ஏஸ்)',
    capacityEn: '1.5 – 2.0 Tonnes',
    capacityTa: '1.5 – 2.0 டன்',
    ratePerKm: 28,
    driverNameEn: 'Murugan Transport Services',
    driverNameTa: 'முருகன் டிரான்ஸ்போர்ட் சர்வீஸ்',
    phone: '+91 98421 88721',
    rating: 4.8,
    etaHours: 1.5,
  },
  {
    id: 'v2',
    typeEn: 'Intermediate Truck (Eicher 14ft)',
    typeTa: 'இடைநிலை லாரி (ஐஷர் 14 அடி)',
    capacityEn: '3.5 – 5.0 Tonnes',
    capacityTa: '3.5 – 5.0 டன்',
    ratePerKm: 42,
    driverNameEn: 'Kaveri Logistics Fleet',
    driverNameTa: 'காவேரி லாஜிஸ்டிக்ஸ் லாரி',
    phone: '+91 94432 11094',
    rating: 4.9,
    etaHours: 2.0,
  },
  {
    id: 'v3',
    typeEn: 'Insulated / Ventilated Reefer',
    typeTa: 'குளிரூட்டப்பட்ட பெட்டி லாரி (Reefer)',
    capacityEn: '4.0 Tonnes',
    capacityTa: '4.0 டன்',
    ratePerKm: 55,
    driverNameEn: 'AgroCool Express Logistics',
    driverNameTa: 'அக்ரோகூல் எக்ஸ்பிரஸ் லாஜிஸ்டிக்ஸ்',
    phone: '+91 97890 44321',
    rating: 4.9,
    etaHours: 2.5,
  },
];

export const marketplaceService = {
  getHarvestAdvisory() {
    return { ...HARVEST_ADVISORY };
  },

  getBuyers(crop = 'Tomato') {
    return BUYER_REQUIREMENTS.filter(b => b.crop.toLowerCase() === crop.toLowerCase());
  },

  getAllBuyers() {
    return [...BUYER_REQUIREMENTS];
  },

  getMyListings() {
    try {
      const saved = localStorage.getItem('agrix_my_crop_listings');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [...INITIAL_MY_LISTINGS];
  },

  saveListing(listingData) {
    const existing = this.getMyListings();
    const newListing = {
      ...listingData,
      id: `list_${Date.now()}`,
      statusEn: 'Active',
      statusTa: 'நேரலை',
      viewsCount: 1,
      inquiriesCount: 0,
      postedOnEn: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      postedOnTa: new Date().toLocaleDateString('ta-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    const updated = [newListing, ...existing];
    try {
      localStorage.setItem('agrix_my_crop_listings', JSON.stringify(updated));
    } catch (e) {}
    return newListing;
  },

  deleteListing(id) {
    const existing = this.getMyListings().filter(l => l.id !== id);
    try {
      localStorage.setItem('agrix_my_crop_listings', JSON.stringify(existing));
    } catch (e) {}
    return existing;
  },

  /**
   * Calculates NET return comparison for all matched buyers.
   * Net Return = Selling Price - Transport Cost (₹/kg)
   */
  getOpportunities(crop = 'Tomato', quantityKg = 2000) {
    const buyers = this.getBuyers(crop);
    const opportunities = buyers.map(buyer => {
      const transportPerKg = buyer.transportRatePerKg;
      const netPricePerKg = buyer.offeredPrice - transportPerKg;
      const grossRevenue = buyer.offeredPrice * quantityKg;
      const transportTotal = transportPerKg * quantityKg;
      const netRevenue = netPricePerKg * quantityKg;

      return {
        ...buyer,
        transportPerKg,
        netPricePerKg,
        grossRevenue,
        transportTotal,
        netRevenue,
      };
    });

    // Sort by Net Return descending
    return opportunities.sort((a, b) => b.netPricePerKg - a.netPricePerKg);
  },

  getTransportFleets() {
    return [...FLEET_VEHICLES];
  },
};
