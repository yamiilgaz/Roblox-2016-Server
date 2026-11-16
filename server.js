const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// View Engine olarak EJS kullanıyoruz (HTML dosyalarını dinamik okumak için)
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'Website/Views'));

// Statik dosyalar (CSS, JS, resimler) için klasör tanımı
app.use(express.static(path.join(__dirname, 'Website/wwwroot')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Ana Sayfa (Home / Login / Landing)
app.get('/', (req, res) => {
    res.render('Pages/home.html', { 
        userIdStr: '0', 
        userName: 'Guest', 
        useBundledAssets: true 
    });
});

// 2. Arama ve Yönlendirme Kontrolü (Bahsettiğin keyword mantığı)
app.get('/games', (req, res) => {
    const keyword = req.query.keyword || req.query.Keyword;
    if (keyword) {
        return res.redirect(`/games/Search?keyword=${encodeURIComponent(keyword)}`);
    }
    res.render('Pages/games.html', { 
        userIdStr: '0', 
        userName: 'Guest', 
        useBundledAssets: true 
    });
});

app.get('/games/Search', (req, res) => {
    const keyword = req.query.keyword || '';
    res.send(`<!DOCTYPE html><html><body><h1>Arama Sonucu: ${keyword}</h1></body></html>`);
});

// 3. Geliştirici / Create Sayfası (Develop Tab)
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

    res.render('Pages/download.html', {
        userIdStr: '0',
        userName: 'Guest',
        useBundledAssets: true,
        viewParam,
        pageParam
    });
});

// Sunucuyu Başlat
app.listen(PORT, () => {
    console.log(`[*] Roblox 2016 Web Server ${PORT} portunda aktif!`);
});
