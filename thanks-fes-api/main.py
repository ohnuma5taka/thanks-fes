from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request

from seed import seed
from app.api import api_router
from app.config import env
from app.cruds import question_crud
from app.db.session import Session
from app.models.health_model import HealthModel
from app.ws_client import ws_client


@asynccontextmanager
async def websocket_lifespan(app: FastAPI):
    await ws_client.connect_broadcaster()
    yield
    await ws_client.disconnect_broadcaster()


app_version = "1.0"

app = FastAPI(title="感謝祭API", version=app_version, lifespan=websocket_lifespan)

app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=env.allowed_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def handler(request: Request, exc: RequestValidationError):
    print(exc)


@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    request.state.db = Session()
    response = await call_next(request)
    request.state.db.close()
    return response


@app.get("/health", summary="ヘルスチェックAPI", response_model=HealthModel)
async def health_check():
    return HealthModel(
        status="ok" if len(question_crud.get_all()) > 0 else "No question saved",
        version=app_version,
    )


@app.post("/init-db", summary="DB初期化API", response_model=None)
async def init_db():
    seed(mode="dev")


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        workers=1,
        host="0.0.0.0",
        port=8888,
        ws_ping_interval=25,
        reload=True,
    )
