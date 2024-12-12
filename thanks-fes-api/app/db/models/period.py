from sqlalchemy import Column, Integer, String

from app.config import env
from app.db.base import Base


class Period(Base):

    __tablename__ = 'periods'
    __table_args__ = {'schema': env.db_schema}

    number = Column(Integer, primary_key=True)
    title = Column(String, nullable=False, default='')
    description = Column(String, nullable=False, default='')
    panelist_type = Column(String, nullable=False, default='')
    award_count = Column(Integer, nullable=False, default=0)
