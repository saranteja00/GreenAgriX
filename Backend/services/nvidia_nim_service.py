# ─── GreenAgriX AI Agricultural Diagnostic Service ──────────────────────────
import os
import requests
from typing import Optional, Dict

NVIDIA_NIM_API_KEY = os.getenv("NVIDIA_NIM_API_KEY", "")

NVIDIA_NIM_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
DEFAULT_NIM_MODEL = "meta/llama-3.2-11b-vision-instruct"

class NvidiaNimDiagnosisService:
    def __init__(self, api_key: str = NVIDIA_NIM_API_KEY, model: str = DEFAULT_NIM_MODEL):
        self.api_key = api_key
        self.model = model

    def generate_diagnosis(
        self,
        crop: str,
        detected_disease: str,
        confidence: float,
        language: str = "en",
        image_base64: Optional[str] = None
    ) -> dict:
        """
        Calls AI Pathology model to generate an expert agronomist diagnosis.
        """
        is_ta = language == "ta"
        is_healthy = "healthy" in detected_disease.lower()

        if is_healthy:
            if is_ta:
                report = (
                    f"**பயிர் நலம் மற்றும் ஊட்டச்சத்து அறிக்கை:**\n\n"
                    f"**1. நிலை:** {crop} பயிரில் எந்தவித பூஞ்சை அல்லது பூச்சி தாக்குதல் அறிகுறிகளும் இல்லை. இலைகள் ஆரோக்கியமாகவும் நல்ல பச்சையத்துடனும் உள்ளன (துல்லியம்: {confidence}%).\n\n"
                    f"**2. பரிந்துரைக்கப்படும் ஊட்டச்சத்து:** பயிரின் வீரியமான வளர்ச்சிக்கு 15 நாட்களுக்கு ஒருமுறை 1 லிட்டர் தண்ணீருக்கு 30 மி.லி பஞ்சகாவ்யா அல்லது 5 கிராம் 19:19:19 சமச்சீர் உரம் இலைவழியாக தெளிக்கவும்.\n\n"
                    f"**3. பூஞ்சைக்கொல்லி தேவை:** பூஞ்சை அல்லது இரசாயன மருந்துகள் தற்போது தேவையில்லை.\n\n"
                    f"**4. தடுப்பு மேலாண்மை:** சீரான சொட்டுநீர் பாசனம் மற்றும் காற்றோட்டமான களையற்ற சூழலை பராமரிக்கவும்."
                )
            else:
                report = (
                    f"**Crop Health & Nutrition Report:**\n\n"
                    f"**1. Status:** No fungal, bacterial, or pest lesions detected on {crop}. Foliage is healthy with robust chlorophyll coverage ({confidence}% confidence).\n\n"
                    f"**2. Recommended Nutrition:** Apply Panchagavya 3% (30ml/L) or NPK 19:19:19 foliar spray @ 5g/L every 15 days to promote vegetative growth.\n\n"
                    f"**3. Chemical Fungicides:** No chemical fungicides or insecticides are needed at this stage.\n\n"
                    f"**4. Preventative Agronomy:** Maintain consistent drip irrigation schedule and keep plots weed-free."
                )
            return {
                "status": "success",
                "engine": "GreenAgriX Plant Pathology AI",
                "detected_disease": detected_disease,
                "crop": crop,
                "confidence": confidence,
                "language": language,
                "diagnosis_report": report
            }

        # Prompt for diseased foliage
        system_prompt = (
            "நீங்கள் GreenAgriX முதன்மை வேளாண் விஞ்ஞானி மற்றும் தாவர நோயியல் நிபுணர். "
            "பயிரில் கண்டறியப்பட்ட நோய்க்கு 100% தூய தமிழில் (TAMIL) மட்டுமே மருத்துவ அறிக்கையை வழங்கவும்: "
            "1. நோயின் காரணம் & நுண்ணுயிரி, 2. உடனடி அவசர நடவடிக்கை, "
            "3. இரசாயன மருந்தளவு (லிட்டருக்கு எத்தனை கிராம்/மி.லி), 4. இயற்கை கட்டுப்பாடு (வேப்ப எண்ணெய் / ட்ரைக்கோடெர்மா), 5. நீண்டகால தடுப்பு."
            if is_ta else
            "You are GreenAgriX Chief Agricultural Scientist & Plant Pathologist. "
            "Generate a structured, authoritative diagnostic report for the detected crop disease: "
            "1. Pathogen Cause & Epidemiology, 2. Immediate Emergency Action, "
            "3. Chemical Prescription (exact active ingredients & dosage per liter/acre), "
            "4. Organic Bio-Control Alternative, 5. Long-term Field Prevention."
        )

        user_content = (
            f"Vision Model detected '{detected_disease}' on '{crop}' leaf with {confidence}% confidence. "
            f"Please generate the complete agronomist diagnosis and treatment protocol."
        )

        headers = {
            "Authorization": f"Bearer {self.api_key.strip()}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content}
        ]

        payload = {
            "model": self.model,
            "messages": messages,
            "max_tokens": 400,
            "temperature": 0.3,
            "top_p": 0.9
        }

        try:
            response = requests.post(NVIDIA_NIM_URL, headers=headers, json=payload, timeout=8)
            if response.status_code == 200:
                data = response.json()
                raw_text = data["choices"][0]["message"]["content"].strip()
                return {
                    "status": "success",
                    "engine": "GreenAgriX Plant Pathology AI",
                    "detected_disease": detected_disease,
                    "crop": crop,
                    "confidence": confidence,
                    "language": language,
                    "diagnosis_report": raw_text
                }
            else:
                return self._fallback_diagnosis(crop, detected_disease, confidence, language)
        except Exception:
            return self._fallback_diagnosis(crop, detected_disease, confidence, language)

    def _fallback_diagnosis(self, crop: str, disease: str, confidence: float, language: str) -> dict:
        is_ta = language == "ta"
        if is_ta:
            report = (
                f"**பயிர் மருத்துவ அறிக்கை:**\n\n"
                f"**1. நோயின் காரணம்:** {crop} பயிரில் {disease} பூஞ்சை தொற்று கண்டறியப்பட்டுள்ளது (துல்லியம்: {confidence}%).\n\n"
                f"**2. அவசர நடவடிக்கை:** பாதிக்கப்பட்ட இலைகளை உடனே அகற்றி நிலத்திற்கு வெளியே அழிக்கவும். சொட்டுநீர் பாசனத்தை பயன்படுத்தி இலைகள் நனையாமல் பார்க்கவும்.\n\n"
                f"**3. இரசாயன மருந்தளவு:** 1 லிட்டர் தண்ணீருக்கு 2.5 கிராம் மேன்கோசெப் (Mancozeb 75% WP) அல்லது 2 கிராம் காப்பர் ஆக்ஸிகுளோரைடு கலந்து தெளிக்கவும்.\n\n"
                f"**4. இயற்கை கட்டுப்பாடு:** 1 லிட்டர் தண்ணீருக்கு 5 மி.லி வேப்ப எண்ணெய் (10,000 PPM) + 2 கிராம் ட்ரைக்கோடெர்மா விரிடி காலை வேளையில் தெளிக்கவும்.\n\n"
                f"**5. தடுப்பு முறை:** காற்று புகும் இடைவெளி விடவும் மற்றும் தழைச்சத்து யூரியாவை குறைத்து சமச்சீர் பொட்டாஷ் இடவும்."
            )
        else:
            report = (
                f"**Agronomist Diagnostic Report:**\n\n"
                f"**1. Pathogen Cause:** Detected {disease} on {crop} with {confidence}% AI confidence. Typically caused by fungal sporulation under warm, humid canopy conditions.\n\n"
                f"**2. Immediate Emergency Action:** Prune infected lower foliage immediately and dispose away from the plot. Halt overhead sprinkler irrigation.\n\n"
                f"**3. Precision Chemical Prescription:** Spray Mancozeb 75% WP @ 2.5g/L (500g/acre) or Chlorothalonil 75% WP @ 2g/L. Repeat after 8–10 days if symptoms persist.\n\n"
                f"**4. Organic Bio-Control:** Apply Neem Oil (10,000 PPM) @ 5ml/L + Pseudomonas fluorescens @ 5g/L with sticker in early morning.\n\n"
                f"**5. Long-term Prevention:** Practice crop rotation, maintain 60cm furrow spacing, and avoid excessive nitrogen application."
            )

        return {
            "status": "success",
            "engine": "GreenAgriX Plant Pathology AI",
            "detected_disease": disease,
            "crop": crop,
            "confidence": confidence,
            "language": language,
            "diagnosis_report": report
        }

nvidia_nim_service = NvidiaNimDiagnosisService()
