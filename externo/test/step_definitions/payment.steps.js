const { When, Then, Given, setDefaultTimeout} = require('@cucumber/cucumber');
const {assert} = require('chai');
const paymentUtils = require('../../../utils/paymentMethods');
const paymentClient = require('../../../utils/paymentClient');
const verifyCard = require('../../../utils/verifyCreditCard');
// Certifique-se que app.js exporta o app

setDefaultTimeout(20000); //aumenta o timeout para 20 segundos

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
When('a função payBill é chamada com userId {string}', async function (userId) {
    this.response = await paymentUtils.payBill(userId);
});

When('a função checkCard é chamada com {string}, {string} e {int}', async function (cardNumber, expirationDate, cvv) {
    this.response = await verifyCard.verifyCreditCard(cardNumber, expirationDate, cvv);
});

Then('o cartão deve ser verificado com sucesso', async function(){
    assert.exists(this.response);
});

Then('o status do cartão deve ser {string}', async function (status){
   assert.equal(this.response, status);
});

Given('que o token de autenticação foi gerado', async function () {
    this.token = await paymentClient.obterToken();
    this.client = await paymentClient.client();
    console.log(this.client);
});