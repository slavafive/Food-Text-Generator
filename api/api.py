import time
from flask import Flask, request, jsonify
from PIL import Image
import json
import os
from io import BytesIO
import requests
from transformers import pipeline
from api.utils import read_file
from api.model_response import GenerationStatus, ModelResponse
from api.text_generator import TextGenerator


app = Flask(__name__, static_folder='../build', static_url_path='/')

config = read_file('api/config/config.yaml')

image_to_text = pipeline(
    "image-to-text", model="Salesforce/blip-image-captioning-large")
text_to_text = TextGenerator(
    food_items_filepath='api/items/food.txt',
    furniture_items_filepath='api/items/furniture.txt',
    template=config['template'],
    open_ai_key=config['open_ai_key'],
    model_name=config['model_name']
)


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}


def read_image(url):
    response = requests.get(url)
    image = Image.open(BytesIO(response.content))
    return image


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
    print(f"Statuses: {statuses}")
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
    print(f"Generated texts: {image_to_text_result['text']}")
    text_to_text_result = text_to_text.generate(
        descriptions=image_to_text_result['text'],
        restaurant=params['restaurant'],
        word_number=params['wordNumber']
    )
    print(f'Text to text: {text_to_text_result}')
    tags = {
        1: ['fruit', 'banana', 'burger'],
        2: ['kiwi', 'spaghetti'],
        3: ['kiwi'],
        4: ['kiwi'],
        5: ['fruit', 'banana', 'burger'],
        6: ['kiwi', 'spaghetti'],
        7: ['kiwi'],
        8: ['kiwi'],
        9: ['orange']

    }
    return jsonify({'image_captions': image_to_text_result['text'], 'generated_text': text_to_text_result, 'tags': tags}), 200
