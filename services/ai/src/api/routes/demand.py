from fastapi import APIRouter
from src.schemas.request import DemandPredictRequest
from src.schemas.response import BaseResponse
from typing import Any

router = APIRouter()

@router.post("/predict", response_model=BaseResponse[Any])
async def predict_demand(request: DemandPredictRequest):
    # Stub for future implementation
    return BaseResponse(
        data={
            "predicted_demand": 42,
            "confidence": 0.6,
            "model_version": "demand-v0.1-stub"
        }
    )
