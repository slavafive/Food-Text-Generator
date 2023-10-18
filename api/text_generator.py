from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

from api.utils import read_file, extract_items, compile_regex_from_items


class TextGenerator:

    def __init__(self, food_items, furniture_items, template: str, open_ai_key: str, model_name: str = 'text-davinci-003'):
        self.food_items = self._read_items(food_items) if isinstance(
            food_items, str) else food_items
        self.food_pattern = compile_regex_from_items(self.food_items)

        self.furniture_items = self._read_items(furniture_items) if isinstance(
            furniture_items, str) else furniture_items
        self.furniture_pattern = compile_regex_from_items(self.furniture_items)

        self.template = template
        self.prompt = PromptTemplate(template=self.template, input_variables=[
                                     "restaurant", "word_number", "descriptions"])

        llm = OpenAI(
            temperature=0,
            openai_api_key=open_ai_key,
            model=model_name
        )
        self.llm_chain = LLMChain(prompt=self.prompt, llm=llm)

    def _read_items(self, filepath: str):
        data = read_file(filepath)
        return list(map(lambda s: s.lower().strip(), data.split(',')))

    def _join_extracted_items(self, items):
        return ", ".join(items[:-1]) + " and " + items[-1] if len(items) > 1 else items[0]

    def _format_description(self, description: str):
        if description == '' or description is None:
            return ''
        left_description, items = extract_items(
            string=description, pattern=self.food_pattern)
        if len(items) == 0:
            left_description, items = extract_items(
                string=left_description, pattern=self.furniture_pattern)
        return self._join_extracted_items(items) if len(items) >= 1 else ''

    def _format_descriptions(self, descriptions: list):
        formatted_descriptions = filter(lambda x: x != '' and x is not None, map(
            self._format_description, descriptions))
        return '\n'.join([f"{i}. {description}" for i, description in enumerate(formatted_descriptions, 1)])

    def generate(self, descriptions, restaurant="Daddy Burgers", word_number=100):
        formatted_descriptions = self._format_descriptions(descriptions)
        if formatted_descriptions == '':
            return 'Could not generate text as provided images are not related to food.'
        # return self.template.format(descriptions=formatted_descriptions, word_number=word_number, restaurant=restaurant)
        return self.llm_chain.run(restaurant=restaurant, word_number=word_number, descriptions=formatted_descriptions).strip()
