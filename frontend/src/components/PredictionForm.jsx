import { useState, useEffect } from "react";
import { getAreas } from "../api";

const PAYMENT_METHODS_AR = ["Cash", "Installments"];

export default function PredictionForm({ onResult, onExplain, loading, setLoading, t, lang }) {
  const [areas, setAreas] = useState({ sub_areas: [], governorates: [], property_types: [] });
  const [form, setForm] = useState({
    governorate: "Cairo",
    sub_area: "5th Settlement Compounds",
    property_type: "Apartment",
    payment_method: "Cash",
    size_sqm: 150,
    bedrooms: 3,
    bathrooms: 2,
    has_maid_room: false,
  });

  useEffect(() => {
    getAreas()
      .then(setAreas)
      .catch((err) => console.error("Failed to load areas:", err));
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      size_sqm: Number(form.size_sqm),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
    };
    try {
      await onResult(payload);
      await onExplain(payload);
    } catch (err) {
      console.error("Prediction failed:", err);
      alert(t.errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="prediction-form" onSubmit={handleSubmit}>
      <h2>{t.propertyData}</h2>

      <div className="form-row">
        <label>
          {t.governorate}
          <select name="governorate" value={form.governorate} onChange={handleChange}>
            {areas.governorates.length > 0
              ? areas.governorates.map((g) => <option key={g} value={g}>{g}</option>)
              : <option value={form.governorate}>{form.governorate}</option>}
          </select>
        </label>

        <label>
          {t.subArea}
          <select name="sub_area" value={form.sub_area} onChange={handleChange}>
            {areas.sub_areas.length > 0
              ? areas.sub_areas.map((a) => <option key={a} value={a}>{a}</option>)
              : <option value={form.sub_area}>{form.sub_area}</option>}
          </select>
        </label>
      </div>

      <div className="form-row">
        <label>
          {t.propertyType}
          <select name="property_type" value={form.property_type} onChange={handleChange}>
            {areas.property_types.length > 0
              ? areas.property_types.map((tp) => <option key={tp} value={tp}>{tp}</option>)
              : <option value={form.property_type}>{form.property_type}</option>}
          </select>
        </label>

        <label>
          {t.paymentMethod}
          <select name="payment_method" value={form.payment_method} onChange={handleChange}>
            {PAYMENT_METHODS_AR.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
      </div>

      <div className="form-row three-cols">
        <label>
          {t.sizeSqm}
          <input type="number" name="size_sqm" value={form.size_sqm}
            onChange={handleChange} min="20" max="2000" required />
        </label>
        <label>
          {t.bedrooms}
          <input type="number" name="bedrooms" value={form.bedrooms}
            onChange={handleChange} min="0" max="10" required />
        </label>
        <label>
          {t.bathrooms}
          <input type="number" name="bathrooms" value={form.bathrooms}
            onChange={handleChange} min="0" max="10" required />
        </label>
      </div>

      <label className="checkbox-label">
        <input type="checkbox" name="has_maid_room"
          checked={form.has_maid_room} onChange={handleChange} />
        {t.maidRoom}
      </label>

      <button type="submit" disabled={loading}>
        {loading ? t.calculating : t.calculate}
      </button>
    </form>
  );
}