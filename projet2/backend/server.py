import os

import joblib
import numpy as np
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app, resources={r"/predict/*": {"origins": "*"}}, supports_credentials=True)

# Define paths for models and scalers
MODEL_DIR = "predictionModel/models/"
SCALER_DIR = "predictionModel/scalers/"

# Model and Scaler file mapping
MODEL_FILES = {
    "heart": "heart_disease_model.h5",
    #"stroke": "stroke_model.h5",
    #"pcos": "pcos_model.h5",
    #"diabetes": "diabetes_model.h5",
}

SCALER_FILES = {
    "heart": "heart_scaler.pkl",
    #"stroke": "stroke_scaler.pkl",
    #"pcos": "pcos_scaler.pkl",
    #"diabetes": "diabetes_scaler.pkl",
}

# Define input fields per disease
DISEASE_FIELDS = {
    "heart": ["age", "sex", "cp", "trestbps", "chol", "fbs", "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal"],
    #"stroke": ["gender", "age", "hypertension", "heart_disease", "ever_married", "work_type", "residence_type", "avg_glucose_level", "bmi", "smoking_status"],
    #"pcos": ["age", "bmi", "amh", "lh", "fsh_lh", "weight_gain", "hair_growth", "skin_darkening", "hair_loss", "pimples", "cycle_length", "follicle_L", "follicle_R", "tsh", "endometrium"],
   #"diabetes": ["Pregnancies", "Glucose","BloodPressure","SkinThickness","Insulin","BMI","DiabetesPedigreeFunction","Age","Outcome"],
}

# Load models and scalers
models = {}
scalers = {}

for disease, model_file in MODEL_FILES.items():
    print('___________________________________________')
    model_path = os.path.join(MODEL_DIR, model_file)
    print(model_path)
    m=load_model(model_path)
    scaler_path = os.path.join(SCALER_DIR, SCALER_FILES[disease])
    print(scaler_path)
    print(disease)
    if os.path.exists(model_path) and os.path.exists(scaler_path):
        # Load the model and scaler
        models[disease] = load_model(model_path)
        scalers[disease] = joblib.load(scaler_path)
        print(f"✅ Loaded model & scaler for {disease}")
    else:
        print(f"❌ Model or scaler missing for {disease}")
    print('___________________________________________')
@app.after_request
def apply_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

@app.route("/predict/<disease>", methods=["POST", "OPTIONS"])
def predict(disease):
    if request.method == "OPTIONS":
        return "", 204  # Handle preflight CORS request

    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data received"}), 400

        if disease not in models:
            return jsonify({"error": "Invalid disease type"}), 400

        # Validate input data
        missing_fields = [field for field in DISEASE_FIELDS[disease] if field not in data]
        if missing_fields:
            return jsonify({"error": f"Missing input fields: {', '.join(missing_fields)}"}), 400

        # Convert input to numerical values
        try:
            features = [float(data[field]) for field in DISEASE_FIELDS[disease]]
        except ValueError:
            return jsonify({"error": "Invalid input: All values must be numeric"}), 400

        input_data = np.array([features])
        input_scaled = scalers[disease].transform(input_data)

        # Predict using the model
        prediction_prob = models[disease].predict(input_scaled)[0][0]
        prediction = "YES" if prediction_prob > 0.5 else "NO"

        return jsonify({
            "disease": disease,
            "risk": prediction,
            "probability": round(float(prediction_prob) * 100, 2)
        }), 200

    except Exception as e:
        print(f"Server Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
