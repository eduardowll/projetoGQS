const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const clienteRoutes = require('./src/routes/clienteRoutes');
const reservaRoutes = require('./src/routes/reservaRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src/public')));

app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'src/views'));

app.use('/api/clientes', clienteRoutes);
app.use('/api/reservas', reservaRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views', 'index.html'));
});

app.get('/clientes/novo', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views', 'cliente-form.html'));
});

app.get('/reservas/novo', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views', 'reserva-form.html'));
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}

module.exports = app;

