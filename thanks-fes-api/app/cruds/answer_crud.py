from typing import List

from sqlalchemy import func, desc, and_, asc

from app.db.models.answer import Answer
from app.db.models.panelist import Panelist
from app.db.models.question import Question
from app.db.session import connect_session


def get(_id: int = None) -> Answer:
    with connect_session() as db:
        return db.query(Answer).get(_id)


def get_all() -> List[Answer]:
    with connect_session() as db:
        return db.query(Answer).all()


def get_questions_list(question_ids: list[int] = None):
    with connect_session() as db:
        return db.query(Answer).filter(Answer.question_id.in_(question_ids)).all()


def get_question_list(question_id: int = None):
    with connect_session() as db:
        return db.query(Answer).filter(Answer.question_id == question_id).all()


def get_panelist_list(panelist_id: int = None) -> List[Answer]:
    with connect_session() as db:
        return db.query(Answer).filter(Answer.panelist_id == panelist_id).all()


def get_question_count(question_id: int = None, answer: str = None) -> int:
    with connect_session() as db:
        return db.query(Answer) \
            .filter(and_(Answer.question_id == question_id, Answer.answer == answer)) \
            .count()


def get_correct(question_id: int = None, panelist_id: int = None) -> int:
    with connect_session() as db:
        return db.query(Answer.correct) \
            .filter(and_(Answer.question_id == question_id, Answer.panelist_id == panelist_id)) \
            .scalar()


def count_panelist_correct(panelist_id: int = None) -> int:
    with connect_session() as db:
        return db.query(func.sum(Answer.correct)) \
            .filter(Answer.panelist_id == panelist_id).scalar()


def get_team_answer_list(question_id: int = None) -> list[str, int]:
    with connect_session() as db:
        return db.query(Panelist.team, func.avg(Answer.correct)) \
            .join(Panelist, Panelist.id == Answer.panelist_id) \
            .filter(Answer.question_id == question_id) \
            .group_by(Panelist.team) \
            .all()


def get_panelist_results() -> list[tuple[int, int, float]]:
    with connect_session() as db:
        return db.query(
            Panelist.id,
            func.sum(Answer.correct).label("total_correct"),
            func.sum(Answer.elapsed_second).label("total_elapsed_second"),
        ) \
            .join(Panelist, Panelist.id == Answer.panelist_id) \
            .group_by(Panelist.id, Panelist.name) \
            .order_by(desc("total_correct"), asc("total_elapsed_second")) \
            .all()


def get_panelist_period_results(period: int = None) -> list[tuple[int, int, float]]:
    with connect_session() as db:
        last_question = db.query(Question) \
            .filter(Question.period == period) \
            .order_by(desc(Question.idx)).first()
        return db.query(Answer.panelist_id, Answer.correct, Answer.elapsed_second) \
            .filter(Answer.question_id == last_question.id, Answer.correct > 0) \
            .order_by(Answer.elapsed_second) \
            .all()


def get_team_results() -> List[tuple[str, float, float]]:
    with connect_session() as db:
        return db.query(
            Panelist.team,
            func.avg(Answer.correct).label("avg_correct"),
            func.sum(Answer.elapsed_second).label("total_elapsed_second"),
        ) \
            .join(Panelist, Panelist.id == Answer.panelist_id) \
            .group_by(Panelist.team) \
            .order_by(desc("avg_correct"), asc("total_elapsed_second")) \
            .all()


def save(item: Answer) -> Answer:
    with connect_session() as db:
        db.add(item)
        db.commit()
        db.refresh(item)
        return item


def bulk_save(items: list[Answer]) -> list[Answer]:
    with connect_session() as db:
        db.add_all(items)
        db.commit()
        return items


def delete(_id: int) -> Answer:
    with connect_session() as db:
        item = db.query(Answer).get(_id)
        db.delete(item)
        db.commit()
        return item


def delete_all() -> None:
    with connect_session() as db:
        db.query(Answer).delete()
        db.commit()


def reset_all(items: List[Answer]):
    with connect_session() as db:
        db.query(Answer).delete()
        db.add_all(items)
        db.commit()
