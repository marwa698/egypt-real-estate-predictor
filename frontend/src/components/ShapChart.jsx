export default function ShapChart({ explanation, t }) {
  if (!explanation) return null;

  const maxAbsImpact = Math.max(
    ...explanation.feature_impacts.map((f) => Math.abs(f.impact))
  );

  return (
    <div className="shap-chart">
      <h2>{t.shapTitle}</h2>
      <p className="shap-subtitle">{t.shapSubtitle}</p>

      <div className="shap-bars">
        {explanation.feature_impacts.map((f) => {
          const widthPct = (Math.abs(f.impact) / maxAbsImpact) * 100;
          const isPositive = f.impact > 0;
          return (
            <div key={f.feature} className="shap-row">
              <div className="shap-label">
                {t.features[f.feature] || f.feature}
              </div>
              <div className="shap-bar-track">
                <div
                  className={`shap-bar-fill ${isPositive ? "positive" : "negative"}`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
              <div className="shap-pct">{f.impact_pct}%</div>
            </div>
          );
        })}
      </div>

      <div className="shap-legend">
        <span className="legend-item">
          <span className="dot positive" /> {t.raisesPrice}
        </span>
        <span className="legend-item">
          <span className="dot negative" /> {t.lowersPrice}
        </span>
      </div>
    </div>
  );
}