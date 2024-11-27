from typing import List

from sqlalchemy import func, desc, and_, asc, distinct, or_

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


def get_question_count(question_id: int = None, value: str = None) -> int:
    with connect_session() as db:
        return db.query(Answer) \
            .filter(and_(Answer.question_id == question_id, Answer.answer == value)) \
            .count()


def get_score(question_id: int = None, panelist_id: int = None) -> int:
    with connect_session() as db:
        return db.query(Answer.score) \
            .filter(and_(Answer.question_id == question_id, Answer.panelist_id == panelist_id)) \
            .scalar()


def count_panelist_score(panelist_id: int = None) -> int:
    with connect_session() as db:
        return db.query(func.sum(Answer.score)) \
            .filter(Answer.panelist_id == panelist_id).scalar()


def get_team_answer_list(question_id: int = None) -> list[str, int]:
    with connect_session() as db:
        return db.query(Panelist.team, func.avg(Answer.correct), func.avg(Answer.score)) \
            .join(Panelist, Panelist.id == Answer.panelist_id) \
            .filter(Answer.question_id == question_id) \
            .group_by(Panelist.team) \
            .all()


def get_panelist_results() -> list[tuple[int, int, float]]:
    with connect_session() as db:
        return db.query(
            Panelist.id,
            func.sum(Answer.score).label("total_score"),
            func.sum(Answer.elapsed_second).label("total_elapsed_second"),
        ) \
            .join(Panelist, Panelist.id == Answer.panelist_id) \
            .group_by(Panelist.id) \
            .order_by(desc("total_score"), asc("total_elapsed_second")) \
            .all()


def get_panelist_period_results(period: int = None) -> list[tuple[int, int, float]]:
    with connect_session() as db:
        answered_question_ids = db.query(distinct(Answer.question_id)).all()
        answered_question_ids = [x[0] for x in answered_question_ids]
        last_question = db.query(Question) \
            .filter(Question.period == period, Question.id.in_(answered_question_ids)) \
            .order_by(desc(Question.idx)).first()
        last_corrected_panelist_ids = db.query(Panelist.id) \
            .join(Answer, Answer.panelist_id == Panelist.id) \
            .filter(Answer.question_id == last_question.id, Answer.score > 0) \
            .all()
        last_corrected_panelist_ids = [x[0] for x in last_corrected_panelist_ids]
        return [(
            panelist_id,
            db.query(func.sum(Answer.score)) \
                .join(Question, Question.id == Answer.question_id) \
                .filter(Question.period == period and Answer.panelist_id == panelist_id).scalar(),
            db.query(Answer.elapsed_second).filter(Answer.question_id == last_question.id).scalar()
        ) for panelist_id in last_corrected_panelist_ids]


def get_team_results(period: int = None) -> List[tuple[str, float, float]]:
    with connect_session() as db:
        return db.query(
            Panelist.team,
            func.avg(Answer.score).label("avg_score"),
            func.sum(Answer.elapsed_second).label("total_elapsed_second"),
        ) \
            .join(Panelist, Panelist.id == Answer.panelist_id) \
            .join(Question, Question.id == Answer.question_id) \
            .filter(or_(period is None, Question.period == period)) \
            .group_by(Panelist.team) \
            .order_by(desc("avg_score"), asc("total_elapsed_second"), asc(Panelist.team)) \
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
