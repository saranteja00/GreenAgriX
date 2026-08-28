# 🌿 GreenAgriX — AI-Powered Smart Agriculture & Mandi Intelligence Platform

![GreenAgriX Banner](https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&w=1200&q=80)

GreenAgriX is a comprehensive precision agriculture, crop disease diagnostic, and intelligent market linkage platform designed for Indian farmers. It empowers growers with real-time agronomic insights, multi-lingual AI crop doctor diagnostics, APMC Mandi wholesale price trends, and direct buyer arbitrage matching.

---

## 🚀 Key Features

### 1. 🔍 AI Crop Doctor & Disease Diagnostics
- **Dual Computer Vision & Multimodal LLM Inference**: YOLO lesion detection combined with NVIDIA NIM / Meta Llama 3.2 Vision for instant leaf pathology diagnosis.
- **Organic & Chemical Prescriptions**: Exact dosage per liter, application intervals, pathogen identification, and long-term prevention protocols.
- **Bilingual Audio Readout**: Text-to-speech voice assistant in **English** and **Tamil (`தமிழ்`)**.

### 2. 🏪 APMC Mandi Price Trends & Inter-Market Arbitrage
- **Real-Time Prices**: Live wholesale prices (`₹/qtl`) across major APMC Mandis (Nashik, Koyambedu, Azadpur, Ottanchathiram, Yeshwanthpur, Kolar).
- **Interactive Price & Demand Forecast Graphs**: Historical trends with 30-day/60-day/90-day machine learning demand curves.
- **Inter-Market Comparison Bar Charts**: Direct price arbitrage calculator showing freight deductions and best-selling profit margins.
- **12 Supported Crops**: Tomato 🍅, Potato 🥔, Maize 🌽, Wheat 🌾, Rice 🌾, Onion 🧅, Brinjal 🍆, Chilli 🌶️, Carrot 🥕, Cotton 🧶, Groundnut 🥜, Soybean 🌱.

### 3. 🤝 Buyer Matching & Best Selling Opportunity Engine
- Match harvest volume directly with verified institutional buyers, supermarket aggregators, and food processors.
- Automatic ranking by Net Realized Profit (`₹/kg`) factoring in transit freight distance.

### 4. 🏛️ Government Schemes & Subsidy Advisory
- Direct eligibility calculator for Central and Tamil Nadu State agricultural subsidies (PM-KISAN, PMFBY, Micro-Irrigation Subsidy, TN Agri Mechanization).
- Step-by-step document checklist and direct portal application links.

### 5. ⚠️ Farm Health, Weather & Pest Alerts
- Hyperlocal weather forecasts, rainfall trends, soil moisture alerts, and proactive pest outbreak advisories.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, Lucide React, Web Speech API.
- **Backend**: FastAPI (Python 3.10+), Uvicorn, Pydantic.
- **AI / ML Diagnostics**: NVIDIA NIM API (`meta/llama-3.2-11b-vision-instruct`), OpenCV, PIL, YOLO-based lesion segmentation.
- **Localization**: Full bilingual support for **English (`EN`)** and **Tamil (`தமிழ்`)**.

---

## 🏁 Quick Start & Local Setup

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/Green-AgriX.git
cd Green-AgriX
```

### 2. Backend Setup (FastAPI)
```bash
cd Backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn main:app --port 8000 --reload
```
FastAPI Swagger API docs available at: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup (React + Vite)
```bash
cd ../Frontend
npm install
npm run dev
```
GreenAgriX Web App available at: `http://localhost:5173`

---

## 📄 License
This project is licensed under the MIT License.