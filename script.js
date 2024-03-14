let dadosCompletos = [] // Armazena os dados completos para reutilização

async function fetchData(url) {
  const response = await fetch(url)
  const data = await response.json()
  dadosCompletos = data // Armazena os dados recebidos para filtragem futura
  preencherAnosDisponiveis()
  preencherParlamentaresDisponiveis()
  preencherBeneficiariosDisponiveis() // Corrigido o nome da função
  filtrarDados() // Exibe todos os dados inicialmente, já ordenados
}

function limparNome(nome) {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/MUNICIPIO DE |MUNICÍPIO DE /gi, "")
    .trim()
}

function preencherBeneficiariosDisponiveis() {
  // Corrigido o nome da função
  const beneficiarios = Array.from(
    new Set(dadosCompletos.map((item) => item.nome_beneficiario_plano_acao))
  ).sort()
  const selectBeneficiario = document.getElementById("filtro_beneficiario") // Corrigido o nome da variável
  selectBeneficiario.innerHTML =
    "<option value=''>Todos os Beneficiários</option>" // Corrigido o nome da variável
  beneficiarios.forEach((beneficiario) => {
    const option = document.createElement("option")
    option.value = beneficiario
    option.textContent = beneficiario
    selectBeneficiario.appendChild(option)
  })
}

function preencherAnosDisponiveis() {
  const anos = Array.from(
    new Set(dadosCompletos.map((item) => item.ano_plano_acao))
  ).sort()
  const selectAno = document.getElementById("filtro_ano")
  selectAno.innerHTML = "<option value=''>Todos os anos</option>"
  anos.forEach((ano) => {
    const option = document.createElement("option")
    option.value = ano
    option.textContent = ano
    selectAno.appendChild(option)
  })
}

function preencherParlamentaresDisponiveis() {
  const parlamentares = Array.from(
    new Set(
      dadosCompletos.map((item) => item.nome_parlamentar_emenda_plano_acao)
    )
  ).sort()
  const selectParlamentar = document.getElementById("filtro_parlamentar")
  selectParlamentar.innerHTML =
    "<option value=''>Todos os parlamentares</option>"
  parlamentares.forEach((parlamentar) => {
    const option = document.createElement("option")
    option.value = parlamentar
    option.textContent = parlamentar
    selectParlamentar.appendChild(option)
  })
}

function filtrarDados() {
  const filtroNome = document
    .getElementById("filtro_beneficiario")
    .value.toLowerCase()
  const filtroAno = document.getElementById("filtro_ano").value
  const filtroParlamentar = document
    .getElementById("filtro_parlamentar")
    .value.toLowerCase()

  const dadosFiltrados = dadosCompletos.filter((item) => {
    const nomeMatch =
      !filtroNome ||
      limparNome(item.nome_beneficiario_plano_acao)
        .toLowerCase()
        .includes(filtroNome)
    const anoMatch = !filtroAno || item.ano_plano_acao.toString() === filtroAno
    const parlamentarMatch =
      !filtroParlamentar ||
      item.nome_parlamentar_emenda_plano_acao
        .toLowerCase()
        .includes(filtroParlamentar)
    return nomeMatch && anoMatch && parlamentarMatch
  })

  displayData(dadosFiltrados)
}

function displayData(data) {
  // Ordena os dados por nome do beneficiário de forma alfabética antes da exibição
  let dadosOrdenados = [...data].sort((a, b) =>
    limparNome(a.nome_beneficiario_plano_acao).localeCompare(
      limparNome(b.nome_beneficiario_plano_acao)
    )
  )

  const tableBody = document.querySelector("#dadosTabela tbody")
  tableBody.innerHTML = "" // Limpa a tabela antes de adicionar novos dados

  let totalInvestimento = 0
  let totalCusteio = 0

  dadosOrdenados.forEach((item) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>${limparNome(item.nome_beneficiario_plano_acao)}</td>
            <td>${item.ano_plano_acao}</td>
            <td>${item.nome_parlamentar_emenda_plano_acao}</td>
            <td>${item.codigo_plano_acao}</td>
            <td>${item.situacao_plano_acao}</td>
            <td>${item.valor_investimento_plano_acao.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}</td>
            <td>${item.valor_custeio_plano_acao.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}</td>
        `
    tableBody.appendChild(row)

    totalInvestimento += item.valor_investimento_plano_acao
    totalCusteio += item.valor_custeio_plano_acao
  })

  // Atualiza os totais no HTML
  document.getElementById("totalInvestimento").textContent =
    totalInvestimento.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  document.getElementById("totalCusteio").textContent =
    totalCusteio.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

document
  .getElementById("filtro_beneficiario")
  .addEventListener("input", filtrarDados)
document.getElementById("filtro_ano").addEventListener("change", filtrarDados)
document
  .getElementById("filtro_parlamentar")
  .addEventListener("change", filtrarDados)



// Inicializa a busca e exibição de dados
document.addEventListener("DOMContentLoaded", (event) => {
  const uf = "SE"
  const url = `https://api.transferegov.gestao.gov.br/transferenciasespeciais/plano_acao_especial?uf_beneficiario_plano_acao=eq.${uf}`
  fetchData(url)
})
