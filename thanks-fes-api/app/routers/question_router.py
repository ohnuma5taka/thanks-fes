from fastapi import APIRouter

from app.cruds import question_crud, answer_crud
from app.models.question_model import QuestionModel, PutQuestionAnswerRequest

router = APIRouter()


@router.get('', summary='全問題取得API', response_model=list[QuestionModel])
async def get_all():
    questions = question_crud.get_all()
    return [QuestionModel(x) for x in questions]


@router.get('/{_id}/answer', summary='解答取得API', response_model=str)
async def get_question_answer(_id: int):
    question = question_crud.get(_id)
    return question.answer


@router.put('/{_id}/answer', summary='解答変更API', response_model=None)
async def put_question_answer(_id: int, body: PutQuestionAnswerRequest):
    point = question_crud.get_point(_id)
    question = question_crud.get(_id)
    question.answer = body.answer
    question_crud.save(question)
    answers = answer_crud.get_question_list(_id)
    for answer in answers:
        answer.score = int(answer.answer == body.answer) * point
    answer_crud.bulk_save(answers)
