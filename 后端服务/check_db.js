
const pool = require('./db');
require('dotenv').config();

async function check() {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        console.log('Connection successful:', rows[0].result);
        process.exit(0);
    } catch (e) {
        console.error('Connection failed:', e);
        process.exit(1);
    }
}
check();
