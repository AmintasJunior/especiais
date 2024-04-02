function displayData(data) {
  let dadosOrdenados = [...data].sort((a, b) =>
    limparNome(a.nome_beneficiario_plano_acao).localeCompare(
      limparNome(b.nome_beneficiario_plano_acao)
    )
  )
  const tableBody = document.querySelector("#dadosTabela tbody")
  tableBody.innerHTML = ""

  let totalInvestimento = 0
  let totalCusteio = 0

  dadosOrdenados.forEach((item) => {
    const row = document.createElement("tr")

    const valorInvestimento =
      parseFloat(item.valor_investimento_plano_acao) || 0 // Converte para número, usa 0 se falhar
    const valorCusteio = parseFloat(item.valor_custeio_plano_acao) || 0 // Converte para número, usa 0 se falhar

    row.innerHTML = `
      <td>${limparNome(item.nome_beneficiario_plano_acao)}</td>
      <td>${item.ano_plano_acao}</td>
      <td>${item.nome_parlamentar_emenda_plano_acao}</td>
      <td data-id-plano-acao="${item.id_plano_acao}" class="planoAcao">${
      item.codigo_plano_acao
    }</td>
      <td>${item.situacao_plano_acao}</td>
      <td>${(
        parseFloat(item.valor_investimento_plano_acao) || 0
      ).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
      <td>${(parseFloat(item.valor_custeio_plano_acao) || 0).toLocaleString(
        "pt-BR",
        { style: "currency", currency: "BRL" }
      )}</td>
      <td><span onclick="abrirModalDetalhes()" class="eye-icon"><i class="far fa-eye"></i></span></td>
    `

    const eyeIcon = row.querySelector(".eye-icon")
    if (eyeIcon) {
      eyeIcon.addEventListener("click", () => abrirModalDetalhes(item))
    }

    tableBody.appendChild(row)

    totalInvestimento += valorInvestimento
    totalCusteio += valorCusteio
  })

  document.getElementById("totalInvestimento").textContent =
    totalInvestimento.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  document.getElementById("totalCusteio").textContent =
    totalCusteio.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  // Agora que os dados foram inseridos, obtenha a contagem de linhas
  let contagem = contarLinhas("corpoTabela") // Substitua "corpoTabela" pelo ID correto, se necessário

  // Atualize o elemento HTML com a nova contagem de linhas
  document.getElementById("contagemLinhas").textContent =
    "Total de Instrumentos:  " + contagem

  // Opcionalmente, se quiser manter a contagem em uma variável dentro de `displayData` por algum outro motivo:
  let contagemLinhas = contagem // Agora `contagemLinhas` contém o número de linhas

  function contarLinhas(idDaTabela) {
    var corpoTabela = document.getElementById(idDaTabela) // Usa o ID para selecionar diretamente o tbody
    if (corpoTabela) {
      return corpoTabela.rows.length // Retorna o número de linhas no tbody
    } else {
      // Se, por algum motivo, o tbody não for encontrado, tenta contar as linhas diretamente na tabela
      // Isso é mais uma garantia, mas com a estrutura fornecida, o tbody deve sempre ser encontrado
      var tabela = document.getElementById("dadosTabela")
      return tabela.rows.length
    }
  }
}
