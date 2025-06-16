from app.models.team_model import TeamModel
from fastapi import APIRouter

from app.cruds import team_crud

router = APIRouter()


@router.get("", summary="チーム一覧取得API", response_model=list[TeamModel])
async def get_all():
    return [TeamModel(x) for x in team_crud.get_all()]
