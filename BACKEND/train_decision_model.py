import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

print("Generating synthetic historical agricultural market data...")

# Generate 10,000 realistic scenarios
np.random.seed(42)
n_samples = 10000

# 1. Market Variables
current_price = np.random.uniform(10, 100, n_samples)
expected_price = current_price * np.random.uniform(0.7, 1.4, n_samples)
profit_margin = expected_price - current_price

# 2. Logistics & Storage
distance_km = np.random.randint(5, 150, n_samples)
storage_cost = np.random.uniform(0.5, 5.0, n_samples)
has_storage = np.random.choice([0, 1], n_samples, p=[0.3, 0.7])

# 3. Environmental & Spoilage
temp = np.random.uniform(20, 45, n_samples)
humidity = np.random.uniform(30, 95, n_samples)
# Higher temp & humidity = higher spoilage risk
spoilage_score = (temp * 0.4) + (humidity * 0.6) + np.random.normal(0, 5, n_samples)

# Initialize target
y = []

for i in range(n_samples):
    cp = current_price[i]
    ep = expected_price[i]
    pm = profit_margin[i]
    sc = storage_cost[i]
    dist = distance_km[i]
    spoil = spoilage_score[i]
    st_avail = has_storage[i]

    # Rule Engine for "True" historical decision labels
    if cp >= ep:
        y.append("sell")
    elif st_avail == 1 and pm > sc and spoil < 75:
        # High profit, manageable spoilage -> Store
        if dist > 50:
            y.append("pool") # Store but also pool transport
        else:
            y.append("store")
    elif spoil >= 75 or st_avail == 0:
        # High spoilage risk or no storage -> Process (to increase shelf life)
        y.append("process")
    elif dist > 50 and pm > 0:
        y.append("pool")
    else:
        y.append("sell") # Default fallback

X = pd.DataFrame({
    'current_price': current_price,
    'expected_price': expected_price,
    'distance_km': distance_km,
    'storage_cost': storage_cost,
    'has_storage': has_storage,
    'temp': temp,
    'humidity': humidity
})

print(f"Generated {n_samples} records.")
print("Training RandomForestClassifier...")

model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
model.fit(X, y)

accuracy = model.score(X, y)
print(f"Model Training Accuracy: {accuracy:.2f}")

joblib_path = os.path.join(os.path.dirname(__file__), "decision_model.joblib")
joblib.dump(model, joblib_path)
print(f"Saved AI Model to {joblib_path}")
