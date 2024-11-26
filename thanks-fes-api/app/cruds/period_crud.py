from typing import List

from app.db.models.period import Period
from app.db.session import connect_session


def get(number: int = None) -> Period:
    with connect_session() as db:
        return db.query(Period).get(number)


def get_all() -> List[Period]:
    with connect_session() as db:
        return db.query(Period).order_by(Period.period).all()


def save(item: Period) -> Period:
    with connect_session() as db:
        db.add(item)
        db.commit()
        db.refresh(item)
        return item


def delete(_id: int) -> Period:
    with connect_session() as db:
        item = db.query(Period).get(_id)
        db.delete(item)
        db.commit()
        return item


def reset_all(items: List[Period]):
    with connect_session() as db:
        db.query(Period).delete()
        db.add_all(items)
        db.commit()
