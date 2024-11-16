from sqlalchemy import Column, Integer, String, Float

from app.config import env
from app.db.base import Base


class Answer(Base):

    __tablename__ = 'answers'
    __table_args__ = {'schema': env.db_schema}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    panelist_id = Column(Integer, nullable=False, default=0)
    question_id = Column(Integer, nullable=False, default=0)
    answer = Column(String, unique=True, default='')
    correct = Column(Integer, nullable=False, default=0)
    elapsed_second = Column(Float, nullable=False, default=0)
