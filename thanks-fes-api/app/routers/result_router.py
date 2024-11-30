from fastapi import APIRouter

from app.cruds import answer_crud, panelist_crud
from app.models.result_model import ResultModel

router = APIRouter()


def fetch_panelist_results(period: int = None) -> list[ResultModel]:
    results = []
    rank = _total_score = _elapsed_second = 0
    _results = answer_crud.get_panelist_results() if period is None \
            else answer_crud.get_panelist_period_results(period)
    for _id, total_score, elapsed_second in _results:
        if _total_score != total_score or _elapsed_second != elapsed_second:
            rank += 1
            _total_score, _elapsed_second = total_score, elapsed_second
        result = ResultModel(
            name=panelist_crud.get_name(_id),
            score=total_score,
            elapsed_second=elapsed_second,
            rank=rank
        )
        results.append(result)
    return results


def fetch_team_results(period: int = None) -> list[ResultModel]:
    results = []
    rank = _avg_score = 0
    max_panelist_count = panelist_crud.get_max_team_panelist_count()
    for _team, score in answer_crud.get_team_results(period, max_panelist_count):
        score = round(score)
        if _avg_score != score:
            rank += 1
            _avg_score = score
        result = ResultModel(
            name=_team,
            score=score,
            elapsed_second=0,
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
    return [x for x in fetch_panelist_results(period) if x.name == name][0]


@router.get('/panelists/periods/{period}', summary='個人ピリオド結果リスト取得API', response_model=list[ResultModel])
async def get_panelist_periods_result(period: int):
    return fetch_panelist_results(period)


@router.get('/teams/{team}/periods/{period}', summary='チームピリオド結果取得API', response_model=ResultModel)
async def get_team_period_result(team: str, period: int):
    return [x for x in fetch_team_results(period) if x.name == team][0]


@router.get('/teams/periods/{period}', summary='チームピリオド結果リスト取得API', response_model=list[ResultModel])
async def get_team_periods_result(period: int):
    return fetch_team_results(period)
