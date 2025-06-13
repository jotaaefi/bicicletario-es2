//Foi mal estar tudo em inglês. Acho que é o costume.
//Pareceu esquisito misturar inglês com português.
//Meu supervisor dizia para escolher uma, então escolhi o inglês.

const express = require("express");
const router = express.Router();
const paymentMethods = require("../utils/paymentMethods");


router.post('/cobranca', async (req, res) => {
    let {value, userId} = req.body;
    const now = new Date();
    const requestedTime = now.toLocaleString('pt-BR');
    let response = await paymentMethods.createBill(userId, value, requestedTime);

    res.status(200).send(response);

})

module.exports = router;
    // const creditCard = userData.creditCard;
    //
    // const billing = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${accessToken}`
    //     },
    //     body: JSON.stringify({
    //         intent: "CAPTURE",
    //         purchase_units: [{
    //             amount: {
    //                 currency_code: "BRL",
    //                 value: "10.00"
    //             }
    //         }],
    //         payment_source: {
    //             card: {
    //                 number: "4111111111111111",
    //                 expiry: "2026-01",
    //                 security_code: "123",
    //                 name: "JOHN DOE",
    //                 billing_address: {
    //                     address_line_1: "123 Main St",
    //                     admin_area_2: "San Jose",
    //                     admin_area_1: "CA",
    //                     postal_code: "95131",
    //                     country_code: "US"
    //                 }
    //             }
    //         }
    //     })
    // });


// async function criarPagamentoCartao() {
//     const accessToken = await obterToken();
//
//     const pagamento = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${accessToken}`
//         },
//         body: JSON.stringify({
//             intent: "CAPTURE",
//             purchase_units: [{
//                 amount: {
//                     currency_code: "BRL",
//                     value: "10.00"
//                 }
//             }],
//             payment_source: {
//                 card: {
//                     number: "4111111111111111",
//                     expiry: "2026-01",
//                     security_code: "123",
//                     name: "JOHN DOE",
//                     billing_address: {
//                         address_line_1: "123 Main St",
//                         admin_area_2: "San Jose",
//                         admin_area_1: "CA",
//                         postal_code: "95131",
//                         country_code: "US"
//                     }
//                 }
//             }
//         })
//     });
//
//     const data = await pagamento.json();
//     console.log(JSON.stringify(data, null, 2));
// }
//
// async function obterToken() {
//     const clientId = 'SEU_CLIENT_ID_SANDBOX';
//     const clientSecret = 'SEU_SECRET_SANDBOX';
//
//     const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
//
//     const resposta = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
//         method: 'POST',
//         headers: {
//             'Authorization': `Basic ${credentials}`,
//             'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         body: 'grant_type=client_credentials'
//     });
//
//     const dados = await resposta.json();
//     return dados.access_token;
// }
//
// criarPagamentoCartao();

