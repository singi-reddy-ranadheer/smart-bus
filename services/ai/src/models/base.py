from abc import ABC, abstractmethod
import pandas as pd
import joblib
import os
from src.core.config import settings

class BaseModel(ABC):
    def __init__(self, version: str):
        self.version = version
        self.model = None

    @abstractmethod
    def train(self, X: pd.DataFrame, y: pd.Series):
        pass

    @abstractmethod
    def predict(self, X: pd.DataFrame):
        pass
        
    def get_model_path(self):
        os.makedirs(settings.MODEL_DIR, exist_ok=True)
        return os.path.join(settings.MODEL_DIR, f"{self.__class__.__name__}_{self.version}.joblib")

    def save(self):
        if self.model:
            joblib.dump(self.model, self.get_model_path())
            
    def load(self):
        path = self.get_model_path()
        if os.path.exists(path):
            self.model = joblib.load(path)
            return True
        return False
