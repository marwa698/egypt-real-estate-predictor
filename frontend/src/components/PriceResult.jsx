function formatPrice(num) {
  return new Intl.NumberFormat("en-EG").format(Math.round(num));
}

export default function PriceResult({ result, t }) {
  if (!result) return null;
  const isAboveAvg = result.comparison_to_area_avg_pct > 0;

  return (
    <div className="price-result">
      <h2>{t.predictedPrice}</h2>

      <div className="main-price">
        {formatPrice(result.predicted_price)} <span>{t.egp}</span>
      </div>

      <div className="price-range">
        {t.priceRange} {formatPrice(result.price_range_low)} — {formatPrice(result.price_range_high)} {t.egp}
      </div>

      <div className="confidence-bar">
        <span>{t.confidence} {Math.round(result.confidence * 100)}%</span>
        <div className="bar-track">
          <div className="bar-fill" style={{ width: `${result.confidence * 100}%` }} />
        </div>
      </div>

      <div className="market-comparison">
        <h3>{t.marketComparison}</h3>
        <div className="comparison-row">
          <span>{t.areaAvgPps}</span>
          <strong>{formatPrice(result.area_avg_price_per_sqm)} {t.ppsUnit}</strong>
        </div>
        <div className="comparison-row">
          <span>{t.yourPps}</span>
          <strong>{formatPrice(result.price_per_sqm_input)} {t.ppsUnit}</strong>
        </div>
        <div className={`comparison-badge ${isAboveAvg ? "above" : "below"}`}>
          {isAboveAvg ? "▲" : "▼"} {Math.abs(result.comparison_to_area_avg_pct)}%{" "}
          {isAboveAvg ? t.aboveAvg : t.belowAvg}
        </div>
      </div>
    </div>
  );
}