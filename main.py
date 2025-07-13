from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import json
import os

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

DATA_FILE = os.path.join(os.path.dirname(__file__), 'produtos.json')

def load_produtos():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_produtos(produtos):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(produtos, f, ensure_ascii=False, indent=2)

@app.route('/')
def home():
    return render_template('Home.html')

@app.route('/criador')
def criador():
    return render_template('criador.html')

@app.route('/produtos', methods=['GET'])
def listar_produtos():
    produtos = load_produtos()
    return jsonify(produtos)

@app.route('/produtos', methods=['POST'])
def cadastrar_produto():
    produto = request.json
    produtos = load_produtos()
    produtos.append(produto)
    save_produtos(produtos)
    return jsonify({'status': 'ok', 'produto': produto}), 201

# Para servir arquivos estáticos (JS, CSS, imagens)
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory(app.static_folder, filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)