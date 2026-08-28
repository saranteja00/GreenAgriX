from fastapi import APIRouter, Query
from services.risk_service import risk_service

router = APIRouter(prefix="/api/v1/alerts", tags=["Farm Risk & Mitigation Alerts"])

@router.get("/risks")
async def get_farm_risks(
    crop: str = Query("Tomato", description="Crop name"),
    moisture: float = Query(32.0, description="Current soil moisture percentage"),
    humidity: float = Query(78.0, description="Current ambient humidity percentage")
):
    """
    Fetch multi-factor farm risk assessment (weather, pests, soil stress, market volatility).
    """
    result = risk_service.get_farm_risk_profile(crop=crop, soil_moisture=moisture, humidity=humidity)
    return {
        "status": "success",
        "data": result
    }
