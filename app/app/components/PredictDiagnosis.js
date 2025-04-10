import { useState } from "react";
import axios from "axios";

export default function PredictDiagnosis() {
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePredict = async () => {
    if (!symptoms) {
      setError("Please enter symptoms!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/predict", {
        signs_and_symptoms: symptoms,
      });
      setDiagnosis(response.data.diagnosis);
    } catch (err) {
      setError("Prediction failed—check backend!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Diagnose Me</h2>
      <input
        type="text"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        placeholder="Enter symptoms (e.g., fever, cough)"
      />
      <button onClick={handlePredict} disabled={loading}>
        {loading ? "Predicting..." : "Get Diagnosis"}
      </button>
      {diagnosis && <p>Diagnosis: {diagnosis}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
