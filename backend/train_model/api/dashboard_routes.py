from flask import Blueprint, jsonify
import csv
import os

dashboard_bp = Blueprint('dashboard', __name__)

DATA_FILE = os.path.join(os.path.dirname(__file__), '../../datasets/predicted_results.csv')

@dashboard_bp.route('/api/dashboard/predictions', methods=['GET'])
def get_predictions():
    predictions = []
    try:
        with open(DATA_FILE, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                predictions.append({
                    'cpuUsage': float(row.get('cpuUsage', 0)),
                    'memoryUsage': float(row.get('memoryUsage', 0)),
                    'diskUsage': float(row.get('diskUsage', 0)),
                    'networkUsage': float(row.get('networkUsage', 0)),
                    'predictedStorage': float(row.get('predictedStorage', 0)),
                    'timestamp': row.get('timestamp', '')
                })
    except Exception as e:
        return jsonify({'error': 'Failed to load predictions', 'details': str(e)}), 500

    return jsonify(predictions)
