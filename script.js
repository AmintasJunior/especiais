let dadosCompletos = []

async function fetchData(url) {
  const response = await fetch(url)
  const data = await response.json()
  dadosCompletos = data
  preencherAnosDisponiveis()
  preencherParlamentaresDisponiveis()
  preencherBeneficiariosDisponiveis()
  filtrarDados()
}

function limparNome(nome) {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/MUNICIPIO DE |MUNICÍPIO DE /gi, "")
    .trim()
}

function preencherBeneficiariosDisponiveis() {
  const beneficiarios = Array.from(
    new Set(dadosCompletos.map((item) => item.nome_beneficiario_plano_acao))
  ).sort()
  const selectBeneficiario = document.getElementById("filtro_beneficiario")
  selectBeneficiario.innerHTML =
    "<option value=''>Todos os Beneficiários</option>"
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

  const filtroClientesACCheckbox = document.getElementById("Clientes-AC")
  const filtroTodosMunicCheckbox = document.getElementById("Todos-Munic")

  if (filtroClientesACCheckbox.checked && filtroTodosMunicCheckbox.checked) {
    // Se ambos os checkboxes estiverem marcados, exibir todos os dados da tabela
    displayData(dadosCompletos)
    return
  }

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

    const filtroClientesACAtivo =
      filtroClientesACCheckbox.checked &&
      [
        "ARAUA",
        "CANHOBA",
        "CEDRO DE SAO JOAO",
        "CUMBE",
        "GARARU",
        "GENERAL MAYNARD",
        "GRACCHO CARDOSO",
        "ITABAIANINHA",
        "ITABI",
        "MACAMBIRA",
        "MALHADA DOS BOIS",
        "MARUIM",
        "MURIBECA",
        "NOSSA SENHORA DA GLORIA",
        "PORTO DA FOLHA",
        "PROPRIA",
        "RIACHUELO",
        "SANTO AMARO DAS BROTAS",
        "SAO FRANCISCO",
        "TELHA",
        "TOMAR DO GERU",
      ].includes(limparNome(item.nome_beneficiario_plano_acao))

    const filtroTodosMunicAtivo = filtroTodosMunicCheckbox.checked

    return (
      nomeMatch &&
      anoMatch &&
      parlamentarMatch &&
      (filtroClientesACAtivo || !filtroClientesACCheckbox.checked) &&
      (filtroTodosMunicAtivo || !filtroTodosMunicCheckbox.checked)
    )
  })

  displayData(dadosFiltrados)
}

function displayData(data) {
  const tableBody = document.querySelector("#dadosTabela tbody")
  tableBody.innerHTML = ""

  let totalInvestimento = 0
  let totalCusteio = 0

  data.forEach((item) => {
    const row = document.createElement("tr")

    const valorInvestimento =
      parseFloat(item.valor_investimento_plano_acao) || 0 // Converte para número, usa 0 se falhar
    const valorCusteio = parseFloat(item.valor_custeio_plano_acao) || 0 // Converte para número, usa 0 se falhar

    row.innerHTML = `
      <td>${limparNome(item.nome_beneficiario_plano_acao)}</td>
      <td>${item.ano_plano_acao}</td>
      <td>${item.nome_parlamentar_emenda_plano_acao}</td>
      <td data-id-plano-acao="${item.id_plano_acao}" class="planoAcao">${
      item.codigo_plano_acao
    }</td>
      <td>${item.situacao_plano_acao}</td>
      <td>${(
        parseFloat(item.valor_investimento_plano_acao) || 0
      ).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
      <td>${(parseFloat(item.valor_custeio_plano_acao) || 0).toLocaleString(
        "pt-BR",
        { style: "currency", currency: "BRL" }
      )}</td>
      <td><span onclick="abrirModalDetalhes()" class="eye-icon"><i class="far fa-eye"></i></span></td>
    `
    tableBody.appendChild(row)

    totalInvestimento += valorInvestimento
    totalCusteio += valorCusteio
  })

  document.getElementById("totalInvestimento").textContent =
    totalInvestimento.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  document.getElementById("totalCusteio").textContent =
    totalCusteio.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

// Função para abrir o modal
function abrirModalDetalhes() {
  document.getElementById("modalDetalhes").style.display = "block"
}

// Função para fechar o modal
function fecharModalDetalhes() {
  document.getElementById("modalDetalhes").style.display = "none"
}

// Fechar o modal clicando fora dele
window.onclick = function (event) {
  if (event.target == document.getElementById("modalDetalhes")) {
    fecharModalDetalhes()
  }
}

// Fechar o modal clicando fora dele
window.onclick = function (event) {
  if (event.target == document.getElementById("modalDetalhes")) {
    fecharModalDetalhes()
  }
}

function exportToExcel() {
  const dados = dadosCompletos.map((item) => ({
    Nome: limparNome(item.nome_beneficiario_plano_acao),
    Ano: item.ano_plano_acao,
    Parlamentar: item.nome_parlamentar_emenda_plano_acao,
    Código: item.codigo_plano_acao,
    Situação: item.situacao_plano_acao,
    Investimento: item.valor_investimento_plano_acao,
    Custeio: item.valor_custeio_plano_acao,
  }))

  const ws = XLSX.utils.json_to_sheet(dados)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Dados")

  XLSX.writeFile(wb, "dados.xlsx")
}

document
  .getElementById("exportExcelButton")
  .addEventListener("click", exportToExcel)

function exportToExcel() {
  const table = document.getElementById("dadosTabela")
  const filename = "dados.xlsx"
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
  const blob = new Blob([tableToExcel(table)], { type: fileType })
  saveAs(blob, filename)
}

document
  .getElementById("exportExcelButton")
  .addEventListener("click", exportToExcel)
function exportToExcel() {
  const wb = XLSX.utils.table_to_book(document.getElementById("dadosTabela"), {
    sheet: "Sheet JS",
  })
  XLSX.writeFile(wb, "Transferências Especiais - AC.xlsx")
}

function exportToPDF() {
  const options = {
    margin: 1,
    filename: "documento.pdf",
    image: { type: "png", quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    header: {
      height: "1in",
      contents: '<img src="./img/cabecalho.png" style="width: 100%;" />',
    },
    footer: {
      height: "1in",
      contents: '<img src="./img/rodape.png" style="width: 100%;" />',
    },
  }

  const content = document.getElementById("dadosTabela")

  html2pdf().from(content).set(options).save()
}

document
  .getElementById("exportPDFButton")
  .addEventListener("click", exportToPDF)

document
  .getElementById("exportPDFButton")
  .addEventListener("click", exportToPDF)

document
  .getElementById("filtro_beneficiario")
  .addEventListener("input", filtrarDados)
document.getElementById("filtro_ano").addEventListener("change", filtrarDados)
document
  .getElementById("filtro_parlamentar")
  .addEventListener("change", filtrarDados)

document.getElementById("Clientes-AC").addEventListener("change", filtrarDados)
document.getElementById("Todos-Munic").addEventListener("change", filtrarDados)

document
  .querySelector("#dadosTabela tbody")
  .addEventListener("click", (event) => {
    let target = event.target

    // Navega para cima na árvore do DOM até encontrar uma célula <td> com a classe 'planoAcao'
    while (target != null && !target.classList.contains("planoAcao")) {
      target = target.parentNode
    }

    if (target && target.dataset.idPlanoAcao) {
      const idPlanoAcao = target.dataset.idPlanoAcao
      const link = `https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/${idPlanoAcao}/dados-basicos`
      window.open(link, "_blank")
    }
  })

document.addEventListener("DOMContentLoaded", (event) => {
  // Ativar o checkbox "Clientes-AC" ao carregar a página
  document.getElementById("Clientes-AC").checked = true

  const uf = "SE"
  const url = `https://api.transferegov.gestao.gov.br/transferenciasespeciais/plano_acao_especial?uf_beneficiario_plano_acao=eq.${uf}`
  fetchData(url)
})
