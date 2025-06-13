const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const crypto = require("crypto");
const { obterToken } = require("./paymentClient");
const userData = require("../database.json");

const BILLS_FILE = path.join(__dirname, "bills.json");

function loadBills() {
    if (!fs.existsSync(BILLS_FILE)) {
        fs.writeFileSync(BILLS_FILE, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(BILLS_FILE));
}

function saveBills(bills) {
    fs.writeFileSync(BILLS_FILE, JSON.stringify(bills, null, 2));
}

async function createBill(userId, amount){
    //1 - Obter o token de acesso
    //2 - Criar a cobrança
    //3 - Salvar a cobrança no arquivo bills.json


    const accessToken = await obterToken();

    const user = userData.users.find(u => u.userId === userId);
    if (!user) throw new Error("Usuário não encontrado");

    const response = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
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

    const data = await response.json();
    if (!response.ok) throw new Error(`Erro ao criar cobrança: ${data.message}`);

    const bills = loadBills();
    if (!bills[userId]) bills[userId] = [];
    bills[userId].push({
        orderId: data.id,
        amount: amount.toString(),
        status: "PENDING"
    });
    saveBills(bills);
    let billResponse = {
        userId: userId,
        orderId: data.id,
        amount: amount.toString(),
        status: "PENDING"
    };

    return billResponse;
}

module.exports = {
    createBill,
    loadBills
}