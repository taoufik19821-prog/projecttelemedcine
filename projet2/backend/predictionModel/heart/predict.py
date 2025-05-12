import os

import joblib
import numpy as np
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
from tensorflow.keras.models import load_model

# Flask app setup
app = Flask(__name__)
CORS(app)

# Load model and scaler
MODEL_PATH = "heart_disease_model.h5"
SCALER_PATH = "heart_scaler.pkl"

model = load_model(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

# List of features (must match training order!)
FEATURES = [
    "age", "sex", "cp", "trestbps", "chol", "fbs",
    "restecg", "thalach", "exang", "oldpeak", "slope",
    "ca", "thal"
]

@app.route("/predict/<disease>", methods=["POST", "OPTIONS"])
def predict(disease):
    
    try:
        data = request.get_json()
        print(data)
        # Validate input
        missing = [f for f in FEATURES if f not in data]
        if missing:
            return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

        # Convert to DataFrame to match scaler format
        input_values = [float(data[feature]) for feature in FEATURES]
        input_df = pd.DataFrame([input_values], columns=FEATURES)

        # Scale the data
        input_scaled = scaler.transform(input_df)

        # Predict
        prediction_prob = model.predict(input_scaled)[0][0]
        prediction = "YES" if prediction_prob > 0.5 else "NO"
        print(prediction)
        print(round(float(prediction_prob) * 100, 2))
        return jsonify({
            "risk": prediction,
            "probability": round(float(prediction_prob) * 100, 2)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
