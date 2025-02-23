import csv
from app.cruds import question_crud
from app.db.models.question import Question


def seed_questions(seeds_data_dir: str):
    questions = [
        Question(
            id=row["id"],
            period=int(row["period"] or 0),
            idx=int(row["idx"] or 0),
            question_format=row["question_format"],
            option_format=row["option_format"],
            text=row["text"],
            read_text=row["read_text"],
            answer=row["answer"],
            point=int(row["point"] or 0),
            thinking_second=int(row["thinking_second"] or 0),
        )
        for row in csv.DictReader(
            open(f"{seeds_data_dir}/questions.tsv"), delimiter="\t"
        )
    ]
    question_crud.reset_all(questions)
    print(f"questions: {len(questions)} records")
