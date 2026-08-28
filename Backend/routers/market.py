from fastapi import APIRouter, Query, Body
from typing import Optional
from services.market_service import market_service

router = APIRouter(prefix="/api/v1/market", tags=["Market Demand, Buyers & Selling Opportunities"])

@router.get("/demand")
async def get_crop_market_demand(crop: str = Query("Tomato", description="Crop name")):
    """
    Fetch live APMC mandi wholesale demand, price volatility, and 30-day forecast.
    """
    result = market_service.get_market_demand(crop=crop)
    return result

@router.get("/buyers")
async def get_verified_buyers(
    crop: str = Query("Tomato", description="Crop name"),
    grade: Optional[str] = Query(None, description="Quality grade: Grade A, Grade B, etc.")
):
    """
    Fetch verified institutional buyers, aggregators, and APMC commission agents.
    """
    buyers = market_service.get_buyers(crop=crop, grade=grade)
    return {
        "status": "success",
        "crop": crop,
        "total_buyers": len(buyers),
        "buyers": buyers
    }

@router.post("/best-opportunity")
async def calculate_best_selling_opportunity(
    crop: str = Body("Tomato", embed=True),
    expected_volume_kg: float = Body(2000.0, embed=True),
    production_cost_per_kg: float = Body(12.0, embed=True)
):
    """
    Calculates Net Realization: Net Revenue = (Price * Volume) - Freight.
    Ranks buyer opportunities and highlights the top recommended buyer.
    """
    result = market_service.calculate_best_selling_opportunity(
        crop=crop,
        expected_volume_kg=expected_volume_kg,
        production_cost_per_kg=production_cost_per_kg
    )
    return {
        "status": "success",
        "data": result
    }
