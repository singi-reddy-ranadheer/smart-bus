from fastapi import APIRouter, Depends
from src.schemas.request import ETATrainRequest
from src.schemas.response import BaseResponse
from src.api.dependencies import get_training_pipeline, TrainingPipeline
from src.core.monitoring import logger

router = APIRouter()

@router.post("/eta", response_model=BaseResponse[dict])
async def train_eta(
    request: ETATrainRequest,
    pipeline: TrainingPipeline = Depends(get_training_pipeline)
):
    try:
        result = pipeline.train_eta_model(
            from_date=request.from_date,
            to_date=request.to_date,
            version=request.model_version
        )
        return BaseResponse(data=result)
    except Exception as e:
        logger.error(f"ETA training failed: {str(e)}")
        return BaseResponse(
            error={
                "code": "INTERNAL_ERROR",
                "message": "Failed to train ETA model",
                "details": str(e)
            }
        )
