import os
import csv
import hashlib
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import numpy as np
import joblib

app = Flask(__name__)
CORS(app)

# === Paths ===
DATASET_PATH = os.path.join('datasets', 'borg_traces_data.csv')
PREDICTION_CSV = os.path.join('datasets', 'predicted_results.csv')
CONTACT_CSV = os.path.join('datasets', 'contact_messages.csv')
USERS_CSV = os.path.join('datasets', 'users.csv')

# === Load Models ===
classification_model = joblib.load('model_files/model.pkl')
try:
    regression_model = joblib.load('model_files/regression_model.pkl')
except FileNotFoundError:
    regression_model = None
    print("⚠️ Regression model not found. Only classification predictions will be available.")

# === Utilities ===
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# === Routes ===
@app.route('/')
def home():
    return '''<h1>Flask API is Running</h1><p>Use <code>/api/predict</code> to get scale prediction (0 or 1) and storage prediction.</p>'''

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'UP'}), 200

@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()

        if not name or not email or not password or len(password) < 8:
            return jsonify({'error': 'Invalid input or weak password'}), 400

        hashed_password = hash_password(password)

        if os.path.exists(USERS_CSV):
            with open(USERS_CSV, 'r') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    if row['email'] == email:
                        return jsonify({'error': 'Email already registered'}), 400

        file_exists = os.path.isfile(USERS_CSV)
        with open(USERS_CSV, 'a', newline='') as file:
            writer = csv.DictWriter(file, fieldnames=['name', 'email', 'password'])
            if not file_exists:
                writer.writeheader()
            writer.writerow({'name': name, 'email': email, 'password': hashed_password})

        return jsonify({'message': 'User registered successfully', 'token': 'mock-token'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()

        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400

        hashed_input = hash_password(password)

        if not os.path.exists(USERS_CSV):
            return jsonify({'error': 'No users found'}), 400

        with open(USERS_CSV, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if row['email'] == email and row['password'] == hashed_input:
                    return jsonify({'message': 'Login successful', 'token': 'mock-token'}), 200

        return jsonify({'error': 'Invalid credentials'}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Empty or invalid input'}), 400

        cpu = float(data.get('cpuUsage', 0))
        memory = float(data.get('memoryUsage', 0))
        disk = float(data.get('diskUsage', 0))
        bandwidth = float(data.get('networkUsage', 0))
        final_input = np.array([[cpu, memory, disk, bandwidth]])

        scale_prediction = classification_model.predict(final_input)[0]
        if regression_model:
            storage_prediction = max(round(regression_model.predict(final_input)[0], 2), 0)
        else:
            storage_prediction = round(0.3 * cpu + 0.2 * memory + 1.25 * disk + 0.1 * bandwidth, 2)

        row = {
            'cpu': cpu,
            'memory': memory,
            'disk': disk,
            'bandwidth': bandwidth,
            'scale_needed': int(scale_prediction),
            'predicted_storage_gb': storage_prediction,
            'timestamp': request.headers.get('Date', '')
        }

        file_exists = os.path.isfile(PREDICTION_CSV)
        with open(PREDICTION_CSV, 'a', newline='') as file:
            writer = csv.DictWriter(file, fieldnames=row.keys())
            if not file_exists or os.path.getsize(PREDICTION_CSV) == 0:
                writer.writeheader()
            writer.writerow(row)

        return jsonify({
            'scale_needed': int(scale_prediction),
            'predicted_storage_gb': storage_prediction
        })

    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 400

@app.route('/api/predict-dataset', methods=['GET'])
def fetch_dataset_predictions():
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        predictions = []

        if os.path.exists(PREDICTION_CSV):
            with open(PREDICTION_CSV, 'r') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    predictions.append({
                        'cpu': float(row.get('cpu', 0)),
                        'memory': float(row.get('memory', 0)),
                        'disk': float(row.get('disk', 0)),
                        'bandwidth': float(row.get('bandwidth', 0)),
                        'scale_needed': int(row.get('scale_needed', 0)),
                        'predicted_storage_gb': float(row.get('predicted_storage_gb', 0)),
                        'timestamp': row.get('timestamp', '')
                    })

        total = len(predictions)
        start = (page - 1) * limit
        end = start + limit
        paginated = predictions[start:end]

        return jsonify({'predictions': paginated, 'total': total, 'page': page, 'limit': limit})

    except Exception as e:
        return jsonify({'error': f'Fetching predictions failed: {str(e)}'}), 500

@app.route('/api/download-predictions', methods=['GET'])
def download_predictions_csv():
    try:
        if not os.path.exists(PREDICTION_CSV):
            return jsonify({'error': 'Prediction file not found'}), 404
        return send_file(PREDICTION_CSV, as_attachment=True, mimetype='text/csv')
    except Exception as e:
        return jsonify({'error': f'Download failed: {str(e)}'}), 500

@app.route('/api/clear-predictions', methods=['DELETE'])
def clear_predictions_csv():
    try:
        headers = ['cpu', 'memory', 'disk', 'bandwidth', 'scale_needed', 'predicted_storage_gb', 'timestamp']
        with open(PREDICTION_CSV, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(headers)
        return jsonify({'message': 'Prediction logs cleared successfully'}), 200
    except Exception as e:
        return jsonify({'error': f'Clearing predictions failed: {str(e)}'}), 500

@app.route('/api/dashboard/predictions', methods=['GET'])
def dashboard_predictions():
    try:
        predictions = []
        if os.path.exists(PREDICTION_CSV):
            with open(PREDICTION_CSV, 'r') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    predictions.append({
                        'cpuUsage': float(row.get('cpu', 0)),
                        'memoryUsage': float(row.get('memory', 0)),
                        'diskUsage': float(row.get('disk', 0)),
                        'networkUsage': float(row.get('bandwidth', 0)),
                        'scaleNeeded': int(row.get('scale_needed', 0)),
                        'predictedStorage': float(row.get('predicted_storage_gb', 0)),
                        'timestamp': row.get('timestamp', '')
                    })

        return jsonify(predictions)

    except Exception as e:
        return jsonify({'error': f'Failed to load dashboard predictions: {str(e)}'}), 500

@app.route('/contact', methods=['POST'])
def contact():
    try:
        data = request.get_json()
        required_fields = ['name', 'email', 'subject', 'message']
        if not data or not all(field in data and data[field].strip() for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        row = {
            'name': data['name'].strip(),
            'email': data['email'].strip(),
            'subject': data['subject'].strip(),
            'message': data['message'].strip()
        }

        file_exists = os.path.isfile(CONTACT_CSV)
        with open(CONTACT_CSV, mode='a', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=row.keys())
            if not file_exists or os.path.getsize(CONTACT_CSV) == 0:
                writer.writeheader()
            writer.writerow(row)

        return jsonify({'message': 'Contact form submitted successfully'}), 200

    except Exception as e:
        return jsonify({'error': f'Failed to process contact form: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
