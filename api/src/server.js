'use strict';
const app = require('./app');
const { arquivo, driver } = require('./db');

const PORTA = Number(process.env.PORT) || 3000;

app.listen(PORTA, () => {
  console.log(`Zelio API ouvindo em http://localhost:${PORTA}`);
  console.log(`Banco: ${arquivo}  (driver: ${driver})`);
});
