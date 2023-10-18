# Food-Text-Generator
This app creates text captions for food images which can be used for maintaining social media of a restaurant.

A user can pass up to 9 photos as input which are then categorised into one or several food classes. After that, the information is formatted and passed to an OpenAI model which generates a corresponding text caption.

## How to use 🧑‍💻
To run the app locally, clone the repository and set the OpenAI config key in [config.yaml](https://github.com/slavafive/Food-Text-Generator/blob/master/api/config/config.yaml) file
```yaml
open_ai_key: "YOUR_API_KEY"
```

## Technical stack ⚙️
* *Frontend*: HTML, CSS, JavaScript, React.js
* *Backend*: Python, Flask
* *Machine Learning*: langchain, transformers, nltk
