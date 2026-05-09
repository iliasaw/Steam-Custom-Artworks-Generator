const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const axios = require('axios');

const PORT = 3200;
const SGDB_API_KEY = '';
let steamGridPath = path.join(__dirname, '../screenshots/grid');

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    console.log(`${req.method} ${parsedUrl.pathname}`);

    // API: Image Proxy (to bypass CORS)
    if (parsedUrl.pathname === '/api/proxy-img') {
        const targetUrl = parsedUrl.query.url;
        if (!targetUrl) {
            res.writeHead(400); res.end(); return;
        }
        try {
            const response = await axios.get(targetUrl, { responseType: 'stream' });
            res.writeHead(200, {
                'Content-Type': response.headers['content-type'],
                'Access-Control-Allow-Origin': '*'
            });
            response.data.pipe(res);
        } catch (e) {
            res.writeHead(500); res.end();
        }
        return;
    }

    // API: SteamGridDB Proxy
    if (parsedUrl.pathname.startsWith('/api/sgdb/search/')) {
        const appId = parsedUrl.pathname.split('/').pop();
        if (!SGDB_API_KEY || SGDB_API_KEY === 'YOUR_KEY_HERE') {
            res.writeHead(401); res.end(JSON.stringify({ error: "API Key error" })); return;
        }
        try {
            const gameRes = await axios.get(`https://www.steamgriddb.com/api/v2/games/steam/${appId}`, {
                headers: { 'Authorization': `Bearer ${SGDB_API_KEY}` }
            });
            const gameId = gameRes.data.data.id;
            const heroesRes = await axios.get(`https://www.steamgriddb.com/api/v2/heroes/game/${gameId}`, {
                headers: { 'Authorization': `Bearer ${SGDB_API_KEY}` }
            });
            res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify(heroesRes.data));
        } catch (error) {
            res.writeHead(error.response?.status || 500); res.end(JSON.stringify({ error: "SGDB Error" }));
        }
        return;
    }

    // API: Save files
    if (parsedUrl.pathname === '/api/save' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const { filename, image, customPath } = JSON.parse(body);
                const savePath = customPath || steamGridPath;
                if (!fs.existsSync(savePath)) fs.mkdirSync(savePath, { recursive: true });
                const base64Data = image.replace(/^data:image\/png;base64,/, "");
                fs.writeFileSync(path.join(savePath, filename), base64Data, 'base64');
                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify({ success: true }));
            } catch (error) {
                res.writeHead(500); res.end(JSON.stringify({ error: error.message }));
            }
        });
        return;
    }

    // API: Steam Proxy
    if (parsedUrl.pathname.startsWith('/api/steam/')) {
        const appId = parsedUrl.pathname.split('/').pop();
        try {
            const response = await axios.get(
                `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=us&l=english`,
                {
                    headers: {
                        // Bypass Steam age gate (18+ games)
                        'Cookie': 'birthtime=283993200; mature_content=1; wants_mature_content=1'
                    }
                }
            );
            res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify(response.data));
        } catch (error) {
            res.writeHead(500); res.end();
        }
        return;
    }

    // Static files
    let filePath = path.join(__dirname, parsedUrl.pathname === '/' ? 'visual-generator.html' : parsedUrl.pathname);
    fs.readFile(filePath, (error, content) => {
        if (error) { res.writeHead(404); res.end('Not found'); }
        else {
            const ext = path.extname(filePath);
            const ct = ext === '.js' ? 'text/javascript' : ext === '.css' ? 'text/css' : 'text/html';
            res.writeHead(200, { 'Content-Type': ct });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n🚀 Server running at http://localhost:${PORT}`);
});
