const { When, Then } = require('@cucumber/cucumber');
const {assert} = require('chai');
const paymentUtils = require('../../../utils/paymentMethods');
// Certifique-se que app.js exporta o app


When('a função payment é chamada com userId {string} e amount {int}', async function (userId, amount) {
    this.response = await paymentUtils.createBill(userId, amount);
})

Then('uma cobrança deve ser criada para o usuário com id {string}', function (id) {
    assert.equal(this.response.userId, id, 'O ID do usuário não corresponde ao esperado');
});

Then('o valor da cobrança deve ser {int}', function (valor) {
    assert.equal(this.response.amount, valor, 'O valor da cobrança não corresponde ao esperado');
});

Then('o status da cobrança deve ser {string}', function (status) {
    assert.equal(this.response.status, status, 'O status da cobrança não corresponde ao esperado');
});
