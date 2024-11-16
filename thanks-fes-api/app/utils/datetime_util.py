from datetime import datetime, timedelta
import re


def to_str(_datetime: datetime, format_str: str = '%Y/%m/%d %H:%M:%S.%f') -> str:
    _str = _datetime.strftime(format_str)
    end_index = -3 if format_str.endswith('%f') else len(_str)
    return _str[:end_index]


def new(datetime_str: str, format_str: str = '%Y/%m/%d %H:%M:%S.%f') -> datetime:
    if format_str.endswith('%f') and re.search(r'\.[0-9]{3}$', datetime_str):
        datetime_str += '000'
    return datetime.strptime(datetime_str, format_str)


def add(_datetime: str, sec: float) -> str:
    return to_str(new(_datetime) + timedelta(seconds=sec))
