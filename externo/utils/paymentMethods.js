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

async function updateBills(userId, orderId){
    const bills = loadBills(); // carrega o objeto completo do arquivo JSON

// supondo que você já encontrou a bill correta, tipo:
    const userBills = bills[userId]; // array de bills do usuário
    const wantedBill = userBills.find(bill => bill.orderId === orderId);

// atualiza o status
    wantedBill.status = "COMPLETED";

// salva tudo de volta no arquivo
    saveBills(bills);

}

async function createBill(userId, amount, requestedTime){
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
        requestedTime: requestedTime,
        createdAt: new Date().toISOString(),
        status: "PENDING"
    });
    saveBills(bills);

    //a de baixo é diferente da de cima na estrutura.

    let billResponse = {
        userId: userId,
        orderId: data.id,
        amount: amount.toString(),
        requestedTime: requestedTime,
        createdAt: new Date().toISOString(),
        status: "PENDING",

    };

    return billResponse;
}

async function payBill(userId){
    //precisa pegar o token de acesso, depois obter a bill mais recente do usuário, e então pagá-la
    const accessToken = await obterToken();
    const bills = loadBills();
    let userBills = bills[userId];
    let latestBill = userBills[userBills.length - 1];
    let user = userData.users.find(u => u.userId === userId);


    if (!latestBill) throw new Error("Nenhuma cobrança encontrada para o usuário");

    if (latestBill.status !== "PENDING") throw new Error("Cobrança já foi paga ou cancelada");

    const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${latestBill.orderId}/capture`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'PayPal-Request-Id': latestBill.orderId,
        },
        body: JSON.stringify({
            payment_source: {
                card: {
                    number: user.creditCard.number,
                    expiry: user.creditCard.expiry,
                    security_code: user.creditCard.cvv,
                    name: user.name || "JOHN DOE"
                }
            }
        })
    });

    const data = await response.json();


    if (response.ok) {
        await updateBills(userId, latestBill.orderId);

        return {
            userId: userId,
            orderId: latestBill.orderId,
            amount: latestBill.amount,
            requestedTime: latestBill.requestedTime,
            createdAt: latestBill.createdAt,
            status: "COMPLETED",
            paymentDetails: data
        };

    } else {
        console.error(`[payBills] Erro ao pagar ${latestBill.orderId}: ${data.message}`);
    }

    return;


}

module.exports = {
    createBill,
    payBill
}