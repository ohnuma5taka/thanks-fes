from typing import Optional

from pydantic import BaseModel, ConfigDict

class OptionModel(BaseModel):
    id: Optional[int] = None
    value: Optional[str] = None
    text: Optional[str] = None
    image_origin_x: Optional[float] = None
    image_origin_y: Optional[float] = None
    image_scale: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)
