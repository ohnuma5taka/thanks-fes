from sqlalchemy import Column, Integer, String, Float

from app.config import env
from app.db.base import Base


class Team(Base):

    __tablename__ = 'teams'
    __table_args__ = {'schema': env.db_schema}

    name = Column(String, primary_key=True, index=True)
    color = Column(String, nullable=False)
