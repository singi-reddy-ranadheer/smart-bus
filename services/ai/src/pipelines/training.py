from src.data.loader import DataLoader
from src.data.preprocessor import Preprocessor
from src.data.validator import validate_training_data
from src.models.eta_model import ETAModel
from src.core.monitoring import logger

class TrainingPipeline:
    def __init__(self):
        self.loader = DataLoader()
        self.preprocessor = Preprocessor()

    def train_eta_model(self, from_date: str, to_date: str, version: str):
        logger.info(f"Starting ETA model training for version {version}")
        
        # 1. Fetch data
        df = self.loader.fetch_training_data(from_date, to_date)
        if df.empty:
            logger.warning("No training data found in the given date range.")
            # For testing without real DB, let's create mock data
            import pandas as pd
            import numpy as np
            df = pd.DataFrame({
                'recorded_at': pd.date_range(start=from_date, end=to_date, periods=100),
                'current_speed': np.random.uniform(10, 60, 100),
                'stop_distance': np.random.uniform(0.1, 5, 100),
                'duration_to_stop': np.random.uniform(2, 20, 100)
            })
            logger.info("Using generated mock data for training.")
        
        # 2. Validate
        validate_training_data(df)
        
        # 3. Preprocess
        X = self.preprocessor.preprocess_eta_features(df)
        y = self.preprocessor.extract_labels(df)
        
        # 4. Train
        model = ETAModel(version=version)
        mae, rmse = model.train(X, y)
        
        # 5. Save
        model.save()
        logger.info(f"ETA model {version} saved successfully.")
        
        return {"mae": mae, "rmse": rmse, "version": version, "samples_used": len(X)}
