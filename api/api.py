from flask import Flask, request, jsonify
import json
from transformers import pipeline

from api.utils import read_file, match_categories, exclude_categories
from api.model_response import GenerationStatus, ModelResponse
from api.text_generator import TextGenerator

import sys
sys.path.append('.')

import nltk
from nltk.stem.wordnet import WordNetLemmatizer
nltk.download('wordnet')


app = Flask(__name__, static_folder='../build', static_url_path='/')

config = read_file('api/config/config.yaml')


image_to_text = pipeline(
    "image-to-text", model="Salesforce/blip-image-captioning-base")
text_to_text = TextGenerator(
    food_items='api/items/food.txt',
    furniture_items='api/items/furniture.txt',
    template=config['template'],
    open_ai_key=config['open_ai_key'],
    model_name=config['model_name']
)

lemmatizer = WordNetLemmatizer()

all_categories = read_file('api/all_categories.yaml')
all_exclusive_categories = read_file('api/exclusive_categories.yaml')


def generate_text(id, url):
    try:
        if url == '' or url is None:
            return ModelResponse(id=id, status=GenerationStatus.EMPTY_URL, description='', generated_text=None)
        result = image_to_text(url)
        response = ModelResponse(id=id, status=GenerationStatus.OK,
                                 description='', generated_text=result[0]['generated_text'])
    except Exception:
        response = ModelResponse(
            id=id, status=GenerationStatus.INCORRECT_IMAGE_SOURCE, description='', generated_text='')
    return response


def generate_image_to_texts(urls):
    responses = [generate_text(id, url) for id, url in enumerate(urls, 1)]
    statuses = ModelResponse.get_statuses(responses)
    if len(statuses) > 0:
        return {'error': True, 'text': ModelResponse.generate_error_message(statuses)}
    return {'error': False, 'text': [response.generated_text for response in responses]}


def check_url_errors(urls):
    url_is_provided = False
    for url in urls:
        if url is not None and url != '':
            if not url.startswith('http://') and not url.startswith('https://'):
                return {'error': True, 'message': 'All URLs must start with "http://" or "https://"'}
            url_is_provided = True
    if not url_is_provided:
        return {'error': True, 'message': 'At least one URL must be provided as input'}
    return {'error': False}


@app.route('/api/generate', methods=['POST'])
def generate():
    params = json.loads(request.data.decode('utf-8'))
    urls = params['urls']
    if params['restaurant'] is None or params['restaurant'] == '':
        return jsonify({'message': 'The name of the restaurant is not provided'}), 400
    input_errors = check_url_errors(urls)
    if input_errors['error']:
        return jsonify({'message': input_errors['message']}), 400
    image_to_text_result = generate_image_to_texts(urls)
    if image_to_text_result['error']:
        return jsonify({'message': image_to_text_result['text']}), 400
    text_to_text_result = text_to_text.generate(
        descriptions=image_to_text_result['text'],
        restaurant=params['restaurant'],
        word_number=params['wordNumber']
    )
    categories = [
        [] if text is None or text == ''
        else exclude_categories(all_exclusive_categories, match_categories(all_categories, lemmatizer, text))
        for text in image_to_text_result['text']
    ]
    return jsonify({'image_captions': image_to_text_result['text'], 'generated_text': text_to_text_result, 'tags': categories}), 200
