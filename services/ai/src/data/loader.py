import pandas as pd
from supabase import create_client, Client
from src.core.config import settings
from src.core.monitoring import logger

class DataLoader:
    def __init__(self):
        if settings.SUPABASE_URL and settings.SUPABASE_KEY:
            self.supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        else:
            self.supabase = None
            logger.warning("Supabase credentials not provided. DataLoader will not work.")

    def fetch_training_data(self, from_date: str, to_date: str) -> pd.DataFrame:
        if not self.supabase:
            return pd.DataFrame()
        
        # Example query fetching from trip_events
        response = (
            self.supabase.table("trip_events")
            .select("*")
            .gte("recorded_at", from_date)
            .lte("recorded_at", to_date)
            .execute()
        )
        
        if response.data:
            return pd.DataFrame(response.data)
        return pd.DataFrame()

    def save_prediction(self, prediction_data: dict):
        if not self.supabase:
            return None
        
        response = (
            self.supabase.table("predictions")
            .insert(prediction_data)
            .execute()
        )
        return response.data
