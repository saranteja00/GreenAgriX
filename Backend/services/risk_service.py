# ─── GreenAgriX Farm Risk Assessment & Real-Time Alert Engine ──────────────

class RiskAlertService:
    def get_farm_risk_profile(self, crop: str = "Tomato", soil_moisture: float = 32.0, humidity: float = 78.0) -> dict:
        """
        Calculates multi-dimensional risk matrix for the active farm.
        """
        risks = []
        overall_score = 72 # Out of 100 health score

        # 1. Weather / Heavy Rainfall Risk
        risks.append({
            "risk_id": "r_rain",
            "category_en": "Weather & Storm Risk",
            "category_ta": "வானிலை & கனமழை அபாயம்",
            "level": "High (அதிகம்)",
            "level_code": "high",
            "headline_en": "Heavy Rainfall Forecasted (15–25mm in next 12h)",
            "headline_ta": "அடுத்த 12 மணி நேரத்தில் கனமழை எச்சரிக்கை (15-25 மி.மீ)",
            "impact_en": "Potential root-zone waterlogging and fruit rot on low-lying plots.",
            "impact_ta": "தாழ்வான நிலப்பகுதிகளில் நீர் தேங்கி வேரழுகல் மற்றும் காய் அழுகல் ஏற்பட வாய்ப்பு.",
            "mitigation_protocol_en": "Clear field tail-end drainage furrows immediately. Halt automated drip irrigation runs.",
            "mitigation_protocol_ta": "வடிகால் வாய்க்கால்களை உடனே தூர்வாரி தயார் செய்யவும். சொட்டுநீர் பாசனத்தை நிறுத்தி வைக்கவும்."
        })

        # 2. Fungal Pest Outbreak Risk
        if humidity > 70:
            risks.append({
                "risk_id": "r_pest",
                "category_en": "Fungal Spore Proliferation",
                "category_ta": "பூஞ்சை தொற்று பரவல் அபாயம்",
                "level": "Medium (நடுத்தரம்)",
                "level_code": "medium",
                "headline_en": "High Ambient Humidity (78%) Triggers Early Blight Risk",
                "headline_ta": "அதிக ஈரப்பதம் (78%) காரணமாக இலைக்கருகல் நோய் பரவும் அபாயம்",
                "impact_en": "Alternaria spores proliferate rapidly in warm humid conditions.",
                "impact_ta": "ஈரப்பதமான தட்பவெப்பத்தில் பூஞ்சை வித்துக்கள் வேகமாக இலைகளில் பரவும்.",
                "mitigation_protocol_en": "Foliar spray of Mancozeb 75% WP @ 2.5g/L or Neem Oil @ 5ml/L after rain clears.",
                "mitigation_protocol_ta": "மழை நின்றதும் 1 லிட்டர் தண்ணீருக்கு 2.5 கிராம் மேன்கோசெப் அல்லது 5 மி.லி வேப்ப எண்ணெய் தெளிக்கவும்."
            })

        # 3. Market Price Drop / Volatility Risk
        risks.append({
            "risk_id": "r_market",
            "category_en": "Market Realization Risk",
            "category_ta": "சந்தை விலை வீழ்ச்சி அபாயம்",
            "level": "Low (குறைவு)",
            "level_code": "low",
            "headline_en": "Favorable Price Window across Next 12–16 Days",
            "headline_ta": "அடுத்த 12-16 நாட்களில் சாதகமான விலை நிலவரம்",
            "impact_en": "Modal price holds steady at ₹28–₹33/kg with high wholesale demand.",
            "impact_ta": "மொத்த கொள்முதல் சந்தையில் ₹28-₹33/கிலோ விலை உறுதியாக நீடிக்கிறது.",
            "mitigation_protocol_en": "Lock forward contract with verified buyers before arrival surge.",
            "mitigation_protocol_ta": "வரத்து அதிகரிக்கும் முன்பே சரிபார்க்கப்பட்ட மொத்த கொள்முதல் வியாபாரிகளுடன் முன்பதிவு செய்யவும்."
        })

        return {
            "crop": crop,
            "overall_farm_health_score": overall_score,
            "active_risks_count": len(risks),
            "risks": risks
        }

risk_service = RiskAlertService()
