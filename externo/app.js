const express = require('express');
const cors = require('cors');
const paymentClient = require('./utils/paymentClient');
const paymentRoutes = require('./routes/payment');
const mailRoutes = require('./routes/mail');
const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).send("API viva e funcionando!");
});

app.use('/email', mailRoutes);

app.use('/payment', paymentRoutes);

app.listen(3000, () => {
    paymentClient.client();
    console.log('Servidor rodando na porta 3000');
});

module.exports = app;