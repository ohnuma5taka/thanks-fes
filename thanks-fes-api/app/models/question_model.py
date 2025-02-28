from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.cruds import option_crud
from app.db.models.question import Question
from app.models.option_model import OptionModel


class QuestionModel(BaseModel):
    id: Optional[int] = None
    period: Optional[int] = None
    index: Optional[int] = None
    question_format: Optional[str] = None
    option_format: Optional[str] = None
    text: Optional[str] = None
    read_text: Optional[str] = None
    second: Optional[int] = None
    answer: Optional[str] = None
    point: Optional[int] = None
    options: Optional[list[OptionModel]] = None

    def __init__(self, question: Question):
        super().__init__()
        self.id = question.id
        self.period = question.period
        self.index = question.idx
        self.question_format = question.question_format
        self.option_format = question.option_format
        self.text = question.text
        self.read_text = question.read_text
        self.second = question.thinking_second
        self.answer = question.answer
        self.point = question.point
        self.options = [
            OptionModel(
                value=x.value,
                image_origin_x=x.image_origin_x,
                image_origin_y=x.image_origin_y,
                image_scale=x.image_scale,
            )
            for x in option_crud.get_question_list(question.id)
        ]

    model_config = ConfigDict(from_attributes=True)


class PutQuestionAnswerRequest(BaseModel):
    answer: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
