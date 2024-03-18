// Função para abrir o modal e preencher com os detalhes do item
function abrirModalDetalhes(item) {
  // Define os elementos do DOM onde os dados serão inseridos
  const dadosModalBasicos = document.querySelector(
    "#modalDetalhes .modal-content #modalCaixaDadosBasicos1"
  )
  const dadosModalBasicos2 = document.querySelector(
    "#modalDetalhes .modal-content #modalCaixaDadosBasicos2"
  )
  const dadosModalDadosBancario = document.querySelector(
    "#modalDetalhes .modal-content #modalCaixaDadosBancario"
  )
  const tbodyFuncaoSubfuncao = document.querySelector(
    "#dadosTabelaFuncaoSubfuncao"
  )
  const tbodyAcaoOrcamentaria = document.querySelector(
    "#dadosTabelaAcaoOrcamentaria"
  )

  // Limpa os tbodys antes de adicionar novos dados
  tbodyFuncaoSubfuncao.innerHTML = ""
  tbodyAcaoOrcamentaria.innerHTML = ""

  // Preenche os dados básicos, dados bancários e outras informações
  preencherDadosBasicos(dadosModalBasicos, item)
  preencherDadosBasicos2(dadosModalBasicos2, item)
  preencherDadosBancarios(dadosModalDadosBancario, item)

  // Processa e adiciona itens às tabelas de Função/Subfunção e Ação Orçamentária
  processarEAdicionarItensTabelas(
    item,
    tbodyFuncaoSubfuncao,
    tbodyAcaoOrcamentaria
  )

  // Exibe o modal
  document.getElementById("modalDetalhes").style.display = "block"
}

function preencherDadosBasicos(elemento, item) {
  let gndTexto = determinarGndTexto(item)
  let valorTotal =
    (parseFloat(item.valor_investimento_plano_acao) || 0) +
    (parseFloat(item.valor_custeio_plano_acao) || 0)

  elemento.innerHTML = `
    <span>
      <span id="negrito">Beneficiário: </span>
      <span>${item.nome_beneficiario_plano_acao}</span>
    </span>
    <span>
      <span id="negrito">GND: </span>
      <span id="gnd">${gndTexto.tipo}</span>
    </span>

  `

  // Adicionando informações adicionais se for custeio e/ou investimento
  if (gndTexto.tipo === "3 - Custeio | 4 - Investimento") {
    elemento.innerHTML += `
      <span>
        <span id="negrito">Valor: </span>
        <span>${gndTexto.valorCusteio.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })} | ${gndTexto.valorInvestimento.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}</span>
      </span>
    `
  } else if (gndTexto.tipo === "3 - Custeio") {
    elemento.innerHTML += `
      <span>
        <span id="negrito">Valor: </span>
        <span>${gndTexto.valorCusteio.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}</span>
      </span>
    `
  } else if (gndTexto.tipo === "4 - Investimento") {
    elemento.innerHTML += `
      <span>
        <span id="negrito">Valor: </span>
        <span>${gndTexto.valorInvestimento.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}</span>
      </span>
    `
  }
}

function preencherDadosBasicos2(elemento, item) {
  elemento.innerHTML = `
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
}

function preencherDadosBancarios(elemento, item) {
  elemento.innerHTML = `
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
}

function determinarGndTexto(item) {
  let resultado = {
    tipo: "",
    valorInvestimento: 0,
    valorCusteio: 0,
  }

  if (
    item.valor_custeio_plano_acao === 0 &&
    item.valor_investimento_plano_acao !== 0
  ) {
    resultado.tipo = "4 - Investimento"
    resultado.valorInvestimento = item.valor_investimento_plano_acao
  } else if (
    item.valor_investimento_plano_acao === 0 &&
    item.valor_custeio_plano_acao !== 0
  ) {
    resultado.tipo = "3 - Custeio"
    resultado.valorCusteio = item.valor_custeio_plano_acao
  } else if (
    item.valor_custeio_plano_acao !== 0 &&
    item.valor_investimento_plano_acao !== 0
  ) {
    resultado.tipo = "3 - Custeio | 4 - Investimento"
    resultado.valorInvestimento = item.valor_investimento_plano_acao
    resultado.valorCusteio = item.valor_custeio_plano_acao
  } else {
    resultado.tipo = "Não definido"
  }

  return resultado
}

function processarEAdicionarItensTabelas(
  item,
  tbodyFuncaoSubfuncao,
  tbodyAcaoOrcamentaria
) {
  const politicasPublicasRaw =
    item.codigo_descricao_areas_politicas_publicas_plano_acao ||
    "Não cadastrado no Transferegov"
  const acoesOrcamentariasRaw =
    item.descricao_programacao_orcamentaria_plano_acao ||
    "Não cadastrado no Transferegov"

  // Ajuste para usar " , " como delimitador específico para split
  const acoesOrcamentarias = acoesOrcamentariasRaw.includes(" , ")
    ? splitCustom(acoesOrcamentariasRaw, " , ")
    : [acoesOrcamentariasRaw]

  politicasPublicasRaw.split(",").forEach((politica) => {
    const tr = document.createElement("tr")
    const [funcao, subFuncao] = politica.split("/")
    tr.innerHTML = `<td>${funcao.trim()}</td><td>${
      subFuncao ? subFuncao.trim() : ""
    }</td>`
    tbodyFuncaoSubfuncao.appendChild(tr)
  })

  acoesOrcamentarias.forEach((acao) => {
    const tr = document.createElement("tr")
    tr.innerHTML = `<td>${acao.trim()}</td>`
    tbodyAcaoOrcamentaria.appendChild(tr)
  })
}

// Função auxiliar para dividir a string com um delimitador customizado " , "
function splitCustom(str, delimiter) {
  return str.split(delimiter).map((s) => s.trim())
}

// Função para fechar o modal
function fecharModalDetalhes() {
  document.getElementById("modalDetalhes").style.display = "none"
}

// Evento para fechar o modal clicando fora dele
window.onclick = function (event) {
  if (event.target == document.getElementById("modalDetalhes")) {
    fecharModalDetalhes()
  }
}
