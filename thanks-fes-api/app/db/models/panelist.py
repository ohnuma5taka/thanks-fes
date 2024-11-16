from sqlalchemy import Column, Integer, String

from app.config import env
from app.db.base import Base


class Panelist(Base):

    __tablename__ = 'panelists'
    __table_args__ = {'schema': env.db_schema}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False, default='')
    team = Column(String, nullable=False, default='')
