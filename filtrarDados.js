// Função para preencher um select com as opções
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

// Função para preencher os beneficiários disponíveis
function preencherBeneficiariosDisponiveis() {
  const beneficiarios = dadosCompletos
    .map((item) => limparNome(item.nome_beneficiario_plano_acao))
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort((a, b) => a.localeCompare(b))
  preencherSelect("filtro_beneficiario", beneficiarios, "Todos")
}

// Função para preencher os anos disponíveis
function preencherAnosDisponiveis() {
  const anos = Array.from(
    new Set(dadosCompletos.map((item) => item.ano_plano_acao))
  ).sort()
  preencherSelect("filtro_ano", anos, "Todos")
}

// Função para preencher os parlamentares disponíveis
function preencherParlamentaresDisponiveis() {
  const parlamentares = Array.from(
    new Set(
      dadosCompletos.map((item) => item.nome_parlamentar_emenda_plano_acao)
    )
  ).sort()
  preencherSelect("filtro_parlamentar", parlamentares, "Todos")
}

// Adiciona listeners de mudança aos elementos relevantes
document.addEventListener("DOMContentLoaded", async (event) => {
  await fetchData(urlPlanoAcao) // Isso preencherá os filtros e chamará filtrarDados no final.

  // Preenche os filtros com as opções disponíveis
  preencherBeneficiariosDisponiveis()
  preencherAnosDisponiveis()
  preencherParlamentaresDisponiveis()

  // Adiciona eventos de mudança aos filtros para chamar a função filtrarDados
  ;[
    "filtro_beneficiario",
    "filtro_ano",
    "filtro_parlamentar",
    // "Clientes-AC",
  ].forEach((id) => {
    document.getElementById(id).addEventListener("change", filtrarDados)
  })

  // Configura o Select2 para os filtros de beneficiários, anos e parlamentares
  $("#filtro_beneficiario, #filtro_ano, #filtro_parlamentar")
    .select2()
    .on("change", filtrarDados)

  // Adiciona evento de mudança ao checkbox "Clientes-AC"
  document
    // .getElementById("Clientes-AC")
    .addEventListener("change", filtrarDados)
})

// Função para filtrar os dados com base nas seleções do usuário
function filtrarDados() {
  const filtroBeneficiarioValues = obterValoresSelecionados(
    "filtro_beneficiario"
  )
  const filtroAnoValues = obterValoresSelecionados("filtro_ano")
  const filtroParlamentarValues = obterValoresSelecionados(
    "filtro_parlamentar"
  ).map((valor) => valor.toLowerCase())
  // const filtroClientesACAtivo = document.getElementById("Clientes-AC").checked

  const dadosFiltrados = dadosCompletos.filter((item) => {
    const nomeMatch = verificarNomeMatch(item, filtroBeneficiarioValues)
    const anoMatch = verificarAnoMatch(item, filtroAnoValues)
    const parlamentarMatch = verificarParlamentarMatch(
      item,
      filtroParlamentarValues
    )
    // const estaNaListaAC = verificarAC(item, filtroClientesACAtivo)
    return nomeMatch && anoMatch && parlamentarMatch
  })

  displayData(dadosFiltrados)
}

// Função auxiliar para obter os valores selecionados de um elemento select
function obterValoresSelecionados(id) {
  return Array.from(document.getElementById(id).selectedOptions).map(
    (option) => option.value
  )
}

// Funções auxiliares para verificar se os itens correspondem aos critérios de filtragem
function verificarNomeMatch(item, filtroBeneficiarioValues) {
  return (
    !filtroBeneficiarioValues.length ||
    filtroBeneficiarioValues.includes("Todos") ||
    filtroBeneficiarioValues.includes(
      limparNome(item.nome_beneficiario_plano_acao)
    )
  )
}

function verificarAnoMatch(item, filtroAnoValues) {
  return (
    !filtroAnoValues.length ||
    filtroAnoValues.includes("Todos") ||
    filtroAnoValues.includes(item.ano_plano_acao.toString())
  )
}

function verificarParlamentarMatch(item, filtroParlamentarValues) {
  return (
    !filtroParlamentarValues.length ||
    filtroParlamentarValues.includes("Todos") ||
    filtroParlamentarValues.some((parlamentar) =>
      item.nome_parlamentar_emenda_plano_acao
        .toLowerCase()
        .includes(parlamentar)
    )
  )
}

// function verificarAC(item, filtroClientesACAtivo) {
//   const clientesAC = [
//     "ARAUA",
//     "CANHOBA",
//     "CEDRO DE SAO JOAO",
//     "CUMBE",
//     "GARARU",
//     "GENERAL MAYNARD",
//     "GRACCHO CARDOSO",
//     "ITABAIANINHA",
//     "ITABI",
//     "MACAMBIRA",
//     "MALHADA DOS BOIS",
//     "MARUIM",
//     "MURIBECA",
//     "NOSSA SENHORA DA GLORIA",
//     "PORTO DA FOLHA",
//     "PROPRIA",
//     "RIACHUELO",
//     "SANTO AMARO DAS BROTAS",
//     "SAO FRANCISCO",
//     "TELHA",
//     "TOMAR DO GERU",
//   ]
//   return (
//     !filtroClientesACAtivo ||
//     clientesAC.includes("Todos") ||
//     clientesAC.includes(limparNome(item.nome_beneficiario_plano_acao))
//   )
// }

// Adiciona listeners de mudança aos elementos relevantes
document.addEventListener("DOMContentLoaded", async (event) => {
  await fetchData(urlPlanoAcao) // Isso preencherá os filtros e chamará filtrarDados no final.

  // Anexa os eventos de mudança aos filtros
  ;[
    "filtro_beneficiario",
    "filtro_ano",
    "filtro_parlamentar",
    // "Clientes-AC",
  ].forEach((id) => {
    document.getElementById(id).addEventListener("change", filtrarDados)
  })

  // Configura o Select2 para os filtros de beneficiários e anos
  $("#filtro_beneficiario, #filtro_ano").select2().on("change", filtrarDados)

  // Anexa o evento de mudança ao checkbox "Clientes-AC"
  document
    // .getElementById("Clientes-AC")
    .addEventListener("change", filtrarDados)
})
