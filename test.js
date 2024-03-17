// Função para buscar dados do Plano de Ação
async function fetchPlanoAcaoData(urlPlanoAcao) {
  try {
    const response = await fetch(urlPlanoAcao)
    const data = await response.json()
    console.log("Dados Plano de Ação carregados:", data.length)
    return data
  } catch (error) {
    console.error("Erro ao buscar dados do Plano de Ação: ", error)
    return []
  }
}

// Função para buscar dados de Empenho
async function fetchEmpenhoData(urlEmpenho) {
  try {
    const response = await fetch(urlEmpenho)
    const data = await response.json()
    console.log("Dados Empenho carregados:", data.length)
    return data
  } catch (error) {
    console.error("Erro ao buscar dados de Empenho: ", error)
    return []
  }
}

// Função para buscar todos os dados de Liquidação com paginação
async function fetchLiquidacaoData() {
  try {
    const urlLiquidacao =
      "https://api.transferegov.gestao.gov.br/transferenciasespeciais/documento_habil_especial?limit=1000"
    const response = await fetch(urlLiquidacao)

    if (!response.ok) {
      throw new Error(
        `Erro ao buscar dados de Liquidação: ${response.statusText}`
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
    return []
  }
}

async function fetchPagamentosData() {
  try {
    const urlPagamentos = `https://api.transferegov.gestao.gov.br/transferenciasespeciais/ordem_pagamento_ordem_bancaria_especial?limit=1000`
    const response = await fetch(urlPagamentos)

    if (!response.ok) {
      throw new Error(
        `Erro ao buscar dados de Pagamentos: ${response.statusText}`
      )
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Resposta da API não é um JSON válido")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
    return []
  }
}

async function cruzarComEmpenho(dadosPlanoAcao, dadosEmpenho) {
  return dadosPlanoAcao
    .map((item) => {
      // Encontra o empenho correspondente no array de dados de empenho
      const empenhoCorrespondente = dadosEmpenho.find(
        (emp) => emp.id_empenho === item.id_empenho
      )

      // Retorna o item com os dados do empenho, se encontrado
      return empenhoCorrespondente
        ? {
            ...item,
            empenho: empenhoCorrespondente,
          }
        : null // Retorna null se o empenho correspondente não for encontrado
    })
    .filter(Boolean) // Filtra para remover os itens nulos
}

// Função para cruzar o resultado anterior com Liquidação
async function cruzarComLiquidacao(dadosCruzados, dadosLiquidacao) {
  return dadosCruzados.map((item) => {
    if (!item.empenho) {
      console.error("Empenho não encontrado para o item:", item)
      return item
    }
    // Filtra as liquidações com base no ID do empenho
    const liquidacoes = dadosLiquidacao.filter(
      (l) => l.id_empenho === item.empenho.id_empenho
    )
    // Retorna o item com as liquidações
    return {
      ...item,
      liquidacao: liquidacoes,
    }
  })
}

// Função para cruzar o resultado anterior com Pagamento
async function cruzarComPagamento(dadosCruzados, dadosPagamento) {
  return dadosCruzados.map((item) => {
    // Verifica se o array de liquidações está vazio
    if (!Array.isArray(item.liquidacao) || item.liquidacao.length === 0) {
      console.error("Liquidação não encontrada para o item:", item)
      return item
    }
    // Usa reduce apenas se houver liquidações
    const pagamentos = item.liquidacao.reduce((acc, liqui) => {
      const pagamentosRelacionados = dadosPagamento.filter(
        (p) => p.id_dh === liqui.id_dh
      )
      return acc.concat(pagamentosRelacionados)
    }, [])
    return {
      ...item,
      pagamentos: pagamentos,
    }
  })
}

async function unificarDados(
  urlPlanoAcao,
  urlEmpenho,
  urlLiquidacao,
  urlPagamentos
) {
  try {
    const dadosPlanoAcao = await fetchPlanoAcaoData(urlPlanoAcao)
    const dadosEmpenho = await fetchEmpenhoData(urlEmpenho)
    const dadosLiquidacao = await fetchLiquidacaoData(urlLiquidacao)
    const dadosPagamento = await fetchPagamentosData(urlPagamentos)

    const resultadoPlanoEmpenho = await cruzarComEmpenho(
      dadosPlanoAcao,
      dadosEmpenho
    )
    console.log(
      "Após cruzar Plano de Ação com Empenho:",
      resultadoPlanoEmpenho.length
    )

    const resultadoPlanoEmpenhoLiquidacao = await cruzarComLiquidacao(
      resultadoPlanoEmpenho,
      dadosLiquidacao
    )
    console.log(
      "Após cruzar com Liquidação:",
      resultadoPlanoEmpenhoLiquidacao.length
    )

    const resultadoFinal = await cruzarComPagamento(
      resultadoPlanoEmpenhoLiquidacao,
      dadosPagamento
    )
    console.log(
      "Resultado Final após cruzar com Pagamento:",
      resultadoFinal.length
    )

    return resultadoFinal
  } catch (error) {
    console.error("Erro durante a unificação dos dados:", error)
    return []
  }
}

// Substitua as URLs de exemplo pelas suas URLs reais
const uf = "SE"
const urlEmpenho = `https://api.transferegov.gestao.gov.br/transferenciasespeciais/empenho_especial?uf_beneficiario_empenho=eq.${uf}`
const urlPlanoAcao = `https://api.transferegov.gestao.gov.br/transferenciasespeciais/plano_acao_especial?uf_beneficiario_plano_acao=eq.${uf}`
const urlLiquidacao = `https://api.transferegov.gestao.gov.br/transferenciasespeciais/documento_habil_especial?limit=1000`
const urlPagamentos = `https://api.transferegov.gestao.gov.br/transferenciasespeciais/ordem_pagamento_ordem_bancaria_especial?limit=1000`

unificarDados(urlPlanoAcao, urlEmpenho, urlLiquidacao, urlPagamentos)
  .then((resultadoFinal) => {
    console.log("Resultado Final da Unificação:", resultadoFinal)
  })
  .catch((error) => {
    console.error("Erro durante a unificação dos dados:", error)
  })
