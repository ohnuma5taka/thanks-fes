import csv
from app.cruds import question_crud
from app.db.models.question import Question


def seed_questions(seeds_data_dir: str):
    questions = [
        Question(
            id=int(row['id'] or 0),
            period=int(row['period'] or 0),
            idx=int(row['idx'] or 0),
            question_format=row['question_format'],
            option_format=row['option_format'],
            text=row['text'],
            thinking_second=int(row['thinking_second'] or 0),
            answer=row['answer'],
        ) for row in csv.DictReader(open(f'{seeds_data_dir}/questions.tsv'), delimiter='\t')
    ]
    question_crud.reset_all(questions)
    print(f'questions: {len(questions)} records')
