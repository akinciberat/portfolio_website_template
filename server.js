const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'portfolio.json');

const ADMIN_USER = 'admin';
const ADMIN_PASS_HASH = bcrypt.hashSync('admin123', 10);

// Multer config for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + '-' + Math.random().toString(36).slice(2, 8) + ext);
    }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const ok = /\.(jpg|jpeg|png|gif|webp|svg|pdf)$/i.test(file.originalname);
        cb(null, ok);
    }
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'portfolio-secret-key-change-me',
    resave: false, saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.use(express.static(__dirname, { index: 'index.html', extensions: ['html'] }));

function readData() { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
function writeData(data) { fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8'); }

function requireAuth(req, res, next) {
    if (req.session && req.session.authenticated) return next();
    res.status(401).json({ error: 'Giriş yapmanız gerekiyor.' });
}

// Auth
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && bcrypt.compareSync(password, ADMIN_PASS_HASH)) {
        req.session.authenticated = true;
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Kullanıcı adı veya şifre hatalı.' });
    }
});
app.post('/api/logout', (req, res) => { req.session.destroy(); res.json({ success: true }); });
app.get('/api/auth-check', (req, res) => {
    res.json({ authenticated: !!(req.session && req.session.authenticated) });
});

// Public data
app.get('/api/data', (req, res) => res.json(readData()));

// Protected data
app.put('/api/data/:section', requireAuth, (req, res) => {
    try {
        const data = readData();
        const section = req.params.section;
        if (!(section in data)) return res.status(400).json({ error: 'Geçersiz bölüm.' });
        data[section] = req.body;
        writeData(data);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/data', requireAuth, (req, res) => {
    try { writeData(req.body); res.json({ success: true }); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

// Image upload
app.post('/api/upload', requireAuth, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Dosya yüklenemedi.' });
    res.json({ success: true, path: '/uploads/' + req.file.filename });
});

app.listen(PORT, () => {
    console.log(`\n🚀 Portfolio: http://localhost:${PORT}`);
    console.log(`🔧 Admin: http://localhost:${PORT}/admin`);
    console.log(`\n📋 Giriş: admin / admin123\n`);
});
