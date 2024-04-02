document
  .querySelector("#dadosTabela tbody")
  .addEventListener("click", (event) => {
    let target = event.target

    // Navega para cima na árvore do DOM até encontrar uma célula <td> com a classe 'planoAcao'
    while (target != null && !target.classList.contains("planoAcao")) {
      target = target.parentNode
    }

    if (target && target.dataset.idPlanoAcao) {
      const idPlanoAcao = target.dataset.idPlanoAcao
      const link = `https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/${idPlanoAcao}/dados-basicos`
      window.open(link, "_blank")
    }
  })
