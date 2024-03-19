async function fetchData(urlPlanoAcao) {
  try {
    const response = await fetch(urlPlanoAcao)
    const data = await response.json()
    dadosCompletos = data
    preencherAnosDisponiveis()
    preencherParlamentaresDisponiveis()
    preencherBeneficiariosDisponiveis()
    filtrarDados() // Chama a filtragem inicial
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

function preencherSelect(selectId, dados, textoInicial) {
  const selectElement = document.getElementById(selectId)
  selectElement.innerHTML = `<option value=''>${textoInicial}</option>`
  dados.forEach((dado) => {
    const option = document.createElement("option")
    option.value = dado
    option.textContent = dado
    selectElement.appendChild(option)
  })

  // Aplica o Select2 ao select
  $(selectElement).select2()
}

function preencherBeneficiariosDisponiveis() {
  const beneficiarios = dadosCompletos
    .map((item) => limparNome(item.nome_beneficiario_plano_acao))
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort((a, b) => a.localeCompare(b))
  preencherSelect("filtro_beneficiario", beneficiarios, "Todos")
}

function preencherAnosDisponiveis() {
  const anos = Array.from(
    new Set(dadosCompletos.map((item) => item.ano_plano_acao))
  ).sort()
  preencherSelect("filtro_ano", anos, "Todos")
}

function preencherParlamentaresDisponiveis() {
  const parlamentares = Array.from(
    new Set(
      dadosCompletos.map((item) => item.nome_parlamentar_emenda_plano_acao)
    )
  ).sort()
  preencherSelect("filtro_parlamentar", parlamentares, "Todos")
}

function filtrarDados() {
  // Obtém os valores selecionados para beneficiários como um array de strings em minúsculas
  const filtroBeneficiarioValues = Array.from(
    document.getElementById("filtro_beneficiario").selectedOptions
  ).map((option) => option.value.toLowerCase())

  // Obtém os valores selecionados para anos como um array de strings
  const filtroAnoValues = Array.from(
    document.getElementById("filtro_ano").selectedOptions
  ).map((option) => option.value)

  // Obtém os valores selecionados para parlamentares como um array de strings em minúsculas
  const filtroParlamentarValues = Array.from(
    document.getElementById("filtro_parlamentar").selectedOptions
  ).map((option) => option.value.toLowerCase())

  const filtroClientesACAtivo = document.getElementById("Clientes-AC").checked

  const dadosFiltrados = dadosCompletos.filter((item) => {
    // Verifica se o item atual corresponde a qualquer um dos valores selecionados para beneficiários
    const nomeMatch =
      !filtroBeneficiarioValues.length ||
      filtroBeneficiarioValues.includes(
        limparNome(item.nome_beneficiario_plano_acao).toLowerCase()
      )

    // Verifica se o item atual corresponde a qualquer um dos valores selecionados para anos
    const anoMatch =
      !filtroAnoValues.length ||
      filtroAnoValues.includes(item.ano_plano_acao.toString())

    // Verifica se o item atual corresponde a qualquer um dos valores selecionados para parlamentares
    const parlamentarMatch =
      !filtroParlamentarValues.length ||
      filtroParlamentarValues.some((parlamentar) =>
        item.nome_parlamentar_emenda_plano_acao
          .toLowerCase()
          .includes(parlamentar)
      )

    // Verifica se o item atual corresponde à condição do checkbox "Clientes-AC"
    const estaNaListaAC =
      !filtroClientesACAtivo ||
      [
        // Substitua isso pela sua lógica específica, se necessário
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

    return nomeMatch && anoMatch && parlamentarMatch && estaNaListaAC
  })

  displayData(dadosFiltrados)
}

// Event listeners simplificados para chamar filtrarDados diretamente.
;[
  "filtro_beneficiario",
  "filtro_ano",
  "filtro_parlamentar",
  "Clientes-AC",
].forEach((id) => {
  document.getElementById(id).addEventListener("change", filtrarDados)
})

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

document.getElementById("Clientes-AC").addEventListener("change", filtrarDados)

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

document
  .getElementById("filtro_beneficiario")
  .addEventListener("change", function () {
    var selecionados = Array.from(this.selectedOptions).map(
      (option) => option.text
    )
    var displayText =
      selecionados.length > 2
        ? selecionados.slice(0, 2).join(", ") +
          `, +${selecionados.length - 2}...`
        : selecionados.join(", ")

    document.getElementById("selecoes_beneficiario").textContent = displayText

    // Mostra o div se houver mais de duas seleções
    if (selecionados.length > 2) {
      document.getElementById("selecoes_beneficiario").style.display = "block"
    } else {
      document.getElementById("selecoes_beneficiario").style.display = "none"
    }
  })

document.addEventListener("DOMContentLoaded", async (event) => {
  const uf = "SE"
  const urlPlanoAcao = `https://api.transferegov.gestao.gov.br/transferenciasespeciais/plano_acao_especial?uf_beneficiario_plano_acao=eq.${uf}`
  await fetchData(urlPlanoAcao) // Isso preencherá os filtros e chamará filtrarDados no final.

  // Anexa o evento de mudança ao checkbox "Clientes-AC"
  document
    .getElementById("Clientes-AC")
    .addEventListener("change", filtrarDados)

  // Anexa eventos de mudança aos outros filtros
  document
    .getElementById("filtro_beneficiario")
    .addEventListener("change", filtrarDados)
  document.getElementById("filtro_ano").addEventListener("change", filtrarDados)

  // Configuração do Select2 para o filtro de parlamentares, se necessário
  $("#filtro_parlamentar").select2().on("change", filtrarDados)
})

$("#filtro_beneficiario").select2().on("change", filtrarDados)
$("#filtro_ano").select2().on("change", filtrarDados)
