from fastapi import APIRouter
from starlette.websockets import WebSocket, WebSocketDisconnect

from app.utils import json_util
from app.ws_client import ws_client

router = APIRouter()


@router.websocket('')
async def ws_step(websocket: WebSocket):
    try:
        await ws_client.connect('step', websocket)
        while True:
            try:
                req_str = await websocket.receive_text()
                await ws_client.broadcast('step', data=json_util.loads(req_str))
            except WebSocketDisconnect:
                break
    finally:
        await ws_client.disconnect(websocket)