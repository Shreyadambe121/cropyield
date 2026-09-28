from pathlib import Path
import pandas as pd
import numpy as np

ROOT_DIR = Path(__file__).resolve().parents[3]
DATA_PATH = ROOT_DIR / "data" / "crop_yield.csv"


def load_training_data():
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Training dataset not found at {DATA_PATH}. Please place crop_yield.csv in the project /data directory.")
    df = pd.read_csv(DATA_PATH)
    df.columns = [col.strip() for col in df.columns]
    if "Yield" not in df.columns and "Production" in df.columns and "Area" in df.columns:
        df["Yield"] = df["Production"] / df["Area"].replace(0, np.nan)
    for col in ["State", "District", "Crop", "Season"]:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip()
    df["Area"] = pd.to_numeric(df["Area"], errors="coerce")
    df["Rainfall"] = pd.to_numeric(df["Rainfall"], errors="coerce")
    df["Temperature"] = pd.to_numeric(df["Temperature"], errors="coerce")
    df["Yield"] = pd.to_numeric(df["Yield"], errors="coerce")
    df = df.dropna(subset=["State", "District", "Crop", "Season", "Area", "Rainfall", "Temperature", "Yield"])
    df = df[df["Area"] > 0]
    return df
