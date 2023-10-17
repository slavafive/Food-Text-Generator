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


def match_categories(all_categories, lemmatizer, text):
    normalized_text = ' '.join([lemmatizer.lemmatize(word) for word in text.split()])
    matched_categories = []
    for categories_dict in all_categories:
        for category in list(categories_dict.values())[0]:
            if isinstance(category, str):
                if re.search(r'\b{}\b'.format(category), normalized_text):
                    matched_categories.append(category)
            else:
                category_name = list(category.keys())[0]
                for regex in category.values():
                    if re.search(regex, text):
                        matched_categories.append(category_name)
    return list(sorted(set(matched_categories))) if len(matched_categories) > 0 else ['other']


def exclude_categories(all_exclusive_categories, matched_categories):
    matched_categories = set(matched_categories)
    for exclusive_categories in all_exclusive_categories:
        category = list(exclusive_categories.keys())[0]
        if category in matched_categories:
            print(list(exclusive_categories.values())[0])
            for exclusive_category in list(exclusive_categories.values())[0]:
                matched_categories.discard(exclusive_category)
    return list(sorted(matched_categories))
