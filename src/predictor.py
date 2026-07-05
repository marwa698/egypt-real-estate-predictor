"""
Predictor - تحميل الموديل وكل الملفات المساعدة، وتنفيذ التنبؤ والتفسير
"""
import pickle
import json
import numpy as np
import pandas as pd
import xgboost as xgb
from pathlib import Path

MODELS_DIR = Path(__file__).parent.parent / "models"


class PricePredictor:
    def __init__(self):
        # 1. حمّل الموديل
        with open(MODELS_DIR / "xgboost_model.pkl", "rb") as f:
            self.model = pickle.load(f)

        # 2. حمّل الـ encoders (type, payment_method, governorate, sub_area)
        with open(MODELS_DIR / "encoders.pkl", "rb") as f:
            self.encoders = pickle.load(f)

        # 3. حمّل mapping سعر المتر لكل منطقة
        with open(MODELS_DIR / "area_price_per_sqm.json", "r", encoding="utf-8") as f:
            self.area_price_per_sqm = json.load(f)

        # 4. القيمة الافتراضية لو منطقة جديدة
        with open(MODELS_DIR / "global_median_pps.json", "r") as f:
            self.global_median_pps = json.load(f)["global_median_pps"]

        # 5. ترتيب الفيتشرز بالظبط زي ما اتدرب عليه الموديل
        with open(MODELS_DIR / "feature_names.json", "r") as f:
            self.feature_names = json.load(f)

        # 6. قوائم القيم المعروفة (للتحقق وللـ dropdowns في الفرونت إند)
        with open(MODELS_DIR / "known_areas.json", "r", encoding="utf-8") as f:
            self.known_areas = json.load(f)

        with open(MODELS_DIR / "known_governorates.json", "r", encoding="utf-8") as f:
            self.known_governorates = json.load(f)

        with open(MODELS_DIR / "known_types.json", "r", encoding="utf-8") as f:
            self.known_types = json.load(f)

    def _safe_encode(self, encoder, value: str) -> int:
        """يحول نص لرقم عن طريق الـ LabelEncoder، ولو القيمة مش معروفة يرجع قيمة افتراضية"""
        if value in encoder.classes_:
            return int(encoder.transform([value])[0])
        return 0

    def _build_features(self, request) -> tuple[pd.DataFrame, float]:
        """يحول الـ request لصف واحد بنفس ترتيب الفيتشرز اللي اتدرب عليها الموديل"""
        type_encoded = self._safe_encode(self.encoders["type"], request.property_type)
        payment_encoded = self._safe_encode(self.encoders["payment_method"], request.payment_method)
        gov_encoded = self._safe_encode(self.encoders["governorate"], request.governorate)
        area_encoded = self._safe_encode(self.encoders["sub_area"], request.sub_area)

        area_pps = self.area_price_per_sqm.get(request.sub_area, self.global_median_pps)

        sqm_per_bedroom = request.size_sqm / (request.bedrooms + 1)

        row = {
            "size_sqm": request.size_sqm,
            "bedrooms": request.bedrooms,
            "bathrooms": request.bathrooms,
            "has_maid_room": int(request.has_maid_room),
            "type_encoded": type_encoded,
            "payment_method_encoded": payment_encoded,
            "governorate_encoded": gov_encoded,
            "sub_area_encoded": area_encoded,
            "area_price_per_sqm": area_pps,
            "sqm_per_bedroom": sqm_per_bedroom,
        }

        return pd.DataFrame([row])[self.feature_names], area_pps

    def predict(self, request) -> dict:
        X, area_pps = self._build_features(request)

        log_price = self.model.predict(X)[0]
        price = float(np.expm1(log_price))

        # نطاق سعري تقريبي بناءً على دقة الموديل (~18% هامش)
        margin = price * 0.18
        price_low = max(price - margin, 0)
        price_high = price + margin

        price_per_sqm_input = price / request.size_sqm
        comparison_pct = ((price_per_sqm_input - area_pps) / area_pps) * 100 if area_pps else 0

        return {
    "predicted_price": float(round(price, 0)),
    "price_range_low": float(round(price_low, 0)),
    "price_range_high": float(round(price_high, 0)),
    "confidence": 0.74,
    "area_avg_price_per_sqm": float(round(area_pps, 0)),
    "price_per_sqm_input": float(round(price_per_sqm_input, 0)),
    "comparison_to_area_avg_pct": float(round(comparison_pct, 1)),
}

    def explain(self, request) -> dict:
        """
        تفسير القرار باستخدام XGBoost المدمج لحساب SHAP values
        (بدل مكتبة shap الخارجية، عشان تفادي مشاكل توافق الإصدارات
        بين xgboost 3.x وحاسبة SHAP الخارجية)
        """
        X, _ = self._build_features(request)

        booster = self.model.get_booster()
        dmatrix = xgb.DMatrix(X)
        shap_output = booster.predict(dmatrix, pred_contribs=True)[0]

        # آخر عنصر في المصفوفة هو الـ base_value (bias)، والباقي تأثير كل feature بالترتيب
        shap_values = shap_output[:-1]
        base_value = float(shap_output[-1])
        predicted_value = float(base_value + shap_values.sum())

        impacts = []
        total_abs_impact = sum(abs(v) for v in shap_values)

        for fname, fval, impact in zip(self.feature_names, X.iloc[0].values, shap_values):
            impact_pct = (abs(impact) / total_abs_impact * 100) if total_abs_impact > 0 else 0
            impacts.append({
                "feature": fname,
                "value": float(fval),
                "impact": float(impact),
                "impact_pct": round(impact_pct, 1),
            })

        impacts.sort(key=lambda x: abs(x["impact"]), reverse=True)

        return {
            "base_value": base_value,
            "predicted_value": predicted_value,
            "feature_impacts": impacts,
        }


# نسخة واحدة بس من الموديل تتحمل عند تشغيل السيرفر (مش كل request)
predictor = PricePredictor()