let data = {};
let currentTab = 'hero';
const titles = {
    hero: 'Hero Bölümü', about: 'Hakkımda', experience: 'İş Tecrübeleri',
    projects: 'Projeler', skills: 'Yetenekler', contact: 'İletişim', settings: 'Site Ayarları'
};

// ======== AUTH ========
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: document.getElementById('loginUser').value,
            password: document.getElementById('loginPass').value
        })
    });
    if (res.ok) await loadDashboard();
    else document.getElementById('loginError').textContent = 'Kullanıcı adı veya şifre hatalı.';
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await fetch('/api/logout', { method: 'POST' }); location.reload();
});

(async () => {
    const res = await fetch('/api/auth-check');
    const { authenticated } = await res.json();
    if (authenticated) await loadDashboard();
})();

async function loadDashboard() {
    const res = await fetch('/api/data');
    data = await res.json();
    // Migrate old gradient format
    migrateData();
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    renderTab(currentTab);
}

function migrateData() {
    // Convert old gradient strings to gradientColors arrays
    if (!data.siteSettings) data.siteSettings = {};
    if (!data.siteSettings.headerLogo) data.siteSettings.headerLogo = '';
    if (!data.siteSettings.footerLogo) data.siteSettings.footerLogo = '';
    if (data.projects) {
        data.projects.items.forEach(p => {
            if (!p.gradientColors) p.gradientColors = ['#0a0a2e', '#1a1a4e', '#003040'];
            if (!p.detailContent) p.detailContent = p.description || '';
            if (!p.detailImages) p.detailImages = [];
            if (!p.image) p.image = '';
            if (!p.link) p.link = '';
            if (!p.pdf) p.pdf = '';
        });
    }
    if (data.skills) {
        data.skills.items.forEach(s => {
            if (!s.gradientColors) s.gradientColors = ['#333333', '#111111'];
        });
    }
}

// ======== TABS ========
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTab = btn.dataset.tab;
        document.getElementById('pageTitle').textContent = titles[currentTab];
        renderTab(currentTab);
    });
});

// ======== SAVE ========
document.getElementById('saveBtn').addEventListener('click', saveData);
async function saveData() {
    collectFormData();
    const res = await fetch('/api/data', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const status = document.getElementById('saveStatus');
    status.textContent = res.ok ? '✅ Kaydedildi!' : '❌ Hata!';
    status.classList.add('show');
    setTimeout(() => status.classList.remove('show'), 2500);
}

// ======== IMAGE UPLOAD HELPER ========
function imageUpload(fieldId, currentSrc, label, acceptType = 'image/*') {
    const isPdf = fieldId.includes('pdf');
    const preview = currentSrc
        ? (isPdf
            ? `<div class="pdf-preview"><span class="pdf-icon">📄</span><span class="pdf-name">${currentSrc.split('/').pop()}</span></div>`
            : `<img src="${currentSrc}" class="img-preview-thumb">`)
        : `<div class="img-placeholder">${isPdf ? 'PDF yok' : 'Görsel yok'}</div>`;
    return `
    <div class="input-group">
        <label>${label || 'Görsel'}</label>
        <div class="img-upload-area" id="area_${fieldId}">
            <div class="img-preview" id="prev_${fieldId}">${preview}</div>
            <div class="img-actions">
                <label class="btn-upload"><input type="file" accept="${acceptType}" onchange="uploadImage(this,'${fieldId}')" hidden>${isPdf ? '📄 PDF Yükle' : '📷 Yükle'}</label>
                ${currentSrc ? `<button type="button" class="btn-delete" onclick="clearImage('${fieldId}')">Kaldır</button>` : ''}
            </div>
        </div>
        <input type="hidden" id="${fieldId}" value="${esc(currentSrc || '')}">
    </div>`;
}

// ======== RENDER TABS ========
function renderTab(tab) {
    const area = document.getElementById('contentArea');
    area.innerHTML = '';
    const r = { hero: renderHero, about: renderAbout, experience: renderExperience,
        projects: renderProjects, skills: renderSkills, contact: renderContact, settings: renderSettings };
    if (r[tab]) r[tab](area);
}

function renderHero(el) {
    const h = data.hero;
    el.innerHTML = `<div class="form-card"><div class="form-card-header"><h3>Hero İçeriği</h3></div>
        <div class="input-group"><label>Üst Başlık</label><input id="h_label" value="${esc(h.label)}"></div>
        <div class="form-row"><div class="input-group"><label>İsim</label><input id="h_first" value="${esc(h.firstName)}"></div>
        <div class="input-group"><label>Soyisim</label><input id="h_last" value="${esc(h.lastName)}"></div></div>
        <div class="input-group"><label>Açıklama</label><textarea id="h_desc" rows="3">${esc(h.description)}</textarea></div>
        <div class="form-row"><div class="input-group"><label>Birincil Buton</label><input id="h_btn1" value="${esc(h.btnPrimary)}"></div>
        <div class="input-group"><label>İkincil Buton</label><input id="h_btn2" value="${esc(h.btnSecondary)}"></div></div></div>`;
}

function renderAbout(el) {
    const a = data.about;
    let stats = a.stats.map((s, i) => `<div class="item-card"><div class="item-header"><h4>İstatistik ${i+1}</h4>
        <button class="btn-delete" onclick="removeItem('about','stats',${i})">Sil</button></div>
        <div class="form-row three"><div class="input-group"><label>Sayı</label><input class="stat-num" data-i="${i}" type="number" value="${s.number}"></div>
        <div class="input-group"><label>Ek</label><input class="stat-suf" data-i="${i}" value="${esc(s.suffix)}"></div>
        <div class="input-group"><label>Etiket</label><input class="stat-lbl" data-i="${i}" value="${esc(s.label)}"></div></div></div>`).join('');

    el.innerHTML = `<div class="form-card"><div class="form-card-header"><h3>Hakkımda</h3></div>
        <div class="form-row"><div class="input-group"><label>Etiket</label><input id="a_tag" value="${esc(a.tag)}"></div>
        <div class="input-group"><label>Başlık</label><input id="a_title" value="${esc(a.title)}"></div></div>
        <div class="input-group"><label>Öne Çıkan</label><textarea id="a_lead" rows="2">${esc(a.lead)}</textarea></div>
        <div class="input-group"><label>Paragraflar (satır = paragraf)</label><textarea id="a_paras" rows="5">${a.paragraphs.join('\n')}</textarea></div></div>
        <div class="form-card"><div class="form-card-header"><h3>İstatistikler</h3></div>${stats}
        <button class="btn-add" onclick="addStat()">+ İstatistik Ekle</button></div>`;
}

function renderExperience(el) {
    const ex = data.experience;
    let items = ex.items.map((item, i) => `<div class="item-card"><div class="item-header"><h4><span class="item-number">${i+1}</span> ${esc(item.role)}</h4>
        <button class="btn-delete" onclick="removeItem('experience','items',${i})">Sil</button></div>
        <div class="form-row"><div class="input-group"><label>Tarih</label><input class="ex-date" data-i="${i}" value="${esc(item.date)}"></div>
        <div class="input-group"><label>Şirket</label><input class="ex-comp" data-i="${i}" value="${esc(item.company)}"></div></div>
        <div class="input-group"><label>Pozisyon</label><input class="ex-role" data-i="${i}" value="${esc(item.role)}"></div>
        <div class="input-group"><label>Açıklama</label><textarea class="ex-desc" data-i="${i}" rows="2">${esc(item.description)}</textarea></div></div>`).join('');

    el.innerHTML = `<div class="form-card"><div class="form-card-header"><h3>Tecrübe Bölümü</h3></div>
        <div class="form-row"><div class="input-group"><label>Etiket</label><input id="ex_tag" value="${esc(ex.tag)}"></div>
        <div class="input-group"><label>Başlık</label><input id="ex_title" value="${esc(ex.title)}"></div></div></div>
        <div class="form-card"><div class="form-card-header"><h3>Deneyimler</h3></div>${items}
        <button class="btn-add" onclick="addExperience()">+ Deneyim Ekle</button></div>`;
}

function renderProjects(el) {
    const p = data.projects;
    let items = p.items.map((item, i) => {
        const dimgs = (item.detailImages || []).map((src, di) =>
            `<div class="detail-img-item"><img src="${src}"><button type="button" class="btn-delete" onclick="removeDetailImage(${i},${di})">✕</button></div>`
        ).join('');

        return `<div class="item-card"><div class="item-header"><h4><span class="item-number">${i+1}</span> ${esc(item.title)}</h4>
            <button class="btn-delete" onclick="removeItem('projects','items',${i})">Sil</button></div>
            
            <div class="project-tabs">
                <button class="ptab-btn active" onclick="switchPTab(this,'card_${i}')">📄 Sayfa İçi (Kart)</button>
                <button class="ptab-btn" onclick="switchPTab(this,'detail_${i}')">📖 Detay Sayfası</button>
            </div>

            <div class="ptab-content" id="card_${i}">
                <div class="form-row"><div class="input-group"><label>Proje Adı</label><input class="pr-title" data-i="${i}" value="${esc(item.title)}"></div>
                <div class="input-group"><label>Kategori</label><input class="pr-cat" data-i="${i}" value="${esc(item.category)}"></div></div>
                <div class="input-group"><label>Kısa Açıklama</label><input class="pr-short" data-i="${i}" value="${esc(item.shortDesc)}"></div>
                ${imageUpload('pr_img_'+i, item.image || '', 'Kart Görseli (Opsiyonel)')}
            </div>

            <div class="ptab-content" id="detail_${i}" style="display:none;">
                <div class="input-group"><label>Detaylı Açıklama</label><textarea class="pr-desc" data-i="${i}" rows="5">${esc(item.detailContent || item.description)}</textarea></div>
                <div class="input-group"><label>Teknolojiler (virgülle)</label><input class="pr-tech" data-i="${i}" value="${(item.tech||[]).join(', ')}"></div>
                <div class="input-group"><label>Proje Linki (Opsiyonel)</label><input class="pr-link" data-i="${i}" value="${esc(item.link || '')}"></div>
                ${imageUpload('pr_pdf_'+i, item.pdf || '', 'PDF Dökümanı (Opsiyonel)', 'application/pdf')}
                <div class="input-group"><label>Detay Sayfası Görselleri</label>
                    <div class="detail-images-grid">${dimgs}</div>
                    <label class="btn-upload" style="margin-top:8px;display:inline-block;"><input type="file" accept="image/*" onchange="uploadDetailImage(this,${i})" hidden>📷 Görsel Ekle</label>
                </div>
            </div>
        </div>`;
    }).join('');

    el.innerHTML = `<div class="form-card"><div class="form-card-header"><h3>Projeler Bölümü</h3></div>
        <div class="form-row"><div class="input-group"><label>Etiket</label><input id="pr_tag" value="${esc(p.tag)}"></div>
        <div class="input-group"><label>Başlık</label><input id="pr_title_sec" value="${esc(p.title)}"></div></div></div>
        <div class="form-card"><div class="form-card-header"><h3>Proje Listesi</h3></div>${items}
        <button class="btn-add" onclick="addProject()">+ Proje Ekle</button></div>`;
}

function renderSkills(el) {
    const s = data.skills;
    let items = s.items.map((item, i) => {
        return `<div class="item-card"><div class="item-header"><h4><span class="item-number">${i+1}</span> ${esc(item.name)}</h4>
            <button class="btn-delete" onclick="removeItem('skills','items',${i})">Sil</button></div>
            <div class="form-row"><div class="input-group"><label>Yetenek Adı</label><input class="sk-name" data-i="${i}" value="${esc(item.name)}"></div>
            <div class="input-group"><label>İkon</label><input class="sk-icon" data-i="${i}" value="${esc(item.icon)}"></div></div>
            <div class="form-row"><div class="input-group"><label>Seviye (%)</label><input class="sk-lvl" data-i="${i}" type="number" min="0" max="100" value="${item.level}"></div>
            <div class="input-group"><label>Seviye Metni</label><input class="sk-lvlt" data-i="${i}" value="${esc(item.levelText)}"></div></div></div>`;
    }).join('');

    el.innerHTML = `<div class="form-card"><div class="form-card-header"><h3>Yetenekler Bölümü</h3></div>
        <div class="form-row"><div class="input-group"><label>Etiket</label><input id="sk_tag" value="${esc(s.tag)}"></div>
        <div class="input-group"><label>Başlık</label><input id="sk_title" value="${esc(s.title)}"></div></div></div>
        <div class="form-card"><div class="form-card-header"><h3>Yetenek Listesi</h3></div>${items}
        <button class="btn-add" onclick="addSkill()">+ Yetenek Ekle</button></div>`;
}

function renderContact(el) {
    const c = data.contact;
    el.innerHTML = `<div class="form-card"><div class="form-card-header"><h3>İletişim</h3></div>
        <div class="form-row"><div class="input-group"><label>Etiket</label><input id="c_tag" value="${esc(c.tag)}"></div>
        <div class="input-group"><label>Başlık</label><input id="c_title" value="${esc(c.title)}"></div></div>
        <div class="input-group"><label>Açıklama</label><textarea id="c_lead" rows="2">${esc(c.lead)}</textarea></div>
        <div class="form-row"><div class="input-group"><label>E-posta</label><input id="c_email" value="${esc(c.email)}"></div>
        <div class="input-group"><label>Konum</label><input id="c_loc" value="${esc(c.location)}"></div></div></div>
        <div class="form-card"><div class="form-card-header"><h3>Sosyal Medya</h3></div>
        <div class="form-row"><div class="input-group"><label>GitHub</label><input id="c_github" value="${esc(c.socials.github)}"></div>
        <div class="input-group"><label>LinkedIn</label><input id="c_linkedin" value="${esc(c.socials.linkedin)}"></div></div>
        <div class="form-row"><div class="input-group"><label>Twitter / X</label><input id="c_twitter" value="${esc(c.socials.twitter)}"></div>
        <div class="input-group"><label>Instagram</label><input id="c_instagram" value="${esc(c.socials.instagram)}"></div></div></div>`;
}

function renderSettings(el) {
    const s = data.siteSettings; const f = data.footer;
    el.innerHTML = `<div class="form-card"><div class="form-card-header"><h3>Site Ayarlari</h3></div>
        <div class="input-group"><label>Site Basligi</label><input id="s_title" value="${esc(s.title)}"></div>
        <div class="input-group"><label>Meta Aciklama</label><textarea id="s_desc" rows="2">${esc(s.description)}</textarea></div>
        <div class="input-group"><label>Anahtar Kelimeler</label><input id="s_keys" value="${esc(s.keywords)}"></div>
        <div class="logo-guidelines">
            <strong>Logo notu</strong>
            <p>Header logo icin onerilen olcu: 160x48 px. Menunun bozulmamasi icin seffaf PNG veya SVG kullanin.</p>
            <p>Footer logo icin onerilen olcu: 180x54 px. Genis logolarda 3:1 oranini gecmeyin.</p>
        </div>
        ${imageUpload('s_header_logo', s.headerLogo || '', 'Header Logo')}
        ${imageUpload('s_footer_logo', s.footerLogo || '', 'Footer Logo')}</div>
        <div class="form-card"><div class="form-card-header"><h3>Footer</h3></div>
        <div class="input-group"><label>Footer Metni</label><input id="f_text" value="${esc(f.text)}"></div></div>`;
}
// ======== COLLECT DATA ========
function collectFormData() {
    const g = id => { const el = document.getElementById(id); return el ? el.value : ''; };

    if (currentTab === 'hero') {
        data.hero = { label: g('h_label'), firstName: g('h_first'), lastName: g('h_last'),
            description: g('h_desc'), btnPrimary: g('h_btn1'), btnSecondary: g('h_btn2') };
    } else if (currentTab === 'about') {
        data.about.tag = g('a_tag'); data.about.title = g('a_title');
        data.about.lead = g('a_lead');
        data.about.paragraphs = g('a_paras').split('\n').filter(p => p.trim());
        document.querySelectorAll('.stat-num').forEach((el, i) => {
            data.about.stats[i] = { number: parseInt(el.value)||0,
                suffix: document.querySelectorAll('.stat-suf')[i].value,
                label: document.querySelectorAll('.stat-lbl')[i].value };
        });
    } else if (currentTab === 'experience') {
        data.experience.tag = g('ex_tag'); data.experience.title = g('ex_title');
        document.querySelectorAll('.ex-role').forEach((el, i) => {
            data.experience.items[i] = { date: document.querySelectorAll('.ex-date')[i].value,
                role: el.value, company: document.querySelectorAll('.ex-comp')[i].value,
                description: document.querySelectorAll('.ex-desc')[i].value };
        });
    } else if (currentTab === 'projects') {
        data.projects.tag = g('pr_tag'); data.projects.title = g('pr_title_sec');
        document.querySelectorAll('.pr-title').forEach((el, i) => {
            data.projects.items[i] = {
                title: el.value,
                category: document.querySelectorAll('.pr-cat')[i].value,
                shortDesc: document.querySelectorAll('.pr-short')[i].value,
                description: document.querySelectorAll('.pr-desc')[i]?.value || '',
                detailContent: document.querySelectorAll('.pr-desc')[i]?.value || '',
                gradientColors: data.projects.items[i]?.gradientColors || ['#0a0a2e','#1a1a4e','#003040'],
                image: g('pr_img_' + i),
                pdf: g('pr_pdf_' + i),
                detailImages: data.projects.items[i]?.detailImages || [],
                tech: (document.querySelectorAll('.pr-tech')[i]?.value || '').split(',').map(t => t.trim()).filter(Boolean),
                link: document.querySelectorAll('.pr-link')[i]?.value || ''
            };
        });
    } else if (currentTab === 'skills') {
        data.skills.tag = g('sk_tag'); data.skills.title = g('sk_title');
        document.querySelectorAll('.sk-name').forEach((el, i) => {
            data.skills.items[i] = { name: el.value,
                icon: document.querySelectorAll('.sk-icon')[i].value,
                gradientColors: data.skills.items[i]?.gradientColors || ['#333','#111'],
                level: parseInt(document.querySelectorAll('.sk-lvl')[i].value)||0,
                levelText: document.querySelectorAll('.sk-lvlt')[i].value };
        });
    } else if (currentTab === 'contact') {
        data.contact = { tag: g('c_tag'), title: g('c_title'), lead: g('c_lead'),
            email: g('c_email'), location: g('c_loc'),
            socials: { github: g('c_github'), linkedin: g('c_linkedin'), twitter: g('c_twitter'), instagram: g('c_instagram') } };
    } else if (currentTab === 'settings') {
        data.siteSettings = {
            title: g('s_title'),
            description: g('s_desc'),
            keywords: g('s_keys'),
            headerLogo: g('s_header_logo'),
            footerLogo: g('s_footer_logo')
        };
        data.footer = { text: g('f_text') };
    }
}

// ======== IMAGE UPLOAD ========
window.uploadImage = async function(input, fieldId) {
    if (!input.files[0]) return;
    const form = new FormData();
    form.append('image', input.files[0]);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    if (res.ok) {
        const { path } = await res.json();
        document.getElementById(fieldId).value = path;
        document.getElementById('prev_' + fieldId).innerHTML = `<img src="${path}" class="img-preview-thumb">`;
    }
};

window.clearImage = function(fieldId) {
    document.getElementById(fieldId).value = '';
    document.getElementById('prev_' + fieldId).innerHTML = '<div class="img-placeholder">Görsel yok</div>';
};

window.uploadDetailImage = async function(input, projectIndex) {
    if (!input.files[0]) return;
    collectFormData();
    const form = new FormData();
    form.append('image', input.files[0]);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    if (res.ok) {
        const { path } = await res.json();
        if (!data.projects.items[projectIndex].detailImages) data.projects.items[projectIndex].detailImages = [];
        data.projects.items[projectIndex].detailImages.push(path);
        renderTab(currentTab);
    }
};

window.removeDetailImage = function(projectIndex, imgIndex) {
    collectFormData();
    data.projects.items[projectIndex].detailImages.splice(imgIndex, 1);
    renderTab(currentTab);
};

// ======== PROJECT TABS ========
window.switchPTab = function(btn, tabId) {
    const card = btn.closest('.item-card');
    card.querySelectorAll('.ptab-btn').forEach(b => b.classList.remove('active'));
    card.querySelectorAll('.ptab-content').forEach(c => c.style.display = 'none');
    btn.classList.add('active');
    document.getElementById(tabId).style.display = '';
};

// ======== ADD / REMOVE ========
window.removeItem = function(section, key, index) {
    collectFormData(); data[section][key].splice(index, 1); renderTab(currentTab);
};
window.addStat = function() {
    collectFormData(); data.about.stats.push({ number: 0, suffix: '+', label: 'Yeni İstatistik' }); renderTab(currentTab);
};
window.addExperience = function() {
    collectFormData(); data.experience.items.push({ date: '2024 — Günümüz', role: 'Yeni Pozisyon', company: 'Şirket', description: 'Açıklama...' }); renderTab(currentTab);
};
window.addProject = function() {
    collectFormData(); data.projects.items.push({ title: 'Yeni Proje', category: 'Kategori', shortDesc: 'Kısa açıklama',
        description: 'Detaylı açıklama', detailContent: 'Detaylı açıklama', gradientColors: ['#0a0a2e','#1a1a4e','#003040'],
        image: '', pdf: '', detailImages: [], tech: ['Teknoloji'], link: '' }); renderTab(currentTab);
};
window.addSkill = function() {
    collectFormData(); data.skills.items.push({ name: 'Yeni Yetenek', icon: '★', gradientColors: ['#333','#111'], level: 80, levelText: 'İleri Seviye' }); renderTab(currentTab);
};

function esc(str) { if (!str) return ''; return String(str).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
