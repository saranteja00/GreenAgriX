from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Body
from typing import Optional
from services.yolo_service import yolo_detector
from services.pesticide_service import get_pesticide_recommendation
from services.nvidia_nim_service import nvidia_nim_service

router = APIRouter(prefix="/api/v1/crop-disease", tags=["YOLO Crop Disease & NVIDIA NIM Diagnosis Advisory"])

@router.post("/predict")
async def predict_crop_disease(
    file: UploadFile = File(...),
    crop_hint: Optional[str] = Form(None),
    language: Optional[str] = Form("en")
):
    """
    YOLO Model Vision Inference + NVIDIA NIM Deep Pathological Diagnosis.
    Accepts crop leaf image upload (PNG/JPG/JPEG).
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a valid image (PNG/JPEG/WEBP).")

    try:
        image_bytes = await file.read()
        if len(image_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty image file received.")

        # 1. Run YOLO Computer Vision model for detection and bounding boxes
        result = yolo_detector.process_image(image_bytes=image_bytes, crop_hint=crop_hint)

        # 2. Call NVIDIA NIM (Llama 3.2 Vision) for deep expert diagnosis
        detected_name = result["primary_diagnosis"]["name_en"]
        confidence = result["primary_diagnosis"]["confidence"]
        nim_diagnosis = nvidia_nim_service.generate_diagnosis(
            crop=crop_hint or "Tomato",
            detected_disease=detected_name,
            confidence=confidence,
            language=language or "en"
        )

        result["nvidia_nim_diagnosis"] = nim_diagnosis

        return {
            "status": "success",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

@router.post("/diagnose-nim")
async def get_nim_diagnosis(
    crop: str = Body("Tomato", embed=True),
    detected_disease: str = Body("Early Blight (Alternaria solani)", embed=True),
    confidence: float = Body(93.5, embed=True),
    language: str = Body("en", embed=True)
):
    """
    Directly generates NVIDIA NIM agronomist diagnosis and treatment protocol for a detected disease.
    """
    diagnosis = nvidia_nim_service.generate_diagnosis(
        crop=crop,
        detected_disease=detected_disease,
        confidence=confidence,
        language=language
    )
    return {
        "status": "success",
        "data": diagnosis
    }

@router.get("/remedy/{disease_id}")
async def get_disease_remedy(disease_id: str):
    """
    Fetch comprehensive organic and chemical pesticide treatment for a specific disease.
    """
    remedy = get_pesticide_recommendation(disease_id)
    return {
        "status": "success",
        "disease_id": disease_id,
        "treatment_protocol": remedy
    }
