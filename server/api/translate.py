from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from flasgger import Swagger
from googletrans import Translator

translator = Translator()

app = Flask(__name__)
api = Api(app)
swagger = Swagger(app)

class translate(Resource):

    def get(self):
        """
        This method responds to the GET request for this endpoint and returns the translated text.
        ---
        tags:
        - Text Translation
        parameters:
            - name: text
              in: query
              type: string
              required: true
              description: The text to be translated
            - name: sourceLanguageCode
              in: query
              type: string
              required: true
              description: The source language code
            - name: targetLanguageCode
              in: query
              type: string
              required: true
              description: The target language code
        responses:
            200:
                description: A successful GET request
                content:
                    application/json:
                      schema:
                        type: object
                        properties:
                            text:
                                type: string
                                description: The translated text
        """
        text = request.args.get('text')
        sourceLanguageCode = request.args.get('sourceLanguageCode')
        targetLanguageCode = request.args.get('targetLanguageCode')

        translation = translator.translate(text, src=sourceLanguageCode, dest=targetLanguageCode)

        return jsonify({"translatedText": translation.text})

api.add_resource(translate, "/translate")

if __name__ == "__main__":
    app.run(debug=True)