import pandas as pd
from sklearn.ensemble import IsolationForest
import re

def extract_features(log_lines):
    """
    Turn log lines into basic numeric features.
    You can customize this more for better accuracy.
    """
    features = []
    for line in log_lines:
        features.append({
            "length": len(line),
            "num_digits": len(re.findall(r"\d", line)),
            "num_uppercase": sum(1 for c in line if c.isupper()),
            "num_special": len(re.findall(r"[\[\]\-{}():;.,!?]", line))
        })
    return pd.DataFrame(features)


def detect_anomalies(log_path):
    with open(log_path, "r") as file:
        log_lines = file.readlines()

    if not log_lines:
        return []

    df = extract_features(log_lines)
    model = IsolationForest(contamination=0.1, random_state=42)
    df['anomaly'] = model.fit_predict(df)

    # Return lines predicted as anomalies (-1)
    suspicious_lines = [log_lines[i] for i in df.index if df.loc[i, 'anomaly'] == -1]
    return suspicious_lines