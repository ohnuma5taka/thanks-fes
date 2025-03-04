from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.cruds import question_crud
from app.db.models.period import Period
from app.models.question_model import QuestionModel


class PeriodModel(BaseModel):
    number: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    read_text: Optional[str] = None
    panelist_type: Optional[str] = None
    award_count: Optional[int] = None
    questions: Optional[list[QuestionModel]] = None

    def __init__(self, period: Period):
        super().__init__()
        self.number = period.number
        self.title = period.title
        self.description = period.description
        self.read_text = period.read_text
        self.panelist_type = period.panelist_type
        self.award_count = period.award_count
        self.questions = [
            QuestionModel(x) for x in question_crud.get_period_list(period.number)
        ]

    model_config = ConfigDict(from_attributes=True)
