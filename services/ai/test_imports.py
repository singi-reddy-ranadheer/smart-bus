from src.main import app
from src.core.config import settings
from src.schemas.request import ETAPredictRequest
from src.models.eta_model import ETAModel
import pandas as pd

def test_imports():
    print("FastAPI app title:", app.title)
    print("Project Name:", settings.PROJECT_NAME)
    
    request = ETAPredictRequest(
        route_id="r1",
        stop_id="s1",
        current_lat=12.9,
        current_lng=77.5,
        current_speed=30.0,
        time_of_day="08:30",
        day_of_week=2
    )
    print("Request schema works:", request.route_id)
    print("All imports successful!")

if __name__ == "__main__":
    test_imports()
