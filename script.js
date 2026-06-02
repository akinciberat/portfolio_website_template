/* ========== LOAD DATA FROM API ========== */
async function loadPortfolioData() {
    try {
        const res = await fetch('/api/data');
        if (!res.ok) return null;
        return await res.json();
    } catch { return null; }
}

function getSkillIconColor(item) {
    const key = `${item.name || ''} ${item.icon || ''}`.toLowerCase();
    if (key.includes('photoshop') || key.includes('ps')) return '#31a8ff';
    if (key.includes('after') || key.includes(' ae')) return '#7c6dff';
    if (key.includes('corel') || key.includes('cd')) return '#49a942';
    if (key.includes('html') || key.includes('</>')) return '#e44d26';
    if (key.includes('css') || key.includes('{ }')) return '#264de4';
    return '#9b5cff';
}

function esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function populatePage() {
    const d = await loadPortfolioData();
    if (!d) return; // static fallback — keep hardcoded HTML

    // Site Settings
    if (d.siteSettings) {
        document.title = d.siteSettings.title;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.content = d.siteSettings.description;
        const headerLogo = document.querySelector('.nav-logo');
        if (headerLogo && d.siteSettings.headerLogo) {
            headerLogo.innerHTML = `<img src="${d.siteSettings.headerLogo}" alt="${d.siteSettings.title || 'Logo'}">`;
            headerLogo.classList.add('has-logo');
        }
        const footerLogo = document.querySelector('.footer-logo');
        if (footerLogo && d.siteSettings.footerLogo) {
            footerLogo.innerHTML = `<img src="${d.siteSettings.footerLogo}" alt="${d.siteSettings.title || 'Logo'}">`;
            footerLogo.classList.add('has-logo');
        }
    }

    // Hero
    if (d.hero) {
        const ql = s => document.querySelector(s);
        const label = ql('.hero-label'); if (label) label.textContent = d.hero.label;
        const lines = document.querySelectorAll('.title-line');
        if (lines[0]) lines[0].textContent = d.hero.firstName;
        if (lines[1]) lines[1].textContent = d.hero.lastName;
        const desc = ql('.hero-desc'); if (desc) desc.innerHTML = d.hero.description.replace(/\n/g, '<br>');
        const btns = document.querySelectorAll('.hero-buttons .btn');
        if (btns[0]) btns[0].querySelector('span').textContent = d.hero.btnPrimary;
        if (btns[1]) btns[1].querySelector('span').textContent = d.hero.btnSecondary;
    }

    // About
    if (d.about) {
        const sec = document.getElementById('about');
        const tag = sec.querySelector('.section-tag'); if (tag) tag.textContent = d.about.tag;
        const title = sec.querySelector('.section-title'); if (title) title.innerHTML = d.about.title;
        const lead = sec.querySelector('.about-lead'); if (lead) lead.textContent = d.about.lead;
        const textDiv = sec.querySelector('.about-text');
        if (textDiv) {
            const existingP = textDiv.querySelectorAll('p:not(.about-lead)');
            existingP.forEach(p => p.remove());
            d.about.paragraphs.forEach(para => {
                const p = document.createElement('p'); p.textContent = para;
                textDiv.appendChild(p);
            });
        }
        // Stats
        const statsDiv = sec.querySelector('.about-stats');
        if (statsDiv) {
            statsDiv.innerHTML = d.about.stats.map(s => `
                <div class="stat-card">
                    <span class="stat-number" data-count="${s.number}">0</span><span class="stat-suffix">${s.suffix}</span>
                    <span class="stat-label">${s.label}</span>
                </div>`).join('');
        }
    }

    // Experience
    if (d.experience) {
        const sec = document.getElementById('experience');
        sec.querySelector('.section-tag').textContent = d.experience.tag;
        sec.querySelector('.section-title').innerHTML = d.experience.title;
        const timeline = sec.querySelector('.timeline');
        const line = timeline.querySelector('.timeline-line').outerHTML;
        timeline.innerHTML = line + d.experience.items.map(item => `
            <div class="timeline-item" data-animate="fade-up">
                <div class="timeline-dot"></div>
                <div class="timeline-card glass-card">
                    <span class="timeline-date">${item.date}</span>
                    <h3 class="timeline-role">${item.role}</h3>
                    <h4 class="timeline-company">${item.company}</h4>
                    <p class="timeline-desc">${item.description}</p>
                </div>
            </div>`).join('');
    }

    // Projects
    if (d.projects) {
        const sec = document.getElementById('projects');
        sec.querySelector('.section-tag').textContent = d.projects.tag;
        sec.querySelector('.section-title').innerHTML = d.projects.title;
        const grid = sec.querySelector('.projects-grid');
        grid.innerHTML = d.projects.items.map((item, i) => {
            // Support both gradientColors array and legacy gradient string
            let bgStyle;
            if (item.image) {
                bgStyle = `background-image: url(${item.image}); background-size: cover; background-position: center;`;
            } else if (item.gradientColors && item.gradientColors.length) {
                bgStyle = `background: linear-gradient(135deg, ${item.gradientColors.join(', ')});`;
            } else {
                bgStyle = `background: ${item.gradient || 'linear-gradient(135deg,#0a0a2e,#1a1a4e)'};`;
            }
            return `<div class="project-card" data-animate="fade-up" data-tilt data-project="${i}" onclick="window.location.href='/project.html?id=${i}'">
                <div class="project-image" style="${bgStyle}"></div>
                <div class="project-overlay">
                    <span class="project-category">${item.category}</span>
                    <h3 class="project-title">${item.title}</h3>
                    <p class="project-short">${item.shortDesc}</p>
                    <button class="project-btn">Detayları Gör ↗</button>
                </div>
            </div>`;
        }).join('');
        window._projectData = d.projects.items;
    }

    // Skills
    if (d.skills) {
        const sec = document.getElementById('skills');
        sec.querySelector('.section-tag').textContent = d.skills.tag;
        sec.querySelector('.section-title').innerHTML = d.skills.title;
        const grid = sec.querySelector('.skills-grid');
        grid.innerHTML = d.skills.items.map(item => {
            const iconColor = getSkillIconColor(item);
            return `<div class="skill-card" data-animate="fade-up" data-tilt>
                <div class="skill-icon" style="background: ${iconColor};"><span>${esc(item.icon)}</span></div>
                <h3 class="skill-name">${item.name}</h3>
                <div class="skill-bar"><div class="skill-progress" data-width="${item.level}"></div></div>
                <span class="skill-level">${item.levelText}</span>
            </div>`;
        }).join('');
    }

    // Contact
    if (d.contact) {
        const sec = document.getElementById('contact');
        sec.querySelector('.section-tag').textContent = d.contact.tag;
        sec.querySelector('.section-title').innerHTML = d.contact.title;
        sec.querySelector('.contact-lead').textContent = d.contact.lead;
        const items = sec.querySelectorAll('.contact-item span');
        if (items[0]) items[0].textContent = d.contact.email;
        if (items[1]) items[1].textContent = d.contact.location;
        const socials = sec.querySelectorAll('.social-link');
        const socialKeys = ['github', 'linkedin', 'twitter', 'instagram'];
        socials.forEach((link, i) => { if (d.contact.socials[socialKeys[i]]) link.href = d.contact.socials[socialKeys[i]]; });
    }

    // Footer
    if (d.footer) {
        const fp = document.querySelector('.footer p');
        if (fp) fp.textContent = d.footer.text;
    }

    // Re-init dynamic features after DOM update
    setTimeout(() => {
        initScrollAnimations();
        initTiltEffects();
        initProjectModal();
        initStatCounters();
        initSkillBars();
    }, 100);
}

/* ========== PRELOADER ========== */
window.addEventListener('load', () => {
    populatePage().then(() => {
        setTimeout(() => {
            document.getElementById('preloader').classList.add('hidden');
            animateHero();
        }, 2000);
    });
});

/* ========== CUSTOM CURSOR ========== */
const cursorDot = document.getElementById('cursorDot');
const cursorOutline = document.getElementById('cursorOutline');
const mouseGlow = document.getElementById('mouseGlow');
let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
    mouseGlow.style.left = mouseX + 'px';
    mouseGlow.style.top = mouseY + 'px';
});

function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.12;
    outlineY += (mouseY - outlineY) * 0.12;
    cursorOutline.style.left = outlineX + 'px';
    cursorOutline.style.top = outlineY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

function bindCursorHovers() {
    document.querySelectorAll('a, button, .project-card, .skill-card, .stat-card').forEach(el => {
        el.addEventListener('mouseenter', () => { cursorDot.classList.add('hover'); cursorOutline.classList.add('hover'); });
        el.addEventListener('mouseleave', () => { cursorDot.classList.remove('hover'); cursorOutline.classList.remove('hover'); });
    });
}
bindCursorHovers();

/* ========== HERO ENTRANCE ANIMATION ========== */
function animateHero() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.hero-label', { opacity: 1, y: 0, duration: 0.8 })
      .to('.title-line', { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 }, '-=0.4')
      .to('.hero-desc', { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
      .to('.hero-buttons', { opacity: 1, y: 0, duration: 0.8 }, '-=0.4');
}

/* ========== NAVIGATION ========== */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 80); });
navToggle.addEventListener('click', () => { navToggle.classList.toggle('active'); navMenu.classList.toggle('active'); });
navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => { navToggle.classList.remove('active'); navMenu.classList.remove('active'); });
});

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 200) current = s.id; });
    navLinks.forEach(l => { l.classList.toggle('active', l.getAttribute('data-section') === current); });
});

/* ========== SCROLL ANIMATIONS ========== */
gsap.registerPlugin(ScrollTrigger);

function initScrollAnimations() {
    document.querySelectorAll('[data-animate]').forEach(el => {
        if (el._observed) return;
        el._observed = true;
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                const delay = el.dataset.delay || 0;
                setTimeout(() => el.classList.add('visible'), delay * 1000);
                obs.unobserve(el);
            }
        }, { threshold: 0.15 });
        obs.observe(el);
    });
}
initScrollAnimations();

function initStatCounters() {
    document.querySelectorAll('.stat-number').forEach(el => {
        if (el._counted) return;
        el._counted = true;
        const target = parseInt(el.dataset.count);
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                gsap.to(el, {
                    textContent: target, duration: 2, ease: 'power2.out',
                    snap: { textContent: 1 },
                    onUpdate() { el.textContent = Math.round(parseFloat(el.textContent)); }
                });
                obs.unobserve(el);
            }
        }, { threshold: 0.5 });
        obs.observe(el);
    });
}
initStatCounters();

function initSkillBars() {
    document.querySelectorAll('.skill-progress').forEach(bar => {
        if (bar._animated) return;
        bar._animated = true;
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { bar.style.width = bar.dataset.width + '%'; obs.unobserve(bar); }
        }, { threshold: 0.3 });
        obs.observe(bar);
    });
}
initSkillBars();

document.querySelectorAll('.section-header').forEach(header => {
    gsap.fromTo(header, { y: 30 }, {
        y: -20, ease: 'none',
        scrollTrigger: { trigger: header, start: 'top 90%', end: 'bottom 20%', scrub: 1 }
    });
});

/* ========== 3D TILT ========== */
function initTiltEffects() {
    document.querySelectorAll('[data-tilt]').forEach(card => {
        if (card._tilted) return;
        card._tilted = true;
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(600px) rotateY(0) rotateX(0) translateY(0)';
        });
    });
    bindCursorHovers();
}
initTiltEffects();

/* ========== PROJECT CARDS → DETAIL PAGE ========== */
function initProjectModal() {
    // Project cards now open project.html?id=X (set via onclick in HTML)
    // Fallback: bind click for hardcoded cards in index.html
    document.querySelectorAll('.project-card:not([onclick])').forEach(card => {
        card.addEventListener('click', () => {
            const i = parseInt(card.dataset.project);
            window.location.href = '/project.html?id=' + i;
        });
    });
    // Keep modal overlay closeable if somehow opened
    const modal = document.getElementById('projectModal');
    if (modal) {
        document.getElementById('modalClose')?.addEventListener('click', () => {
            modal.classList.remove('active'); document.body.style.overflow = '';
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
        });
    }
}
initProjectModal();

/* ========== CONTACT FORM ========== */
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const success = document.getElementById('formSuccess');
    gsap.to(form.querySelectorAll('.form-group, .btn'), {
        opacity: 0, y: -10, duration: 0.3, stagger: 0.05,
        onComplete() {
            form.querySelectorAll('.form-group, .btn').forEach(el => el.style.display = 'none');
            success.classList.add('show');
            gsap.from(success, { opacity: 0, scale: 0.8, duration: 0.5, ease: 'back.out(1.7)' });
        }
    });
});

/* ========== SMOOTH SCROLL ========== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
    });
});
