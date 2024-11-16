import json
import re


def load_ws_text(text: str):
    text = re.sub(r'^"(.*)"$', r'\1', text)
    is_obj = re.fullmatch(r'^\{.*\}$', text) is not None or re.fullmatch(r'^\[.*\]$', text) is not None
    return loads(text) if is_obj else text


def dumps(data: dict):
    return json.dumps(data, ensure_ascii=False)


def dump(data: dict, path: str, indent: int = 2):
    return json.dump(data, open(path, 'w'), ensure_ascii=False, indent=indent)


def loads(text: str):
    return json.loads(text)


def load(path: str):
    return json.load(open(path, 'r'))

