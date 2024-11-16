import csv
from app.cruds import panelist_crud
from app.db.models.panelist import Panelist


def seed_panelists(seeds_data_dir: str):
    panelists = [
        Panelist(
            name=row['name'],
            team=row['team'],
        ) for row in csv.DictReader(open(f'{seeds_data_dir}/panelists.tsv'), delimiter='\t')
    ]
    panelist_crud.reset_all(panelists)
    print(f'panelists: {len(panelists)} records')
