import os
from pathlib import Path
import joblib
import pandas as pd

from .preprocessing import load_training_data

MODEL_DIR = Path(__file__).resolve().parents[1] / "models"
YIELD_MODEL_PATH = MODEL_DIR / "yield_model.pkl"
CROP_MODEL_PATH = MODEL_DIR / "crop_model.pkl"


def ensure_models():
    if not YIELD_MODEL_PATH.exists() or not CROP_MODEL_PATH.exists():
        from .train_model import train_and_save_models
        train_and_save_models()


def load_model(path: Path):
    return joblib.load(path)


def predict_yield(payload):
    ensure_models()
    model = load_model(YIELD_MODEL_PATH)
    df = pd.DataFrame([payload])
    prediction = model.predict(df)[0]
    return float(prediction)


def recommend_crops(payload):
    ensure_models()
    model = load_model(CROP_MODEL_PATH)
    dataset = load_training_data()
    crop_names = sorted(dataset["Crop"].unique().tolist())
    features = [
        {
            "State": payload["state"],
            "District": payload["district"],
            "Season": payload["season"],
            "Area": payload["area"],
            "Rainfall": payload["rainfall"],
            "Temperature": payload["temperature"],
        }
    ]
    df = pd.DataFrame(features)
    probs = model.predict_proba(df)[0]
    crop_scores = list(zip(crop_names, probs))
    crop_scores.sort(key=lambda item: item[1], reverse=True)
    top_crops = crop_scores[:5]

    yield_model = load_model(YIELD_MODEL_PATH)
    recommendations = []
    for crop, probability in top_crops:
        sample = {
            "State": payload["state"],
            "District": payload["district"],
            "Crop": crop,
            "Season": payload["season"],
            "Area": payload["area"],
            "Rainfall": payload["rainfall"],
            "Temperature": payload["temperature"],
        }
        expected_yield = float(yield_model.predict(pd.DataFrame([sample]))[0])
        suit = "High" if probability >= 0.4 else "Medium" if probability >= 0.2 else "Low"
        recommendations.append({
            "crop": crop,
            "suitability": suit,
            "expected_yield": round(expected_yield, 2),
            "probability": round(float(probability), 4),
        })
    return recommendations
