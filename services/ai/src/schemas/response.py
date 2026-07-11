from pydantic import BaseModel
from typing import Any, Generic, TypeVar, Optional

T = TypeVar('T')

class ETAPredictData(BaseModel):
    predicted_eta_minutes: float
    confidence: float
    model_version: str

class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[Any] = None

class BaseResponse(BaseModel, Generic[T]):
    data: Optional[T] = None
    error: Optional[ErrorDetail] = None
