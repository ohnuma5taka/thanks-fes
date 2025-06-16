import csv
from app.cruds import option_crud
from app.db.models.option import Option


def seed_teams(seeds_data_dir: str):
    teams = [
        Option(
            name=row['name'],
            color=row['color']
        ) for row in csv.DictReader(open(f'{seeds_data_dir}/teams.tsv'), delimiter='\t')
    ]
    option_crud.reset_all(teams)
    print(f'teams: {len(teams)} records')
