from sqlalchemy import Column, Integer, String, Float

from app.config import env
from app.db.base import Base


class Option(Base):

    __tablename__ = 'options'
    __table_args__ = {'schema': env.db_schema}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    question_id = Column(Integer, nullable=False, default=0)
    value = Column(String, nullable=False, default='')
    image_origin_x = Column(Float, nullable=False, default=0)
    image_origin_y = Column(Float, nullable=False, default=0)
    image_scale = Column(Float, nullable=False, default=0)
