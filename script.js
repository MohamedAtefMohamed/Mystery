'use strict';

// --- Preloader & Boot Sequence ---
document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById('preloader');
    const loaderBar = document.getElementById('loader-bar');
    const loaderText = document.getElementById('loader-text');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) progress = 100;
        
        loaderBar.style.width = `${progress}%`;
        
        if (progress > 30 && progress < 60) {
            loaderText.innerText = "ESTABLISHING SECURE CONNECTION...";
        } else if (progress >= 60 && progress < 90) {
            loaderText.innerText = "DECRYPTING ASSETS...";
        } else if (progress >= 100) {
            loaderText.innerText = "ACCESS GRANTED.";
            clearInterval(interval);
            
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    document.body.classList.remove('loading');
                    initAnimations();
                }, 1000);
            }, 500);
        }
    }, 100);
});


// --- Custom Cursor & Magnetic Elements ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const magnetics = document.querySelectorAll('.magnetic');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    
    // Dot follows exactly
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    
    // Outline follows with slight delay
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

magnetics.forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const h = rect.width / 2;
        
        const x = e.clientX - rect.left - h;
        const y = e.clientY - rect.top - (rect.height / 2);
        
        this.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        document.body.classList.add('magnetic-hover');
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translate(0px, 0px)';
        document.body.classList.remove('magnetic-hover');
    });
});


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

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!\\|{}<>[]^~';
    const charArray = chars.split('');
    const fontSize = 14;
    let columns = width / fontSize;
    let drops = [];

    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = '#0F0'; // Fallback
        ctx.fillStyle = 'rgba(255, 36, 0, 0.5)'; // Volcano red matrix
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    setInterval(drawMatrix, 33);
}


// --- Scroll Animations (Reveal & Parallax & Progress) ---
const scrollProgress = document.getElementById('scroll-progress');
const navbar = document.getElementById('navbar');

function initAnimations() {
    // Initial reveals on load
    checkReveals();
}

window.addEventListener('scroll', () => {
    // Scroll Progress
    const totalScroll = document.documentElement.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollValue = `${(totalScroll / windowHeight) * 100}%`;
    scrollProgress.style.width = scrollValue;

    // Navbar BG
    if (totalScroll > 50) {
        navbar.classList.add('bg-black/90', 'backdrop-blur-md', 'border-white/10');
        navbar.classList.remove('border-transparent');
    } else {
        navbar.classList.remove('bg-black/90', 'backdrop-blur-md', 'border-white/10');
        navbar.classList.add('border-transparent');
    }

    // Parallax
    document.querySelectorAll('.parallax').forEach(el => {
        const speed = el.getAttribute('data-speed');
        const yPos = -(totalScroll * speed);
        el.style.transform = `translateY(${yPos}px)`;
    });

    checkReveals();
});

function checkReveals() {
    const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const windowHeight = window.innerHeight;
    const revealPoint = 100;

    reveals.forEach(reveal => {
        const revealTop = reveal.getBoundingClientRect().top;
        if (revealTop < windowHeight - revealPoint) {
            reveal.classList.add('active');
        }
    });
}


// --- Counters ---
const counters = document.querySelectorAll('.counter');
let counted = false;

window.addEventListener('scroll', () => {
    if (counted) return;
    
    // Find if stats section is in view
    const statsSection = document.querySelector('.counter')?.closest('section');
    if (!statsSection) return;
    
    const top = statsSection.getBoundingClientRect().top;
    
    if (top < window.innerHeight - 100) {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // ms
            const step = target / (duration / 16); // 60fps
            
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
        const x = e.clientX - rect.left; // x position within the element.
        const y = e.clientY - rect.top;  // y position within the element.
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        card.style.transition = 'transform 0.5s ease';
    });
    
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'none'; // remove transition for smooth tracking
    });
});
