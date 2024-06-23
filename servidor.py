from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Banco de dados fictício
livros = [
    {"id": 1, "titulo": "1984", "autor": "George Orwell", "emprestado": False},
    {"id": 2, "titulo": "Dom Quixote", "autor": "Miguel de Cervantes","emprestado": False},
]

clientes = [

]

emprestimos = [
    
]

@app.route('/')
def index():
    return render_template('index.html')


#Funções principais
@app.route('/cadastrarLivro' , methods = ['POST'])
def cadastrarLivro():
    novoLivro = request.get_json()
    novoLivroId = len(livros) + 1
    livros.append({
        "id": novoLivroId,
        "titulo": novoLivro["titulo"],
        "autor": novoLivro["autor"],
        "emprestado": False
    })
    return jsonify({"message": "Livro cadastrado com sucesso!" , "id": novoLivroId}), 201

@app.route('/cadastrarCliente' , methods=['POST'])
def cadastrarCliente():
    novo_cliente = request.get_json()
    novo_cliente_id = len(clientes) + 1
    clientes.append({
        "id": novo_cliente_id,
        "nome": novo_cliente['nome'],
        "telefone": novo_cliente['telefone'],
        "idLivroEmprestado": None
    })
    return jsonify({"message": "Cliente cadastrado com sucesso!", "id": novo_cliente_id}), 201

@app.route('/realizarEmprestimo', methods = ['POST'])
def emprestimo():
    novo_emprestimo = request.get_json()
    novo_emprestimo_id = len(emprestimos)+ 1 
    novo_emprestimo_id_cliente = int(novo_emprestimo["idCliente"])
    novo_emprestimo_id_livro = int(novo_emprestimo["idLivro"])

    cliente_encontrado = False
    for cliente in clientes:
        if cliente["id"] == novo_emprestimo_id_cliente:
            cliente_encontrado = True
            break
    
    if not cliente_encontrado:
        return jsonify({"message": "Cliente não encontrado"}), 404

    for livro in livros:
        if livro["id"] == novo_emprestimo_id_livro and livro["emprestado"]:
            return jsonify({"message": "Livro já emprestado"}), 400

    livro_encontrado = False
    for livro in livros:
        if livro["id"] == novo_emprestimo_id_livro:
            livro_encontrado = True
            break
    
    if not livro_encontrado:
        return jsonify({"message": "Livro não encontrado"}), 404

    emprestimos.append({
        "idEmprestimo": novo_emprestimo_id , 
        "idCliente": novo_emprestimo_id_cliente , 
        "idLivro": novo_emprestimo_id_livro, 
        "dataParaDevolucao": novo_emprestimo['dataParaDevolucao'], 
        "statusDevolucao": False
    }) 
    for i in range(len(livros)):
        if livros[i]["id"] == novo_emprestimo_id_livro:
            livros[i]["emprestado"] = True
    
    for i in range(len(clientes)):
        if clientes[i]["id"] == novo_emprestimo_id_cliente:
            clientes[i]["idLivroEmprestado"] = novo_emprestimo_id_livro
    
    return jsonify({"message": "Emprestimo realizado com sucesso!", "idEmprestimo": novo_emprestimo_id}), 201

@app.route('/realizarDevolucao' , methods = ['POST'])
def devolucao():

    dadosDevolucao = request.get_json()
    dadosDevolucao_id_cliente = int(dadosDevolucao["idCliente"])
    dadosDevolucao_id_livro = int(dadosDevolucao["idLivro"])

    cliente_encontrado = False
    for cliente in clientes:
        if cliente["id"] == dadosDevolucao_id_cliente:
            cliente_encontrado = True
            break
    
    if not cliente_encontrado:
        return jsonify({"message": "Cliente não encontrado"}), 404

     # Verifica se o livro está marcado como emprestado
    livro_encontrado = False
    for livro in livros:
        if livro["id"] == dadosDevolucao_id_livro:
            livro_encontrado = True
            break
    
    if not livro_encontrado:
        return jsonify({"message": "Livro não encontrado"}), 404

    for i in range(len(livros)):
        if livros[i]["id"] == dadosDevolucao_id_livro:
            livros[i]["emprestado"] = False
    
    for i in range(len(emprestimos)):
        if emprestimos[i]["idCliente"] == dadosDevolucao_id_cliente:
            emprestimos[i]["statusDevolucao"] = True

    for i in range(len(clientes)):
        if clientes[i]["id"] == dadosDevolucao_id_cliente:
            clientes[i]["idLivroEmprestado"] = None
    
    return jsonify({"message": "Devolução realizada com sucesso!"}), 201

#Funções para Listar
@app.route('/listar_livros', methods=['GET'])
def listarLivros():
    return jsonify({'livros': livros})

@app.route('/listar_clientes', methods=['GET'])
def listarClientes():
    return jsonify({'clientes' : clientes})

@app.route('/listar_emprestimos', methods=['GET'])
def listarEmprestimos():
    return jsonify({'emprestimos' : emprestimos})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1234, debug=True)