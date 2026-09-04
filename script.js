'use strict';

// --- Preloader & Boot Sequence ---
document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById('preloader');
    const loaderBar = document.getElementById('loader-bar');
    const loaderText = document.getElementById('loader-text');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 18 + 5;
        if (progress >= 100) progress = 100;
        
        if (loaderBar) loaderBar.style.width = `${progress}%`;
        
        if (progress > 30 && progress < 60) {
            if (loaderText) loaderText.innerText = "ESTABLISHING SECURE CONNECTION...";
        } else if (progress >= 60 && progress < 90) {
            if (loaderText) loaderText.innerText = "DECRYPTING ASSETS & PROTOCOLS...";
        } else if (progress >= 100) {
            if (loaderText) loaderText.innerText = "ACCESS GRANTED. SYSTEM READY.";
            clearInterval(interval);
            
            setTimeout(() => {
                if (preloader) {
                    preloader.style.opacity = '0';
                    preloader.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        preloader.style.display = 'none';
                        document.body.classList.remove('loading');
                        initAnimations();
                    }, 800);
                }
            }, 400);
        }
    }, 80);

    initLenis();
    initCursor();
    initScrollSpy();
    initContactForm();
    initMobileMenu();
    initBackToTop();
    initHoverStates();
});

// --- Lenis Smooth Scroll Integration ---
let lenis = null;
function initLenis() {
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Smooth navigation anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId && targetId !== '#') {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        lenis.scrollTo(targetElement, { offset: -80 });
                    }
                }
            });
        });
    }
}


// --- Smooth Custom Cursor with Lerp (Liquid Smoothing) ---
function initCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    if (!cursorDot || !cursorOutline) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });

    function renderCursor() {
        // Lerp factor 0.18 for silky smooth movement
        outlineX += (mouseX - outlineX) * 0.18;
        outlineY += (mouseY - outlineY) * 0.18;
        
        cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);
}


// --- Hover States for Buttons & Interactive Elements ---
function initHoverStates() {
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .tilt-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering-link'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering-link'));
    });

    // Magnetic buttons
    const magnetics = document.querySelectorAll('.magnetic');
    magnetics.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const h = rect.width / 2;
            const x = e.clientX - rect.left - h;
            const y = e.clientY - rect.top - (rect.height / 2);
            
            this.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
            document.body.classList.add('magnetic-hover');
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0px, 0px)';
            document.body.classList.remove('magnetic-hover');
        });
    });
}


// --- Matrix Rain Canvas ---
const canvas = document.getElementById('matrix-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const chars = '01MYSTERYSECURITY0101010101337_SEC_OFFENSIVE_ASSESSMENT';
    const charArray = chars.split('');
    const fontSize = 14;
    let columns = Math.floor(width / fontSize);
    let drops = [];

    for (let x = 0; x < columns; x++) {
        drops[x] = Math.floor(Math.random() * -50);
    }

    function drawMatrix() {
        ctx.fillStyle = 'rgba(5, 5, 5, 0.08)';
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = 'rgba(255, 36, 0, 0.45)';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            ctx.fillText(text, x, y);
            
            if (y > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    setInterval(drawMatrix, 35);
}


// --- Scroll Animations (Reveal & Scroll Progress & Navbar) ---
const scrollProgress = document.getElementById('scroll-progress');
const navbar = document.getElementById('navbar');

function initAnimations() {
    checkReveals();
}

window.addEventListener('scroll', () => {
    const totalScroll = document.documentElement.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (scrollProgress && windowHeight > 0) {
        const scrollValue = `${(totalScroll / windowHeight) * 100}%`;
        scrollProgress.style.width = scrollValue;
    }

    // Navbar BG transition
    if (navbar) {
        if (totalScroll > 40) {
            navbar.classList.add('bg-black/85', 'backdrop-blur-xl', 'border-white/10', 'shadow-2xl', 'py-3');
            navbar.classList.remove('border-transparent', 'py-4');
        } else {
            navbar.classList.remove('bg-black/85', 'backdrop-blur-xl', 'border-white/10', 'shadow-2xl', 'py-3');
            navbar.classList.add('border-transparent', 'py-4');
        }
    }

    // Parallax
    document.querySelectorAll('.parallax').forEach(el => {
        const speed = parseFloat(el.getAttribute('data-speed')) || 0.1;
        const yPos = -(totalScroll * speed);
        el.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });

    checkReveals();
});

function checkReveals() {
    const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const windowHeight = window.innerHeight;
    const revealPoint = 80;

    reveals.forEach(reveal => {
        const revealTop = reveal.getBoundingClientRect().top;
        if (revealTop < windowHeight - revealPoint) {
            reveal.classList.add('active');
        }
    });
}


// --- ScrollSpy Active Navigation ---
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
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
    });
}


// --- Counters ---
const counters = document.querySelectorAll('.counter');
let counted = false;

window.addEventListener('scroll', () => {
    if (counted) return;
    const statsSection = document.querySelector('.counter')?.closest('section');
    if (!statsSection) return;
    
    const top = statsSection.getBoundingClientRect().top;
    if (top < window.innerHeight - 80) {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 1800; // ms
            const step = target / (duration / 16);
            
            let current = 0;
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.innerText = Math.ceil(current) + "+";
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target + "+";
                }
            };
            updateCounter();
        });
        counted = true;
    }
});


// --- 3D Tilt Cards ---
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
    });
});


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

        // Update submit button UI feedback
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span class="inline-block animate-spin mr-2">⚡</span> OPENING MAIL CLIENT...`;
        submitBtn.disabled = true;

        // Trigger Mailto
        window.location.href = mailtoUrl;

        // Show interactive modal dialog with fallback options
        setTimeout(() => {
            submitBtn.innerHTML = originalBtnHTML;
            submitBtn.disabled = false;
            showContactModal(targetEmail, bodyText, mailtoUrl);
        }, 800);
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
                    Your default email app is opening to send your request directly to <strong class="text-volcano-red font-mono">${targetEmail}</strong>.
                </p>
                
                <div class="bg-black/60 border border-white/10 rounded-lg p-4 mb-6 font-mono text-xs text-gray-300 overflow-x-auto max-h-40">
                    <div class="text-gray-500 mb-1">// TRANSMISSION SUMMARY</div>
                    <pre id="modal-body-preview" class="whitespace-pre-wrap">${escapeHtml(rawBodyText)}</pre>
                </div>

                <div class="flex flex-col sm:flex-row gap-3">
                    <a id="modal-reopen-mailto" href="${mailtoUrl}" class="flex-1 py-3 px-4 text-center font-space font-bold text-black bg-volcano-red rounded hover:bg-white transition-colors text-sm flex items-center justify-center gap-2">
                        <span>Open Email App</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </a>
                    <button id="modal-copy-btn" class="py-3 px-4 font-space font-medium text-white border border-white/20 rounded hover:border-volcano-red hover:text-volcano-red transition-colors text-sm">
                        Copy Message
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Bind events
        document.getElementById('close-modal-btn').addEventListener('click', hideContactModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) hideContactModal();
        });

        document.getElementById('modal-copy-btn').addEventListener('click', () => {
            navigator.clipboard.writeText(`To: ${targetEmail}\n\n${rawBodyText}`).then(() => {
                const btn = document.getElementById('modal-copy-btn');
                btn.innerText = 'Copied to Clipboard! ✓';
                btn.classList.add('text-green-400', 'border-green-400');
                setTimeout(() => {
                    btn.innerText = 'Copy Message';
                    btn.classList.remove('text-green-400', 'border-green-400');
                }, 2500);
            });
        });
    }

    // Update body preview & links
    const preview = modal.querySelector('#modal-body-preview');
    if (preview) preview.textContent = rawBodyText;
    const reopen = modal.querySelector('#modal-reopen-mailto');
    if (reopen) reopen.href = mailtoUrl;

    // Show modal
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.querySelector('.glass-panel-glow').classList.remove('scale-95');
    modal.querySelector('.glass-panel-glow').classList.add('scale-100');
}

function hideContactModal() {
    const modal = document.getElementById('contact-success-modal');
    if (modal) {
        modal.classList.add('opacity-0', 'pointer-events-none');
        modal.querySelector('.glass-panel-glow').classList.remove('scale-100');
        modal.querySelector('.glass-panel-glow').classList.add('scale-95');
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

    // Close mobile menu on link click
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
        btn.className = 'fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full glass-panel-glow text-volcano-red flex items-center justify-center opacity-0 pointer-events-none transition-all duration-300 hover:scale-110 hover:bg-volcano-red hover:text-black group shadow-lg';
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:-translate-y-1 transition-transform"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`;
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
    });
}
