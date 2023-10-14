import time
from flask import Flask, request, jsonify
from PIL import Image
import json
import os
from io import BytesIO
import requests
from transformers import pipeline
from api.model_response import GenerationStatus, ModelResponse


app = Flask(__name__, static_folder='../build', static_url_path='/')

image_to_text = pipeline("image-to-text", model="Salesforce/blip-image-captioning-large")


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
        print(f"Processing url: {url}")
        result = image_to_text(url)
        print(f"Successfully processed url: {url}")
        response = ModelResponse(id=id, status=GenerationStatus.OK, description='', generated_text=result[0]['generated_text'])
    except Exception as e:
        print(f"Error while processing url: {url}")
        response = ModelResponse(id=id, status=GenerationStatus.INCORRECT_IMAGE_SOURCE, description='', generated_text='')
    return response


def generate_texts(urls):
    responses = [generate_text(id, url) for id, url in enumerate(urls, 1)]
    statuses = ModelResponse.get_statuses(responses)
    print(f"Statuses: {statuses}")
    return ModelResponse.generate_error_message(statuses) if len(statuses) > 0 else '\n'.join([response.generated_text for response in responses])


@app.route('/api/generate', methods=['POST'])
def generate():
    data = request.data
    parsed_data = json.loads(data.decode('utf-8'))
    urls = parsed_data['urls']
    urls = [url for url in urls if url is not None]
    print(urls)
    text = generate_texts(urls)
    print(text)
    return jsonify({'generated_text': text}), 200
