from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import CropData, Prediction, ModelMetric

router = APIRouter(tags=["analytics"])


@router.get("/api/analytics")
def analytics(db: Session = Depends(get_db)):
    crop_wise = db.query(CropData.crop, func.avg(CropData.yield_value).label("average_yield")).group_by(CropData.crop).all()
    district_wise = db.query(CropData.district, func.avg(CropData.yield_value).label("average_yield")).group_by(CropData.district).all()
    seasonal = db.query(CropData.season, func.avg(CropData.yield_value).label("average_yield")).group_by(CropData.season).all()
    rainfall_vs_yield = db.query(CropData.rainfall, CropData.yield_value).all()
    temp_vs_yield = db.query(CropData.temperature, CropData.yield_value).all()
    historical_vs_predicted = db.query(Prediction.crop, Prediction.predicted_yield, Prediction.created_at).all()

    return {
        "cropWise": [{"crop": item[0], "averageYield": round(float(item[1]), 2)} for item in crop_wise],
        "districtWise": [{"district": item[0], "averageYield": round(float(item[1]), 2)} for item in district_wise],
        "seasonal": [{"season": item[0], "averageYield": round(float(item[1]), 2)} for item in seasonal],
        "rainfallVsYield": [{"rainfall": float(item[0]), "yield": float(item[1])} for item in rainfall_vs_yield],
        "temperatureVsYield": [{"temperature": float(item[0]), "yield": float(item[1])} for item in temp_vs_yield],
        "historicalVsPredicted": [{"crop": item[0], "predictedYield": float(item[1]), "date": item[2].isoformat() if item[2] else None} for item in historical_vs_predicted],
    }


@router.get("/api/model-metrics")
def model_metrics(db: Session = Depends(get_db)):
    records = db.query(ModelMetric).order_by(ModelMetric.trained_at.desc()).all()
    return {"metrics": [{
        "model_name": record.model_name,
        "mae": record.mae,
        "rmse": record.rmse,
        "r2_score": record.r2_score,
        "accuracy": record.accuracy,
        "trained_at": record.trained_at.isoformat() if record.trained_at else None,
    } for record in records]}
