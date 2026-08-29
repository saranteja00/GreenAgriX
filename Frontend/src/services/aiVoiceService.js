// ─── GreenAgriX AI Voice Assistant & Agronomist Training Service ──────────
// Connects to NVIDIA NIM API with specialized Agricultural Expert system prompt
// with strict bilingual (Tamil / English) enforcement and dual-language local knowledge base.

// On Netlify production: use the serverless proxy (avoids CORS).
// On localhost dev: call NVIDIA directly with the API key.
const IS_LOCALHOST = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const NVIDIA_DIRECT_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const NVIDIA_PROXY_URL = '/api/nvidia-proxy';

const DEFAULT_NVIDIA_KEY =
  import.meta.env?.VITE_NVIDIA_API_KEY || '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';

// Comprehensive Dual-Language Agricultural Knowledge Base
export const AGRI_KNOWLEDGE_ENTRIES = [
  {
    id: 'rot_blight_wound',
    keywords: [
      'rot', 'brown rot', 'wound', 'wounded', 'tissue', 'blight', 'early blight', 'late blight',
      'dark to light brown', 'spots', 'lesion', 'stem rot', 'fruit rot',
      'அழுகல்', 'பழுப்பு அழுகல்', 'காயம்', 'திசு', 'கருகல்', 'இலை கருகல்', 'புள்ளி', 'தண்டு அழுகல்'
    ],
    answerEn: "Brown rot around wounded plant tissue is typically caused by fungal pathogens such as Monilinia, Alternaria (Early Blight), or Phytophthora (Late Blight). Treatment: 1. Prune and destroy infected wounded tissues. 2. Spray Mancozeb 75% WP @ 2.5g/L or Copper Oxychloride 50% WP @ 2.5g/L. 3. For organic management, apply Neem Oil (10,000 ppm) @ 5ml/L with a sticker.",
    answerTa: "பயிர் காயமடைந்த திசுக்களில் ஏற்படும் பழுப்பு நிற அழுகல் (Brown Rot) பொதுவாக Alternaria அல்லது Phytophthora பூஞ்சை தொற்றால் ஏற்படுகிறது. தீர்வு: 1. பாதிக்கப்பட்ட பாகங்களை அகற்றி அழிக்கவும். 2. ஒரு லிட்டர் தண்ணீருக்கு 2.5 கிராம் மேன்கோசெப் (Mancozeb) அல்லது காப்பர் ஆக்ஸிகுளோரைடு (Copper Oxychloride) கலந்து தெளிக்கவும். 3. இயற்கை முறைக்கு 5 மி.லி வேப்ப எண்ணெய் தெளிக்கவும்."
  },
  {
    id: 'tomato_leaf_spots',
    keywords: [
      'tomato', 'yellow', 'leaves', 'yellow leaves', 'black spots', 'curl', 'leaf curl',
      'தக்காளி', 'மஞ்சள் இலை', 'மஞ்சள்', 'கருப்பு புள்ளி', 'இலை சுருட்டல்', 'சுருள்'
    ],
    answerEn: "Yellowing and spotted leaves in tomatoes indicate Early Blight or Nitrogen deficiency. Leaf curl is spread by whiteflies. Remedy: Spray Imidacloprid 17.8% SL @ 0.5ml/L for whiteflies, and Mancozeb @ 2.5g/L for blight. Remove lower infected leaves and avoid wetting leaves during watering.",
    answerTa: "தக்காளி இலைகளில் மஞ்சள் நிற புள்ளிகள் மற்றும் கருகல் Early Blight பூஞ்சை நோயால் ஏற்படுகிறது. இலை சுருட்டை வெள்ளை ஈக்களால் பரவுகிறது. தீர்வு: வெள்ளை ஈக்களுக்கு இமிடாக்ளோப்ரிட் 0.5 மி.லி/லிட்டர் மற்றும் பூஞ்சைக்கு மேன்கோசெப் 2.5 கிராம்/லிட்டர் தெளிக்கவும். பாதிக்கப்பட்ட கீழ் இலைகளை அகற்றி சொட்டுநீர் பாசனம் செய்யவும்."
  },
  {
    id: 'irrigation_watering',
    keywords: [
      'water', 'watering', 'irrigation', 'often', 'schedule', 'moisture', 'rain', 'drip',
      'நீர்', 'தண்ணீர்', 'பாசனம்', 'எவ்வளவு', 'சொட்டுநீர்', 'ஈரப்பதம்', 'மழை', 'பாய்ச்ச'
    ],
    answerEn: "Irrigate early in the morning (6:00 AM – 8:30 AM) using drip irrigation to maintain 50–70% soil moisture. If heavy rain is forecast within 24 hours, postpone irrigation to prevent root rot and anaerobic soil stress.",
    answerTa: "பயிர்களுக்கு காலை 6:00 மணி முதல் 8:30 மணிக்குள் சொட்டுநீர் பாசனம் செய்வது மிகச் சிறந்தது. அடுத்த 24 மணி நேரத்தில் மழை பெய்ய வாய்ப்பு இருந்தால், வேரழுகல் நோயைத் தடுக்க பாசனத்தை உடனே நிறுத்தி வைக்கவும்."
  },
  {
    id: 'pests_insects',
    keywords: [
      'pest', 'bugs', 'insects', 'whiteflies', 'aphids', 'worms', 'caterpillar', 'borer', 'thrips', 'mite',
      'பூச்சி', 'புழு', 'வெள்ளை ஈ', 'அசுவினி', 'தாக்குதல்', 'சாறு உறிஞ்சும்', 'இலைத்துளைப்பான்', 'தண்டு துளைப்பான்'
    ],
    answerEn: "For sucking pests (Aphids, Whiteflies, Thrips), spray Neem Oil (10,000 ppm) @ 5ml/L or Imidacloprid 17.8% SL @ 0.5ml/L. For fruit/stem borers, apply Chlorantraniliprole 18.5% SC @ 0.3ml/L in the evening.",
    answerTa: "அசுவினி, வெள்ளை ஈ போன்ற சாறு உறிஞ்சும் பூச்சிகளுக்கு 1 லிட்டர் தண்ணீருக்கு 5 மி.லி வேப்ப எண்ணெய் அல்லது இமிடாக்ளோப்ரிட் 0.5 மி.லி கலந்து மாலையில் தெளிக்கவும். தண்டு/காய் துளைப்பான் புழுக்களுக்கு குளோரான்ட்ரானிலிப்ரோல் 0.3 மி.லி தெளிக்கவும்."
  },
  {
    id: 'fertilizer_yield',
    keywords: [
      'fertilizer', 'grow', 'yield', 'compost', 'nutrient', 'urea', 'npk', 'potash', 'flowering',
      'உரம்', 'விளைச்சல்', 'வளர்ச்சி', 'யூரியா', 'சத்து', 'NPK', 'பொட்டாஷ்', 'பூக்கும்', 'மண்புழு'
    ],
    answerEn: "To boost vegetative vigor and yield, apply vermicompost @ 2 tonnes/acre along with balanced NPK (120:60:60 kg/ha). During flowering, spray 13-0-45 (Potassium Nitrate) @ 5g/L + Boron @ 1g/L to prevent flower drop and increase fruit size.",
    answerTa: "பயிர் வளர்ச்சியை அதிகரிக்க ஏக்கருக்கு 2 டன் மண்புழு உரம் இடுங்கள். பூக்கும் பருவத்தில் பூக்கள் உதிர்வதைத் தடுத்து காய் திரட்சியாக வளர, 1 லிட்டர் தண்ணீருக்கு 5 கிராம் பொட்டாசியம் நைட்ரேட் (13-0-45) மற்றும் 1 கிராம் போரான் கலந்து இலைவழி தெளிக்கவும்."
  },
  {
    id: 'rice_paddy_blast',
    keywords: [
      'rice', 'paddy', 'wheat', 'blast', 'brown spot', 'sheath blight',
      'நெல்', 'கோதுமை', 'குலைநோய்', 'பழுப்பு புள்ளி', 'தாள் கருகல்'
    ],
    answerEn: "Brown spindle-shaped spots on paddy indicate Blast or Brown Spot. Remedy: Spray Tricyclazole 75% WP @ 0.6g/L or Hexaconazole 5% EC @ 2ml/L. Ensure adequate potassium fertilizer and avoid excessive nitrogen application.",
    answerTa: "நெற்பயிரில் பழுப்பு நிற கதிர் புள்ளிகள் குலைநோய் (Blast) அல்லது இலைப்புள்ளி நோயைக் குறிக்கிறது. தீர்வு: 1 லிட்டர் தண்ணீருக்கு ட்ரைசைக்ளசோல் 0.6 கிராம் அல்லது ஹெக்சாகோனசோல் 2 மி.லி கலந்து தெளிக்கவும். யூரியாவை குறைத்து பொட்டாஷ் உரத்தை சீராக இடவும்."
  }
];

export const aiVoiceService = {
  /**
   * Queries NVIDIA NIM Chat Completions API with trained Agronomist System Prompt
   * Strictly enforces output language (Tamil if language === 'ta', English if language === 'en')
   */
  async queryAgronomistAI(userMessage, language = 'en', apiKey = DEFAULT_NVIDIA_KEY) {
    const isTa = language === 'ta';
    const key = apiKey || DEFAULT_NVIDIA_KEY;

    // Strict system prompt based on language
    const systemPrompt = isTa
      ? `நீங்கள் "GreenAgriX AI வேளாண் விஞ்ஞானி மற்றும் பயிர் மருத்துவர்".
முக்கிய விதி: நீங்கள் 100% தூய, தெளிவான, மரியாதைமிக்க தமிழில் (TAMIL) மட்டுமே பதிலளிக்க வேண்டும்.
பயனர் ஆங்கிலத்தில் கேட்டாலும் கூட, உங்கள் முழு விடையையும் தமிழில் மட்டுமே தர வேண்டும். ஆங்கில வாக்கியங்களை பயன்படுத்த வேண்டாம்.
விடை வடிவம்:
1. நோய்/பிரச்சினை கண்டறிதல்
2. தீர்வு & தெளிக்க வேண்டிய மருந்து அளவு (இயற்கை / இரசாயனம்)
3. தடுப்பு முறை
குரல் கேட்க வசதியாக 70 வார்த்தைகளுக்குள் சுருக்கமாகவும் பயனுள்ளதாகவும் இருக்க வேண்டும்.`
      : `You are "GreenAgriX AI Agricultural Scientist & Crop Doctor".
CRITICAL INSTRUCTION: You MUST respond 100% in clear, practical, authoritative ENGLISH.
Format:
1. Diagnosis & Cause
2. Actionable Remedy with exact dosages (Organic & Chemical)
3. Prevention protocol
Keep response concise (under 75 words) so it is clear for voice listening.`;

    if (!key || key.trim() === '') {
      return this.getLocalFallbackResponse(userMessage, language);
    }

    try {
      // Use Netlify proxy on production to avoid CORS; call NVIDIA directly on localhost
      const apiUrl = IS_LOCALHOST ? NVIDIA_DIRECT_URL : NVIDIA_PROXY_URL;
      const headers = {
        'Content-Type': 'application/json',
        ...(IS_LOCALHOST ? { Authorization: `Bearer ${key.trim()}` } : {}),
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: 'meta/llama-3.1-8b-instruct',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: isTa
                ? `(பயனர் கேள்வி தமிழில் விடை கேட்கிறார்): ${userMessage}`
                : userMessage,
            },
          ],
          temperature: 0.5,
          max_tokens: 280,
        }),
      });

      if (!response.ok) {
        console.warn('NVIDIA NIM API status error, activating trained local knowledge fallback');
        return this.getLocalFallbackResponse(userMessage, language);
      }

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content;
      if (reply && reply.trim().length > 10) {
        return {
          source: isTa ? 'NVIDIA Llama பயிர் மருத்துவர்' : 'NVIDIA Llama Agronomist',
          text: reply.trim(),
        };
      }
      return this.getLocalFallbackResponse(userMessage, language);
    } catch (error) {
      console.warn('Network error or API failure, activating local trained knowledge:', error);
      return this.getLocalFallbackResponse(userMessage, language);
    }
  },

  /**
   * Local Knowledge Base Fallback with smart keyword matching
   * ALWAYS returns Tamil text when language === 'ta', English when language === 'en'.
   */
  getLocalFallbackResponse(query, language = 'en') {
    const isTa = language === 'ta';
    const lowerQuery = (query || '').toLowerCase();

    let bestItem = null;
    let maxScore = 0;

    for (const item of AGRI_KNOWLEDGE_ENTRIES) {
      let score = 0;
      for (const kw of item.keywords) {
        if (lowerQuery.includes(kw.toLowerCase())) {
          score += kw.length > 5 ? 2 : 1;
        }
      }
      if (score > maxScore) {
        maxScore = score;
        bestItem = item;
      }
    }

    if (maxScore > 0 && bestItem) {
      return {
        source: isTa ? 'பயிற்சியளிக்கப்பட்ட வேளாண் அறிவுத்தளம்' : 'Trained Agronomic Knowledge Base',
        text: isTa ? bestItem.answerTa : bestItem.answerEn,
      };
    }

    // Default response strictly in the selected language
    if (isTa) {
      return {
        source: 'GreenAgriX AI உதவியாளர்',
        text: 'நான் உங்கள் GreenAgriX வேளாண் குரல் மருத்துவர். தக்காளி, நெல், பருத்தி, உரம், இலைக்கருகல், பூச்சி தாக்குதல் அல்லது பாசனம் குறித்து கேளுங்கள், உடனடி தீர்வு வழங்குகிறேன்.',
      };
    }

    return {
      source: 'GreenAgriX AI Assistant',
      text: "I am your GreenAgriX Agronomist Assistant. Please ask about your crop symptoms, fertilizer dosages, pest management, or irrigation advice.",
    };
  },

  /**
   * Translates or retrieves response in target language for an active query
   */
  translateActiveResponse(query, targetLanguage = 'en') {
    return this.getLocalFallbackResponse(query, targetLanguage);
  }
};
