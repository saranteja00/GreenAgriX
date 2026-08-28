from fastapi import APIRouter, Query, Body
from typing import Optional
from services.schemes_service import schemes_service

router = APIRouter(prefix="/api/v1/schemes", tags=["Government Agricultural Schemes & Subsidies"])

@router.get("/all")
async def get_all_government_schemes():
    """
    Fetch all Central & State Government Agricultural Schemes and Subsidies.
    """
    schemes = schemes_service.get_all_schemes()
    return {
        "status": "success",
        "total_schemes": len(schemes),
        "schemes": schemes
    }

@router.post("/eligible")
async def get_eligible_schemes(
    crop: str = Body("Tomato", embed=True),
    acreage: float = Body(3.5, embed=True),
    farmer_category: str = Body("Small / Marginal", embed=True),
    has_water_source: bool = Body(True, embed=True),
    category_filter: Optional[str] = Body(None, embed=True)
):
    """
    Matches Central & State Government schemes tailored to farmer's crop, acreage, and farm conditions.
    Calculates estimated financial aid, subsidy percentage, required documents, and application steps.
    """
    result = schemes_service.match_eligible_schemes(
        crop=crop,
        acreage=acreage,
        farmer_category=farmer_category,
        has_well_borewell=has_water_source,
        category_filter=category_filter
    )
    return {
        "status": "success",
        "data": result
    }
