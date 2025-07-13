from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# --- Inicialização do banco SQLite ---
def init_db():
    conn = sqlite3.connect('produtos.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            foto TEXT,
            link TEXT,
            precoAntigo TEXT,
            precoNovo TEXT,
            desconto TEXT,
            cupom TEXT,
            loja TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# --- Funções CRUD SQLite ---
def get_produtos():
    conn = sqlite3.connect('produtos.db')
    c = conn.cursor()
    c.execute('SELECT nome, foto, link, precoAntigo, precoNovo, desconto, cupom, loja FROM produtos')
    produtos = [
        {
            'nome': row[0],
            'foto': row[1],
            'link': row[2],
            'precoAntigo': row[3],
            'precoNovo': row[4],
            'desconto': row[5],
            'cupom': row[6],
            'loja': row[7]
        }
        for row in c.fetchall()
    ]
    conn.close()
    return produtos

def add_produto(produto):
    conn = sqlite3.connect('produtos.db')
    c = conn.cursor()
    c.execute('''
        INSERT INTO produtos (nome, foto, link, precoAntigo, precoNovo, desconto, cupom, loja)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        produto.get('nome'),
        produto.get('foto'),
        produto.get('link'),
        produto.get('precoAntigo'),
        produto.get('precoNovo'),
        produto.get('desconto'),
        produto.get('cupom'),
        produto.get('loja')
    ))
    conn.commit()
    conn.close()

# --- Rotas Flask ---
@app.route('/')
def home():
    return render_template('Home.html')

@app.route('/criador')
def criador():
    return render_template('criador.html')

@app.route('/produtos', methods=['GET'])
def listar_produtos():
    produtos = get_produtos()
    print("Produtos enviados para o frontend:", produtos)
    return jsonify(produtos)

@app.route('/produtos', methods=['POST'])
def cadastrar_produto():
    produto = request.json
    add_produto(produto)
    print("Produto cadastrado:", produto)
    return jsonify({'status': 'ok', 'produto': produto}), 201

# Para servir arquivos estáticos (JS, CSS, imagens)
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory(app.static_folder, filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)