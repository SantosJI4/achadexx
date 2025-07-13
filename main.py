from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import json
import os

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

DATA_FILE = os.path.join(os.path.dirname(__file__), 'produtos.json')

def load_produtos():
    if not os.path.exists(DATA_FILE):
        print("Arquivo produtos.json não existe, criando novo.")
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f)
        return []
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print("Erro ao ler produtos.json:", e)
        # Corrige arquivo corrompido
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f)
        return []

def save_produtos(produtos):
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(produtos, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print("Erro ao salvar produtos.json:", e)

@app.route('/')
def home():
    return render_template('Home.html')

@app.route('/criador')
def criador():
    return render_template('criador.html')

@app.route('/produtos', methods=['GET'])
def listar_produtos():
    produtos = load_produtos()
    print("Produtos enviados para o frontend:", produtos)
    return jsonify(produtos)

@app.route('/produtos', methods=['POST'])
def cadastrar_produto():
    produto = request.json
    produtos = load_produtos()
    produtos.append(produto)
    save_produtos(produtos)
    print("Produto cadastrado:", produto)
    return jsonify({'status': 'ok', 'produto': produto}), 201

# Para servir arquivos estáticos (JS, CSS, imagens)
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory(app.static_folder, filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)