import csv
from app.cruds import question_crud, option_crud
from app.db.models.option import Option
from app.db.models.question import Question


def seed_questions(seeds_data_dir: str):
    option_rows = csv.DictReader(open(f'{seeds_data_dir}/options.tsv'), delimiter='\t')
    question_rows = csv.DictReader(open(f'{seeds_data_dir}/questions.tsv'), delimiter='\t')
    option_rows = sorted([x for x in option_rows], key=lambda x: (x['period'], x['idx']))
    for question_row in question_rows:
        _option_rows = [x for x in option_rows if x['qid'] == question_row['qid']]
        answer = sum([i + 1 if x['answer'] == '1' else 0 for i, x in enumerate(_option_rows)])
        question = Question(
            qid=int(question_row['qid']),
            period=int(question_row['period']),
            idx=int(question_row['idx']),
            panelist_type=question_row['panelist_type'],
            question_format=question_row['question_format'],
            option_format=question_row['option_format'],
            text=question_row['text'],
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
