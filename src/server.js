require('dotenv').config();

const app = require('./app');
const pool = require('./database');

const port = Number(process.env.PORT) || 3000;

async function start() {
  const connection = await pool.getConnection();
  connection.release();

  app.listen(port, () => {
    console.log(`Users API listening on port ${port}`);
  });
}

start().catch((error) => {
  console.error('Unable to start the API. Check the MySQL connection and configuration.', error);
  process.exitCode = 1;
});
