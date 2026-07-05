export const translations = {
  ar: {
    // Header
    appTitle: "نظام توقع أسعار العقارات في مصر 🏠",
    appSubtitle: "نظام ذكي يتوقع أسعار العقارات في مصر بناءً على بيانات حقيقية من السوق",

    // Form
    propertyData: "🏠 بيانات العقار",
    governorate: "المحافظة",
    subArea: "المنطقة",
    propertyType: "نوع العقار",
    paymentMethod: "طريقة الدفع",
    sizeSqm: "المساحة (م²)",
    bedrooms: "عدد الغرف",
    bathrooms: "عدد الحمامات",
    maidRoom: "يوجد غرفة خادمة",
    calculate: "💰 احسب السعر المتوقع",
    calculating: "جاري الحساب...",
    placeholder: "📋 املأ بيانات العقار واضغط \"احسب السعر المتوقع\" لرؤية النتيجة",
    errorMsg: "حصل خطأ أثناء التوقع. تأكد إن الـ backend شغال على localhost:8000",

    // Result
    predictedPrice: "💰 السعر المتوقع",
    egp: "جنيه",
    priceRange: "النطاق السعري:",
    confidence: "دقة التوقع:",
    marketComparison: "📊 مقارنة بالسوق",
    areaAvgPps: "متوسط سعر المتر في المنطقة:",
    yourPps: "سعر المتر للعقار ده:",
    ppsUnit: "جنيه/م²",
    aboveAvg: "أعلى من متوسط المنطقة",
    belowAvg: "أقل من متوسط المنطقة",

    // SHAP
    shapTitle: "🔍 أهم العوامل المؤثرة على السعر",
    shapSubtitle: "مبني على تحليل SHAP لتفسير قرار النموذج",
    raisesPrice: "يرفع السعر",
    lowersPrice: "يقلل السعر",

    // Feature labels
    features: {
      size_sqm: "المساحة",
      bedrooms: "عدد الغرف",
      bathrooms: "عدد الحمامات",
      has_maid_room: "غرفة خادمة",
      type_encoded: "نوع العقار",
      payment_method_encoded: "طريقة الدفع",
      governorate_encoded: "المحافظة",
      sub_area_encoded: "المنطقة الفرعية",
      area_price_per_sqm: "متوسط سعر المنطقة",
      sqm_per_bedroom: "مساحة الغرفة",
    },

    // Footer
    footer: "مبني باستخدام XGBoost + SHAP + FastAPI + React",
  },

  en: {
    // Header
    appTitle: "Egypt Real Estate Price Predictor 🏠",
    appSubtitle: "An intelligent system that predicts real estate prices in Egypt based on real market data",

    // Form
    propertyData: "🏠 Property Details",
    governorate: "Governorate",
    subArea: "Area",
    propertyType: "Property Type",
    paymentMethod: "Payment Method",
    sizeSqm: "Size (m²)",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    maidRoom: "Maid Room",
    calculate: "💰 Calculate Price",
    calculating: "Calculating...",
    placeholder: "📋 Fill in the property details and click \"Calculate Price\" to see the result",
    errorMsg: "An error occurred. Make sure the backend is running on localhost:8000",

    // Result
    predictedPrice: "💰 Predicted Price",
    egp: "EGP",
    priceRange: "Price Range:",
    confidence: "Confidence:",
    marketComparison: "📊 Market Comparison",
    areaAvgPps: "Area avg. price per m²:",
    yourPps: "This property price per m²:",
    ppsUnit: "EGP/m²",
    aboveAvg: "above area average",
    belowAvg: "below area average",

    // SHAP
    shapTitle: "🔍 Key Factors Affecting the Price",
    shapSubtitle: "Based on SHAP analysis to explain the model decision",
    raisesPrice: "Raises price",
    lowersPrice: "Lowers price",

    // Feature labels
    features: {
      size_sqm: "Size",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      has_maid_room: "Maid Room",
      type_encoded: "Property Type",
      payment_method_encoded: "Payment Method",
      governorate_encoded: "Governorate",
      sub_area_encoded: "Sub Area",
      area_price_per_sqm: "Area Avg. Price",
      sqm_per_bedroom: "Room Size",
    },

    // Footer
    footer: "Built with XGBoost + SHAP + FastAPI + React",
  },
};