import time
from flask import Flask, request, jsonify
import json

app = Flask(__name__, static_folder='../build', static_url_path='/')


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}


@app.route('/api/generate', methods=['POST'])
def generate():
    record = json.loads(request.data)
    print(record)
    return jsonify({'generated_text': 'some text'})
