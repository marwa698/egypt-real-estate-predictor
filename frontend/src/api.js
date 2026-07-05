import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getAreas() {
  const response = await api.get("/areas");
  return response.data;
}

export async function predictPrice(formData) {
  const response = await api.post("/predict", formData);
  return response.data;
}

export async function explainPrediction(formData) {
  const response = await api.post("/explain", formData);
  return response.data;
}

export async function getMarketAnalysis(area) {
  const response = await api.get("/market-analysis", {
    params: { area },
  });
  return response.data;
}