import { useState, useEffect } from "react";
import PredictionForm from "./components/PredictionForm";
import PriceResult from "./components/PriceResult";
import ShapChart from "./components/ShapChart";
import { predictPrice, explainPrediction } from "./api";
import { translations } from "./translations";
import "./App.css";

function App() {
  const [result, setResult] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "ar");

  const t = translations[lang];

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    localStorage.setItem("theme", theme);
    localStorage.setItem("lang", lang);
  }, [theme, lang]);

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  function toggleLang() {
    setLang((prev) => (prev === "ar" ? "en" : "ar"));
  }

  async function handlePredict(payload) {
    const data = await predictPrice(payload);
    setResult(data);
  }

  async function handleExplain(payload) {
    const data = await explainPrediction(payload);
    setExplanation(data);
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-controls">
          <button className="toggle-btn" onClick={toggleLang} title="Switch Language">
            {lang === "ar" ? "EN" : "عربي"}
          </button>
          <button className="toggle-btn" onClick={toggleTheme} title="Toggle Theme">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
        <h1>{t.appTitle}</h1>
        <p>{t.appSubtitle}</p>
      </header>

      <main className="app-main">
        <PredictionForm
          onResult={handlePredict}
          onExplain={handleExplain}
          loading={loading}
          setLoading={setLoading}
          t={t}
          lang={lang}
        />

        <div className="results-column">
          {result ? (
            <>
              <PriceResult result={result} t={t} />
              <ShapChart explanation={explanation} t={t} />
            </>
          ) : (
            <div className="placeholder">
              <p>{t.placeholder}</p>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>{t.footer}</p>
      </footer>
    </div>
  );
}

export default App;