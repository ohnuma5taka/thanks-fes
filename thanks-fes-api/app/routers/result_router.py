from fastapi import APIRouter
from pydantic.v1.parse import load_file

from app.cruds import question_crud, answer_crud, panelist_crud
from app.models.result_model import ResultModel

router = APIRouter()


@router.get('/panelists/{panelist_id}', summary='個人総合結果取得API', response_model=ResultModel)
async def get_panelist_result(panelist_id: int):
    for i, (_id, correct, elapsed_second) in enumerate(answer_crud.get_panelist_results()):
        if _id != panelist_id: continue
        return ResultModel(
            name=panelist_crud.get_name(_id),
            correct=correct,
            elapsed_second=elapsed_second,
            rank=i + 1
        )


@router.get('/panelists', summary='個人総合結果リスト取得API', response_model=list[ResultModel])
async def get_panelist_results():
    return [ResultModel(
        name=panelist_crud.get_name(_id),
        correct=correct,
        elapsed_second=elapsed_second,
        rank=i + 1
    ) for i, (_id, correct, elapsed_second) in enumerate(answer_crud.get_panelist_results())]


@router.get('/teams/{team}', summary='チーム総合結果取得API', response_model=ResultModel)
async def get_team_result(team: str):
    for i, (_team, correct, elapsed_second) in enumerate(answer_crud.get_team_results()):
        if _team != team: continue
        return ResultModel(
            name=team,
            correct=correct,
            elapsed_second=elapsed_second,
            rank=i + 1
        )


@router.get('/teams', summary='チーム総合結果リスト取得API', response_model=list[ResultModel])
async def get_team_results():
    return [
        ResultModel(
            name=_team,
            correct=correct,
            elapsed_second=elapsed_second,
            rank=i + 1
        ) for i, (_team, correct, elapsed_second) in enumerate(answer_crud.get_team_results())
    ]


@router.get('/panelists/{panelist_id}/periods/{period}', summary='個人ピリオド結果取得API', response_model=ResultModel)
async def get_panelist_period_result(period: int, panelist_id: int):
    last_question = question_crud.get_period_list(period)[-1]
    print(answer_crud.get_panelist_period_results(period))
    for i, (_id, correct) in enumerate(answer_crud.get_panelist_period_results(period)):
        if _id != panelist_id: continue
        last_answer = answer_crud.get_panelist_one(last_question.id, panelist_id)
        return ResultModel(
            name=panelist_crud.get_name(_id),
            correct=correct,
            elapsed_second=last_answer.elapsed_second,
            rank=i + 1
        )


@router.get('/panelists/periods/{period}', summary='個人ピリオド結果リスト取得API', response_model=list[ResultModel])
async def get_panelist_periods_result(period: int):
    last_question = question_crud.get_period_list(period)[-1]
    return [ResultModel(
            name=panelist_crud.get_name(_id),
            correct=correct,
            elapsed_second=answer_crud.get_panelist_one(last_question.id, _id).elapsed_second,
            rank=i + 1
        ) for i, (_id, correct) in enumerate(answer_crud.get_panelist_period_results(period))
    ]
