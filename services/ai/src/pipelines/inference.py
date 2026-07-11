from src.models.eta_model import ETAModel
from src.data.preprocessor import Preprocessor
from src.schemas.request import ETAPredictRequest
from src.schemas.response import ETAPredictData
import pandas as pd

class InferencePipeline:
    def __init__(self, model_version: str = "v1.0"):
        self.preprocessor = Preprocessor()
        self.model = ETAModel(version=model_version)
        self.model_loaded = self.model.load()

    def predict_eta(self, request: ETAPredictRequest) -> ETAPredictData:
        if not self.model_loaded:
            # For demonstration, instantiate a dummy output if model not found
            # In production, we'd raise an exception or fetch the latest model
            return ETAPredictData(
                predicted_eta_minutes=15.0,
                confidence=0.5,
                model_version="fallback"
            )

        # Convert request to DataFrame for preprocessing
        df = pd.DataFrame([request.model_dump()])
        
        # Preprocess
        X = self.preprocessor.preprocess_eta_features(df)
        
        # Predict
        prediction = self.model.predict(X)[0]
        
        # Prepare response
        # Using a dummy confidence calculation based on speed
        confidence = 0.9 if request.current_speed > 10 else 0.7
        
        return ETAPredictData(
            predicted_eta_minutes=round(prediction, 1),
            confidence=confidence,
            model_version=self.model.version
        )
