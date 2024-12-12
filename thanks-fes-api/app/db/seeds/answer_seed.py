import csv
from app.cruds import answer_crud, panelist_crud
from app.db.models.answer import Answer


def seed_answers(seeds_data_dir: str):
    answers = [
        Answer(
            panelist_id=panelist_crud.get_by_name(row['panelist']).id,
            question_id=row['question_id'],
            answer=row['answer'],
            correct=int(row['correct'] or 0),
            score=int(row['score'] or 0),
            elapsed_second=float(row['elapsed_second'] or 0),
        ) for row in csv.DictReader(open(f'{seeds_data_dir}/answers.tsv'), delimiter='\t')
    ]
    answer_crud.reset_all(answers)
    print(f'answers: {len(answers)} records')

