
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
};

async function test() {
    console.log('Testing connection to:', dbConfig.host);
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected!');
        const [rows] = await connection.execute('SELECT 1 + 1 AS result');
        console.log('Result:', rows);
        await connection.end();
        process.exit(0);
    } catch (err) {
        console.error('--- CONNECTION FAILED ---');
        console.error('Code:', err.code);
        console.error('Errno:', err.errno);
        console.error('Syscall:', err.syscall);
        console.error('Hostname:', err.hostname);
        console.error('Message:', err.message);
        console.error('Stack:', err.stack);
        process.exit(1);
    }
}
test();
