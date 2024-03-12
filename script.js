let dadosCompletos = []; // Armazena os dados completos para reutilização

async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    dadosCompletos = data; // Armazena os dados recebidos para filtragem futura
    displayData(dadosCompletos); // Exibe todos os dados inicialmente, já ordenados
}

function displayData(data) {
    // Ordena os dados por nome_beneficiario_plano_acao em ordem alfabética
    let dadosOrdenados = [...data].sort((a, b) => {
        let nomeA = a.nome_beneficiario_plano_acao.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
        let nomeB = b.nome_beneficiario_plano_acao.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
        return nomeA.localeCompare(nomeB);
    });

    const tableBody = document.querySelector('#dadosTabela tbody');
    tableBody.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

    let totalInvestimento = 0;
    let totalCusteio = 0;

    dadosOrdenados.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.nome_beneficiario_plano_acao.replace(/MUNICIPIO DE |MUNICÍPIO DE /gi, "")}</td>
            <td>${item.ano_plano_acao}</td>
            <td>${item.nome_parlamentar_emenda_plano_acao}</td>
            <td>${item.codigo_plano_acao}</td>
            <td>${item.situacao_plano_acao}</td>
            <td>${item.valor_investimento_plano_acao.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
            <td>${item.valor_custeio_plano_acao.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
        `;
        tableBody.appendChild(row);

        // Acumula os totais
        totalInvestimento += item.valor_investimento_plano_acao;
        totalCusteio += item.valor_custeio_plano_acao;
    });

    // Atualiza os elementos HTML com os totais
    document.getElementById('totalInvestimento').textContent = totalInvestimento.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    document.getElementById('totalCusteio').textContent = totalCusteio.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
}

function filtrarDados(filtro) {
    // Filtra os dados com base no input do usuário
    const dadosFiltrados = dadosCompletos.filter(item => item.nome_beneficiario_plano_acao.toUpperCase().includes(filtro.toUpperCase()));
    displayData(dadosFiltrados); // Exibe os dados filtrados, que serão reordenados
}

document.getElementById('filtro_beneficiario').addEventListener('input', () => {
    const filtro = document.getElementById('filtro_beneficiario').value;
    filtrarDados(filtro); // Filtra os dados conforme o usuário digita
});

// Inicializa a busca e exibição de dados
const uf = 'SE'; // Exemplo de filtro para UF
const url = `https://api.transferegov.gestao.gov.br/transferenciasespeciais/plano_acao_especial?uf_beneficiario_plano_acao=eq.${uf}`;
fetchData(url);
