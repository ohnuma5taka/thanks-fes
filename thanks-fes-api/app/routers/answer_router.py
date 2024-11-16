from fastapi import APIRouter
from app.cruds import answer_crud, panelist_crud, question_crud, option_crud
from app.db.models.answer import Answer
from app.models.answer_model import PostAnswerModel, AnswerModel, PostTeamAnswerModel, GetAnswerCountsModel, \
    TeamAnswerModel

router = APIRouter()


@router.get('', summary='解答リスト取得API', response_model=list[AnswerModel])
async def get_all():
    answers = answer_crud.get_all()
    return [AnswerModel(**x.dict()) for x in answers]


@router.get('/count', summary='解答数リスト取得API', response_model=dict[str, int])
async def get_counts(question_id: int):
    options = option_crud.get_question_list(question_id)
    return {
        str(i+1): answer_crud.get_question_count(question_id, answer=str(i+1))
        for i in range(len(options))
    }


@router.get('/correct', summary='正解数取得API', response_model=int)
async def get_counts(question_id: int, panelist_id: int):
    return answer_crud.get_correct(question_id, panelist_id)


@router.post('/periods/{period}/dummy', summary='ピリオドダミー解答API', response_model=None)
async def create_period_dummy(period: int):
    panelists = panelist_crud.get_all()
    question = question_crud.get_period_list(period)[-1]
    answers = [Answer(
        panelist_id=panelist.id,
        question_id=question.id,
        answer='',
        correct=0,
        elapsed_second=question.thinking_second
    ) for panelist in panelists if answer_crud.get_panelist_one(question.id, panelist.id) is None]
    answer_crud.bulk_save(answers)


@router.post('/teams', summary='チーム解答API', response_model=None)
async def create_teams(body: PostTeamAnswerModel):
    panelists = panelist_crud.get_all()
    correct_map = {x.team: x.correct for x in body.team_answers}
    answers = [Answer(
        panelist_id=panelist.id,
        question_id=body.question_id,
        answer='',
        correct=correct_map[panelist.team],
        elapsed_second=0
    ) for panelist in panelists]
    answer_crud.bulk_save(answers)


@router.get('/teams', summary='チーム解答リスト取得API', response_model=list[TeamAnswerModel])
async def get_team_answers(question_id: int):
    return [TeamAnswerModel(
        team=team,
        correct=round(correct, 0),
    ) for team, correct in answer_crud.get_team_answer_list(question_id)]


@router.post('/new', summary='解答API', response_model=None)
async def create(body: PostAnswerModel):
    question = question_crud.get(body.question_id)
    correct = int(body.answer == question.answer) if question.answer else 0
    answer = Answer(
        panelist_id=body.panelist_id,
        question_id=body.question_id,
        answer=body.answer,
        correct=correct,
        elapsed_second=body.elapsed_second,
    )
    answer_crud.save(answer)


@router.delete('', summary='解答リスト削除API', response_model=None)
async def delete_all():
    answer_crud.delete_all()