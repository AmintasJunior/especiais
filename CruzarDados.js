async function fetchPlanoAcaoData(urlPlanoAcao) {
  try {
    const response = await fetch(urlPlanoAcao)
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erro ao buscar dados do Plano de Ação: ", error)
    return []
  }
}

async function fetchEmpenhoData(urlEmpenho) {
  try {
    const response = await fetch(urlEmpenho)
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erro ao buscar dados de Empenho: ", error)
    return []
  }
}

async function cruzarComEmpenho(dadosPlanoAcao, dadosEmpenho) {
  return dadosPlanoAcao.map((planoAcao) => {
    const empenhosCorrespondentes = dadosEmpenho.filter(
      (emp) => emp.id_plano_acao === planoAcao.id_plano_acao
    )

    const empenhosFormatados = empenhosCorrespondentes.map((emp) => ({
      id_empenho: emp.id_empenho,
      id_minuta_empenho: emp.id_minuta_empenho,
      numero_empenho: emp.numero_empenho,
      situacao_empenho: emp.situacao_empenho,
      descricao_situacao_empenho: emp.descricao_situacao_empenho,
      tipo_documento_empenho: emp.tipo_documento_empenho,
      descricao_tipo_documento_empenho: emp.descricao_tipo_documento_empenho,
      status_processamento_empenho: emp.status_processamento_empenho,
      gestao_emitente_empenho: emp.gestao_emitente_empenho,
      ug_responsavel_empenho: emp.ug_responsavel_empenho,
      ug_emitente_empenho: emp.ug_emitente_empenho,
      descricao_ug_emitente_empenho: emp.descricao_ug_emitente_empenho,
      fonte_recurso_empenho: emp.fonte_recurso_empenho,
      plano_interno_empenho: emp.plano_interno_empenho,
      ptres_empenho: emp.ptres_empenho,
      grupo_natureza_despesa_empenho: emp.grupo_natureza_despesa_empenho,
      natureza_despesa_empenho: emp.natureza_despesa_empenho,
      subitem_empenho: emp.subitem_empenho,
      categoria_despesa_empenho: emp.categoria_despesa_empenho,
      modalidade_despesa_empenho: emp.modalidade_despesa_empenho,
      cnpj_beneficiario_empenho: emp.cnpj_beneficiario_empenho,
      nome_beneficiario_empenho: emp.nome_beneficiario_empenho,
      uf_beneficiario_empenho: emp.uf_beneficiario_empenho,
      numero_ro_empenho: emp.numero_ro_empenho,
      data_emissao_empenho: emp.data_emissao_empenho,
      prioridade_desbloqueio_empenho: emp.prioridade_desbloqueio_empenho,
      valor_empenho: emp.valor_empenho,
      id_plano_acao: emp.id_plano_acao,
    }))

    planoAcao.empenhos = empenhosFormatados

    return planoAcao
  })
}

async function unificarDados(urlPlanoAcao, urlEmpenho) {
  try {
    const dadosPlanoAcao = await fetchPlanoAcaoData(urlPlanoAcao)
    const dadosEmpenho = await fetchEmpenhoData(urlEmpenho)

    const resultadoPlanoEmpenho = await cruzarComEmpenho(
      dadosPlanoAcao,
      dadosEmpenho
    )

    return resultadoPlanoEmpenho
  } catch (error) {
    console.error("Erro durante a unificação dos dados:", error)
    return []
  }
}

// Substitua as URLs de exemplo pelas suas URLs reais
const uf = "SE"
const urlEmpenho = `https://api.transferegov.gestao.gov.br/transferenciasespeciais/empenho_especial?uf_beneficiario_empenho=eq.${uf}`
const urlPlanoAcao = `https://api.transferegov.gestao.gov.br/transferenciasespeciais/plano_acao_especial?uf_beneficiario_plano_acao=eq.${uf}`

unificarDados(urlPlanoAcao, urlEmpenho)

export { unificarDados }

// const dadosCompletos = await unificarDados(urlPlanoAcao, urlEmpenho)
// console.log(dadosCompletos)
