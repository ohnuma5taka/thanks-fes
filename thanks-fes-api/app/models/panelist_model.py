from typing import Optional

from pydantic import BaseModel, ConfigDict


class PanelistModel(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None
    team: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class PanelistTeamModel(BaseModel):
    name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class PanelistRegisteredCountModel(BaseModel):
    team: Optional[str] = None
    count: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


class PostPanelistRequest(BaseModel):
    name: Optional[str] = None
    team: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
