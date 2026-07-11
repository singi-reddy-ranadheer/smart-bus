from .base import BaseModel
import pandas as pd

class DemandModel(BaseModel):
    def __init__(self, version: str = "v1.0"):
        super().__init__(version)
        # Stub for future implementation
        self.model = "stub_model"

    def train(self, X: pd.DataFrame, y: pd.Series):
        pass

    def predict(self, X: pd.DataFrame):
        # Return dummy demand predictions
        return [0 for _ in range(len(X))]
