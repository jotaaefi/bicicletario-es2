Feature: Testando API de pagamentos

  Scenario: Verificar o status de pagamento
    When a função payment é chamada com userId "12345" e amount 10
    Then uma cobrança deve ser criada para o usuário com id "12345"
    And o valor da cobrança deve ser 10
    And o status da cobrança deve ser "PENDING"
