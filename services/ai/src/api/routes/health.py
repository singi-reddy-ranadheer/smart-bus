from fastapi import APIRouter
from src.schemas.response import BaseResponse

router = APIRouter()

@router.get("", response_model=BaseResponse[dict])
async def health_check():
    return BaseResponse(
        data={
            "status": "healthy",
            "service": "ai",
            "version": "1.0.0"
        }
    )
