from fastapi import APIRouter
from starlette.websockets import WebSocket, WebSocketDisconnect

from app.cruds import panelist_crud
from app.db.models.panelist import Panelist
from app.models.panelist_model import PanelistModel, PostPanelistRequest, PanelistRegisteredCountModel
from app.utils import json_util
from app.utils.http_error_util import raise_http_exception
from app.ws_client import ws_client

router = APIRouter()


@router.get('', summary='参加者リスト取得API', response_model=list[PanelistModel])
async def get_all():
    return [PanelistModel(**x.dict()) for x in panelist_crud.get_all()]


@router.get('/teams', summary='チームリスト取得API', response_model=list[str])
async def get_teams():
    return panelist_crud.get_teams()


@router.post('/new', summary='参加者登録API', response_model=PanelistModel)
async def post_panelist(body: PostPanelistRequest):
    panelists = panelist_crud.get_all()
    if body.name in [x.name for x in panelists]:
        raise_http_exception(409, '既に同じ名前が使用されています。違う名前を設定して下さい。')
    panelist = Panelist(
        name=body.name,
        team=body.team
    )
    panelist = panelist_crud.save(panelist)
    panelists = panelist_crud.get_all()
    data = [dict(
            team=team,
            count=len([x for x in panelists if x.team == team])
        ) for team in panelist_crud.get_teams()]
    await ws_client.broadcast('panelist-registered-count', data=data)
    return PanelistModel(**panelist.dict())


@router.get('/registered-count', summary='解答者登録数取得API', response_model=list[PanelistRegisteredCountModel])
async def get_registered_count():
    panelists = panelist_crud.get_all()
    return [PanelistRegisteredCountModel(
        team=team,
        count=len([x for x in panelists if x.team == team])
    ) for team in panelist_crud.get_teams()]


@router.websocket('/registered-count')
async def ws_registered_count(websocket: WebSocket):
    try:
        await ws_client.connect('panelist-registered-count', websocket)
        while True:
            try:
                req_str = await websocket.receive_text()
                await ws_client.broadcast('panelist-registered-count', data=json_util.loads(req_str))
            except WebSocketDisconnect:
                break
    finally:
        await ws_client.disconnect(websocket)