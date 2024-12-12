import asyncio
from broadcaster import Broadcast
from fastapi import WebSocket
import redis

from app.utils import json_util


class Connection:
    def __init__(self, websocket: WebSocket, channel: str, task=None):
        self.id = websocket.headers.get('sec-websocket-key')
        self.websocket = websocket
        self.channel = channel
        self.task = task


class WsClient:
    broadcaster = Broadcast(url='redis://localhost:6379')
    redis_client = redis.StrictRedis(host='localhost', port=6379, decode_responses=True)

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
        key = websocket.headers.get('sec-websocket-key')
        self.connection_map[key] = Connection(websocket, channel)
        subscription = self._subscribe(self.connection_map[key])
        subscribe_n_listen_task = asyncio.create_task(subscription)
        self.connection_map[key].task = subscribe_n_listen_task
        self.redis_client.set(f"ws:{key}", channel, ex=60 * 60 * 12)
        wait_for_subscribe_task = asyncio.create_task(asyncio.sleep(1))
        await asyncio.wait(
            [subscribe_n_listen_task, wait_for_subscribe_task],
            return_when=asyncio.FIRST_COMPLETED,
        )

    async def broadcast(self, channel: str, data: dict | list):
        await self.broadcaster.publish(channel=channel, message=json_util.dumps(data))

    async def disconnect(self, websocket: WebSocket):
        key = websocket.headers.get('sec-websocket-key')
        self.connection_map[key].task.cancel()
        self.redis_client.delete(f"ws:{key}")
        del self.connection_map[key]


ws_client = WsClient()
