// Inicializa um array vazio para armazenar os dados completos recebidos da API.
let dadosCompletos = []

// Função assíncrona para buscar dados de uma URL fornecida e processá-los.
async function fetchData(url) {
  try {
    // Tenta buscar dados da URL fornecida.
    const response = await fetch(url)
    const data = await response.json() // Converte a resposta em JSON.
    dadosCompletos = data // Armazena os dados recebidos no array dadosCompletos.
    // Chama funções para preencher os filtros e filtrar os dados inicialmente.
    preencherAnosDisponiveis()
    preencherParlamentaresDisponiveis()
    preencherBeneficiariosDisponiveis()
    filtrarDados()
  } catch (error) {
    // Captura e exibe qualquer erro que ocorra durante a busca ou processamento dos dados.
    console.error("Erro ao buscar dados: ", error)
  }
}

// Função para limpar e normalizar nomes de beneficiários.
function limparNome(nome) {
  return nome
    .normalize("NFD") // Normaliza a string para a forma de decomposição de compatibilidade Unicode.
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos.
    .replace(/MUNICIPIO DE |MUNICÍPIO DE /gi, "") // Remove prefixos comuns.
    .trim() // Remove espaços em branco no início e no fim.
}

// Função para preencher o filtro de beneficiários disponíveis.
function preencherBeneficiariosDisponiveis() {
  const beneficiarios = dadosCompletos
    .map((item) => limparNome(item.nome_beneficiario_plano_acao)) // Limpa e normaliza os nomes.
    .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicatas.
    .sort((a, b) => a.localeCompare(b, "pt-BR")) // Ordena os nomes.

  // Seleciona o elemento do DOM para o filtro de beneficiários e o preenche com opções.
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

console.log(dadosCompletos)

document.addEventListener("DOMContentLoaded", (event) => {
  // Ativar o checkbox "Clientes-AC" ao carregar a página
  document.getElementById("Clientes-AC").checked = true

  const uf = "SE"
  const url = `https://api.transferegov.gestao.gov.br/transferenciasespeciais/plano_acao_especial?uf_beneficiario_plano_acao=eq.${uf}`
  fetchData(url)
})
