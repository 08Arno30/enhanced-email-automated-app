from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from flasgger import Swagger
import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_BLOCK_ID = os.getenv('REACT_APP_LEVITY_BLOCK_ID')
API_KEY = os.getenv('REACT_APP_LEVITY_API_KEY')

app = Flask(__name__)
api = Api(app)
swagger = Swagger(app)

class ClassifyText(Resource):

    def post(self):
        """
        This method responds to the POST request for this endpoint and returns the labels of the text.
        ---
        tags:
        - Text Processing
        parameters:
            - name: text_to_classify
              in: query
              type: string
              required: true
              description: The text to be classified.
        responses:
            200:
                description: A successful POST request
                content:
                    application/json:
                      schema:
                        type: object
                        properties:
                            text:
                                type: string
                                description: The text that was classified and whether it is classified as "urgent" or "not urgent"
            400:
                description: Bad request
                content:
                    application/json:
                      schema:
                        type: object
                        properties:
                            error:
                                type: string
                                description: Unsupported text
        """
        text = request.args.get('text_to_classify')

        url = f"https://next.levity.ai/api/ai/v3/{API_BLOCK_ID}/classify"
        body = {"textToClassify": text}

        access_token = API_KEY

        # Headers with authorization token and content type
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }

        response = requests.post(url, headers=headers, json=body)

        return jsonify(response.json())   

api.add_resource(ClassifyText, "/classify")

if __name__ == "__main__":
    app.run(debug=True)