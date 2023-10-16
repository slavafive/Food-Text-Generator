import yaml
import re


def read_file(filepath):
    with open(filepath, 'r') as file:
        return yaml.safe_load(file)
    

def extract_items(string, pattern):
    found_items = pattern.findall(string)
    for found_item in set(found_items):
        string = string.replace(found_item, '')
    return ' '.join(string.split()), found_items


def compile_regex_from_items(items):
    regex = r'\b(' + '|'.join(re.escape(item) for item in items) + r')\b'
    return re.compile(regex)
