from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
import pandas as pd
import numpy as np
from .base import BaseModel
from src.core.monitoring import logger

class ETAModel(BaseModel):
    def __init__(self, version: str = "v1.0"):
        super().__init__(version)
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)

    def train(self, X: pd.DataFrame, y: pd.Series):
        logger.info(f"Training ETAModel {self.version} with {len(X)} samples")
        self.model.fit(X, y)
        
        predictions = self.predict(X)
        mae = mean_absolute_error(y, predictions)
        rmse = np.sqrt(mean_squared_error(y, predictions))
        
        logger.info(f"ETAModel training complete. MAE: {mae:.2f}, RMSE: {rmse:.2f}")
        return mae, rmse

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        if not self.model:
            raise ValueError("Model is not loaded or trained")
        return self.model.predict(X)
