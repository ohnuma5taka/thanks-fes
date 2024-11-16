from sqlalchemy import Column, Integer, String

from app.config import env
from app.db.base import Base


class Question(Base):

    __tablename__ = 'questions'
    __table_args__ = {'schema': env.db_schema}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    period = Column(Integer, nullable=False, default='')
    idx = Column(Integer, nullable=False, default=0)
    panelist_type = Column(String, nullable=False, default='')
    format = Column(String, nullable=False, default='')
    text = Column(String, nullable=False, default='')
    file_name = Column(String, nullable=False, default='')
    thinking_second = Column(Integer, nullable=False, default=0)
    answer = Column(String, nullable=False, default='')
    point = Column(Integer, nullable=False, default='')
