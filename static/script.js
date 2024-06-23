function listarLivros() {

    let livros = [];

    fetch('/listar_livros')
    .then(response => response.json())
    .then(data => {
        livros = data.livros
        const tabela = document.getElementById('tabela-lista');
        tabela.innerHTML = '';
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Autor(a)</th>
                <th>Emprestado</th>
            </tr>
        `;
        tabela.appendChild(thead);
        const tbody = document.createElement('tbody');
        livros.forEach(livro => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${livro.id}</td>
                <td>${livro.titulo}</td>
                <td>${livro.autor}</td>
                <td>${livro.emprestado ? 'Sim' : 'Não'}</td>
            `;
            tbody.appendChild(row);
        });
        tabela.appendChild(tbody);
    })
    .catch(error => {
        console.error('Erro:', error);
    });

    
    
}

function listarClientes() {

    let clientes = [];

    fetch('/listar_clientes')
    .then(response => response.json())
    .then(data => {
        clientes = data.clientes
        const tabela = document.getElementById('tabela-lista');
        tabela.innerHTML = '';
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Id do Livro Emprestado</th>
            </tr>
        `;
        tabela.appendChild(thead);
        const tbody = document.createElement('tbody');
        clientes.forEach(cliente => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cliente.id}</td>
                <td>${cliente.nome}</td>
                <td>${cliente.telefone}</td>
                <td>${cliente.idLivroEmprestado || 'Nenhum'}</td>
            `;
            tbody.appendChild(row);
        });
        tabela.appendChild(tbody);
    })
    .catch(error => {
        console.error('Erro:', error);
    });


}

function listarEmprestimos() {

    let emprestimos = [];

    fetch('/listar_emprestimos')
    .then(response => response.json())
    .then(data => {
        emprestimos = data.emprestimos
        const tabela = document.getElementById('tabela-lista');
        tabela.innerHTML = '';
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>ID Empréstimo</th>
                <th>ID Cliente</th>
                <th>ID Livro</th>
                <th>Data para Devolução</th>
                <th>Devolvido</th>
            </tr>
        `;
        tabela.appendChild(thead);
        const tbody = document.createElement('tbody');
        emprestimos.forEach(emprestimo => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${emprestimo.idEmprestimo}</td>
                <td>${emprestimo.idCliente}</td>
                <td>${emprestimo.idLivro}</td>
                <td>${emprestimo.dataParaDevolucao}</td>
                <td>${emprestimo.statusDevolucao ? 'Sim' : 'Não'}</td>
            `;
            tbody.appendChild(row);
        });
        tabela.appendChild(tbody);

    })
    .catch(error => {
        console.error('Erro:', error);
    });


}

function cadastrarCliente() {
    let nome = document.getElementById("nome-cliente").value; 
    let telefone = document.getElementById("telefone-cliente").value;

    if (nome == "" || telefone == "") {
        alert("Por favor, preencha todos os campos antes de cadastrar cliente.");
        return;
    }

    fetch('/cadastrarCliente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "nome": nome, "telefone": telefone })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Sucesso:', data);
        listarClientes()
        alert('Cliente cadastrado com sucesso!')

    })
    .catch(error => {
        console.error('Erro:', error);
    });

    // Limpa os campos após o cadastro
    document.getElementById("nome-cliente").value = "";
    document.getElementById("telefone-cliente").value = "";
    
}

function cadastrarLivro() {
    let titulo = document.getElementById("titulo-livro").value;
    let autor = document.getElementById("autor-livro").value;

    if (titulo === "" || autor === "") {
        alert("Por favor, preencha todos os campos antes de cadastrar livro.");
        return;
    }

    fetch('/cadastrarLivro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "titulo": titulo, "autor": autor })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Sucesso:', data);
        alert('Livro cadastrado com sucesso!');
        listarLivros()
    })
    .catch(error => {
        console.error('Erro:', error);
    });

    // Limpa os campos após o cadastro
    document.getElementById("titulo-livro").value = "";
    document.getElementById("autor-livro").value = "";
}

function realizarEmprestimo() {
    const idLivro = document.getElementById("id-livro").value;
    const idCliente = document.getElementById("id-cliente").value;
    const dataDevolucao = document.getElementById("data-devolucao").value;

    if (idLivro === "" || idCliente === "" || dataDevolucao === "") {
        alert("Por favor, preencha todos os campos antes de confirmar o empréstimo.");
        return;
    }

    fetch('/realizarEmprestimo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "idCliente": idCliente, "idLivro": idLivro, "dataParaDevolucao": dataDevolucao })
    })
    .then(response => {
        if (!response.ok) {
            if (response.status == 400) {
                throw new Error("Livro já emprestado");
            }

            if (response.status == 404) {
                throw new Error("Livro ou cliente não encontrado");
            }
            
        }
        return response.json();
    })
    .then(data => {
        console.log('Sucesso:', data);
        alert('Empréstimo realizado com sucesso!');
        listarEmprestimos();
    })
    .catch(error => {
        alert("Erro: " + error.message);
    });

    // Limpa os campos após o cadastro
    document.getElementById("id-livro").value = "";
    document.getElementById("id-cliente").value = "";
    document.getElementById("data-devolucao").value = "";
}

function realizarDevolucao() {
    const idCliente = document.getElementById("id-cliente-devolucao").value;
    const idLivro = document.getElementById("id-livro-devolucao").value;

    if (idCliente === "" || idLivro === "") {
        alert("Por favor, preencha todos os campos antes de confirmar a devolução.");
        return;
    }

    fetch('/realizarDevolucao', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "idCliente": idCliente, "idLivro": idLivro })
    })
    .then(response => {
        if (!response.ok) {

            if(response.status == 404) {
                throw new Error("Livro ou cliente não encontrado");
            }

        }
        return response.json();
    })
    .then(data => {
        console.log('Sucesso:', data);
        alert('Devolução realizada com sucesso!');
        listarEmprestimos();
    })
    .catch(error => {
        console.error(error);
        alert("Erro: " + error.message);
    });

    // Limpa os campos após a devolução
    document.getElementById("id-cliente-devolucao").value = "";
    document.getElementById("id-livro-devolucao").value = "";
}
