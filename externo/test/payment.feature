Feature: Testando API de pagamentos

  Background:
    Given que o token de autenticação foi gerado

  Scenario: Verificar o status de pagamento
    When a função payment é chamada com userId "67890" e amount 10
    Then uma cobrança deve ser criada para o usuário com id "67890"
    And o valor da cobrança deve ser 10
    And o status da cobrança deve ser "PENDING"

  Scenario: Pagar uma conta
    When a função payBill é chamada com userId "67890"
    Then o status da cobrança deve ser "COMPLETED"

  Scenario: Verificar um cartão
    When a função checkCard é chamada com "4032038952308009", "2030-04" e 123
    Then o cartão deve ser verificado com sucesso
    Then o status do cartão deve ser "VALID"



