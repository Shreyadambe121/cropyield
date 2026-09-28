from typing import Optional, List
from pydantic import BaseModel, Field, EmailStr


class UserRegister(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)


class PredictionInput(BaseModel):
    state: str
    district: str
    crop: str
    season: str
    area: float = Field(..., gt=0)
    rainfall: float = Field(..., ge=0)
    temperature: float = Field(..., ge=-50)


class CropRecommendationInput(BaseModel):
    state: str
    district: str
    season: str
    area: float = Field(..., gt=0)
    rainfall: float = Field(..., ge=0)
    temperature: float = Field(..., ge=-50)


class PredictionRecord(BaseModel):
    id: Optional[int] = None
    state: str
    district: str
    crop: str
    season: str
    area: float
    rainfall: float
    temperature: float
    predicted_yield: float
    created_at: Optional[str] = None
    user_id: Optional[int] = None


class CropRecommendationResult(BaseModel):
    crop: str
    suitability: str
    expected_yield: float
    probability: float
