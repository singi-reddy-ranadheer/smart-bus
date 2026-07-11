from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.core.config import settings
from src.api.routes import eta, demand, health, training

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(health.router, prefix=f"{settings.API_V1_STR}/ai/health", tags=["health"])
app.include_router(eta.router, prefix=f"{settings.API_V1_STR}/ai/eta", tags=["eta"])
app.include_router(demand.router, prefix=f"{settings.API_V1_STR}/ai/demand", tags=["demand"])
app.include_router(training.router, prefix=f"{settings.API_V1_STR}/ai/train", tags=["training"])

@app.get("/")
def root():
    return {"message": "Welcome to Smart Bus AI - AI Service"}
