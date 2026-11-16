const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// View Engine olarak EJS ve .html desteği
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// Views ve Public (Statik) klasör yolları
app.set('views', path.join(__dirname, 'Website/Views'));
app.use(express.static(path.join(__dirname, 'Website/wwwroot')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Güvenli render yardımcı fonksiyonu (Pages klasöründe mi yoksa ana Views içinde mi kontrol eder)
const renderPage = (res, pageName, data = {}) => {
    res.render(`Pages/${pageName}`, data, (err, html) => {
        if (err) {
            // Eğer Pages altındat değilse doğrudan aramayı dener
            res.render(pageName, data, (innerErr, innerHtml) => {
                if (innerErr) {
                    res.status(404).send(`<!DOCTYPE html><html><body><h1>Sayfa Bulunamadı: ${pageName}</h1><p>${err.message}</p></body></html>`);
                } else {
                    res.send(innerHtml);
                }
            });
        } else {
            res.send(html);
        }
    });
};

// 1. Ana Sayfa (Landing / Login / Signup)
app.get('/', (req, res) => {
    renderPage(res, 'index', { 
        userIdStr: '0', 
        userName: 'Guest', 
        useBundledAssets: true 
    });
});

// 2. Oyunlar Sayfası ve Arama / Keyword Yönlendirmesi
app.get('/games', (req, res) => {
    const keyword = req.query.keyword || req.query.Keyword;
    if (keyword) {
        return res.redirect(`/games/Search?keyword=${encodeURIComponent(keyword)}`);
    }
    renderPage(res, 'games', { 
        userIdStr: '0', 
        userName: 'Guest', 
        useBundledAssets: true 
    });
});

app.get('/games/Search', (req, res) => {
    const keyword = req.query.keyword || '';
    res.send(`<!DOCTYPE html><html><body style="font-family: Arial; padding: 20px;"><h1>Arama Sonucu</h1><p>Aranan kelime: <strong>${keyword}</strong></p></body></html>`);
});

// 3. Geliştirici / Create Sayfası (Develop Tab & Parametre Yönetimi)
app.get('/develop', (req, res) => {
    let viewParam = req.query.view || req.query.View || '';
    let pageParam = req.query.Page || req.query.page || '';

    if (!viewParam && pageParam) {
        if (pageParam.toLowerCase() === 'universes') {
            viewParam = '';
        } else if (pageParam.toLowerCase() === 'game-passes') {
            viewParam = '34';
        }
    }

    renderPage(res, 'download', {
        userIdStr: '0',
        userName: 'Guest',
        useBundledAssets: true,
        viewParam,
        pageParam
    });
});

// 4. Genel Sayfa Yönlendiricisi (Diğer tüm .html istekleri için esnek fallback)
app.get('/:page', (req, res) => {
    const page = req.params.page;
    renderPage(res, page, { 
        userIdStr: '0', 
        userName: 'Guest', 
        useBundledAssets: true 
    });
});

// Sunucuyu Başlat
app.listen(PORT, () => {
    console.log(`[*] Gelişmiş Roblox 2016 Web Server ${PORT} portunda aktif!`);
});
