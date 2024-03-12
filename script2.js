async function main() {
    const response = await fetch('https://api.transferegov.gestao.gov.br/transferenciasespeciais/plano_acao_especial');
    const data = await response.json();

    console.log(data)


}

main();
