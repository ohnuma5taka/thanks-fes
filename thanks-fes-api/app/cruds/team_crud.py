from typing import List

from app.db.models.team import Team
from app.db.session import connect_session


def get_all() -> List[Team]:
    with connect_session() as db:
        return db.query(Team).all()


def reset_all(items: List[Team]):
    with connect_session() as db:
        db.query(Team).delete()
        db.add_all(items)
        db.commit()
