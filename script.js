let dadosCompletos = []

async function fetchData(urlPlanoAcao) {
  try {
    const response = await fetch(urlPlanoAcao)
    const data = await response.json()
    dadosCompletos = data
    preencherAnosDisponiveis()
    preencherParlamentaresDisponiveis()
    preencherBeneficiariosDisponiveis()
    filtrarDados()
  } catch (error) {
    console.error("Erro ao buscar dados: ", error)
  }
}

function limparNome(nome) {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/MUNICIPIO DE |MUNICÍPIO DE /gi, "")
    .trim()
}

function preencherBeneficiariosDisponiveis() {
  const beneficiarios = dadosCompletos
    .map((item) => limparNome(item.nome_beneficiario_plano_acao))
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort((a, b) => a.length - b.length)

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
  let dadosOrdenados = [...data].sort((a, b) =>
    limparNome(a.nome_beneficiario_plano_acao).localeCompare(
      limparNome(b.nome_beneficiario_plano_acao)
    )
  )
  const tableBody = document.querySelector("#dadosTabela tbody")
  tableBody.innerHTML = ""

  let totalInvestimento = 0
  let totalCusteio = 0

  dadosOrdenados.forEach((item) => {
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

    const eyeIcon = row.querySelector(".eye-icon")
    if (eyeIcon) {
      eyeIcon.addEventListener("click", () => abrirModalDetalhes(item))
    }

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

  // Agora que os dados foram inseridos, obtenha a contagem de linhas
  let contagem = contarLinhas("corpoTabela") // Substitua "corpoTabela" pelo ID correto, se necessário

  // Atualize o elemento HTML com a nova contagem de linhas
  document.getElementById("contagemLinhas").textContent =
    "Total de Instrumentos:  " + contagem

  // Opcionalmente, se quiser manter a contagem em uma variável dentro de `displayData` por algum outro motivo:
  let contagemLinhas = contagem // Agora `contagemLinhas` contém o número de linhas

  function contarLinhas(idDaTabela) {
    var corpoTabela = document.getElementById(idDaTabela) // Usa o ID para selecionar diretamente o tbody
    if (corpoTabela) {
      return corpoTabela.rows.length // Retorna o número de linhas no tbody
    } else {
      // Se, por algum motivo, o tbody não for encontrado, tenta contar as linhas diretamente na tabela
      // Isso é mais uma garantia, mas com a estrutura fornecida, o tbody deve sempre ser encontrado
      var tabela = document.getElementById("dadosTabela")
      return tabela.rows.length
    }
  }
}

function verificarDescricaoAreasPoliticas(valor) {
  // Verifica se o valor é null e retorna "não cadastrado", caso contrário, retorna o próprio valor
  return valor === null ? "Não cadastrado no TransfereGov" : valor
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
  const urlPlanoAcao = `https://api.transferegov.gestao.gov.br/transferenciasespeciais/plano_acao_especial?uf_beneficiario_plano_acao=eq.${uf}`
  fetchData(urlPlanoAcao)

})
