const axios = require('axios');

// Handler utama untuk Vercel Serverless Function
module.exports = async (req, res) => {
    // Setup CORS agar bisa diakses dari frontend
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    }

    const { url, width = 1280, height = 720, full_page = false, device_scale = 1 } = req.body;

    try {
        if (!url || !url.startsWith('http')) {
            throw new Error('URL tidak valid. Pastikan menggunakan https://');
        }

        // Logic asli Anda
        const { data } = await axios.post('https://gcp.imagy.app/screenshot/createscreenshot', {
            url: url,
            browserWidth: parseInt(width),
            browserHeight: parseInt(height),
            fullPage: full_page === true || full_page === 'true', // Handle string/boolean
            deviceScaleFactor: parseInt(device_scale),
            format: 'png'
        }, {
            headers: {
                'content-type': 'application/json',
                referer: 'https://imagy.app/full-page-screenshot-taker/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
            }
        });

        if (!data.fileUrl) throw new Error('Gagal mendapatkan gambar dari provider.');

        return res.status(200).json({ 
            success: true, 
            image_url: data.fileUrl,
            creator: "SANN404 FORUM"
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};
