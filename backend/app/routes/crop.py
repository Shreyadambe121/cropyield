from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.ml.predict import recommend_crops
from app.ml.preprocessing import load_training_data

router = APIRouter(tags=["crops"])


@router.get("/api/crops")
def get_crops():
    data = load_training_data()
    crops = sorted(data["Crop"].unique().tolist())
    return {"crops": crops}


@router.get("/api/locations")
def get_locations():
    data = load_training_data()
    states = sorted(data["State"].unique().tolist())
    districts = sorted(data["District"].unique().tolist())
    return {"states": states, "districts": districts}


@router.post("/api/recommend-crops")
def recommend_crop_api(payload: dict, db: Session = Depends(get_db)):
    required = ["state", "district", "season", "area", "rainfall", "temperature"]
    missing = [field for field in required if field not in payload]
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing required fields: {', '.join(missing)}")

    payload = {
        "state": str(payload["state"]).strip(),
        "district": str(payload["district"]).strip(),
        "season": str(payload["season"]).strip(),
        "area": float(payload["area"]),
        "rainfall": float(payload["rainfall"]),
        "temperature": float(payload["temperature"]),
    }

    if payload["area"] <= 0:
        raise HTTPException(status_code=400, detail="Area must be greater than zero")

    data = load_training_data()
    valid_states = set(data["State"].unique())
    valid_districts = set(data["District"].unique())
    if payload["state"] not in valid_states:
        raise HTTPException(status_code=400, detail="Unknown state")
    if payload["district"] not in valid_districts:
        raise HTTPException(status_code=400, detail="Unknown district")

    recommendations = recommend_crops(payload)
    return {"recommendations": recommendations, "state": payload["state"], "district": payload["district"]}
