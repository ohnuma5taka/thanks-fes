from fastapi import APIRouter
from app.cruds import answer_crud, panelist_crud, question_crud, option_crud
from app.db.models.answer import Answer
from app.models.answer_model import PostAnswerModel, AnswerModel, PostTeamAnswerModel, TeamScoreModel

router = APIRouter()

def create_answer(
panelist_id: int,
question_id: str,
        answer: str = '', correct: int = 0, score: int = 0, elapsed_second: float = 0):
    _answer = answer_crud.get(panelist_id, question_id)
    if _answer is None:
        _answer = Answer(
            panelist_id=panelist_id,
            question_id=question_id,
            answer=answer,
            correct=correct,
            score=score,
            elapsed_second=elapsed_second
        )
    else:
        _answer.answer = answer
        _answer.correct = correct
        _answer.score = score
        _answer.elapsed_second = elapsed_second
    return _answer



@router.get('', summary='解答リスト取得API', response_model=list[AnswerModel])
async def get_all():
    answers = answer_crud.get_all()
    return [AnswerModel(**x.dict()) for x in answers]


@router.get('/count', summary='解答数リスト取得API', response_model=dict[str, int])
async def get_counts(question_id: str):
    options = option_crud.get_question_list(question_id)
    return {
        option.value: answer_crud.get_question_count(question_id, value=option.value)
        for option in options
    }


@router.get('/score', summary='スコア取得API', response_model=int)
async def get_counts(question_id: str, panelist_id: int):
    return answer_crud.get_score(question_id, panelist_id)


@router.post('/questions/{question_id}/dummy', summary='無解答者用ダミー解答API', response_model=None)
async def create_question_dummy(question_id: str):
    question = question_crud.get(question_id)
    answers = [create_answer(
        panelist_id=panelist.id,
        question_id=question_id,
        answer='',
        correct=0,
        score=0,
        elapsed_second=question.thinking_second
    ) for panelist in panelist_crud.get_unanswered_list(question_id)]
    answer_crud.bulk_save(answers)


@router.post('/teams', summary='チーム解答API', response_model=None)
async def create_teams(body: PostTeamAnswerModel):
    question = question_crud.get(body.question_id)
    panelists = panelist_crud.get_all()
    correct_map = {x.team: x.correct for x in body.team_answers}
    answers = [create_answer(
        panelist_id=panelist.id,
        question_id=body.question_id,
        answer='',
        correct=correct_map[panelist.team],
        score=correct_map[panelist.team] * question.point,
        elapsed_second=0
    ) for panelist in panelists]
    answer_crud.bulk_save(answers)


@router.get('/teams', summary='チーム解答リスト取得API', response_model=list[TeamScoreModel])
async def get_team_answers(question_id: str):
    return [TeamScoreModel(
        team=team,
        correct=round(avg_correct),
        score=round(avg_score),
    ) for team, avg_correct, avg_score in answer_crud.get_team_answer_list(question_id)]


@router.post('/new', summary='解答API', response_model=None)
async def create(body: PostAnswerModel):
    question = question_crud.get(body.question_id)
    correct = int(body.answer == question.answer) if question.answer else 0
    answer = create_answer(
        panelist_id=body.panelist_id,
        question_id=body.question_id,
        answer=body.answer,
        correct=correct,
        score=correct * question.point,
        elapsed_second=body.elapsed_second,
    )
    answer_crud.save(answer)


@router.delete('/questions/{question_id}', summary='問題解答リスト削除API', response_model=None)
async def delete_question_answer(question_id: str):
    answer_crud.delete_question_list(question_id)


@router.delete('', summary='解答リスト削除API', response_model=None)
async def delete_all():
    answer_crud.delete_all()