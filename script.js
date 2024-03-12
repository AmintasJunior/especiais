let dadosCompletos = []; // Armazena os dados completos para reutilização

async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    dadosCompletos = data; // Armazena os dados recebidos para filtragem futura
    displayData(data); // Exibe todos os dados inicialmente
}

function displayData(data) {
    // Ordena os dados por nome_beneficiario_plano_acao em ordem alfabética, considerando a remoção de acentos e espaços extras
    let dadosOrdenados = [...data].sort((a, b) => {
        let nomeA = a.nome_beneficiario_plano_acao.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
        let nomeB = b.nome_beneficiario_plano_acao.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
        return nomeA < nomeB ? -1 : nomeA > nomeB ? 1 : 0;
    });

    const tableBody = document.querySelector('#dadosTabela tbody');
    tableBody.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

    let totalInvestimento = 0;
    let totalCusteio = 0;

    dadosOrdenados.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.nome_beneficiario_plano_acao.replace(/MUNICIPIO DE |MUNICÍPIO DE /gi, "").trim()}</td>
            <td>${item.ano_plano_acao}</td>        
            <td>${item.nome_parlamentar_emenda_plano_acao}</td>
            <td>${item.codigo_plano_acao}</td>
            <td>${item.situacao_plano_acao}</td>
            <td>${(item.valor_investimento_plano_acao).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
            <td>${(item.valor_custeio_plano_acao).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
        `;
        tableBody.appendChild(row);

        // Acumula os totais
        totalInvestimento += Number(item.valor_investimento_plano_acao);
        totalCusteio += Number(item.valor_custeio_plano_acao);
    });

    // Atualiza os elementos HTML com os totais
    document.getElementById('totalInvestimento').textContent = totalInvestimento.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    document.getElementById('totalCusteio').textContent = totalCusteio.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
}

function filtrarDados(filtro) {
    // Filtra os dados com base no input do usuário, removendo espaços extras para comparação
    const dadosFiltrados = dadosCompletos.filter(item => item.nome_beneficiario_plano_acao.trim().toUpperCase().includes(filtro.trim().toUpperCase()));
    displayData(dadosFiltrados);
}

document.getElementById('filtro_beneficiario').addEventListener('input', () => {
    const filtro = document.getElementById('filtro_beneficiario').value;
    filtrarDados(filtro); // Filtra os dados conforme o usuário digita
});

// Inicializa a busca e exibição de dados
const uf = 'SE'; // Exemplo de filtro para UF
const url = `https://api.transferegov.gestao.gov.br/transferenciasespeciais/plano_acao_especial?uf_beneficiario_plano_acao=eq.${uf}`;
fetchData(url);
