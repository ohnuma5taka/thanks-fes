import os
import argparse

from app.cruds import (
    answer_crud,
    panelist_crud,
    question_crud,
    option_crud,
    period_crud,
)
from app.db.seeds.answer_seed import seed_answers
from app.db.seeds.option_seed import seed_options
from app.db.seeds.panelist_seed import seed_panelists
from app.db.seeds.period_seed import seed_periods
from app.db.seeds.question_seed import seed_questions

parser = argparse.ArgumentParser()
parser.add_argument("--mode", default="")


def seed(mode: str = None):
    root_dir = os.path.dirname(__file__)
    seeds_data_dir = os.path.join(root_dir, "app", "db", "seeds", "data")
    BOS = "\033[92m"
    EOS = "\033[0m"
    print(f"{BOS}Initializing data...{EOS}")
    answer_crud.reset_all([])
    panelist_crud.reset_all([])
    option_crud.reset_all([])
    question_crud.reset_all([])
    period_crud.reset_all([])
    print(f"{BOS}Seeding data...{EOS}")
    seed_periods(seeds_data_dir)
    seed_questions(seeds_data_dir)
    seed_options(seeds_data_dir)
    if mode == "dev":
        seed_panelists(seeds_data_dir)
        seed_answers(seeds_data_dir)
    print(f"{BOS}Done!{EOS}")


if __name__ == "__main__":
    args = parser.parse_args()
    seed(mode=args.mode)
