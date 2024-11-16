from typing import List

from app.db.models.option import Option
from app.db.session import connect_session


def get(_id: int = None) -> Option:
    with connect_session() as db:
        return db.query(Option).get(_id)


def get_all() -> List[Option]:
    with connect_session() as db:
        return db.query(Option).all()


def get_question_list(question_id: int = None) -> List[Option]:
    with connect_session() as db:
        return db.query(Option).filter(Option.question_id == question_id).all()


def save(item: Option) -> Option:
    with connect_session() as db:
        db.add(item)
        db.commit()
        db.refresh(item)
        return item


def bulk_save(items: list[Option]) -> list[Option]:
    with connect_session() as db:
        db.add_all(items)
        db.commit()
        return items


def delete(_id: int) -> Option:
    with connect_session() as db:
        item = db.query(Option).get(_id)
        db.delete(item)
        db.commit()
        return item


def reset_all(items: List[Option]):
    with connect_session() as db:
        db.query(Option).delete()
        db.add_all(items)
        db.commit()
