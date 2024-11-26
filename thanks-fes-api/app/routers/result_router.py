from fastapi import APIRouter

from app.cruds import answer_crud, panelist_crud
from app.models.result_model import ResultModel

router = APIRouter()


def fetch_panelist_results() -> list[ResultModel]:
    results = []
    rank = _correct = _elapsed_second = 0
    for _id, correct, elapsed_second in answer_crud.get_panelist_results():
        if _correct != correct or _elapsed_second != elapsed_second:
            rank += 1
            _correct, _elapsed_second = correct, elapsed_second
        result = ResultModel(
            name=panelist_crud.get_name(_id),
            correct=correct,
            elapsed_second=elapsed_second,
            rank=rank
        )
        results.append(result)
    return results


def fetch_team_results() -> list[ResultModel]:
    results = []
    rank = _correct = _elapsed_second = 0
    max_panelist_count = panelist_crud.get_max_team_panelist_count()
    for _team, correct, elapsed_second in answer_crud.get_team_results():
        if _correct != correct or _elapsed_second != elapsed_second:
            rank += 1
            _correct, _elapsed_second = correct, elapsed_second
        result = ResultModel(
            name=_team,
            correct=round(correct * max_panelist_count),
            elapsed_second=elapsed_second,
            rank=rank
        )
        results.append(result)
    return results


def fetch_period_results(period: int) -> list[ResultModel]:
    results = []
    rank = _correct = _elapsed_second = 0
    for _id, correct, elapsed_second in answer_crud.get_panelist_period_results(period):
        if _correct != correct or _elapsed_second != elapsed_second:
            rank += 1
            _correct, _elapsed_second = correct, elapsed_second
        result = ResultModel(
            name=panelist_crud.get_name(_id),
            correct=correct,
            elapsed_second=elapsed_second,
            rank=rank
        )
        results.append(result)
    return results


@router.get('/panelists/{panelist_id}', summary='個人総合結果取得API', response_model=ResultModel)
async def get_panelist_result(panelist_id: int):
    name = panelist_crud.get_name(panelist_id)
    return [x for x in fetch_panelist_results() if x.name == name][0]


@router.get('/panelists', summary='個人総合結果リスト取得API', response_model=list[ResultModel])
async def get_panelist_results():
    return fetch_panelist_results()


@router.get('/teams/{team}', summary='チーム総合結果取得API', response_model=ResultModel)
async def get_team_result(team: str):
    return [x for x in fetch_team_results() if x.name == team][0]


@router.get('/teams', summary='チーム総合結果リスト取得API', response_model=list[ResultModel])
async def get_team_results():
    return fetch_team_results()


@router.get('/panelists/{panelist_id}/periods/{period}', summary='個人ピリオド結果取得API', response_model=ResultModel)
async def get_panelist_period_result(period: int, panelist_id: int):
    name = panelist_crud.get_name(panelist_id)
    return [x for x in fetch_period_results(period) if x.name == name][0]


@router.get('/panelists/periods/{period}', summary='個人ピリオド結果リスト取得API', response_model=list[ResultModel])
async def get_panelist_periods_result(period: int):
    return fetch_period_results(period)
