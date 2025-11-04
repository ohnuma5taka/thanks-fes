import csv

from app.cruds import team_crud
from app.db.models.team import Team


def seed_teams(seeds_data_dir: str):
    teams = [
        Team(name=row["name"], color=row["color"])
        for row in csv.DictReader(open(f"{seeds_data_dir}/teams.tsv"), delimiter="\t")
    ]
    team_crud.reset_all(teams)
    print(f"teams: {len(teams)} records")
