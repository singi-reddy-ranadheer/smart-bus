from fastapi import APIRouter, Depends
from src.schemas.request import ETAPredictRequest
from src.schemas.response import BaseResponse, ETAPredictData
from src.api.dependencies import get_inference_pipeline, InferencePipeline
from src.core.monitoring import logger

router = APIRouter()

@router.post("/predict", response_model=BaseResponse[ETAPredictData])
async def predict_eta(
    request: ETAPredictRequest,
    pipeline: InferencePipeline = Depends(get_inference_pipeline)
):
    try:
        prediction_data = pipeline.predict_eta(request)
        return BaseResponse(data=prediction_data)
    except Exception as e:
        logger.error(f"ETA prediction failed: {str(e)}")
        return BaseResponse(
            error={
                "code": "INTERNAL_ERROR",
                "message": "Failed to predict ETA",
                "details": str(e)
            }
        )
