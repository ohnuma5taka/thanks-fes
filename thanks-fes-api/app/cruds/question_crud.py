from typing import List

from app.db.models.question import Question
from app.db.session import connect_session


def get(_id: int = None) -> Question:
    with connect_session() as db:
        return db.query(Question).get(_id)


def get_all() -> List[Question]:
    with connect_session() as db:
        return db.query(Question).order_by(Question.period, Question.idx).all()


def get_period_list(period: int = None) -> List[Question]:
    with connect_session() as db:
        return db.query(Question).filter(Question.period == period).order_by(Question.period, Question.idx).all()


def save(item: Question) -> Question:
    with connect_session() as db:
        db.add(item)
        db.commit()
        db.refresh(item)
        return item


def delete(_id: int) -> Question:
    with connect_session() as db:
        item = db.query(Question).get(_id)
        db.delete(item)
        db.commit()
        return item


def reset_all(items: List[Question]):
    with connect_session() as db:
        db.query(Question).delete()
        db.add_all(items)
        db.commit()
