# Berat Akıncı Portfolio Website

Modern, interaktif ve admin panelli kişisel portfolyo web sitesi. Bu proje, yaratıcı tasarımcılar ve geliştiriciler için profesyonel bir çevrimiçi varlık oluşturmayı amaçlar.

## 🌟 Özellikler

- **Modern Tasarım**: Glassmorphism efektleri, gradient renkler ve animasyonlar
- **Admin Paneli**: Tüm içeriği yönetebileceğiniz güvenli admin paneli
- **PDF Desteği**: Projeler için PDF dökümanları yükleyebilir ve görüntüleyebilirsiniz
- **Görsel Yükleme**: Projeler için görseller yükleyebilirsiniz
- **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- **Animasyonlar**: GSAP ve ScrollTrigger ile akıcı animasyonlar
- **3D Efektler**: Spline 3D ve tilt efektleri
- **Çok Dilli**: Türkçe içerik

## 📋 İçerik Bölümleri

1. **Hero**: Ana giriş bölümü - isim, unvan ve açıklama
2. **Hakkımda**: Kişisel bilgiler ve istatistikler
3. **Tecrübe**: İş deneyimleri zaman çizelgesi
4. **Projeler**: Proje galerisi ve detay sayfaları (PDF desteği)
5. **Yetenekler**: Teknik yetenekler ve seviyeleri
6. **İletişim**: İletişim formu ve sosyal medya linkleri

## 🚀 Kurulum

### Gereksinimler

- Node.js (v14 veya üzeri)
- npm veya yarn
- Git (opsiyonel, GitHub'dan çekmek için)

---

## 💻 Local (Yerel) Kurulum

### Adım 1: Node.js Kurulumu

**Windows:**
1. [nodejs.org](https://nodejs.org/) adresine gidin
2. LTS versiyonunu indirin ve kurun
3. Kurulumdan sonra komut satırını açın ve kontrol edin:
```bash
node --version
npm --version
```

**Mac:**
```bash
# Homebrew ile
brew install node
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Adım 2: Projeyi İndirme

**GitHub'dan klonlama:**
```bash
git clone https://github.com/akinciberat/portfolio_website_template.git
cd portfolio_website_template
```

**Veya ZIP olarak indirme:**
1. GitHub'da "Code" butonuna tıklayın
2. "Download ZIP" seçeneğini seçin
3. İndirilen dosyayı çıkarın
4. Klasöre gidin: `cd portfolio_website_template`

### Adım 3: Bağımlılıkları Yükleme

```bash
npm install
```

Bu komut `package.json` dosyasındaki tüm paketleri yükler:
- express (web sunucusu)
- express-session (oturum yönetimi)
- bcryptjs (şifre şifreleme)
- multer (dosya yükleme)

### Adım 4: Sunucuyu Başlatma

```bash
npm start
```

Veya:
```bash
node server.js
```

### Adım 5: Siteye Erişim

Tarayıcınızda açın:
- Ana site: http://localhost:3000
- Admin panel: http://localhost:3000/admin

**Admin Giriş Bilgileri:**
- Kullanıcı adı: `admin`
- Şifre: `admin123`

---

## 🌐 VPS/VDS Sunucu Kurulumu (Ubuntu/Debian)

### Adım 1: Sunucuya Bağlanma

SSH ile sunucunuza bağlanın:
```bash
ssh root@sunucu-ip-adresi
```

### Adım 2: Sistemi Güncelleme

```bash
apt update && apt upgrade -y
```

### Adım 3: Node.js Kurulumu

```bash
# Node.js 18.x LTS kurulumu
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Kontrol
node --version
npm --version
```

### Adım 4: Git Kurulumu

```bash
apt install git -y
```

### Adım 5: Projeyi İndirme

```bash
# Proje klasörü oluştur
mkdir -p /var/www
cd /var/www

# Projeyi klonla
git clone https://github.com/akinciberat/portfolio_website_template.git
cd portfolio_website_template
```

### Adım 6: Bağımlılıkları Yükleme

```bash
npm install
```

### Adım 7: uploads Klasörünü Oluşturma

```bash
mkdir -p uploads
chmod 755 uploads
```

### Adım 8: PM2 Kurulumu (Process Manager)

PM2, Node.js uygulamalarını production ortamında çalıştırmak için kullanılır:

```bash
npm install -g pm2
```

### Adım 9: Uygulamayı PM2 ile Başlatma

```bash
pm2 start server.js --name portfolio
pm2 save
pm2 startup
```

**PM2 Komutları:**
```bash
pm2 list              # Tüm uygulamaları listele
pm2 logs portfolio    # Logları görüntüle
pm2 restart portfolio # Uygulamayı yeniden başlat
pm2 stop portfolio    # Uygulamayı durdur
pm2 delete portfolio  # Uygulamayı sil
```

### Adım 10: Firewall Ayarları

```bash
# UFW firewall'ı etkinleştir
ufw allow 22/tcp      # SSH
ufw allow 80/tcp      # HTTP
ufw allow 443/tcp     # HTTPS
ufw enable
```

### Adım 11: Nginx Kurulumu ve Reverse Proxy

**Nginx kurulumu:**
```bash
apt install nginx -y
```

**Nginx config dosyası oluşturma:**
```bash
nano /etc/nginx/sites-available/portfolio
```

Aşağıdaki içeriği yapıştırın (domain-adresinizi.com kısmını kendi domaininizle değiştirin):
```nginx
server {
    listen 80;
    server_name domain-adresiniz.com www.domain-adresiniz.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads {
        alias /var/www/portfolio_website_template/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

**Config'i aktifleştirme:**
```bash
ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Adım 12: SSL Sertifikası (Let's Encrypt)

**Certbot kurulumu:**
```bash
apt install certbot python3-certbot-nginx -y
```

**SSL sertifikası alma:**
```bash
certbot --nginx -d domain-adresiniz.com -d www.domain-adresiniz.com
```

**Otomatik yenileme ayarı:**
```bash
certbot renew --dry-run
```

---

## ☁️ Cloud Platform Kurulumu

### DigitalOcean App Platform

1. DigitalOcean hesabınıza giriş yapın
2. "Apps" sekmesine gidin
3. "Create App" butonuna tıklayın
4. GitHub reposunu bağlayın
5. Build settings:
   - Build Command: `npm install`
   - Run Command: `node server.js`
6. Environment variables ekleyin:
   - `PORT`: 8080
   - `NODE_ENV`: production
7. Deploy butonuna tıklayın

### Heroku

**Heroku CLI kurulumu:**
```bash
# Windows: https://devcenter.heroku.com/articles/heroku-cli
# Mac: brew tap heroku/brew && brew install heroku
# Linux: snap install heroku --classic
```

**Deploy:**
```bash
# Heroku giriş
heroku login

# App oluştur
heroku create portfolio-app

# Deploy
git push heroku main
```

**Environment variables:**
```bash
heroku config:set PORT=8080
heroku config:set NODE_ENV=production
```

### Vercel

**Vercel CLI kurulumu:**
```bash
npm install -g vercel
```

**Deploy:**
```bash
vercel
```

**Not:** Vercel serverless functions kullanır, bu yüzden `server.js` dosyasını Vercel formatına çevirmeniz gerekebilir.

---

## 🔧 Güvenlik Ayarları

### Admin Şifresini Değiştirme

`server.js` dosyasında:
```javascript
const ADMIN_PASS_HASH = bcrypt.hashSync('yeni-güçlü-şifreniz', 10);
```

### Session Secret Değiştirme

`server.js` dosyasında:
```javascript
app.use(session({
    secret: 'çok-güçlü-rastgele-secret-key', // Bunu değiştirin
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
```

### Environment Variables Kullanma

`.env` dosyası oluşturun:
```env
PORT=3000
ADMIN_PASSWORD=güçlü-şifre
SESSION_SECRET=rastgele-secret
NODE_ENV=production
```

`server.js` dosyasını güncelleyin:
```javascript
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const ADMIN_PASS_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);
```

`.env` dosyasını `.gitignore`'a ekleyin:
```
.env
.env.local
```

---

## 📊 Monitoring ve Loglar

### PM2 Monitoring

```bash
pm2 monit
```

### Logları Görüntüleme

```bash
pm2 logs portfolio
```

### Log Dosyalarına Kaydetme

```bash
pm2 start server.js --name portfolio --log-date-format "YYYY-MM-DD HH:mm:ss"
```

---

## 🔄 Güncelleme ve Bakım

### Projeyi Güncelleme

```bash
cd /var/www/portfolio_website_template
git pull origin main
npm install
pm2 restart portfolio
```

### Yedekleme

**Veritabanı yedekleme:**
```bash
cp data/portfolio.json data/portfolio.json.backup
```

**Uploads yedekleme:**
```bash
tar -czf uploads-backup.tar.gz uploads/
```

**Otomatik yedekleme (cron job):**
```bash
crontab -e
```

Aşağıdaki satırı ekleyin (her gün gece yarısı yedekler):
```
0 0 * * * cp /var/www/portfolio_website_template/data/portfolio.json /var/www/portfolio_website_template/data/portfolio.json.backup.$(date +\%Y\%m\%d)
```

---

## 🐛 Sorun Giderme

### Port Kullanımda Hatası

```bash
# Port 3000'i kullanan süreci bul
netstat -tulpn | grep :3000
# veya
lsof -i :3000

# Süreci sonlandır
kill -9 <PID>
```

### Permission Hataları

```bash
# Klasör izinlerini düzelt
chmod -R 755 /var/www/portfolio_website_template
chown -R www-data:www-data /var/www/portfolio_website_template
```

### Nginx 502 Bad Gateway

```bash
# Nginx config'i kontrol et
nginx -t

# Nginx'i yeniden başlat
systemctl restart nginx

# PM2 uygulamasını kontrol et
pm2 status
pm2 restart portfolio
```

### Node.js Modül Hataları

```bash
# node_modules'i sil ve yeniden yükle
rm -rf node_modules
npm install
```

---

## 📱 Local Kurulum - Hızlı Başlangıç

Sadece local'de test etmek istiyorsanız:

```bash
# 1. Projeyi indir
git clone https://github.com/akinciberat/portfolio_website_template.git
cd portfolio_website_template

# 2. Bağımlılıkları yükle
npm install

# 3. Başlat
npm start

# 4. Tarayıcıda aç
# http://localhost:3000
```

## 🔐 Admin Paneli

### Giriş

- URL: http://localhost:3000/admin
- Kullanıcı adı: `admin`
- Şifre: `admin123`

**Güvenlik Notu**: Prodüksiyon ortamında şifreyi `server.js` dosyasındaki `ADMIN_PASS_HASH` değişkeninden değiştirmelisiniz.

### Admin Panel Özellikleri

Admin panel ile şu bölümleri yönetebilirsiniz:

1. **Hero**: Ana sayfa içeriği (başlık, açıklama, butonlar)
2. **Hakkımda**: Kişisel bilgiler ve istatistikler
3. **Tecrübe**: İş deneyimleri ekleme/düzenleme/silme
4. **Projeler**: Proje yönetimi
   - Proje adı, kategori, kısa açıklama
   - Kart görseli yükleme
   - Detaylı açıklama
   - Teknolojiler
   - Proje linki
   - **PDF dökümanı yükleme** (yeni özellik)
   - Detay sayfası görselleri
5. **Yetenekler**: Yetenekler ve seviyeleri
6. **İletişim**: İletişim bilgileri ve sosyal medya linkleri
7. **Ayarlar**: Site başlığı, meta açıklama, logolar

## 📁 Proje Yapısı

```
kendisitem/
├── admin/                  # Admin panel dosyaları
│   ├── index.html         # Admin panel arayüzü
│   ├── script.js          # Admin panel JavaScript
│   └── style.css          # Admin panel stilleri
├── data/                  # Veri dosyaları
│   └── portfolio.json     # Tüm site içeriği
├── uploads/               # Yüklenen görseller ve PDF'ler
├── index.html            # Ana sayfa
├── project.html          # Proje detay sayfası
├── script.js             # Ana sayfa JavaScript
├── style.css             # Ana sayfa stilleri
├── server.js             # Node.js sunucusu
├── package.json          # Proje bağımlılıkları
└── README.md             # Bu dosya
```

## 🎨 Proje Yönetimi (Admin Panel)

### Yeni Proje Ekleme

1. Admin panel'e giriş yapın
2. "Projeler" sekmesine tıklayın
3. "+ Proje Ekle" butonuna tıklayın
4. Proje bilgilerini doldurun:
   - **Sayfa İçi (Kart)** tab'ı:
     - Proje adı
     - Kategori
     - Kısa açıklama
     - Kart görseli (opsiyonel)
   - **Detay Sayfası** tab'ı:
     - Detaylı açıklama
     - Teknolojiler (virgülle ayırın)
     - Proje linki (opsiyonel)
     - **PDF dökümanı** (opsiyonel) - PDF yükleyebilirsiniz
     - Detay sayfası görselleri
5. "💾 Kaydet" butonuna tıklayın

### PDF Yükleme

Projeler için PDF dökümanları yükleyebilirsiniz:

1. Proje düzenleme ekranında "Detay Sayfası" tab'ına tıklayın
2. "PDF Dökümanı" alanında "📄 PDF Yükle" butonuna tıklayın
3. PDF dosyasını seçin
4. Kaydedin

PDF, proje detay sayfasında iframe içinde görüntülenecektir.

### Görsel Yükleme

- **Kart Görseli**: Proje kartında gösterilen ana görsel
- **Detay Görselleri**: Proje detay sayfasında galeri olarak gösterilen görseller
- **Logolar**: Site başlığı ve footer için logolar

## 🔧 Teknik Detaylar

### Kullanılan Teknolojiler

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Animasyon**: GSAP, ScrollTrigger
- **3D**: Spline Viewer
- **Styling**: CSS Custom Properties, Glassmorphism
- **Session**: express-session
- **Upload**: multer
- **Auth**: bcryptjs

### Veri Yapısı

Tüm içerik `data/portfolio.json` dosyasında saklanır. Bu dosya admin panelinden dinamik olarak güncellenir.

### API Endpoints

- `GET /api/data` - Tüm verileri getir
- `PUT /api/data` - Tüm verileri güncelle
- `PUT /api/data/:section` - Belirli bir bölümü güncelle
- `POST /api/login` - Admin girişi
- `POST /api/logout` - Admin çıkışı
- `GET /api/auth-check` - Oturum kontrolü
- `POST /api/upload` - Görsel/PDF yükleme

## 🎨 Tasarım Özellikleri

- **Renk Paleti**: Koyu tema (dark mode) ile cyan ve purple accent renkler
- **Tipografi**: Inter ve Space Grotesk fontları
- **Efektler**: Glassmorphism, gradient, glow efektleri
- **Animasyonlar**: Scroll animasyonları, hover efektleri, 3D tilt
- **Responsive**: Mobil, tablet ve masaüstü uyumlu

## 📝 Özelleştirme

### Renkleri Değiştirme

`style.css` dosyasındaki CSS custom properties'i değiştirin:

```css
:root {
    --accent-cyan: #00f0ff;
    --accent-purple: #7b2ff7;
    --bg-primary: #050508;
    /* ... */
}
```

### Admin Şifresini Değiştirme

`server.js` dosyasında:

```javascript
const ADMIN_PASS_HASH = bcrypt.hashSync('yeni-sifre', 10);
```

### Port Değiştirme

`server.js` dosyasında:

```javascript
const PORT = 3000; // İstediğiniz portu yazın
```

## 🚀 Prodüksiyon Dağıtımı

### Önerilen Platformlar

- **Vercel**: Backend için serverless functions kullanın
- **Heroku**: Node.js uygulaması olarak deploy edin
- **Railway**: Basit ve hızlı deploy
- **DigitalOcean**: VPS veya App Platform

### Prodüksiyon İçin Hazırlık

1. Admin şifresini değiştirin
2. Session secret'ı değiştirin (`server.js`)
3. Environment variables kullanın
4. HTTPS kullanın
5. Uploads klasörünü güvenli hale getirin

## 🐛 Sorun Giderme

### Sunucu Başlamıyor

- Port 3000 kullanımda mı kontrol edin
- Node.js kurulu mu kontrol edin
- `npm install` komutunu çalıştırdınız mı?

### Görsel Yüklenmiyor

- `uploads` klasörünün yazma izni var mı kontrol edin
- Dosya boyutu 10MB'ı aşıyor mu kontrol edin
- Desteklenen formatlar: jpg, jpeg, png, gif, webp, svg, pdf

### Admin Panel'e Giriş Yapılamıyor

- Kullanıcı adı ve şifreyi kontrol edin
- Tarayıcı cache'ini temizleyin
- Session süresi dolmuş olabilir

## 📄 Lisans

Bu proje kişisel kullanım içindir. İzinsiz kopyalamayın veya dağıtmayın.

## 👤 İletişim

- **E-posta**: hello@beratakinci.com
- **Konum**: İstanbul, Türkiye
- **GitHub**: [Profiliniz]
- **LinkedIn**: [Profiliniz]

## 🙏 Teşekkürler

Bu proje, modern web teknolojileri kullanılarak geliştirilmiştir. Tasarım ve geliştirme sürecinde kullanılan kütüphaneler ve araçlar için teşekkürler.

---

**Son Güncelleme**: Haziran 2026
**Versiyon**: 1.0.0
