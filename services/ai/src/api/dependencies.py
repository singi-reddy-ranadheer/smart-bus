from src.pipelines.inference import InferencePipeline
from src.pipelines.training import TrainingPipeline

# Global instances for dependency injection
# In a more complex app, we might use FastAPI's Depends to inject these
# but since they are stateless wrappers around models/data, globals are fine for now.

inference_pipeline = InferencePipeline(model_version="v1.0")
training_pipeline = TrainingPipeline()

def get_inference_pipeline() -> InferencePipeline:
    return inference_pipeline

def get_training_pipeline() -> TrainingPipeline:
    return training_pipeline
