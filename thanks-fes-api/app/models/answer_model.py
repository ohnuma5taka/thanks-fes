from typing import Optional

from pydantic import BaseModel, ConfigDict


class AnswerModel(BaseModel):
    id: Optional[int] = None
    panelist_id: Optional[int] = None
    question_id: Optional[int] = None
    answer: Optional[str] = None
    correct: Optional[int] = None
    score: Optional[int] = None
    elapsed_second: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)


class PostAnswerModel(BaseModel):
    panelist_id: Optional[int] = None
    question_id: Optional[int] = None
    answer: Optional[str] = None
    elapsed_second: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)


class GetAnswerCountsModel(BaseModel):
    question_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


class TeamAnswerModel(BaseModel):
    team: Optional[str] = None
    correct: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


class PostTeamAnswerModel(BaseModel):
    question_id: Optional[int] = None
    team_answers: Optional[list[TeamAnswerModel]] = None

    model_config = ConfigDict(from_attributes=True)


class TeamScoreModel(BaseModel):
    team: Optional[str] = None
    correct: Optional[int] = None
    score: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)