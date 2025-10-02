from flask import Flask, request, jsonify
import requests
from flask_cors import CORS  # importante para liberar requisições do frontend

app = Flask(__name__)
CORS(app)  # libera todas as origens, cuidado em produção

API_KEY = 'AIzaSyCKjob2l3ZvOVW_7hToHA-h4U8W1TEDO_s'

@app.route("/verificar", methods=["GET"])
def verificar():
    query = request.args.get("q")
    if not query:
        return jsonify({"erro": "Falta parâmetro 'q'"}), 400

    url = f"https://factchecktools.googleapis.com/v1alpha1/claims:search?query={query}&key={API_KEY}"

    try:
        resposta = requests.get(url)
        dados = resposta.json()
        return jsonify(dados)
    except Exception as e:
        return jsonify({"erro": f"Erro ao consultar API: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
