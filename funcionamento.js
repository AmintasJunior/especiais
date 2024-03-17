const urlLiquidacao = `https://api.transferegov.gestao.gov.br/transferenciasespeciais/ordem_pagamento_ordem_bancaria_especial`

async function fetchLiquidacaoData(urlLiquidacao) {
  try {
    const response = await fetch(urlLiquidacao)
    const data = await response.json()
    return data // Retorna os dados do plano de ação
  } catch (error) {
    console.error("Erro ao buscar dados do plano de ação: ", error)
    return [] // Retorna um array vazio em caso de erro
  }
}

fetchLiquidacaoData(urlLiquidacao).then((data) => {
  console.log(data) // Aqui você tem os dados de empenho com os dados do plano de ação correspondente incluídos
})
