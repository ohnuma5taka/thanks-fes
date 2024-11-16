import csv
from app.cruds import question_crud, option_crud
from app.db.models.option import Option
from app.db.models.question import Question


def seed_questions(seeds_data_dir: str):
    option_rows = csv.DictReader(open(f'{seeds_data_dir}/options.tsv'), delimiter='\t')
    question_rows = csv.DictReader(open(f'{seeds_data_dir}/questions.tsv'), delimiter='\t')
    option_rows = [x for x in option_rows]
    for question_row in question_rows:
        _option_rows = [x for x in option_rows
                        if x['period'] == question_row['period'] and x['idx'] == question_row['idx']]
        answer = sum([i + 1 if x['answer'] == '1' else 0 for i, x in enumerate(_option_rows)])
        question = Question(
            period=int(question_row['period']),
            idx=int(question_row['idx']),
            panelist_type=question_row['panelist_type'],
            format=question_row['format'],
            text=question_row['text'],
            file_name=question_row['file_name'],
            thinking_second=int(question_row['thinking_second']),
            answer=str(answer) if answer else '',
            point=int(question_row['point']),
        )
        question = question_crud.save(question)
        options = [
            Option(
                question_id=question.id,
                text=row['text'],
                image_origin_x=float(row['image_origin_x']) if row['image_origin_x'] else 0,
                image_origin_y=float(row['image_origin_y']) if row['image_origin_y'] else 0,
                image_scale=float(row['image_scale']) if row['image_scale'] else 0,
            ) for row in _option_rows
        ]
        option_crud.bulk_save(options)
    print(f'questions: {len(question_crud.get_all())} records')
