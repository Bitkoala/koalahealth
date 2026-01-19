/**
 * @file /后端服务/routes/public.js
 * @description 公开配置路由模块。
 * 
 * 提供无需身份验证即可访问的系统配置接口，主要用于 App 启动时的动态配置获取。
 */

const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @route   GET /api/public/config/:key
 * @desc    获取指定的公开全局配置。
 * @access  Public
 */
router.get('/config/:key', async (req, res) => {
    const { key } = req.params;
    try {
        const [rows] = await pool.query('SELECT config_value FROM global_configs WHERE config_key = ?', [key]);
        if (rows.length === 0) {
            return res.status(404).json({ message: '配置项不存在' });
        }

        // 尝试解析 JSON，如果解析失败则返回原始字符串
        let value = rows[0].config_value;
        try {
            value = JSON.parse(value);
        } catch (e) {
            // Keep as string
        }

        res.json({ key, value });
    } catch (error) {
        console.error(`获取配置 ${key} 失败:`, error);
        res.status(500).json({ message: '服务器内部错误' });
    }
});

module.exports = router;
