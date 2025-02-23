import csv
from app.cruds import option_crud
from app.db.models.period import Period


def seed_periods(seeds_data_dir: str):
    periods = [
        Period(
            number=int(row["number"] or 0),
            title=row["title"],
            description=row["description"],
            read_text=row["read_text"],
            panelist_type=row["panelist_type"],
            award_count=int(row["award_count"] or 0),
        )
        for row in csv.DictReader(open(f"{seeds_data_dir}/periods.tsv"), delimiter="\t")
    ]
    option_crud.reset_all(periods)
    print(f"periods: {len(periods)} records")
