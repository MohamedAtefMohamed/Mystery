'use strict';

// --- Lightweight, Fast Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    // Instant preloader removal for maximum responsiveness
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
            document.body.classList.remove('loading');
        }, 150);
    }

    initScrollSpy();
    initContactForm();
    initMobileMenu();
    initBackToTop();
    initScrollReveals();
});


// --- Lightweight Scroll Reveal Animations ---
function initScrollReveals() {
    const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    if (!('IntersectionObserver' in window)) {
        reveals.forEach(el => el.classList.add('active'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
}


// --- ScrollSpy Active Navigation ---
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-nav');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active-nav');
            }
        });
    }, { passive: true });
}


// --- Contact Form Mailto Handler ---
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('contact-name')?.value.trim() || '';
        const company = document.getElementById('contact-company')?.value.trim() || '';
        const email = document.getElementById('contact-email')?.value.trim() || '';
        const serviceSelect = document.getElementById('contact-service');
        const service = serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex].text : '';
        const message = document.getElementById('contact-message')?.value.trim() || '';

        const targetEmail = 'mystery.security@gmail.com';
        const subject = encodeURIComponent(`[Security Inquiry] ${service} - ${name} (${company})`);
        const bodyText = `MYSTERY Security Team,

Below are the details for our cybersecurity engagement request:

- Name: ${name}
- Company: ${company}
- Corporate Email: ${email}
- Service Required: ${service}

- Details / Requirements:
${message}

----------------------------------------
Sent via MYSTERY Security Portal`;

        const body = encodeURIComponent(bodyText);
        const mailtoUrl = `mailto:${targetEmail}?subject=${subject}&body=${body}`;

        // Feedback on button
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span class="inline-block animate-spin mr-2">⚡</span> OPENING MAIL CLIENT...`;
        submitBtn.disabled = true;

        // Trigger Mailto
        window.location.href = mailtoUrl;

        setTimeout(() => {
            submitBtn.innerHTML = originalBtnHTML;
            submitBtn.disabled = false;
            showContactModal(targetEmail, bodyText, mailtoUrl);
        }, 500);
    });
}

function showContactModal(targetEmail, rawBodyText, mailtoUrl) {
    let modal = document.getElementById('contact-success-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'contact-success-modal';
        modal.className = 'fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300 opacity-0 pointer-events-none';
        modal.innerHTML = `
            <div class="glass-panel-glow max-w-lg w-full p-8 rounded-2xl text-left relative transform transition-transform duration-300 scale-95">
                <button id="close-modal-btn" class="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold p-2">&times;</button>
                <div class="w-12 h-12 rounded-full bg-volcano-red/20 border border-volcano-red/40 flex items-center justify-center text-volcano-red text-2xl mb-4">
                    ✓
                </div>
                <h3 class="text-2xl font-space font-bold text-white mb-2">Email Client Initiated</h3>
                <p class="text-gray-300 text-sm mb-6 leading-relaxed">
                    Your request is directed to <strong class="text-volcano-red font-mono">${targetEmail}</strong>.
                </p>
                
                <div class="bg-black/60 border border-white/10 rounded-lg p-4 mb-6 font-mono text-xs text-gray-300 overflow-x-auto max-h-40">
                    <div class="text-gray-500 mb-1">// TRANSMISSION SUMMARY</div>
                    <pre id="modal-body-preview" class="whitespace-pre-wrap">${escapeHtml(rawBodyText)}</pre>
                </div>

                <div class="flex flex-col sm:flex-row gap-3">
                    <a id="modal-reopen-mailto" href="${mailtoUrl}" class="flex-1 py-3 px-4 text-center font-space font-bold text-black bg-volcano-red rounded hover:bg-white transition-colors text-sm flex items-center justify-center gap-2">
                        <span>Open Email App</span>
                    </a>
                    <button id="modal-copy-btn" class="py-3 px-4 font-space font-medium text-white border border-white/20 rounded hover:border-volcano-red hover:text-volcano-red transition-colors text-sm">
                        Copy Message
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('close-modal-btn').addEventListener('click', hideContactModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) hideContactModal();
        });

        document.getElementById('modal-copy-btn').addEventListener('click', () => {
            navigator.clipboard.writeText(`To: ${targetEmail}\n\n${rawBodyText}`).then(() => {
                const btn = document.getElementById('modal-copy-btn');
                btn.innerText = 'Copied! ✓';
                btn.classList.add('text-green-400', 'border-green-400');
                setTimeout(() => {
                    btn.innerText = 'Copy Message';
                    btn.classList.remove('text-green-400', 'border-green-400');
                }, 2000);
            });
        });
    }

    const preview = modal.querySelector('#modal-body-preview');
    if (preview) preview.textContent = rawBodyText;
    const reopen = modal.querySelector('#modal-reopen-mailto');
    if (reopen) reopen.href = mailtoUrl;

    modal.classList.remove('opacity-0', 'pointer-events-none');
}

function hideContactModal() {
    const modal = document.getElementById('contact-success-modal');
    if (modal) {
        modal.classList.add('opacity-0', 'pointer-events-none');
    }
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}


// --- Mobile Navigation Menu ---
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const menuDrawer = document.getElementById('mobile-menu');
    if (!menuBtn || !menuDrawer) return;

    menuBtn.addEventListener('click', () => {
        menuDrawer.classList.toggle('hidden');
        menuDrawer.classList.toggle('flex');
    });

    const mobileLinks = menuDrawer.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuDrawer.classList.add('hidden');
            menuDrawer.classList.remove('flex');
        });
    });
}


// --- Back To Top Floating Action Button ---
function initBackToTop() {
    let btn = document.getElementById('back-to-top');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'back-to-top';
        btn.setAttribute('aria-label', 'Back to top');
        btn.className = 'fixed bottom-8 right-8 z-40 w-11 h-11 rounded-full glass-panel-glow text-volcano-red flex items-center justify-center opacity-0 pointer-events-none transition-all duration-200 hover:scale-105 hover:bg-volcano-red hover:text-black group shadow-lg';
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`;
        document.body.appendChild(btn);

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.remove('opacity-0', 'pointer-events-none');
            btn.classList.add('opacity-100');
        } else {
            btn.classList.add('opacity-0', 'pointer-events-none');
            btn.classList.remove('opacity-100');
        }
    }, { passive: true });
}
