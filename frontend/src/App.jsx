import { useState } from "react";
import InputForm from "./components/InputForm.jsx";
import ResultDisplay from "./components/ResultDisplay.jsx";

// Change this to your deployed backend URL once hosted on Render
const API_BASE_URL = "http://localhost:5000";

function App() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(entries) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/bfhl`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: entries }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.error || `Request failed (${response.status})`);
      }

      const json = await response.json();
      setResult(json);
    } catch (err) {
      setError(err.message || "Something went wrong while calling the API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>BFHL Hierarchy Processor</h1>
        <p>Enter node relationships and see the structured breakdown.</p>
      </header>

      <InputForm onSubmit={handleSubmit} loading={loading} />

      {error && (
        <div className="error-box" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && <ResultDisplay data={result} />}
    </div>
  );
}

export default App;