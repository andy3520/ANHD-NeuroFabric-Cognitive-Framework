"""Main FastAPI application."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core import setup_logging, settings
from .routers import tasks_router

# Setup logging
setup_logging()

# Create FastAPI app
app = FastAPI(
    title="NeuroFabric Cognitive Framework API",
    description="Multi-agent cognitive framework inspired by neuroscience",
    version="0.1.0",
)

# CORS middleware
origins = settings.cors_origins.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tasks_router)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": "NeuroFabric Cognitive Framework API",
        "version": "0.1.0",
        "status": "operational",
        "docs": "/docs",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=True,
    )
