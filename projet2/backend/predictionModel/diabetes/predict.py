import joblib
import numpy as np
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app)  # Autoriser les requêtes cross-origin

# Charger le modèle et le scaler au démarrage
model = load_model('diabetes_model.h5')
scaler = joblib.load('diabetes_scaler.pkl')

# Liste des features attendues
FEATURES = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 
            'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Récupérer les données JSON
        data = request.json
        
        # Vérifier les données reçues
        if not data or not all(field in data for field in FEATURES):
            return jsonify({'error': 'Données manquantes ou format incorrect'}), 400

        # Créer un DataFrame et prétraiter
        input_data = pd.DataFrame([data])
        scaled_data = scaler.transform(input_data)

        # Faire la prédiction
        probability = model.predict(scaled_data)[0][0]
        prediction = int(probability > 0.5)  # Seuil optimisé pourrait être chargé ici

        return jsonify({
            'prediction': prediction,
            'probability': float(probability),
            'status': 'success'
        })

    except Exception as e:
        return jsonify({'error': str(e), 'status': 'failed'}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)