// Função para preencher um select com as opções
function preencherSelect(selectId, dados) {
  const selectElement = document.getElementById(selectId)
  selectElement.innerHTML = ""
  dados.forEach((dado) => {
    const option = document.createElement("option")
    option.value = dado
    option.textContent = dado
    selectElement.appendChild(option)
  })

  // Aplica o Select2 ao select
  // $(selectElement).select2()
}

// Função para preencher os beneficiários disponíveis
function preencherBeneficiariosDisponiveis() {
  const beneficiarios = dadosCompletos
    .map((item) => limparNome(item.nome_beneficiario_plano_acao))
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort((a, b) => a.localeCompare(b))
  preencherSelect("filtro_beneficiario", beneficiarios)
}

// Função para preencher os anos disponíveis
function preencherAnosDisponiveis() {
  const anos = Array.from(
    new Set(dadosCompletos.map((item) => item.ano_plano_acao))
  ).sort()
  preencherSelect("filtro_ano", anos)
}

// Função para preencher os parlamentares disponíveis
function preencherParlamentaresDisponiveis() {
  const parlamentares = Array.from(
    new Set(
      dadosCompletos.map((item) => item.nome_parlamentar_emenda_plano_acao)
    )
  ).sort()
  preencherSelect("filtro_parlamentar", parlamentares)
}

// Adiciona listeners de mudança aos elementos relevantes
document.addEventListener("DOMContentLoaded", async (event) => {
  await fetchData(urlPlanoAcao) // Isso preencherá os filtros e chamará filtrarDados no final.

  // Preenche os filtros com as opções disponíveis
  preencherBeneficiariosDisponiveis()
  preencherAnosDisponiveis()
  preencherParlamentaresDisponiveis()

  // Adiciona eventos de mudança aos filtros para chamar a função filtrarDados
  ;["filtro_beneficiario", "filtro_ano", "filtro_parlamentar"].forEach((id) => {
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
