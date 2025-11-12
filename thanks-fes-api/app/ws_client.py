import asyncio
from broadcaster import Broadcast
from fastapi import WebSocket
import redis

from app.utils import json_util


class Connection:
    def __init__(self, websocket: WebSocket, channel: str, task=None):
        self.id = websocket.headers.get("sec-websocket-key")
        self.websocket = websocket
        self.channel = channel
        self.task = task


class WsClient:
    broadcaster = Broadcast(url="redis://localhost:6379")
    redis_client = redis.StrictRedis(host="localhost", port=6379, decode_responses=True)

    def __init__(self):
        self.connection_map: dict[str, Connection] = {}

    async def connect_broadcaster(self):
        await self.broadcaster.connect()

    async def disconnect_broadcaster(self):
        await self.broadcaster.disconnect()

    async def _subscribe(self, connection: Connection):
        async with self.broadcaster.subscribe(connection.channel) as subscriber:
            async for event in subscriber:
                data = dict(id=connection.id, data=json_util.loads(event.message))
                await connection.websocket.send_text(data=json_util.dumps(data))

    async def connect(self, channel: str, websocket: WebSocket):
        await websocket.accept()
        key = websocket.headers.get("sec-websocket-key")
        conn = Connection(websocket, channel)
        self.connection_map[key] = conn

        # サブスクライブをバックグラウンドで起動
        conn.task = asyncio.create_task(self._subscribe(conn))
        self.redis_client.set(f"ws:{key}", channel, ex=1)

    async def broadcast(self, channel: str, data: dict | list):
        await self.broadcaster.publish(channel=channel, message=json_util.dumps(data))

    async def disconnect(self, websocket: WebSocket):
        key = websocket.headers.get("sec-websocket-key")
        conn = self.connection_map.get(key)
        if conn and conn.task:
            conn.task.cancel()
            try:
                await conn.task
            except asyncio.CancelledError:
                pass
        self.redis_client.delete(f"ws:{key}")
        self.connection_map.pop(key, None)


ws_client = WsClient()
