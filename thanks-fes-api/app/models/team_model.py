from typing import Optional

from pydantic import BaseModel, ConfigDict

class TeamModel(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
