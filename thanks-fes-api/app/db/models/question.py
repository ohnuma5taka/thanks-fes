from sqlalchemy import Column, Integer, String

from app.config import env
from app.db.base import Base


class Question(Base):

    __tablename__ = 'questions'
    __table_args__ = {'schema': env.db_schema}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    qid = Column(Integer, nullable=False, default=0)
    period = Column(Integer, nullable=False, default=0)
    idx = Column(Integer, nullable=False, default=0)
    panelist_type = Column(String, nullable=False, default='')
    question_format = Column(String, nullable=False, default='')
    option_format = Column(String, nullable=False, default='')
    text = Column(String, nullable=False, default='')
    thinking_second = Column(Integer, nullable=False, default=0)
    answer = Column(String, nullable=False, default='')
    point = Column(Integer, nullable=False, default='')
