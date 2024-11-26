from fastapi import APIRouter

from app.cruds import period_crud
from app.models.period_model import PeriodModel

router = APIRouter()


@router.get('', summary='全ピリオド取得API', response_model=list[PeriodModel])
async def get_all():
    periods = period_crud.get_all()
    return [PeriodModel(x) for x in periods]
