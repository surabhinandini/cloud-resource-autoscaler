from flask import Blueprint, request, jsonify
from datetime import datetime
import joblib
import numpy as np
import csv
import os

api_bp = Blueprint('api', __name__)

# Load classification and regression models with robust paths
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../model_files'))
clf_model_path = os.path.join(base_dir, 'classification_model.pkl')
reg_model_path = os.path.join(base_dir, 'regression_model.pkl')

classification_model = joblib.load(clf_model_path)

try:
    regression_model = joblib.load(reg_model_path)
except FileNotFoundError:
    regression_model = None

# Logs directory and file
logs_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../logs'))
os.makedirs(logs_dir, exist_ok=True)
log_file = os.path.join(logs_dir, 'predictions_log.csv')

def log_prediction(cpu, memory, disk, network, scale_pred, storage_pred):
    header = ['timestamp', 'cpu', 'memory', 'disk', 'network', 'scale_prediction', 'storage_prediction_gb']
    file_exists = os.path.exists(log_file)

    with open(log_file, 'a', newline='') as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(header)
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        writer.writerow([timestamp, cpu, memory, disk, network, scale_pred, storage_pred])

@api_bp.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        # Validate inputs
        required_fields = ['cpu', 'memory', 'disk', 'network']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400

        cpu = float(data['cpu'])
        memory = float(data['memory'])
        disk = float(data['disk'])
        network = float(data['network'])

        input_features = np.array([[cpu, memory, disk, network]])

        # Classification prediction: scale needed (0 or 1)
        scale_pred = classification_model.predict(input_features)[0]

        # Regression prediction: storage needed (fallback if regression model not found)
        if regression_model:
            storage_pred = regression_model.predict(input_features)[0]
            storage_pred = max(round(storage_pred, 2), 0)  # No negative storage
        else:
            # Fallback formula with weights
            storage_pred = round(0.3*cpu + 0.2*memory + 1.25*disk + 0.1*network, 2)

        scale_desc = {0: "No Scaling Needed", 1: "Scaling Needed"}
        scale_result = scale_desc.get(scale_pred, "Unknown")

        # Log the prediction
        log_prediction(cpu, memory, disk, network, scale_result, storage_pred)

        return jsonify({
            'scale_needed': scale_pred,
            'scale_description': scale_result,
            'predicted_storage_gb': storage_pred
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api_bp.route('/logs', methods=['GET'])
def get_logs():
    try:
        if not os.path.exists(log_file):
            return jsonify({'logs': []})
        with open(log_file, 'r') as f:
            reader = csv.DictReader(f)
            logs = list(reader)
        return jsonify({'logs': logs})
    except Exception as e:
        return jsonify({'error': str(e)}), 400
