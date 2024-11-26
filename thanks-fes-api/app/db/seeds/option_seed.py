import csv
from app.cruds import option_crud
from app.db.models.option import Option


def seed_options(seeds_data_dir: str):
    options = [
        Option(
            question_id=row['question_id'],
            value=row['value'],
            image_origin_x=float(row['image_origin_x'] or 0),
            image_origin_y=float(row['image_origin_y'] or 0),
            image_scale=float(row['image_scale'] or 0),
        ) for row in csv.DictReader(open(f'{seeds_data_dir}/options.tsv'), delimiter='\t')
    ]
    option_crud.reset_all(options)
    print(f'options: {len(options)} records')

