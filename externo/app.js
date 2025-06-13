const express = require('express');
const cors = require('cors');
const paymentRoutes = require('./routes/payment');
const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).send("API viva e funcionando!");
});

app.use('/api/payment', paymentRoutes);

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

module.exports = app;