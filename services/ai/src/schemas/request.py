from pydantic import BaseModel, Field
from typing import Optional

class ETAPredictRequest(BaseModel):
    route_id: str
    stop_id: str
    current_lat: float
    current_lng: float
    current_speed: float
    time_of_day: str  # Format: "HH:MM"
    day_of_week: int  # 0 (Monday) to 6 (Sunday)
    weather: Optional[str] = "clear"

class DemandPredictRequest(BaseModel):
    route_id: str
    date: str  # Format: "YYYY-MM-DD"
    time_slot: str  # Format: "HH:MM-HH:MM"

class ETATrainRequest(BaseModel):
    from_date: str
    to_date: str
    model_version: str
