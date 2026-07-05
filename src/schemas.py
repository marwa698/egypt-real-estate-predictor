"""
Pydantic schemas - تحديد شكل البيانات الداخلة والخارجة من الـ API
"""
from pydantic import BaseModel, Field
from typing import List, Dict


class PredictionRequest(BaseModel):
    """البيانات اللي المستخدم بيدخلها في الفورم"""
    governorate: str = Field(..., example="Cairo")
    sub_area: str = Field(..., example="5th Settlement Compounds")
    property_type: str = Field(..., example="Apartment")
    payment_method: str = Field(..., example="Cash")
    size_sqm: float = Field(..., gt=0, example=150)
    bedrooms: int = Field(..., ge=0, example=3)
    bathrooms: int = Field(..., ge=0, example=2)
    has_maid_room: bool = Field(default=False, example=False)


class PredictionResponse(BaseModel):
    """الرد اللي هيرجع للمستخدم بعد التنبؤ"""
    predicted_price: float
    price_range_low: float
    price_range_high: float
    confidence: float
    area_avg_price_per_sqm: float
    price_per_sqm_input: float
    comparison_to_area_avg_pct: float


class ShapFeatureImpact(BaseModel):
    """تأثير كل feature على السعر"""
    feature: str
    value: float
    impact: float
    impact_pct: float


class ExplanationResponse(BaseModel):
    """تفسير القرار - أهم العوامل المؤثرة"""
    base_value: float
    predicted_value: float
    feature_impacts: List[ShapFeatureImpact]


class MarketAnalysisResponse(BaseModel):
    """تحليل السوق للمنطقة المختارة"""
    area: str
    avg_price: float
    median_price: float
    avg_price_per_sqm: float
    n_listings: int