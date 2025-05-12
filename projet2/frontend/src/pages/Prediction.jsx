import { motion } from "framer-motion";
import jsPDF from "jspdf";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { assets } from "../assets/assets";
import logo from '../assets/logo.png';
import { AppContext } from "../context/AppContext";

const diseaseFields = {
  heart: [
    { name: "age", label: "Age", type: "number" },
    {
      name: "sex",
      label: "Sex",
      type: "select",
      options: [
        { label: "Male", value: 1 },
        { label: "Female", value: 0 },
      ],
    },
    {
      name: "cp",
      label: "Chest Pain Type",
      type: "select",
      options: [
        { label: "0", value: 0 },
        { label: "1", value: 1 },
        { label: "2", value: 2 },
        { label: "3", value: 3 },
      ],
    },
    {
      name: "trestbps",
      label: "Resting Blood Pressure (mm Hg)",
      type: "number",
    },
    { name: "chol", label: "Cholesterol (mg/dL)", type: "number" },
    {
      name: "fbs",
      label: "Fasting Blood Sugar > 120 mg/dL",
      type: "select",
      options: [
        { label: "Yes", value: 1 },
        { label: "No", value: 0 },
      ],
    },
    {
      name: "restecg",
      label: "Resting ECG Results",
      type: "select",
      options: [
        { label: "0", value: 0 },
        { label: "1", value: 1 },
        { label: "2", value: 2 },
      ],
    },
    { name: "thalach", label: "Max Heart Rate Achieved", type: "number" },
    {
      name: "exang",
      label: "Exercise Induced Angina",
      type: "select",
      options: [
        { label: "Yes", value: 1 },
        { label: "No", value: 0 },
      ],
    },
    { name: "oldpeak", label: "ST Depression (Oldpeak)", type: "number" },
    {
      name: "slope",
      label: "Slope of Peak Exercise ST Segment",
      type: "select",
      options: [
        { label: "0", value: 0 },
        { label: "1", value: 1 },
        { label: "2", value: 2 },
      ],
    },
    {
      name: "ca",
      label: "Number of Major Vessels (0-3)",
      type: "select",
      options: [
        { label: "0", value: 0 },
        { label: "1", value: 1 },
        { label: "2", value: 2 },
        { label: "3", value: 3 },
      ],
    },
    {
      name: "thal",
      label: "Thalassemia",
      type: "select",
      options: [
        { label: "Normal", value: 1 },
        { label: "Fixed Defect", value: 2 },
        { label: "Reversible Defect", value: 3 },
      ],
    },
  ],
  diabetes: [
    { name: "pregnancies", label: "Number of Pregnancies", type: "number" },
    { name: "glucose", label: "Glucose Level", type: "number" },
    { name: "blood_pressure", label: "Blood Pressure", type: "number" },
    { name: "skin_thickness", label: "Skin Thickness", type: "number" },
    { name: "insulin", label: "Insulin Level", type: "number" },
    { name: "bmi", label: "BMI", type: "number" },
    { name: "dpf", label: "Diabetes Pedigree Function", type: "number" },
    { name: "age", label: "Age", type: "number" },
  ],
  pcos: [
    { name: "age", label: "Age (in years)", type: "number" },
    { name: "bmi", label: "BMI", type: "number" },
    { name: "amh", label: "AMH (ng/mL)", type: "number" },
    { name: "lh", label: "LH (mIU/mL)", type: "number" },
    { name: "fsh_lh", label: "FSH/LH Ratio", type: "number" },
    {
      name: "weight_gain",
      label: "Weight Gain",
      type: "select",
      options: [
        { label: "No", value: 0 },
        { label: "Yes", value: 1 },
      ],
    },
    {
      name: "hair_growth",
      label: "Hair Growth",
      type: "select",
      options: [
        { label: "No", value: 0 },
        { label: "Yes", value: 1 },
      ],
    },
    {
      name: "skin_darkening",
      label: "Skin Darkening",
      type: "select",
      options: [
        { label: "No", value: 0 },
        { label: "Yes", value: 1 },
      ],
    },
    {
      name: "hair_loss",
      label: "Hair Loss",
      type: "select",
      options: [
        { label: "No", value: 0 },
        { label: "Yes", value: 1 },
      ],
    },
    {
      name: "pimples",
      label: "Pimples",
      type: "select",
      options: [
        { label: "No", value: 0 },
        { label: "Yes", value: 1 },
      ],
    },
    { name: "cycle_length", label: "Cycle Length (days)", type: "number" },
    { name: "follicle_L", label: "Follicle No. (Left)", type: "number" },
    { name: "follicle_R", label: "Follicle No. (Right)", type: "number" },
    { name: "tsh", label: "TSH (mIU/L)", type: "number" },
    {
      name: "endometrium",
      label: "Endometrium Thickness (mm)",
      type: "number",
    },
  ],
  stroke: [
    {
      name: "gender",
      label: "Gender",
      type: "select",
      options: [
        { label: "Female", value: 0 },
        { label: "Male", value: 1 },
      ],
    },
    { name: "age", label: "Age (in years)", type: "number" },
    {
      name: "hypertension",
      label: "Hypertension",
      type: "select",
      options: [
        { label: "No", value: 0 },
        { label: "Yes", value: 1 },
      ],
    },
    {
      name: "heart_disease",
      label: "Heart Disease",
      type: "select",
      options: [
        { label: "No", value: 0 },
        { label: "Yes", value: 1 },
      ],
    },
    {
      name: "ever_married",
      label: "Ever Married",
      type: "select",
      options: [
        { label: "No", value: 0 },
        { label: "Yes", value: 1 },
      ],
    },
    {
      name: "work_type",
      label: "Work Type",
      type: "select",
      options: [
        { label: "Private", value: 0 },
        { label: "Self-employed", value: 1 },
        { label: "Govt job", value: 2 },
        { label: "Children", value: 3 },
        { label: "Never worked", value: 4 },
      ],
    },
    {
      name: "residence_type",
      label: "Residence Type",
      type: "select",
      options: [
        { label: "Rural", value: 0 },
        { label: "Urban", value: 1 },
      ],
    },
    {
      name: "avg_glucose_level",
      label: "Average Glucose Level",
      type: "number",
    },
    { name: "bmi", label: "BMI", type: "number" },
    {
      name: "smoking_status",
      label: "Smoking Status",
      type: "select",
      options: [
        { label: "Never smoked", value: 0 },
        { label: "Formerly smoked", value: 1 },
        { label: "Smokes", value: 2 },
        { label: "Unknown", value: 3 },
      ],
    },
  ],
};

const getRiskColor = (percentage) => {
  if (percentage <= 50) return "#10B981"; // Green (Low Risk)
  if (percentage <= 80) return "#F59E0B"; // Orange (Moderate Risk)
  return "#EF4444"; // Red (High Risk)
};

const Preloader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-r from-blue-300 to-blue-100 z-50">
      {/* Animated Logo */}
      <motion.h1
        className="text-5xl font-bold text-blue-600 tracking-wide mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        DIAGNOSTIC<span className="text-gray-800">AI</span>
      </motion.h1>

      {/* Animated Subheading */}
      <motion.p
        className="text-xl text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        Vos informations sur la santé, à une prédiction près...
      </motion.p>

      {/* Pulse Loader with Custom Animation */}
      <div className="flex gap-1 mt-4">
        <motion.div
          className="w-2 h-2 bg-blue-600 rounded-full"
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="w-2 h-2 bg-blue-600 rounded-full"
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.div
          className="w-2 h-2 bg-blue-600 rounded-full"
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
      </div>
    </div>
  );
};

const Prediction = () => {
  const { userData, backendUrl } = useContext(AppContext);

  const [pageLoading, setPageLoading] = useState(true);
  const [disease, setDisease] = useState("");
  const [formData, setFormData] = useState({});
  const [riskPercentage, setRiskPercentage] = useState("0%");
  const [riskLevel, setRiskLevel] = useState("Low Risk");
  const [riskMessage, setRiskMessage] = useState(
    "Veuillez remplir le formulaire pour obtenir votre prédiction de risque de maladie."
  );
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setFormData({});
    setPrediction(null);
  }, [disease]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePrediction = async () => {
    if (!disease) {
      toast.error("Veuillez sélectionner une maladie");
      return;
    }

    // Ensure all required fields are filled
    const requiredFields = diseaseFields[disease].map((field) => field.name);
    for (let field of requiredFields) {
      if (!formData[field] && formData[field] !== 0) {
        alert(`Veuillez remplir le champ: ${field}`);
        return;
      }
    }

    setLoading(true);

    try {
      // Step 1: Get the prediction from the backend
      const response = await fetch(`http://127.0.0.1:5000/predict/${disease}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Échec de la récupération de la prédiction");
      }

      const result = await response.json();

      // Display prediction results to the user
      const riskLevel = result.risk === "YES" ? "High Risk" : "Low Risk";
      setRiskPercentage(`${result.probability}%`);
      setRiskLevel(riskLevel);
      setRiskMessage(
        result.risk === "YES"
          ? "Consult a doctor for further evaluation."
          : "Your health condition seems fine."
      );
      setPrediction(result.probability);

      // Step 2: Save the prediction and user data to MongoDB
      const userId = userData?._id || "guest";

      const saveResponse = await fetch("http://127.0.0.1:4000/api/predictions/savePrediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          disease,
          userId, // ✅ Corrected - ensure userId is passed
          userInputs: formData, // ✅ Corrected from userData to userInputs
          predictionResult: riskLevel,
          probability: result.probability,
        }),
      });

      if (!saveResponse.ok) {
        const saveError = await saveResponse.json();
        console.error("Failed to save prediction data:", saveError.message);
        throw new Error(`Failed to save prediction data: ${saveError.message}`);
      }

      console.log("Les données de prédiction ont été enregistrées avec succès!");
    } catch (error) {
      console.error("Error:", error);
      setRiskMessage("Failed to get prediction or save data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const normalValues = {
    heart: {
      trestbps: { normal: "90-120", unit: "mm Hg" },
      chol: { normal: "< 200", unit: "mg/dL" },
      fbs: { normal: "< 100", unit: "mg/dL" },
      thalach: { normal: "60-100", unit: "bpm" },
      oldpeak: { normal: "0-2", unit: "mm" },
    },
    diabetes: {
      pregnancies: { normal: "0-2", unit: "Count" },
      glucose: { normal: "70-99", unit: "mg/dL" },
      blood_pressure: { normal: "90-120", unit: "mm Hg" },
      skin_thickness: { normal: "10-40", unit: "mm" },
      insulin: { normal: "16-166", unit: "µU/mL" },
      bmi: { normal: "18.5-24.9", unit: "kg/m²" },
      dpf: { normal: "0.1-2.5", unit: "Index" },
    },
    pcos: {
      bmi: { normal: "18.5-24.9", unit: "kg/m²" },
      amh: { normal: "1.0-5.0", unit: "ng/mL" },
      lh: { normal: "1.5-8.0", unit: "mIU/mL" },
      fsh_lh: { normal: "1.0-2.0", unit: "Ratio" },
      cycle_length: { normal: "21-35", unit: "Days" },
      follicle_L: { normal: "5-10", unit: "Count" },
      follicle_R: { normal: "5-10", unit: "Count" },
      tsh: { normal: "0.5-4.5", unit: "mIU/L" },
      endometrium: { normal: "7-14", unit: "mm" },
    },
    stroke: {
      avg_glucose_level: { normal: "70-99", unit: "mg/dL" },
      bmi: { normal: "18.5-24.9", unit: "kg/m²" },
    },
  };

  const handleDownloadCertificate = () => {
    if (!disease || prediction === null) {
      alert("Veuillez d'abord compléter la prédiction.");
      return;
    }

    const doc = new jsPDF();

    // Load Logo (Top Left, Resized to Maintain Aspect Ratio)
    const img = new Image();
    img.src = logo;
    img.onload = () => {
      doc.addImage(img, "PNG", 10, 7, 70, 20); // Adjust width and height to avoid squeezing

      // Contact Information (Adjusted Positioning)
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(userData?.email, 140, 15);
      doc.text(userData?.phone, 140, 20);

      // Title (Centered, Updated Text)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(40, 40, 40);
      doc.text("Certificat de prédiction", 105, 40, { align: "center" });

      // Disease Name (Centered)
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text(`Maladie: ${disease.toUpperCase()}`, 105, 48, { align: "center" });

      doc.line(15, 50, 195, 50);

      // Date
      doc.setFontSize(10);
      const currentDate = new Date();
      const dateString = currentDate.toLocaleDateString();
      const timeString = currentDate.toLocaleTimeString();
      doc.text(`Date: ${dateString}`, 160, 57);
      doc.text(`Time: ${timeString}`, 160, 62);

      doc.setFontSize(13);
      doc.setFont("helvetica", "semi-bold");
      doc.text("Patient : ", 15, 57);
      const patientAge = formData["age"] || "N/A"; // Get age from formData
      doc.text(`Age: ${patientAge}`, 15, 62);
      doc.text("Sex: Male", 15, 67);

      doc.line(15, 70, 195, 70);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(40, 40, 40);
      doc.text("Rapport du patient", 105, 85, { align: "center" });

      // Patient Details Section
      let yPos = 96;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Parameter", 20, yPos);
      doc.text("Normal Value", 78, yPos);
      doc.text("Unit", 120, yPos);
      doc.text("Patient Value", 148, yPos);
      doc.text("Unit", 180, yPos);
      doc.line(15, yPos + 5, 195, yPos + 5);
      yPos += 10;

      // Table Content
      doc.setFont("helvetica", "normal");
      diseaseFields[disease]
        .filter(field => field.name !== "age" && field.name !== "gender" && field.name!=="sex") // Exclude age and gender
        .forEach((field) => {
          let value = formData[field.name] || "N/A";
          let normalInfo = normalValues[disease][field.name] || { normal: "--", unit: "--" };
          let normalValue = normalInfo.normal;
          let unit = normalInfo.unit;

          if (field.type === "select") {
            const selectedOption = field.options.find((opt) => opt.value == value);
            value = selectedOption ? selectedOption.label : value;
          }
          doc.text(field.label, 20, yPos);
          doc.text(normalValue, 90, yPos, { align: "center" });
          doc.text(unit, 125, yPos, { align: "center" });
          doc.text(value, 160, yPos, { align: "center" });
          doc.text(unit, 185, yPos, { align: "center" });
          doc.line(15, yPos + 5, 195, yPos + 5);
          yPos += 10;
        });

      // Set Table Position
      const tableX = 30;
      let tableY = yPos + 10;
      const columnWidths = [80, 70]; // Column sizes for "Label" and "Value"
      const rowHeight = 10;
      const tableWidth = columnWidths.reduce((a, b) => a + b, 0);

      // Table Header
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setFillColor(230, 230, 230); // Light gray background for header
      doc.rect(tableX, tableY, tableWidth, rowHeight, "F");
      doc.setTextColor(0, 0, 0);
      doc.text("Résultat de la prédiction", tableX + tableWidth / 2, tableY + 7, { align: "center" });

      // Table Border
      doc.rect(tableX, tableY, tableWidth, rowHeight * 3);

      // Risk Level Row
      tableY += rowHeight;
      doc.setFont("helvetica", "normal");
      doc.text("Risk Level", tableX + 10, tableY + 7);
      doc.setTextColor(...(prediction >= 50 ? [200, 0, 0] : [0, 150, 0])); // Red for high risk, Green for low
      doc.text(riskLevel, tableX + columnWidths[0] + 10, tableY + 7);

      // Probability Row
      doc.setTextColor(0, 0, 0);
      tableY += rowHeight;
      doc.text("Probabilité", tableX + 10, tableY + 7);
      doc.text(`${riskPercentage}`, tableX + columnWidths[0] + 15, tableY + 7);
      // Footer Disclaimer
      const pageWidth = doc.internal.pageSize.width; // Get page width
      const pageHeight = doc.internal.pageSize.height; // Get page height

      doc.setTextColor(40, 40, 40);
      doc.line(15, pageHeight - 25, 195, pageHeight - 25); // Horizontal line above footer

      doc.setFontSize(10);
      doc.text(
        "Il s'agit d'un rapport informatisé. Veuillez consulter un médecin pour une évaluation plus approfondie.",
        pageWidth / 2, // Center horizontally
        pageHeight - 15, // Position near bottom
        { align: "center", maxWidth: 180 }
      );
      // Save PDF
      doc.save(`Prediction_${disease}_certificate.pdf`);
    };
  };


  return (
    <>
      {pageLoading ? (
        <Preloader />
      ) : (
        <div className="mt-15 flex flex-col items-center p-6">
          <div className="flex flex-col md:flex-row gap-8 max-w-7xl w-full bg-white rounded-3xl shadow-2xl p-10">
            <div className="w-full md:w-1/2 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 [&::-webkit-scrollbar]:hidden">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Disease
                </label>
                <select
                  className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setDisease(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="heart">Heart Disease</option>
                  <option value="pcos">PCOS</option>
                  <option value="diabetes">Diabetes</option>
                  <option value="stroke">Stroke</option>
                </select>
              </div>

              {disease && (
                <form className="grid grid-cols-1 gap-4">
                  {diseaseFields[disease].map((field) => (
                    <div key={field.name} className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      {field.type === "select" ? (
                        <select
                          name={field.name}
                          value={formData[field.name] || ""}
                          onChange={handleInputChange}
                          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select</option>
                          {field.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="number"
                          name={field.name}
                          value={formData[field.name] || ""}
                          onChange={handleInputChange}
                          placeholder={field.label}
                          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className={`mt-4 py-3 px-6 text-white text-lg font-semibold rounded-lg shadow-md transition ${loading
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    onClick={handlePrediction}
                    disabled={loading}
                  >
                    {loading ? "Predicting..." : "Predict Disease Risk"}
                  </button>
                </form>
              )}
            </div>

            <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-6">
                Prediction Result
              </h3>

              <div className="w-64 h-64 flex items-center justify-center relative rounded-full shadow-lg bg-white">
                {prediction !== null ? (
                  <>
                    <PieChart width={250} height={250}>
                      <Pie
                        data={[
                          { name: "Risk", value: prediction },
                          { name: "Safe", value: 100 - prediction },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        <Cell fill={getRiskColor(prediction)} />{" "}
                        {/* Risk color based on percentage */}
                        <Cell fill="#D1D5DB" /> {/* Gray for safe area */}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                    <div className="absolute flex flex-col items-center">
                      <span
                        className="text-4xl font-bold"
                        style={{ color: getRiskColor(prediction) }}
                      >
                        {riskPercentage}
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: getRiskColor(prediction) }}
                      >
                        {riskLevel}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col justify-center items-center text-gray-400 text-center animate-pulse">
                    <img className="m-0 p-0 h-8 w-8" src={assets.bot} alt="" />
                    <p>Waiting for prediction...</p>
                  </div>
                )}
              </div>

              <button
                onClick={handleDownloadCertificate}
                className={`mt-6 py-3 px-6 text-white text-lg font-semibold rounded-lg shadow-md bg-green-500 hover:bg-green-600 transition ${prediction == null ? "cursor-not-allowed opacity-50" : ""
                  }`}
                disabled={prediction == null} // Only disable when prediction is null or undefined
              >
                Download Prediction Certificate
              </button>
              <p className="mt-6 text-gray-500 text-sm text-center">
                {riskMessage}
              </p>
              
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Prediction;
