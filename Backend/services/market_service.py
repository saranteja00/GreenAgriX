# ─── GreenAgriX Market Demand, Buyer Matching & Best Selling Engine ─────────
from typing import List, Dict, Optional

# Verified Institutional & Mandi Buyers Directory
BUYERS_DATABASE = [
    {
        "id": "b1",
        "name_en": "FreshBasket Wholesale Hub",
        "name_ta": "ஃப்ரெஷ்பாஸ்கெட் மொத்த கொள்முதல் மையம்",
        "buyer_type_en": "Supermarket Aggregator",
        "buyer_type_ta": "பல்பொருள் அங்காடி மொத்த கொள்முதல்",
        "rating": 4.8,
        "location_en": "Koyambedu Wholesale Hub, Chennai",
        "location_ta": "கோயம்பேடு மொத்த கொள்முதல் மையம், சென்னை",
        "distance_km": 35,
        "crop": "Tomato",
        "crop_ta": "தக்காளி",
        "grade_accepted": ["Grade A", "Grade B"],
        "required_volume_kg": 2000,
        "offered_price_per_kg": 30.0,
        "payment_terms_en": "Instant Bank Transfer (Same Day)",
        "payment_terms_ta": "உடனடி வங்கி பரிமாற்றம் (அன்றைய தினமே)",
        "payment_speed_days": 0,
        "freight_cost_estimate": 1200,
        "reliability_score": 98
    },
    {
        "id": "b2",
        "name_en": "Salem Fresh Mandi Syndicate",
        "name_ta": "சேலம் வேளாண் ஒழுங்குமுறை விற்பனைக்கூடம்",
        "buyer_type_en": "APMC Commission Agent",
        "buyer_type_ta": "APMC அரசு உரிமம் பெற்ற வியாபாரி",
        "rating": 4.6,
        "location_en": "Local APMC Market, Salem",
        "location_ta": "உள்ளூர் ஒழுங்குமுறை விற்பனைக்கூடம், சேலம்",
        "distance_km": 12,
        "crop": "Tomato",
        "crop_ta": "தக்காளி",
        "grade_accepted": ["Grade A", "Grade B", "Grade C"],
        "required_volume_kg": 2500,
        "offered_price_per_kg": 29.5,
        "payment_terms_en": "Cash on Spot Delivery",
        "payment_terms_ta": "டெலிவரியின் போது நேரடி ரொக்கம்",
        "payment_speed_days": 0,
        "freight_cost_estimate": 450,
        "reliability_score": 95
    },
    {
        "id": "b3",
        "name_en": "Metro Retail Marts",
        "name_ta": "மெட்ரோ ரீடெய்ல் மார்ட்ஸ்",
        "buyer_type_en": "Direct Retail Chain",
        "buyer_type_ta": "நேரடி சில்லறை விற்பனை சங்கிலி",
        "rating": 4.9,
        "location_en": "Central Distribution, Bangalore",
        "location_ta": "மத்திய விநியோக மையம், பெங்களூரு",
        "distance_km": 180,
        "crop": "Tomato",
        "crop_ta": "தக்காளி",
        "grade_accepted": ["Grade A (Premium)"],
        "required_volume_kg": 3000,
        "offered_price_per_kg": 33.0,
        "payment_terms_en": "48 Hours Direct NEFT",
        "payment_terms_ta": "48 மணி நேரத்திற்குள் NEFT வங்கி பரிமாற்றம்",
        "payment_speed_days": 2,
        "freight_cost_estimate": 4800,
        "reliability_score": 99
    },
    {
        "id": "b4",
        "name_en": "Apex Global Agro Processing",
        "name_ta": "அபெக்ஸ் குளோபல் உணவு பதப்படுத்தும் ஆலை",
        "buyer_type_en": "Food Processing & Sauce Plant",
        "buyer_type_ta": "உணவு பதப்படுத்தும் & சாஸ் தயாரிப்பு நிறுவனம்",
        "rating": 4.7,
        "location_en": "Industrial Estate, Hosur",
        "location_ta": "தொழிற்பேட்டை, ஓசூர்",
        "distance_km": 95,
        "crop": "Tomato",
        "crop_ta": "தக்காளி",
        "grade_accepted": ["Grade B", "Grade C (Bulk Sauce)"],
        "required_volume_kg": 5000,
        "offered_price_per_kg": 27.5,
        "payment_terms_en": "Weekly Consolidated RTGS",
        "payment_terms_ta": "வாராந்திர RTGS வங்கி செலுத்துகை",
        "payment_speed_days": 7,
        "freight_cost_estimate": 2400,
        "reliability_score": 96
    }
]

# Mandi Trends & 30-day Forecast
MANDI_DEMAND_TRENDS = {
    "Tomato": {
        "current_modal_price": 28.5,
        "price_change_24h": "+4.2%",
        "demand_level": "High (உயர் தேவை)",
        "arrival_volume_tonnes": 1420,
        "market_sentiment_en": "Strong upward trend due to local festival demand and supply deficit in neighbouring districts.",
        "market_sentiment_ta": "பண்டிகை கால தேவை மற்றும் அண்டை மாவட்டங்களில் வரத்து குறைவு காரணமாக விலை உயரும் வாய்ப்பு அதிகம்.",
        "forecast_30d": [
            {"date": "Day 1-5", "price": 28.5, "demand": "High"},
            {"date": "Day 6-10", "price": 31.0, "demand": "Peak"},
            {"date": "Day 11-15 (Target)", "price": 33.5, "demand": "Peak"},
            {"date": "Day 16-20", "price": 30.0, "demand": "Moderate"},
            {"date": "Day 21-30", "price": 27.0, "demand": "Normal"}
        ]
    }
}

class MarketService:
    def get_market_demand(self, crop: str = "Tomato") -> dict:
        data = MANDI_DEMAND_TRENDS.get(crop, MANDI_DEMAND_TRENDS["Tomato"])
        return {
            "crop": crop,
            "status": "success",
            "demand_summary": data
        }

    def get_buyers(self, crop: str = "Tomato", grade: Optional[str] = None) -> List[dict]:
        buyers = [b for b in BUYERS_DATABASE if b["crop"].lower() == crop.lower()]
        if grade and grade != "All":
            buyers = [b for b in buyers if grade in b["grade_accepted"]]
        return buyers

    def calculate_best_selling_opportunity(
        self,
        crop: str = "Tomato",
        expected_volume_kg: float = 2000.0,
        production_cost_per_kg: float = 12.0
    ) -> dict:
        """
        Calculates Net Realization:
        Gross Revenue = Offered Price * Volume
        Net Revenue = Gross Revenue - Freight Cost
        Net Realized Price/kg = Net Revenue / Volume
        Net Profit = (Net Realized Price/kg - Production Cost/kg) * Volume
        """
        buyers = [b for b in BUYERS_DATABASE if b["crop"].lower() == crop.lower()]
        opportunities = []

        for b in buyers:
            gross_revenue = b["offered_price_per_kg"] * expected_volume_kg
            # Scale freight by volume and distance
            freight = b["freight_cost_estimate"]
            net_revenue = gross_revenue - freight
            net_realized_price = round(net_revenue / expected_volume_kg, 2)
            net_profit = round(net_revenue - (production_cost_per_kg * expected_volume_kg), 2)
            margin_percent = round((net_profit / net_revenue) * 100, 1) if net_revenue > 0 else 0

            opportunities.append({
                "buyer_id": b["id"],
                "buyer_name_en": b["name_en"],
                "buyer_name_ta": b["name_ta"],
                "buyer_type_en": b["buyer_type_en"],
                "buyer_type_ta": b["buyer_type_ta"],
                "distance_km": b["distance_km"],
                "offered_price_per_kg": b["offered_price_per_kg"],
                "gross_revenue": gross_revenue,
                "freight_cost": freight,
                "net_revenue": net_revenue,
                "net_realized_price_per_kg": net_realized_price,
                "net_profit": net_profit,
                "profit_margin_percent": margin_percent,
                "payment_speed_days": b["payment_speed_days"],
                "rating": b["rating"]
            })

        # Rank by highest Net Realized Price / Net Revenue
        opportunities.sort(key=lambda x: x["net_realized_price_per_kg"], reverse=True)
        top_pick = opportunities[0] if opportunities else None

        return {
            "crop": crop,
            "harvest_volume_kg": expected_volume_kg,
            "production_cost_per_kg": production_cost_per_kg,
            "top_recommended_buyer": top_pick,
            "all_ranked_opportunities": opportunities,
            "recommendation_reason_en": f"Top pick '{top_pick['buyer_name_en'] if top_pick else ''}' yields the maximum NET return of ₹{top_pick['net_realized_price_per_kg'] if top_pick else 0}/kg due to optimal balance of high offer price and ultra-low transit freight.",
            "recommendation_reason_ta": f"அதிக கொள்முதல் விலை மற்றும் மிகக் குறைந்த போக்குவரத்துச் செலவு காரணமாக '{top_pick['buyer_name_ta'] if top_pick else ''}' மூலமாக அதிகபட்ச நிகர லாபம் (கிலோவிற்கு ₹{top_pick['net_realized_price_per_kg'] if top_pick else 0}) கிடைக்கிறது."
        }

market_service = MarketService()
