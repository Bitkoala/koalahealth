
const pool = require('./db');
require('dotenv').config();

async function initDb() {
    try {
        console.log('Creating global_configs table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS global_configs (
                config_key VARCHAR(255) PRIMARY KEY,
                config_value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('Table created or already exists.');

        // Insert default splash config if not exists
        const [rows] = await pool.query('SELECT * FROM global_configs WHERE config_key = ?', ['app_splash_config']);
        if (rows.length === 0) {
            const defaultConfig = JSON.stringify({ image: '', text: '' });
            await pool.query('INSERT INTO global_configs (config_key, config_value) VALUES (?, ?)', ['app_splash_config', defaultConfig]);
            console.log('Default splash config inserted.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
}

initDb();
