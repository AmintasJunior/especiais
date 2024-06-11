// váriaveis declarada...
let dadosCompletos = []
const uf = "SE"
const urlPlanoAcao = `https://api.transferegov.gestao.gov.br/transferenciasespeciais/plano_acao_especial?uf_beneficiario_plano_acao=eq.${uf}`


//função para buscar os dados na API...
async function fetchData(urlPlanoAcao) {
  try {
    const response = await fetch(urlPlanoAcao)
    const data = await response.json()
    dadosCompletos = data
    console.log(dadosCompletos)
    preencherAnosDisponiveis()
    preencherParlamentaresDisponiveis()
    preencherBeneficiariosDisponiveis()
    filtrarDados() // Chama a filtragem inicial
  } catch (error) {
    console.error("Erro ao buscar dados: ", error)
  }
}

// chama a função criada acima...
fetchData(urlPlanoAcao)
