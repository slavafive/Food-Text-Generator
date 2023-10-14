import time
from flask import Flask, request, jsonify
from PIL import Image
import json
import os
from io import BytesIO
import requests
from transformers import pipeline

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


def generate_text(url):
    result = image_to_text(url)
    generated_text = result[0]['generated_text']
    return generated_text


@app.route('/api/generate', methods=['POST'])
def generate():
    data = request.data
    parsed_data = json.loads(data.decode('utf-8'))
    urls = parsed_data['urls']
    # image = read_image(urls[0])
    generated_text = generate_text(urls[0])
    return jsonify({'generated_text': generated_text})


@app.route('/api/upload', methods=['POST'])
def upload():
    print(request.data)
    file = request.files['file']
    file.save(os.path.join('111.jpg'))
