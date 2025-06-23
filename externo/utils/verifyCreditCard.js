
const {obterToken} = require("./paymentClient");
const fetch = require("node-fetch");
const crypto = require("crypto");

async function verifyCreditCard(cardNumber,expiry,cvv) {
    const accessToken = await obterToken();
    let amount = 1; //1 real

    const response_createbill = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'PayPal-Request-Id': crypto.randomUUID()
        },
        body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [{
                amount: {
                    currency_code: "BRL",
                    value: amount.toString()
                }
            }]
        })
    });

    const data = await response_createbill.json();
    const response_paybill = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${latestBill.orderId}/capture`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'PayPal-Request-Id': response_createbill.orderId,
        },
        body: JSON.stringify({
            payment_source: {
                card: {
                    number: cardNumber,
                    expiry: expiry,
                    security_code: cvv,
                    name: "JOHN DOE" //john doe seria nosso joão da silva? sinceramente, não muda nada
                    //então vou deixar john doe.
                }
            }
        })


    });

    console.log(response_paybill);
    return response_paybill;


}

module.exports = {
    verifyCreditCard
}