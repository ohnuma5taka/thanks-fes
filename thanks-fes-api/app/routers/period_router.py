from fastapi import APIRouter

from app.cruds import period_crud
from app.models.period_model import PeriodModel

router = APIRouter()


@router.get("/{number}", summary="特定ピリオド取得API", response_model=PeriodModel)
async def get_opening_period(number: int):
    return PeriodModel(period_crud.get(number))


@router.get("", summary="全ピリオド取得API", response_model=list[PeriodModel])
async def get_all():
    return [PeriodModel(x) for x in period_crud.get_all()]
