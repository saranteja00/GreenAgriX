// ─── GreenAgriX Government Schemes & Subsidy Client Service ──────────────────
import { apiClient } from './apiClient';

export const FALLBACK_SCHEMES = [
  {
    id: 'scheme_drip_micro_irrigation',
    name_en: 'Per Drop More Crop (PDMC) — Micro Irrigation Subsidy',
    name_ta: 'சொட்டுநீர் & தெளிப்பு பாசன மானியத் திட்டம் (PDMC)',
    department_en: 'Ministry of Agriculture & TN Horticulture Department',
    department_ta: 'வேளாண்மை மற்றும் தோட்டக்கலைத்துறை',
    category: 'Irrigation & Water',
    category_ta: 'பாசனம் & நீர் மேலாண்மை',
    max_subsidy_amount_inr: 55000,
    applicable_subsidy_percentage: 100,
    calculated_financial_aid_inr: 192500,
    is_eligible: true,
    match_score: 99,
    eligible_crops: ['Tomato', 'Chilli', 'Vegetables', 'Cotton', 'Maize'],
    min_acreage: 0.5,
    max_acreage: 12.5,
    description_en: 'Provides 100% full financial subsidy for small/marginal farmers (up to 5 acres) and 75% for other farmers to install automated drip/sprinkler systems.',
    description_ta: 'சிறு மற்றும் குறு விவசாயிகளுக்கு 100% முழு மானியத்திலும், பிற விவசாயிகளுக்கு 75% மானியத்திலும் சொட்டுநீர் மற்றும் தெளிப்பு பாசன அமைப்புகள் வழங்கப்படுகின்றன.',
    required_documents_en: [
      'Aadhaar Card copy',
      'Land Patta / Chitta & FMB Sketch',
      'Bank Passbook (Aadhaar linked)',
      'Small / Marginal Farmer Certificate (VAO)',
      'Passport Size Photos (2)',
      'Water & Soil Test Feasibility Report'
    ],
    required_documents_ta: [
      'ஆதார் அட்டை நகல்',
      'நில பட்டா / சிட்டா & FMB வரைபடம்',
      'ஆதார் இணைக்கப்பட்ட வங்கி கணக்கு புத்தக நகல்',
      'சிறு/குறு விவசாயி சான்றிதழ் (VAO ஒப்புதல்)',
      'புகைப்படம் (2)',
      'மண் மற்றும் பாசன நீர் பரிசோதனை அறிக்கை'
    ],
    application_steps_en: [
      '1. Register on the state Horticulture Portal (tnhorticulture.tn.gov.in)',
      '2. Upload Land Patta and Farmer Certificate',
      '3. Select empanelled Micro-Irrigation vendor (Jain / Netafim / Finolex)',
      '4. Assistant Director of Horticulture field inspection',
      '5. Work order issuance and direct installation'
    ],
    application_steps_ta: [
      '1. தோட்டக்கலைத்துறை போர்ட்டலில் (tnhorticulture.tn.gov.in) பதிவு செய்யவும்',
      '2. நில பட்டா மற்றும் சிறு விவசாயி சான்றிதழை பதிவேற்றவும்',
      '3. அங்கீகரிக்கப்பட்ட சொட்டுநீர் நிறுவனத்தை தேர்வு செய்யவும்',
      '4. தோட்டக்கலை அலுவலர் கள ஆய்வு செய்வார்',
      '5. பணி ஆணை பிறப்பிக்கப்பட்டு உபகரணங்கள் நிறுவப்படும்'
    ],
    portal_url: 'https://tnhorticulture.tn.gov.in/horti/pmksy',
    badge_color: 'emerald'
  },
  {
    id: 'scheme_pm_kusum_solar',
    name_en: 'PM-KUSUM Component-B (Solar Agriculture Pump Subsidy)',
    name_ta: 'பிஎம்-குசும் சூரிய ஒளி வேளாண் பம்ப் மானியம் (70% மானியம்)',
    department_en: 'Ministry of New and Renewable Energy (MNRE) & TEDA',
    department_ta: 'புதுப்பிக்கத்தக்க எரிசக்தி துறை (TEDA)',
    category: 'Solar Energy & Machinery',
    category_ta: 'சூரிய சக்தி & இயந்திரங்கள்',
    max_subsidy_amount_inr: 185000,
    applicable_subsidy_percentage: 70,
    calculated_financial_aid_inr: 185000,
    is_eligible: true,
    match_score: 95,
    eligible_crops: ['All Crops', 'Tomato', 'Wheat', 'Paddy', 'Cotton'],
    min_acreage: 1.0,
    max_acreage: 25.0,
    description_en: 'Provides 70% financial subsidy for standalone solar agriculture pumps (3 HP to 7.5 HP) replacing diesel pumps with zero recurring electricity bills.',
    description_ta: 'டீசல் பம்புகளை மாற்றவும் மின் இணைப்பு இல்லாத கிணறுகளுக்கு 3 HP முதல் 7.5 HP வரையிலான சூரிய ஒளி பம்புகளுக்கு 70% அரசு மானியம் வழங்கப்படுகிறது.',
    required_documents_en: [
      'Aadhaar Card & Voter ID',
      'Patta / Chitta in farmer name',
      'No-Objection Certificate from EB / TANGEDCO',
      'Well / Borewell Ownership Certificate',
      'Bank Account Details'
    ],
    required_documents_ta: [
      'ஆதார் அட்டை நகல்',
      'விவசாயி பெயரிலான பட்டா / சிட்டா',
      'மின்வாரிய (TANGEDCO) தடையில்லா சான்று',
      'கிணறு / ஆழ்துளை கிணறு உரிமை சான்று',
      'வங்கி கணக்கு விவரங்கள்'
    ],
    application_steps_en: [
      '1. Apply online at PM-KUSUM / TEDA portal',
      '2. Verification by Agriculture Engineering Department',
      '3. Pay 30% beneficiary contribution after subsidy clearance',
      '4. Solar panel & pump commissioning within 30 days'
    ],
    application_steps_ta: [
      '1. PM-KUSUM / TEDA இணையதளத்தில் விண்ணப்பிக்கவும்',
      '2. வேளாண் பொறியியல் துறை ஆய்வு செய்யும்',
      '3. மானியம் போக மீதமுள்ள 30% தொகையை செலுத்தவும்',
      '4. 30 நாட்களில் சோலார் பேனல் மற்றும் பம்ப் பொருத்தப்படும்'
    ],
    portal_url: 'https://pmkusum.mnre.gov.in',
    badge_color: 'amber'
  },
  {
    id: 'scheme_pm_kisan',
    name_en: 'PM-KISAN Samman Nidhi (Direct Income Support)',
    name_ta: 'பிஎம்-கிசான் நேரடி நிதி உதவித் திட்டம் (ஆண்டுக்கு ₹6,000)',
    department_en: 'Department of Agriculture and Farmers Welfare',
    department_ta: 'மத்திய வேளாண்மை மற்றும் உழவர் நல அமைச்சகம்',
    category: 'Direct Income Support',
    category_ta: 'நேரடி பண உதவி',
    max_subsidy_amount_inr: 6000,
    applicable_subsidy_percentage: 100,
    calculated_financial_aid_inr: 6000,
    is_eligible: true,
    match_score: 98,
    eligible_crops: ['All Crops'],
    min_acreage: 0.1,
    max_acreage: 20.0,
    description_en: 'Guaranteed financial assistance of ₹6,000 per year in three equal 4-monthly installments of ₹2,000 directly into farmer Aadhaar-linked bank accounts.',
    description_ta: 'அனைத்து நில உரிமையாளர் விவசாயிகளுக்கும் ஆண்டுக்கு ₹6,000 நிதி உதவி, நான்கு மாதங்களுக்கு ஒருமுறை ₹2,000 வீதம் 3 தவணைகளில் நேரடியாக வங்கிக் கணக்கில் செலுத்தப்படுகிறது.',
    required_documents_en: [
      'Aadhaar Card (Mandatory biometric e-KYC)',
      'Land Holding Documents (Patta/Chitta)',
      'Aadhaar-Seeded Active Bank Account Number'
    ],
    required_documents_ta: [
      'ஆதார் அட்டை (பயோமெட்ரிக் e-KYC அவசியம்)',
      'நில உரிமை ஆவணங்கள் (பட்டா/சிட்டா)',
      'ஆதார் இணைக்கப்பட்ட நேரடி வங்கி கணக்கு'
    ],
    application_steps_en: [
      '1. Visit pmkisan.gov.in or Common Service Centre (CSC)',
      '2. Complete OTP / Biometric Aadhaar e-KYC',
      '3. State Nodal Officer approves land record validation',
      '4. Direct Benefit Transfer (DBT) credit'
    ],
    application_steps_ta: [
      '1. pmkisan.gov.in அல்லது பொது சேவை மையத்தை (CSC) அணுகவும்',
      '2. ஆதார் e-KYC பூர்த்தி செய்யவும்',
      '3. நில ஆவணங்கள் சரிபார்க்கப்பட்ட பின் ஒப்புதல் அளிக்கப்படும்',
      '4. வங்கி கணக்கில் பணம் வரவு வைக்கப்படும்'
    ],
    portal_url: 'https://pmkisan.gov.in',
    badge_color: 'blue'
  },
  {
    id: 'scheme_pmfby_crop_insurance',
    name_en: 'Pradhan Mantri Fasal Bima Yojana (PMFBY Crop Insurance)',
    name_ta: 'பிரதம மந்திரி பயிர் காப்பீட்டுத் திட்டம் (PMFBY)',
    department_en: 'Agriculture Insurance Company & State Agri Dept',
    department_ta: 'பயிர் காப்பீட்டு கழகம் & வேளாண்மைத்துறை',
    category: 'Crop Insurance & Risk',
    category_ta: 'பயிர் காப்பீடு & இடர் மேலாண்மை',
    max_subsidy_amount_inr: 45000,
    applicable_subsidy_percentage: 90,
    calculated_financial_aid_inr: 45000,
    is_eligible: true,
    match_score: 94,
    eligible_crops: ['Paddy', 'Wheat', 'Tomato', 'Cotton', 'Maize'],
    min_acreage: 0.2,
    max_acreage: 50.0,
    description_en: 'Comprehensive risk insurance against unseasonal heavy rains, drought, and pest outbreaks. Farmers pay only 1.5% - 2% premium.',
    description_ta: 'கனமழை, வறட்சி, பூச்சி தாக்குதல் மற்றும் இயற்கை பேரிடரால் ஏற்படும் பயிர் இழப்புகளுக்கு முழு காப்பீடு. விவசாயிகள் வெறும் 1.5% முதல் 2% மட்டுமே பிரீமியம் செலுத்தினால் போதும்.',
    required_documents_en: [
      'Sowing Certificate from VAO (பயிர் சாகுபடி அடங்கல்)',
      'Land Patta / Chitta copy',
      'Aadhaar Card & Bank Passbook copy',
      'Premium Payment Challan'
    ],
    required_documents_ta: [
      'கிராம நிர்வாக அலுவலர் (VAO) பயிர் சாகுபடி சான்று / அடங்கல்',
      'நில பட்டா / சிட்டா நகல்',
      'ஆதார் அட்டை மற்றும் வங்கி கணக்கு புத்தகம்',
      'பிரீமியம் ரசீது'
    ],
    application_steps_en: [
      '1. Enroll through Primary Agricultural Co-op Society (PACCS) or CSC',
      '2. Pay minimal farmer premium (2% for Kharif, 1.5% for Rabi)',
      '3. In case of crop loss, report within 72 hours via Crop Insurance App',
      '4. Direct claim settlement to bank account'
    ],
    application_steps_ta: [
      '1. தொடக்க வேளாண் கூட்டுறவு சங்கம் (PACCS) அல்லது CSC மையத்தில் பதிவு செய்யவும்',
      '2. குறைந்தபட்ச பிரீமியம் செலுத்தவும்',
      '3. பயிர் பாதிப்பு ஏற்பட்டால் 72 மணி நேரத்திற்குள் தெரிவிக்கவும்',
      '4. இழப்பீட்டுத் தொகை வங்கி கணக்கில் செலுத்தப்படும்'
    ],
    portal_url: 'https://pmfby.gov.in',
    badge_color: 'indigo'
  },
  {
    id: 'scheme_smam_machinery',
    name_en: 'Sub-Mission on Agricultural Mechanization (SMAM Farm Machinery)',
    name_ta: 'வேளாண் இயந்திரமயமாக்கல் துணைத் திட்டம் (SMAM 50% மானியம்)',
    department_en: 'Agricultural Engineering Department',
    department_ta: 'வேளாண் பொறியியல் துறை',
    category: 'Solar Energy & Machinery',
    category_ta: 'சூரிய சக்தி & இயந்திரங்கள்',
    max_subsidy_amount_inr: 125000,
    applicable_subsidy_percentage: 50,
    calculated_financial_aid_inr: 125000,
    is_eligible: true,
    match_score: 90,
    eligible_crops: ['All Crops', 'Paddy', 'Cotton', 'Tomato'],
    min_acreage: 1.0,
    max_acreage: 30.0,
    description_en: 'Provides 50% subsidy on Power Tillers, Mini Tractors, Multi-Crop Thrashers, and Power Sprayers for small/marginal farmers.',
    description_ta: 'பவர் டில்லர், மினி டிராக்டர், ரோட்டோவேட்டர், பவர் ஸ்ப்ரேயர் போன்ற நவீன விவசாய கருவிகளுக்கு சிறு/குறு விவசாயிகளுக்கு 50% அரசு மானியம் வழங்கப்படுகிறது.',
    required_documents_en: [
      'Aadhaar Card & Community Certificate',
      'Small/Marginal Farmer Certificate',
      'Land Patta / Chitta',
      'Quotation from authorized manufacturer'
    ],
    required_documents_ta: [
      'ஆதார் அட்டை & சாதி சான்றிதழ்',
      'சிறு/குறு விவசாயி சான்றிதழ்',
      'நில பட்டா / சிட்டா',
      'அங்கீகரிக்கப்பட்ட நிறுவனத்தின் விலைப்புள்ளி (Quotation)'
    ],
    application_steps_en: [
      '1. Register online on agrimachinery.nic.in',
      '2. Select equipment model and upload land documents',
      '3. Priority allotment for SC/ST, Small/Marginal and Women farmers',
      '4. Direct subsidy disbursement upon machine verification'
    ],
    application_steps_ta: [
      '1. agrimachinery.nic.in இணையதளத்தில் விண்ணப்பிக்கவும்',
      '2. தேவையான இயந்திரத்தை தேர்வு செய்து ஆவணங்களை பதிவேற்றவும்',
      '3. முன்னுரிமை அடிப்படையில் நிதி ஒதுக்கீடு செய்யப்படும்',
      '4. இயந்திரம் சரிபார்க்கப்பட்டதும் மானியம் வரவு வைக்கப்படும்'
    ],
    portal_url: 'https://agrimachinery.nic.in',
    badge_color: 'rose'
  },
  {
    id: 'scheme_soil_health_card',
    name_en: 'National Soil Health Card & Micro-Nutrient Scheme',
    name_ta: 'மண் வள அட்டை திட்டம் & நுண்ணூட்ட உர மானியம்',
    department_en: 'Department of Agriculture',
    department_ta: 'மத்திய மற்றும் மாநில வேளாண்மைத்துறை',
    category: 'Seeds & Fertilizers',
    category_ta: 'விதை & உரங்கள்',
    max_subsidy_amount_inr: 4500,
    applicable_subsidy_percentage: 100,
    calculated_financial_aid_inr: 4500,
    is_eligible: true,
    match_score: 100,
    eligible_crops: ['All Crops'],
    min_acreage: 0.1,
    max_acreage: 50.0,
    description_en: 'Free laboratory soil testing across 12 chemical parameters (NPK, pH, micronutrients) with personalized fertilizer recommendations every 2 years.',
    description_ta: '12 வகையான மண் ஊட்டச்சத்துக்கள் (N, P, K, pH, நுண்ணூட்டங்கள்) முற்றிலும் இலவசமாக பரிசோதிக்கப்பட்டு 2 ஆண்டுகளுக்கு ஒருமுறை மண் வள அட்டை வழங்கப்படுகிறது.',
    required_documents_en: [
      'Aadhaar Card',
      'Survey Number / Field Map'
    ],
    required_documents_ta: [
      'ஆதார் அட்டை நகல்',
      'புல எண் (Survey Number)'
    ],
    application_steps_en: [
      '1. Submit soil sample to local Block Soil Testing Laboratory',
      '2. Digital Soil Health Card generated within 14 days',
      '3. Receive subsidized gypsum / zinc sulphate kits'
    ],
    application_steps_ta: [
      '1. வட்டார மண் பரிசோதனை மையத்தில் மண் மாதிரி ஒப்படைக்கவும்',
      '2. 14 நாட்களில் மண் வள அட்டை வழங்கப்படும்',
      '3. மானிய விலையில் ஜிப்சம் மற்றும் நுண்ணூட்ட உரங்கள் வழங்கப்படும்'
    ],
    portal_url: 'https://soilhealth.dac.gov.in',
    badge_color: 'teal'
  }
];

export const schemesService = {
  async fetchEligibleSchemes({ crop = 'Tomato', acreage = 3.5, farmerCategory = 'Small / Marginal', hasWaterSource = true, categoryFilter = 'All' }) {
    try {
      const data = await apiClient.getEligibleSchemes({
        crop,
        acreage,
        farmerCategory,
        hasWaterSource,
        categoryFilter
      });
      return data;
    } catch (err) {
      console.warn('Backend unavailable, using local schemes knowledge:', err);
      const filtered = categoryFilter === 'All' 
        ? FALLBACK_SCHEMES 
        : FALLBACK_SCHEMES.filter(s => s.category === categoryFilter);
      
      const totalSavings = filtered.reduce((sum, s) => sum + (s.calculated_financial_aid_inr || s.max_subsidy_amount_inr), 0);

      return {
        farmer_profile: {
          crop,
          acreage,
          category: farmerCategory,
          has_water_source: hasWaterSource
        },
        eligible_schemes_count: filtered.length,
        total_potential_subsidy_savings_inr: totalSavings,
        matched_schemes: filtered
      };
    }
  }
};
