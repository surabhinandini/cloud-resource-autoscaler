import pandas as pd
import argparse
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, mean_squared_error, r2_score
import joblib
import os

# Create model_files directory if it doesn't exist
os.makedirs('model_files', exist_ok=True)

# CLI Argument Parsing
parser = argparse.ArgumentParser()
parser.add_argument("--mode", choices=["both", "classification", "regression"], default="both", help="Select model training type")
args = parser.parse_args()

# Load your dataset
data = pd.read_csv('data/borg_traces_data.csv')

# Pick relevant columns — update these based on your dataset's actual column names
columns_needed = ['cpu_usage', 'memory_usage', 'disk_io_time', 'network_usage']
data = data[columns_needed]

# Convert all columns to numeric, drop rows with NaN
data = data.apply(pd.to_numeric, errors='coerce')
data.dropna(inplace=True)

# Create target column 'scale_needed'
data['scale_needed'] = ((data['cpu_usage'] > 0.7) |
                        (data['memory_usage'] > 0.7) |
                        (data['disk_io_time'] > 0.7) |
                        (data['network_usage'] > 0.7)).astype(int)

# Create target column 'storage_needed_gb'
data['storage_needed_gb'] = data['disk_io_time'] * 100

# Features for training
X = data[columns_needed]

# --- Train Classification Model ---
if args.mode in ["both", "classification"]:
    print("🔧 Training Classification Model...")
    y_class = data['scale_needed']
    X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(X, y_class, test_size=0.2, random_state=42)

    clf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    clf_model.fit(X_train_c, y_train_c)

    # Evaluate
    y_pred_c = clf_model.predict(X_test_c)
    acc = accuracy_score(y_test_c, y_pred_c)
    print(f"✅ Classification Accuracy: {acc:.4f}")

    # Save model
    joblib.dump(clf_model, 'model_files/classification_model.pkl')
    print("📦 Classification model saved at model_files/classification_model.pkl")

# --- Train Regression Model ---
if args.mode in ["both", "regression"]:
    print("\n🔧 Training Regression Model...")
    y_reg = data['storage_needed_gb']
    X_train_r, X_test_r, y_train_r, y_test_r = train_test_split(X, y_reg, test_size=0.2, random_state=42)

    reg_model = RandomForestRegressor(n_estimators=100, random_state=42)
    reg_model.fit(X_train_r, y_train_r)

    # Evaluate
    y_pred_r = reg_model.predict(X_test_r)
    r2 = r2_score(y_test_r, y_pred_r)
    mse = mean_squared_error(y_test_r, y_pred_r)
    print(f"✅ Regression R² Score: {r2:.4f}")
    print(f"📉 Regression MSE: {mse:.2f}")

    # Save model
    joblib.dump(reg_model, 'model_files/regression_model.pkl')
    print("📦 Regression model saved at model_files/regression_model.pkl")
