from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    predictions = relationship("Prediction", back_populates="user")


class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    crop = Column(String(100), nullable=False)
    season = Column(String(50), nullable=False)
    area = Column(Float, nullable=False)
    rainfall = Column(Float, nullable=False)
    temperature = Column(Float, nullable=False)
    predicted_yield = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="predictions")


class CropData(Base):
    __tablename__ = "crop_data"
    id = Column(Integer, primary_key=True, index=True)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    crop = Column(String(100), nullable=False)
    season = Column(String(50), nullable=False)
    area = Column(Float, nullable=False)
    rainfall = Column(Float, nullable=False)
    temperature = Column(Float, nullable=False)
    production = Column(Float, nullable=False)
    yield_value = Column("yield", Float, nullable=False)


class ModelMetric(Base):
    __tablename__ = "model_metrics"
    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String(100), nullable=False)
    mae = Column(Float, nullable=True)
    rmse = Column(Float, nullable=True)
    r2_score = Column(Float, nullable=True)
    accuracy = Column(Float, nullable=True)
    trained_at = Column(DateTime, default=datetime.utcnow)
