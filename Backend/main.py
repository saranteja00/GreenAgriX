from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import disease_prediction, market, risks_alerts, schemes

app = FastAPI(
    title="GreenAgriX AI Agricultural Intelligence API",
    description="Backend API powering YOLO Crop Disease Vision, Pesticide Advisory, Market Demand, Buyer Discovery, Risk Alerts & Government Scheme Recommendations.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for Frontend Development & Production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow local React Vite frontend (http://localhost:5173) and any origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Modular Routers
app.include_router(disease_prediction.router)
app.include_router(market.router)
app.include_router(risks_alerts.router)
app.include_router(schemes.router)

@app.get("/", tags=["Health Check"])
@app.get("/api/v1/health", tags=["Health Check"])
async def root_health():
    return {
        "status": "healthy",
        "service": "GreenAgriX FastAPI Backend",
        "version": "2.0.0",
        "endpoints": [
            "/api/v1/crop-disease/predict",
            "/api/v1/crop-disease/remedy/{disease_id}",
            "/api/v1/market/demand",
            "/api/v1/market/buyers",
            "/api/v1/market/best-opportunity",
            "/api/v1/alerts/risks",
            "/api/v1/schemes/all",
            "/api/v1/schemes/eligible"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
