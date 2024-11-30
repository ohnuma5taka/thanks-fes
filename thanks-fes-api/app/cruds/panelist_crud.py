from typing import List

from sqlalchemy import distinct, func

from app.db.models.answer import Answer
from app.db.models.panelist import Panelist
from app.db.session import connect_session


def get(_id: int = None, name: str = None) -> Panelist:
    with connect_session() as db:
        return db.query(Panelist).get(_id) if _id is not None \
            else db.query(Panelist).filter(Panelist.name == name).first()


def get_name(_id: int = None) -> str:
    with connect_session() as db:
        return db.query(Panelist).get(_id).name


def get_by_name(name: str = None) -> Panelist:
    with connect_session() as db:
        return db.query(Panelist).filter(Panelist.name == name).first()


def get_all() -> List[Panelist]:
    with connect_session() as db:
        return db.query(Panelist).all()


def get_teams() -> List[str]:
    with connect_session() as db:
        return sorted([x[0] for x in db.query(distinct(Panelist.team)).all()])


def get_unanswered_list(question_id: int = None) -> list[Panelist]:
    with connect_session() as db:
        ids = [x.id for x in db.query(Panelist).all()]
        return db.query(Panelist) \
            .join(Answer, Answer.panelist_id == Panelist.id) \
            .filter(Answer.question_id == question_id, ~Answer.panelist_id.in_(ids)) \
            .all()


def save(item: Panelist) -> Panelist:
    with connect_session() as db:
        db.add(item)
        db.commit()
        db.refresh(item)
        return item


def delete(_id: int) -> Panelist:
    with connect_session() as db:
        item = db.query(Panelist).get(_id)
        db.delete(item)
        db.commit()
        return item


def reset_all(items: List[Panelist]):
    with connect_session() as db:
        db.query(Panelist).delete()
        db.add_all(items)
        db.commit()
