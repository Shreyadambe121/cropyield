import json
from datetime import datetime
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

from app.database import SessionLocal, engine, Base
from app.models import ModelMetric
from .preprocessing import load_training_data

MODEL_DIR = Path(__file__).resolve().parents[1] / "models"
MODEL_DIR.mkdir(exist_ok=True)


def make_regressor_pipeline():
    categorical_features = ["State", "District", "Crop", "Season"]
    numeric_features = ["Area", "Rainfall", "Temperature"]

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
            ("num", "passthrough", numeric_features),
        ]
    )

    model = RandomForestRegressor(n_estimators=300, random_state=42)
    return Pipeline([("preprocessor", preprocessor), ("model", model)])


def make_classifier_pipeline():
    categorical_features = ["State", "District", "Season"]
    numeric_features = ["Area", "Rainfall", "Temperature"]

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
            ("num", "passthrough", numeric_features),
        ]
    )

    model = RandomForestClassifier(n_estimators=300, random_state=42)
    return Pipeline([("preprocessor", preprocessor), ("model", model)])


def save_metrics_to_db(metrics):
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        for model_name, model_metrics in metrics.items():
            db.add(
                ModelMetric(
                    model_name=model_name,
                    mae=model_metrics.get("mae"),
                    rmse=model_metrics.get("rmse"),
                    r2_score=model_metrics.get("r2_score"),
                    accuracy=model_metrics.get("accuracy"),
                    trained_at=datetime.utcnow(),
                )
            )
        db.commit()


def train_and_save_models():
    df = load_training_data()

    feature_cols = ["State", "District", "Crop", "Season", "Area", "Rainfall", "Temperature"]
    target_col = "Yield"
    X = df[feature_cols]
    y = df[target_col]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    reg_pipeline = make_regressor_pipeline()
    reg_pipeline.fit(X_train, y_train)
    y_pred = reg_pipeline.predict(X_test)

    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    reg_path = MODEL_DIR / "yield_model.pkl"
    joblib.dump(reg_pipeline, reg_path)

    clf_X = df[["State", "District", "Season", "Area", "Rainfall", "Temperature"]]
    clf_y = df["Crop"]
    clf_X_train, clf_X_test, clf_y_train, clf_y_test = train_test_split(
        clf_X, clf_y, test_size=0.2, random_state=42
    )
    clf_pipeline = make_classifier_pipeline()
    clf_pipeline.fit(clf_X_train, clf_y_train)
    clf_pred = clf_pipeline.predict(clf_X_test)
    clf_accuracy = accuracy_score(clf_y_test, clf_pred)

    clf_path = MODEL_DIR / "crop_model.pkl"
    joblib.dump(clf_pipeline, clf_path)

    metrics = {
        "yield_regressor": {
            "mae": float(mae),
            "rmse": float(rmse),
            "r2_score": float(r2),
            "accuracy": None,
        },
        "crop_classifier": {
            "mae": None,
            "rmse": None,
            "r2_score": None,
            "accuracy": float(clf_accuracy),
        },
    }

    save_metrics_to_db(metrics)

    print(json.dumps({
        "yield_regressor": {
            "MAE": round(float(mae), 4),
            "RMSE": round(float(rmse), 4),
            "R2": round(float(r2), 4),
        },
        "crop_classifier": {
            "Accuracy": round(float(clf_accuracy), 4),
        }
    }, indent=2))


if __name__ == "__main__":
    train_and_save_models()
