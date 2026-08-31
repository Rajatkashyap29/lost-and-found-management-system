from fastapi import FastAPI ,APIRouter
from fastapi.middleware.cors import CORSMiddleware

from .config.database import Base, engine
from .router import user_routes,item_routes,claim_routes,admin_routes
from .models.item_model import Category, Item
from .models.user_model import User
from .models.claim_model import Claim

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Lost & Found Management System",
    version="1.0.0",
    description="A FastAPI backend for managing lost and found items."
)
app.include_router(user_routes.router)
app.include_router(item_routes.router)
app.include_router(claim_routes.router)
app.include_router(admin_routes.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Home"])
def welcome():
    return {
        "success": True,
        "message": "Welcome to the Lost & Found Management System"
    }


