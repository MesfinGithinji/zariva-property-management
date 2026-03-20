from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Zariva Property Management API",
    description="Modern property management system for landlords, tenants, and administrators",
    version="0.1.0",
)

# CORS middleware - allow frontend to make requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Welcome to Zariva Property Management API",
        "version": "0.1.0",
        "status": "active",
        "docs": "/docs"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

# Import routers here when ready
# from app.routers import auth, properties, tenants, landlords, maintenance
# app.include_router(auth.router)
# app.include_router(properties.router)
# app.include_router(tenants.router)
# app.include_router(landlords.router)
# app.include_router(maintenance.router)
