from fastapi import APIRouter

from app.cruds import answer_crud, panelist_crud
from app.models.result_model import ResultModel
from app.utils.http_error_util import raise_http_exception

router = APIRouter()


def fetch_panelist_results(period: int = None) -> list[ResultModel]:
    results = []
    rank = _score = _elapsed_second = 0
    print(period)
    _results = (
        answer_crud.get_panelist_results()
        if period is None
        else answer_crud.get_panelist_period_results(period)
    )
    print(_results)

    for _id, score, elapsed_second in _results:
        elapsed_second = round(elapsed_second, 2)
        if _score != score or _elapsed_second != elapsed_second:
            rank += 1
            _score, _elapsed_second = score, elapsed_second
        result = ResultModel(
            name=panelist_crud.get_name(_id),
            score=score,
            elapsed_second=elapsed_second,
            rank=rank,
        )
        results.append(result)
    return results


def fetch_team_results(period: int = None) -> list[ResultModel]:
    results = []
    rank = _avg_score = 0
    _results = (
        answer_crud.get_team_results()
        if period is None
        else answer_crud.get_team_period_results(period)
    )
    for _team, score in _results:
        score = round(score)
        if _avg_score != score:
            rank += 1
            _avg_score = score
        result = ResultModel(name=_team, score=score, elapsed_second=0, rank=rank)
        results.append(result)
    return results


dummy_result = ResultModel(name="", score=0, elapsed_second=0, rank=0)


@router.get(
    "/panelists/{panelist_id}",
    summary="個人総合結果取得API",
    response_model=ResultModel,
)
async def get_panelist_result(panelist_id: int):
    panelist = panelist_crud.get(panelist_id)
    if panelist is None:
        raise_http_exception(404, "panelist not found")
    results = [x for x in fetch_panelist_results() if x.name == panelist.name]
    return results[0] if results else dummy_result


@router.get(
    "/panelists", summary="個人総合結果リスト取得API", response_model=list[ResultModel]
)
async def get_panelist_results():
    return fetch_panelist_results()


@router.get(
    "/teams/{team}", summary="チーム総合結果取得API", response_model=ResultModel
)
async def get_team_result(team: str):
    teams = panelist_crud.get_teams()
    if team not in teams:
        raise_http_exception(404, "team not found")
    results = [x for x in fetch_team_results() if x.name == team]
    return results[0] if results else dummy_result


@router.get(
    "/teams", summary="チーム総合結果リスト取得API", response_model=list[ResultModel]
)
async def get_team_results():
    return fetch_team_results()


@router.get(
    "/panelists/{panelist_id}/periods/{period}",
    summary="個人ピリオド結果取得API",
    response_model=ResultModel,
)
async def get_panelist_period_result(panelist_id: int, period: int):
    panelist = panelist_crud.get(panelist_id)
    if panelist is None:
        raise_http_exception(404, "panelist not found")
    results = [x for x in fetch_panelist_results(period) if x.name == panelist.name]
    return results[0] if results else dummy_result


@router.get(
    "/panelists/periods/{period}",
    summary="個人ピリオド結果リスト取得API",
    response_model=list[ResultModel],
)
async def get_panelist_periods_result(period: int):
    print("get_panelist_periods_result", period)
    return fetch_panelist_results(period)


@router.get(
    "/teams/{team}/periods/{period}",
    summary="チームピリオド結果取得API",
    response_model=ResultModel,
)
async def get_team_period_result(team: str, period: int):
    teams = panelist_crud.get_teams()
    if team not in teams:
        raise_http_exception(404, "team not found")
    results = [x for x in fetch_team_results(period) if x.name == team]
    return results[0] if results else dummy_result


@router.get(
    "/teams/periods/{period}",
    summary="チームピリオド結果リスト取得API",
    response_model=list[ResultModel],
)
async def get_team_periods_result(period: int):
    return fetch_team_results(period)
