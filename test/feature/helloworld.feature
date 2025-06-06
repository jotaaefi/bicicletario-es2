Feature: Teste da API básica

Scenario: Verificar se a API está viva
When eu faço uma requisição GET para "/"
Then a resposta deve ser 200
And a mensagem deve conter "API viva e funcionando"

