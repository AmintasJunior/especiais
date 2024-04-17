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

  elemento.innerHTML = `
    <span>
      <span id="negrito">Beneficiário: </span>
      <span>${limparNome(item.nome_beneficiario_plano_acao)}</span>
    </span>
  `

  // Adicionando informações adicionais se for custeio e/ou investimento
  if (gndTexto.tipo === "3 - Custeio | 4 - Investimento") {
    elemento.innerHTML += `
      <span style="display: block; margin-bottom: 6px;">
        <span id="negrito">Valor Custeio: </span>
        <span>${gndTexto.valorCusteio.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}</span>
      </span>
      <span>
        <span id="negrito">Valor Investimento: </span>
        <span>${gndTexto.valorInvestimento.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}</span>
      </span>
    `
  } else if (gndTexto.tipo === "3 - Custeio") {
    elemento.innerHTML += `
      <span style="gap: 7px;">
        <span id="negrito">Valor Custeio: </span>
        <span>${gndTexto.valorCusteio.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}</span>
      </span>
      <span>
        <span id="negrito">Valor Investimento: </span>
        <span>R$ 0,00</span>
      </span>
    `
  } else if (gndTexto.tipo === "4 - Investimento") {
    elemento.innerHTML += `
      <span style="gap: 7px">
        <span id="negrito">Valor Investimento: </span>
        <span>${gndTexto.valorInvestimento.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}</span>
      </span>
      <span>
        <span id="negrito">Valor Custeio: </span>
        <span>R$ 0,00</span>
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

// Função para imprimir apenas o conteúdo desejado do modal com estilos incluídos, juntamente com cabeçalho e rodapé em imagem
function imprimirConteudoModalComEstilo() {
  // Selecionar o conteúdo específico que você deseja imprimir
  var conteudoParaImpressao = document.getElementById("CaixaModalTxtTitulo").innerHTML;

  // URL das imagens para cabeçalho e rodapé
  var urlCabecalho = "./img/cabeçalho.png";
  var urlRodape = "./img/rodape.png";

  // Criar um iframe temporário para imprimir o conteúdo
  var iframeTemporario = document.createElement('iframe');
  iframeTemporario.style.position = 'absolute';
  iframeTemporario.style.width = '0';
  iframeTemporario.style.height = '0';
  document.body.appendChild(iframeTemporario);

  // Escrever o conteúdo no iframe com estilos incluídos, juntamente com cabeçalho e rodapé em imagem
  var conteudoIframe = `
    <!DOCTYPE html>
    <html>
    <head>
    <title>Impressão</title>
    <style>
    body {
      font-family: "Inter", sans-serif;
      font-size: 14px;
      color: #333;
      padding-top: 35px;
    }
    /* Adicione outros estilos conforme necessário */
    @font-face {
      font-family: "Inter";
      font-style: normal;
      font-weight: 400;
    }
    

    #caixaModalStitulo {
      z-index: 1;
      position: static;
      padding-bottom: 3px;
    }
    
    #CaixaModalTxtTitulo {
      overflow-y: scroll;
      height: 420px;
    }
    
    .close {
      color: #aaa;
      float: right;
      font-size: 22px;
      font-weight: bold;
      padding-right: 12px;
      padding-bottom: 12px;
    }
    
    .close:hover,
    .close:focus {
      color: black;
      cursor: pointer;
    }
    
    #CaixaModalTxtTitulo {
      padding: 15px 10px 10px 2px;

    }
    
    #modalTxtTitulo {
      font-size: 22px;
      color: black;
      font-weight: 500;
      border-bottom: solid 4px rgb(4, 95, 143);
      padding: 5px;
    }
    
    #CaixaCompletaDadosBasicos {
      /* border: solid 1px royalblue; */
      margin: 20px 0 15px;
    }
    
    #seletorCaixaDadosBasico {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding-right: 15px;
    }
    
    #modalCaixaDadosBasicos1 {
      padding: 10px 3px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 7px;
    }
    
    #modalCaixaDadosBasicos2 {
      padding: 10px 3px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 7px;
    }
    
    #txtTituloDadosBasicos {
      font-size: 18px;
      color: black;
      font-weight: 500;
      border-bottom: solid 2px rgb(4, 95, 143);
      padding: 3px;
    }
    
    #CaixaCompletaDadosBancario {
      /* border: solid 1px royalblue; */
      margin: 15px 0 15px;
    }
    
    #modalCaixaDadosBancario {
      display: flex;
      justify-content: space-between;
      padding: 10px 18px 10px 3px;
    }
    
    #txtTituloDadosBancario {
      font-size: 18px;
      color: black;
      font-weight: 500;
      border-bottom: solid 2px rgb(4, 95, 143);
      padding: 3px;
    }
    
    #CaixaCompletaAplicacao {
      /* border: solid 1px royalblue; */
      margin: 15px 0 15px;
    }
    
    #modalCaixaAplicacao {
      padding: 10px 3px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 7px;
    }
    
    #txtTituloAplicacao {
      font-size: 18px;
      color: black;
      font-weight: 500;
      border-bottom: solid 2px rgb(4, 95, 143);
      padding: 3px;
    }
    
    #TxtmodalDetalhes {
      font-weight: 500;
    }
    
    #negrito {
      font-weight: 500;
    }
    
    #gnd {
      color: rgb(4, 95, 143);
      font-weight: 600;
    }
    
    #dadosTabelaAplicacaoFuncao {
      width: 100%;
      border-collapse: collapse;
      border: solid 0.5px #f5f5f5;
    }
    
    #dadosTabelaAplicacaoFuncao thead th {
      background-color: rgb(4, 95, 143);
      color: white;
      font-weight: 500;
      text-align: left;
      height: 25px;
      font-size: 16px;
      padding-left: 5px;
    }
    
    #dadosTabelaAplicacaoFuncao tbody tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    
    #dadosTabelaAplicacaoFuncao tbody tr:hover {
      background-color: #ddd;
    }
    
    #dadosTabelaAplicacaoFuncao td {
      padding: 5px;
      text-align: left;
      height: 30px;
      font-size: 15px;
    }
    
    #dadosTabelaAplicacaoAcao {
      width: 100%;
      border-collapse: collapse;
      border: solid 0.5px #f5f5f5;
      margin-top: 7px;
    }
    
    #dadosTabelaAplicacaoAcao thead th {
      background-color: rgb(4, 95, 143);
      color: white;
      font-weight: 500;
      text-align: left;
      height: 25px;
      font-size: 16px;
      padding-left: 5px;
    }
    
    #dadosTabelaAplicacaoAcao tbody tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    
    #dadosTabelaAplicacaoAcao tbody tr:hover {
      background-color: #ddd;
    }
    
    #dadosTabelaAplicacaoAcao td {
      padding: 5px;
      text-align: left;
      height: 30px;
      font-size: 15px;
    }

      /* Estilos para o cabeçalho */
      #cabecalho {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100px; /* Ajuste conforme necessário */
        background-image: url(${urlCabecalho});
        background-size: contain;
        background-repeat: no-repeat;
      }

      /* Estilos para o rodapé */
      #rodape {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 40px; /* Ajuste conforme necessário */
        background-image: url(${urlRodape});
        background-size: contain;
        background-repeat: no-repeat;
      }
    </style>
    </head>
    <body>
    <div id="cabecalho"></div>
    ${conteudoParaImpressao}
    </body>
    <tfoot>
    <div id="rodape"></div>
    </tfoot>
    </html>
  `;
  var iframeDocumento = iframeTemporario.contentWindow || iframeTemporario.contentDocument;
  iframeDocumento.document.open();
  iframeDocumento.document.write(conteudoIframe);
  iframeDocumento.document.close();

  // Esperar um pouco para garantir que o conteúdo seja carregado no iframe
  setTimeout(function() {
    // Chamar o método de impressão do iframe
    iframeDocumento.focus();
    iframeDocumento.print();
    // Remover o iframe temporário após a impressão
    document.body.removeChild(iframeTemporario);
  }, 1000); // Aguarda 1 segundo para garantir que o conteúdo seja carregado corretamente
}

