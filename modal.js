// Função para abrir o modal
function abrirModalDetalhes(item) {
  const dadosModalBasicos = document.querySelector(
    "#modalDetalhes .modal-content #modalCaixaDadosBasicos1"
  )

  let gndTexto

  if (
    item.valor_custeio_plano_acao === 0 &&
    item.valor_investimento_plano_acao !== 0
  ) {
    gndTexto = "4 - Investimento"
  } else if (
    item.valor_investimento_plano_acao === 0 &&
    item.valor_custeio_plano_acao !== 0
  ) {
    gndTexto = "3 - Custeio"
  } else if (
    item.valor_custeio_plano_acao !== 0 &&
    item.valor_investimento_plano_acao !== 0
  ) {
    gndTexto = "3 - Custeio e 4 - Investimento"
  } else {
    gndTexto = "Não definido" // ou qualquer outro valor padrão que você queira usar
  }

  dadosModalBasicos.innerHTML = `
    <span>
    <span id="negrito">Beneficiário: </span>
    <span>${limparNome(item.nome_beneficiario_plano_acao)}</span>
    </span>
    
    <span>
    <span id="negrito">GND: </span>
    <span id="gnd">${gndTexto}</span>
    </span>

    <span>
    <span id="negrito">Valor: </span>
    <span>${(
      (parseFloat(item.valor_investimento_plano_acao) || 0) +
      (parseFloat(item.valor_custeio_plano_acao) || 0)
    ).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
    </span>

  `
  const dadosModalBasicos2 = document.querySelector(
    "#modalDetalhes .modal-content #modalCaixaDadosBasicos2"
  )
  dadosModalBasicos2.innerHTML = `

    <span>
    <span id="negrito">Parlamentar: </span>
    <span>${item.nome_parlamentar_emenda_plano_acao}</span>
    </span>

    <span>
    <span id="negrito">Plano de Ação: </span>
    <span>${item.codigo_plano_acao}</span>
    </span>

    <span>
    <span id="negrito">Situação: </span>
    <span>${item.situacao_plano_acao}</span>
    </span>

  `

  const dadosModalDadosBancario = document.querySelector(
    "#modalDetalhes .modal-content #modalCaixaDadosBancario"
  )
  dadosModalDadosBancario.innerHTML = `
    <span>
    <span id="negrito">Banco: </span>
    <span>${item.nome_banco_plano_acao}</span>
    </span>

    <span>
    <span id="negrito">Agência: </span>
    <span>${item.numero_agencia_plano_acao}-${item.dv_agencia_plano_acao}</span>
    </span>

    <span>
    <span id="negrito">Conta: </span>
    <span>${item.numero_conta_plano_acao}-${item.dv_conta_plano_acao}</span>
    </span>
  `

  const dadosModalAplicacao = document.querySelector(
    "#modalDetalhes .modal-content #modalCaixaAplicacao"
  )
  dadosModalAplicacao.innerHTML = `

    <span>
    <span id="negrito">Politicas Públicas: </span>
    <span>${verificarDescricaoAreasPoliticas(
      item.codigo_descricao_areas_politicas_publicas_plano_acao
    )}</span>
    </span>

    <span>
    <span id="negrito">Ação Orçamentária: </span>
    <span>${verificarDescricaoAreasPoliticas(
      item.descricao_programacao_orcamentaria_plano_acao
    )}</span>
    </span>

  `

  // Exibe o modal
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

exportfunction(fecharModalDetalhes)
exportfunction(abrirModalDetalhes)
