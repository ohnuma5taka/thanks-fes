from sqlalchemy import Column, Integer, String

from app.config import env
from app.db.base import Base


class Question(Base):

    __tablename__ = 'questions'
    __table_args__ = {'schema': env.db_schema}

    id = Column(String, primary_key=True)
    period = Column(Integer, nullable=False, default=0)
    idx = Column(Integer, nullable=False, default=0)
    question_format = Column(String, nullable=False, default='')
    option_format = Column(String, nullable=False, default='')
    text = Column(String, nullable=False, default='')
    thinking_second = Column(Integer, nullable=False, default=0)
    answer = Column(String, nullable=False, default='')
    point = Column(Integer, nullable=False, default=0)
