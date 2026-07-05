"""
Egypt Real Estate Price Predictor - FastAPI Backend
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from src.schemas import (
    PredictionRequest,
    PredictionResponse,
    ExplanationResponse,
    MarketAnalysisResponse,
)
from src.predictor import predictor

app = FastAPI(
    title="Egypt Real Estate Price Predictor",
    description="نظام ذكي يتوقع أسعار العقارات في مصر",
    version="1.0.0",
)

# CORS - عشان الفرونت إند (React على بورت مختلف) يقدر يتواصل مع الـ API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/areas")
def get_areas():
    """قائمة المناطق والمحافظات والأنواع المعروفة - للـ dropdowns في الفرونت إند"""
    return {
        "sub_areas": predictor.known_areas,
        "governorates": predictor.known_governorates,
        "property_types": predictor.known_types,
    }


@app.post("/predict", response_model=PredictionResponse)
def predict_price(request: PredictionRequest):
    try:
        result = predictor.predict(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/explain", response_model=ExplanationResponse)
def explain_prediction(request: PredictionRequest):
    """تفسير القرار - أي عوامل أثرت أكتر على السعر (SHAP)"""
    try:
        result = predictor.explain(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/market-analysis", response_model=MarketAnalysisResponse)
def market_analysis(area: str):
    """تحليل سريع لمنطقة معينة بناءً على بيانات التدريب"""
    if area not in predictor.area_price_per_sqm:
        raise HTTPException(status_code=404, detail=f"Area '{area}' not found")

    avg_pps = predictor.area_price_per_sqm[area]

    return {
        "area": area,
        "avg_price": avg_pps,  # تبسيط مبدئي - ممكن نحسّنه لاحقاً ببيانات أدق
        "median_price": avg_pps,
        "avg_price_per_sqm": avg_pps,
        "n_listings": 0,  # placeholder - هنحسّنه لو حفظنا الإحصائيات الكاملة لاحقاً
    }