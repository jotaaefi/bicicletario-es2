//Eu já fiz com Python, agora que preciso passar, vou fazer com node.
//Chame de preguiça, fale que Javascript
//não é linguagem de verdade, mas eu PRECISO passar nessa matéria.
//E com uma nota boa, se possível.

const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const dotenv = require('dotenv');

dotenv.config();

function environment() {
    let clientId = process.env.CLIENTID;
    let clientSecret = process.env.CLIENTSECRET;
    return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
    return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

async function obterToken() {
    const clientId = process.env.CLIENTID;
    const clientSecret = process.env.CLIENTSECRET;

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const resposta = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });

    const dados = await resposta.json();
    return dados.access_token;
}


module.exports = { client, obterToken };
