async function main() {
    const result = await fetch('https://api.transferegov.gestao.gov.br/transferenciasespeciais/plano_acao_especial')
    const data = await result.json()
    console.log (data)
}
    main()