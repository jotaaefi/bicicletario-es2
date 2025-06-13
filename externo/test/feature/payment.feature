Feature: Testando API de pagamentos

  Scenario: Verificar o status de pagamento
    When a função payment é chamada com userId "67890" e amount 10
    Then uma cobrança deve ser criada para o usuário com id "67890"
    And o valor da cobrança deve ser 10
    And o status da cobrança deve ser "PENDING"

  Scenario: Pagar uma conta
    When a função payBill é chamada com userId "67890"
    Then o status da cobrança deve ser "COMPLETED"