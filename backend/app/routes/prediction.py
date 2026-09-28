from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.auth import get_current_user, get_current_user_optional
from app.database import get_db
from app.ml.predict import predict_yield
from app.models import Prediction, User
from app.schemas import PredictionInput

router = APIRouter(tags=["predictions"])


@router.post("/api/predict-yield")
def predict_yield_api(payload: PredictionInput, db: Session = Depends(get_db), current_user: Optional[User] = Depends(get_current_user_optional)):
    try:
        result = predict_yield({
            "State": payload.state,
            "District": payload.district,
            "Crop": payload.crop,
            "Season": payload.season,
            "Area": payload.area,
            "Rainfall": payload.rainfall,
            "Temperature": payload.temperature,
        })
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Model prediction failed. Please check your inputs or model training.") from exc

    estimated_total = result * payload.area
    record = Prediction(
        user_id=current_user.id if current_user else None,
        state=payload.state,
        district=payload.district,
        crop=payload.crop,
        season=payload.season,
        area=payload.area,
        rainfall=payload.rainfall,
        temperature=payload.temperature,
        predicted_yield=result,
        created_at=datetime.utcnow(),
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "id": record.id,
        "crop": payload.crop,
        "district": payload.district,
        "state": payload.state,
        "season": payload.season,
        "predicted_yield": round(float(result), 2),
        "estimated_total_production": round(float(estimated_total), 2),
        "unit": "tonnes/hectare",
    }


@router.post("/api/predictions")
def store_prediction(payload: PredictionInput, db: Session = Depends(get_db), current_user: Optional[User] = Depends(get_current_user_optional)):
    result = predict_yield({
        "State": payload.state,
        "District": payload.district,
        "Crop": payload.crop,
        "Season": payload.season,
        "Area": payload.area,
        "Rainfall": payload.rainfall,
        "Temperature": payload.temperature,
    })
    record = Prediction(
        user_id=current_user.id if current_user else None,
        state=payload.state,
        district=payload.district,
        crop=payload.crop,
        season=payload.season,
        area=payload.area,
        rainfall=payload.rainfall,
        temperature=payload.temperature,
        predicted_yield=result,
        created_at=datetime.utcnow(),
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"message": "Prediction stored successfully", "id": record.id}


@router.get("/api/predictions")
def get_predictions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    results = db.query(Prediction).filter(Prediction.user_id == current_user.id).order_by(Prediction.created_at.desc()).all()
    return {
        "predictions": [{
            "id": item.id,
            "state": item.state,
            "district": item.district,
            "crop": item.crop,
            "season": item.season,
            "area": item.area,
            "rainfall": item.rainfall,
            "temperature": item.temperature,
            "predicted_yield": item.predicted_yield,
            "created_at": item.created_at.isoformat() if item.created_at else None,
        } for item in results]
    }


@router.delete("/api/predictions/{prediction_id}")
def delete_prediction(prediction_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    prediction = db.query(Prediction).filter(Prediction.id == prediction_id, Prediction.user_id == current_user.id).first()
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    db.delete(prediction)
    db.commit()
    return {"message": "Prediction deleted"}
