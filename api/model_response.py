from collections import defaultdict


class GenerationStatus:

    OK = 'no errors'
    INCORRECT_IMAGE_SOURCE = 'incorrect image source'


class ModelResponse:

    def __init__(self, id: int, status: GenerationStatus, description: str, generated_text: str) -> None:
        self.id = id
        self.status = status
        self.description = description
        self.generated_text = generated_text

    @staticmethod
    def get_statuses(model_responses):
        statuses = defaultdict(lambda: [])
        for model_response in model_responses:
            if model_response.status != GenerationStatus.OK:
                statuses[model_response.status].append(model_response.id)
        return statuses

    @staticmethod
    def generate_error_message(statuses):
        if len(statuses) == 0:
            return "All the images were processed successfully"
        # message = "The following errors were found:\n"
        message = ''
        for status, ids in statuses.items():
            message += f"Link{'s' if len(ids) == 1 else ''} {', '.join(map(str, ids))} contain{'s' if len(ids) == 1 else ''} {status}."
        return message
