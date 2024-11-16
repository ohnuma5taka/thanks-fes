from typing import Optional

from pydantic import BaseModel, ConfigDict


class HealthModel(BaseModel):
    status: Optional[str] = None
    version: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
