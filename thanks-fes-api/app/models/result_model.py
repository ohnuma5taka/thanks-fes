from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.db.models.answer import Answer


class ResultModel(BaseModel):
    name: Optional[str] = None
    score: Optional[int] = None
    elapsed_second: Optional[float] = None
    rank: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)
