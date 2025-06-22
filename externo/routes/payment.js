//Foi mal estar tudo em inglês. Acho que é o costume.
//Pareceu esquisito misturar inglês com português.
//Meu supervisor dizia para escolher uma, então escolhi o inglês.

const express = require("express");
const router = express.Router();
const paymentMethods = require("../utils/paymentMethods");


//esse treco demora um pouco, porque tem duas coisas acontecendo aqui: a criação da cobrança
//(no paypal) e o pagamento (no paypal)
router.post('/cobranca', async (req, res) => {
    let {value, userId} = req.body;
    const now = new Date();
    const requestedTime = now.toLocaleString('pt-BR');

    try{
        await paymentMethods.createBill(userId, value, requestedTime);
        try {
            let payment = await paymentMethods.payBill(userId);
            if (!payment) {
                //não faz nada; a bill continua "PENDING"
                res.send(500).send("Pending bill.");
            }
        } catch (e) {
            if (e.message.includes("User not found")) {
                return res.status(422).send("Invalid data: " + userId);
            }
            res.send(500).send("Internal Server Error: " + e.message);
        }
    } catch(e){
        return res.status(500).send("Internal Server Error: " + e.message);
    }

    res.status(200).send("Bill paid successfully!");

});

router.post('/processaCobrancasEmFila', async (req, res) => {
    try{
        await paymentMethods.paysLateBills();
    } catch (e) {
        res.status(500).send("Internal Server Error: " + e.message);
    }
    res.status(200).send("All bills were processed.");


});

router.get('/cobranca/:billId', async (req, res) => {
    const billId = req.params.billId;

    try {
        const bill = await paymentMethods.getsBill(billId);
        res.status(200).json(bill);
    } catch (error) {
        if (error.message === "Bill not found") {
            return res.status(404).send("Bill not found.");
        }
        res.status(500).send("Internal Server Error: " + error.message);
    }
});

module.exports = router;

