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

### Adımlar

1. Projeyi klonlayın veya indirin:
```bash
git clone <repository-url>
cd kendisitem
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Sunucuyu başlatın:
```bash
npm start
```

4. Tarayıcınızda açın:
- Ana site: http://localhost:3000
- Admin panel: http://localhost:3000/admin

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
