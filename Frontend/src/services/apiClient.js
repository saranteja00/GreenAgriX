// ─── GreenAgriX Centralized API Client (FastAPI Backend Integration) ────────
const BACKEND_BASE_URL = 'http://localhost:8000/api/v1';

export const apiClient = {
  /**
   * Health check for backend connection
   */
  async checkHealth() {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/health`);
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Predict crop disease via YOLO model endpoint
   */
  async predictCropDisease(imageFile, cropHint = 'Tomato', language = 'en') {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('crop_hint', cropHint);
    formData.append('language', language);

    const response = await fetch(`${BACKEND_BASE_URL}/crop-disease/predict`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Disease prediction failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  },

  /**
   * Request direct NVIDIA NIM AI deep agronomist diagnosis
   */
  async diagnoseWithNvidiaNim(crop = 'Tomato', detectedDisease = 'Early Blight (Alternaria solani)', confidence = 93.5, language = 'en') {
    const response = await fetch(`${BACKEND_BASE_URL}/crop-disease/diagnose-nim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        crop,
        detected_disease: detectedDisease,
        confidence,
        language
      }),
    });
    if (!response.ok) throw new Error('NVIDIA NIM diagnosis request failed');
    const data = await response.json();
    return data.data;
  },

  /**
   * Fetch market demand & price forecast
   */
  async getMarketDemand(crop = 'Tomato') {
    const response = await fetch(`${BACKEND_BASE_URL}/market/demand?crop=${encodeURIComponent(crop)}`);
    if (!response.ok) throw new Error('Failed to fetch market demand');
    return await response.json();
  },

  /**
   * Fetch verified buyers list
   */
  async getBuyers(crop = 'Tomato', grade = 'All') {
    const gradeQuery = grade && grade !== 'All' ? `&grade=${encodeURIComponent(grade)}` : '';
    const response = await fetch(`${BACKEND_BASE_URL}/market/buyers?crop=${encodeURIComponent(crop)}${gradeQuery}`);
    if (!response.ok) throw new Error('Failed to fetch buyers');
    return await response.json();
  },

  /**
   * Calculate best selling opportunity (Net Return Optimizer)
   */
  async calculateBestSellingOpportunity(crop = 'Tomato', expectedVolumeKg = 2000, productionCostPerKg = 12) {
    const response = await fetch(`${BACKEND_BASE_URL}/market/best-opportunity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        crop,
        expected_volume_kg: expectedVolumeKg,
        production_cost_per_kg: productionCostPerKg,
      }),
    });
    if (!response.ok) throw new Error('Failed to calculate best opportunity');
    const data = await response.json();
    return data.data;
  },

  /**
   * Fetch farm risk assessment & alerts
   */
  async getFarmRisks(crop = 'Tomato', moisture = 32.0, humidity = 78.0) {
    const response = await fetch(
      `${BACKEND_BASE_URL}/alerts/risks?crop=${encodeURIComponent(crop)}&moisture=${moisture}&humidity=${humidity}`
    );
    if (!response.ok) throw new Error('Failed to fetch farm risks');
    const data = await response.json();
    return data.data;
  },

  /**
   * Fetch eligible government agricultural schemes for farmer's active profile
   */
  async getEligibleSchemes({
    crop = 'Tomato',
    acreage = 3.5,
    farmerCategory = 'Small / Marginal',
    hasWaterSource = true,
    categoryFilter = 'All',
  }) {
    const response = await fetch(`${BACKEND_BASE_URL}/schemes/eligible`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        crop,
        acreage,
        farmer_category: farmerCategory,
        has_water_source: hasWaterSource,
        category_filter: categoryFilter === 'All' ? null : categoryFilter,
      }),
    });
    if (!response.ok) throw new Error('Failed to fetch eligible schemes');
    const data = await response.json();
    return data.data;
  },
};
