# Food-Text-Generator

This app creates text captions for food images which can be used for maintaining social media of a restaurant.

A user can pass up to 9 photos as input which are then categorised into one or several food classes. After that, the information is formatted and passed to an OpenAI model which generates a corresponding text caption.

## How to run the app locally 🧑‍💻

1. Clone the repository:

```bash
git clone https://github.com/slavafive/Food-Text-Generator.git app
cd app
```

2. Install yarn and run the frontend application:

```
yarn install
yarn start
```

This will start the frontend application at _http://localhost:3000_.

3. Set the OpenAI API config key in [api/config/config.yaml](https://github.com/slavafive/Food-Text-Generator/blob/master/api/config/config.yaml) file

```yaml
open_ai_key: "YOUR_API_KEY"
```

*Note. You can view your OpenAI API keys by logging in at [openai.com](https://openai.com), then choosing API in the central menu, then clicking the avatar on top right corner and choosing the option "View API keys".*

4. Navigate to `api` directory and create a virtual environment there:
```bash
cd api
python3 -m venv venv
source venv/bin/activate
```

5. Install the required dependencies:
```bash
pip3 install -r requirements.txt
```

6. Launch the backend application (from the `api` directory):

```
sudo flask run
```

7. Now you can go to _http://localhost:3000_. in your web browser and generate text captions!

## Application guide 🖥
**The application accepts unly URLs of photos**. That is said, if you would to process a certain type of image, type its name in the browser, make a right click on it and choose the option "Copy Image Address".*

<img width="568" alt="image" src="https://github.com/slavafive/Food-Text-Generator/assets/42523164/f3139b1c-e3d8-4a3b-81a0-9cbc0a7cd67c">

Then insert the copied URL into the application input field.

<img width="730" alt="image" src="https://github.com/slavafive/Food-Text-Generator/assets/42523164/596fa536-ec74-4a2c-a25c-6bbadd50c682">

After inserting the desired URLs, click the *"Generate"* button. This will classify each image into one of available food classes and create an image caption describing the group of photos.

<img width="1511" alt="image" src="https://github.com/slavafive/Food-Text-Generator/assets/42523164/e42892f6-35ce-4124-bf3c-bc8fd506703d">

*Note. Expect to wait up to 10 seconds for a single image to be processed.*

## Technical stack ⚙️

- _Frontend_: HTML, CSS, JavaScript, React.js
- _Backend_: Python, Flask
- _Machine Learning_: langchain, transformers, nltk

## Version information 🔢
* Python: 3.10.2
