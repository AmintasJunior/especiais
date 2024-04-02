document
  .getElementById("exportExcelButton")
  .addEventListener("click", exportToExcel)
function exportToExcel() {
  const wb = XLSX.utils.table_to_book(document.getElementById("dadosTabela"), {
    sheet: "Sheet JS",
  })
  XLSX.writeFile(wb, "Transferências Especiais - AC.xlsx")
}

function exportToPDF() {
  const options = {
    margin: 1,
    filename: "documento.pdf",
    image: { type: "png", quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    header: {
      height: "1in",
      contents: '<img src="./img/cabecalho.png" style="width: 100%;" />',
    },
    footer: {
      height: "1in",
      contents: '<img src="./img/rodape.png" style="width: 100%;" />',
    },
  }

  const content = document.getElementById("dadosTabela")

  html2pdf().from(content).set(options).save()
}

document
  .getElementById("exportPDFButton")
  .addEventListener("click", exportToPDF)

document
  .getElementById("exportPDFButton")
  .addEventListener("click", exportToPDF)
