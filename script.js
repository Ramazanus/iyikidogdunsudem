/*
   --------------------------------------------------
   JavaScript Code for "Seninle" Romantic Birthday Website
   Interactive elements, animations, particle effects,
   reasons generator, and carousel logic.
   --------------------------------------------------
*/

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initScrollProgressBar();
    initBgParticles();
    initCursorTrail();
    initGSAPAnimations();
    initSurpriseModal();
    initReasonsSection();
    initCarousel();
    initAudioController();
    initClickSparkles();
});

// 1. Loading Screen Progress
function initLoader() {
    const loadingScreen = document.getElementById('loading-screen');
    const progress = document.getElementById('loader-progress');
    const percentage = document.getElementById('loader-percentage');
    
    let count = 0;
    const interval = setInterval(() => {
        count += Math.floor(Math.random() * 8) + 2;
        if (count >= 100) {
            count = 100;
            clearInterval(interval);
            
            // Wait slightly and fade out loader
            setTimeout(() => {
                loadingScreen.style.opacity = 0;
                loadingScreen.style.visibility = 'hidden';
                document.body.style.overflowY = 'auto';
            }, 600);
        }
        progress.style.width = count + '%';
        percentage.textContent = count + '%';
    }, 45);
}

// 2. Scroll Progress Indicator
function initScrollProgressBar() {
    const progressBar = document.getElementById('scroll-progress-bar');
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// 3. Floating Background Particles Canvas
function initBgParticles() {
    const canvas = document.getElementById('bg-particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    class HeartParticle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100;
            this.size = Math.random() * 8 + 4;
            this.speed = Math.random() * 0.8 + 0.4;
            this.opacity = Math.random() * 0.4 + 0.15;
            this.angle = Math.random() * Math.PI * 2;
            this.wiggleSpeed = Math.random() * 0.02 + 0.005;
            this.wiggleRange = Math.random() * 20 + 5;
        }
        
        update() {
            this.y -= this.speed;
            this.angle += this.wiggleSpeed;
            this.x += Math.sin(this.angle) * 0.3;
            
            if (this.y < -50) {
                this.reset();
            }
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = '#f8a5c2';
            
            // Draw heart path
            ctx.beginPath();
            ctx.translate(this.x, this.y);
            ctx.scale(this.size / 10, this.size / 10);
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-5, -5, -10, -2, -10, 5);
            ctx.bezierCurveTo(-10, 12, -2, 17, 0, 20);
            ctx.bezierCurveTo(2, 17, 10, 12, 10, 5);
            ctx.bezierCurveTo(10, -2, 5, -5, 0, 0);
            ctx.fill();
            ctx.restore();
        }
    }
    
    // Spawn background particles
    const particleCount = Math.min(40, Math.floor(window.innerWidth / 30));
    for (let i = 0; i < particleCount; i++) {
        const p = new HeartParticle();
        // pre-distribute particles vertically so they don't all rise from bottom initially
        p.y = Math.random() * canvas.height;
        particles.push(p);
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// 4. Cursor Heart Trail
function initCursorTrail() {
    const container = document.getElementById('cursor-trail-container');
    let lastX = 0;
    let lastY = 0;
    let distanceThreshold = 45; // Pixels cursor must travel to spawn a heart
    
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        // Calculate distance from last spawned heart
        const dist = Math.hypot(x - lastX, y - lastY);
        
        if (dist > distanceThreshold) {
            spawnHeart(x, y);
            lastX = x;
            lastY = y;
        }
    });
    
    function spawnHeart(x, y) {
        const heart = document.createElement('i');
        heart.classList.add('fa-solid', 'fa-heart', 'cursor-heart');
        
        // Random size and rotation
        const size = Math.random() * 12 + 8;
        const rotation = Math.random() * 40 - 20;
        
        heart.style.left = `${x - size / 2}px`;
        heart.style.top = `${y - size / 2}px`;
        heart.style.fontSize = `${size}px`;
        heart.style.transform = `rotate(${rotation}deg)`;
        
        // Random palette colors
        const colors = ['#f8a5c2', '#e66767', '#fce4ec', '#f5cd79'];
        heart.style.color = colors[Math.floor(Math.random() * colors.length)];
        
        container.appendChild(heart);
        
        // Smoothly float up and disappear
        gsap.to(heart, {
            y: -80 - Math.random() * 50,
            x: (Math.random() * 60 - 30),
            opacity: 0,
            duration: 1.2 + Math.random() * 0.8,
            ease: 'power1.out',
            onComplete: () => heart.remove()
        });
    }
}

// 5. Scroll Reveals using GSAP
function initGSAPAnimations() {
    // Register scroll trigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Header entrance
    gsap.from('.main-header', {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.5
    });
    
    // Hero Text Entrance
    const heroTimeline = gsap.timeline({ delay: 0.8 });
    heroTimeline.from('.hero-pretitle', { y: 20, opacity: 0, duration: 0.6 })
                .from('.hero-title', { y: 30, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4')
                .from('.hero-desc', { y: 20, opacity: 0, duration: 0.6 }, '-=0.5')
                .from('.title-divider', { scaleX: 0, opacity: 0, duration: 0.5 }, '-=0.4')
                .from('.hero-cta-wrapper', { y: 20, opacity: 0, duration: 0.6 }, '-=0.3');
                
    // Scroll reveal for memory rows
    const memoryRows = document.querySelectorAll('.memory-row');
    memoryRows.forEach(row => {
        const text = row.querySelector('.memory-text');
        const visual = row.querySelector('.memory-visual');
        
        gsap.from(text, {
            scrollTrigger: {
                trigger: row,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            x: row.classList.contains('row-reverse') ? 80 : -80,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
        
        gsap.from(visual, {
            scrollTrigger: {
                trigger: row,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            x: row.classList.contains('row-reverse') ? -80 : 80,
            opacity: 0,
            duration: 1.2,
            ease: 'power2.out'
        });
    });

    // Reasons Section Entrance
    gsap.from('.reasons-card-wrapper', {
        scrollTrigger: {
            trigger: '#why-birthday-section',
            start: 'top 75%'
        },
        scale: 0.95,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
    });
    
    // Header styling on scroll
    ScrollTrigger.create({
        start: 'top -50',
        onEnter: () => document.querySelector('.main-header').classList.add('scrolled'),
        onLeaveBack: () => document.querySelector('.main-header').classList.remove('scrolled')
    });
}

// 6. Surprise Modal Card & Typewriter Text
function initSurpriseModal() {
    const modal = document.getElementById('surprise-modal');
    const openBtn = document.getElementById('btn-open-heart');
    const closeBtn = document.getElementById('btn-close-surprise');
    const typewriterText = document.getElementById('typewriter-text');
    
    const romanticLetter = `Sevgilim, hayatımın en güzel şansı...\n\nSeninle geçen her an, benim için paha biçilemez birer hatıra. Gülüşünle dünyamı aydınlattığın, en zor anlarımda elimi tutup bana yuva sıcaklığını hissettirdiğin için teşekkür ederim. Bu yeni yaşında da her gün seninle gülmek, seninle yaşlanmak istiyorum. İyi ki doğdun sevgilim, iyi ki benim oldun. Doğum günün kutlu olsun sevgilim.`;
    
    let typewriterActive = false;
    
    function openSurprise() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Start typewriter effect once open
        if (!typewriterActive) {
            typewriterActive = true;
            typewriterText.textContent = '';
            let charIndex = 0;
            
            function typeChar() {
                if (charIndex < romanticLetter.length) {
                    // Convert linebreaks to HTML breaks
                    if (romanticLetter.charAt(charIndex) === '\n') {
                        typewriterText.innerHTML += '<br>';
                    } else {
                        typewriterText.innerHTML += romanticLetter.charAt(charIndex);
                    }
                    charIndex++;
                    setTimeout(typeChar, 35);
                }
            }
            setTimeout(typeChar, 800);
        }
    }
    
    function closeSurprise() {
        modal.classList.remove('active');
        document.body.style.overflowY = 'auto';
        
        // Reset 3D heart splitting in heart3d.js if active
        if (window.closeHeart3D) {
            window.closeHeart3D();
        }
    }
    
    openBtn.addEventListener('click', openSurprise);
    closeBtn.addEventListener('click', closeSurprise);
    
    // Close modal on click outside card
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeSurprise();
        }
    });
    
    // Expose openSurprise to window for heart3d.js click event
    window.openSurpriseModal = openSurprise;
}

// 7. NEW SECTION: Why Happy Birthday (Neden İyi Ki Doğdun?) Logic & Particles
function initReasonsSection() {
    const reasons = [
        "Çünkü gülüşün en kötü günümü bile güzelleştiriyor.",
        "Çünkü yanında kendim gibi hissediyorum.",
        "Çünkü sesini duyunca içim huzur doluyor.",
        "Çünkü hayatıma renk kattın.",
        "Çünkü küçük şeyleri bile özel hissettirebiliyorsun.",
        "Çünkü gözlerin bana güven veriyor.",
        "Çünkü seninle zaman çok hızlı geçiyor.",
        "Çünkü seninle sıradan günler bile güzel oluyor.",
        "Çünkü bana sevgiyi yeniden öğrettin.",
        "Çünkü sarılınca bütün stresim gidiyor.",
        "Çünkü kahkahaların bağımlılık yapıyor.",
        "Çünkü varlığın bile yetiyor.",
        "Çünkü birlikteyken dünya daha sakin geliyor.",
        "Çünkü en kötü anımda bile yanımda oldun.",
        "Çünkü bana “ev” gibi hissettiriyorsun.",
        "Çünkü hayallerimi seninle kuruyorum.",
        "Çünkü seni izlemek bile mutlu ediyor.",
        "Çünkü kalbimin en güzel yerindesin.",
        "Çünkü seninle her şey daha anlamlı.",
        "Çünkü iyi ki varsın.",
        "Çünkü bana sevildiğimi hissettiriyorsun.",
        "Çünkü gözlerinin içi gülüyor.",
        "Çünkü bazen hiçbir şey yapmadan bile mutlu olabiliyoruz.",
        "Çünkü mesajın gelince istemsiz gülümsüyorum.",
        "Çünkü dünyanın en güzel tesadüfüsün.",
        "Çünkü kalbim seni görünce farklı atıyor.",
        "Çünkü en güzel anılarımın çoğunda sen varsın.",
        "Çünkü bana sabretmeyi ve sevmeyi öğrettin.",
        "Çünkü senin yanında zaman duruyor gibi.",
        "Çünkü seni anlatmaya kelimeler yetmiyor.",
        "Çünkü bir bakışın bile günümü değiştirebiliyor.",
        "Çünkü iyi ki doğmuşsun da yollarımız kesişmiş.",
        "Çünkü seninle yaşlanma fikri bile güzel geliyor.",
        "Çünkü seni sevmek çok kolay.",
        "Çünkü dünyanın en güzel hissi senin yanında olmak.",
        "Çünkü bazen sadece adını görmek bile yetiyor.",
        "Çünkü kalbimde bıraktığın hissin tarifi yok.",
        "Çünkü sen benim en güzel şansımsın.",
        "Çünkü her gün sana yeniden aşık oluyorum."
    ];
    
    let currentIndex = 0;
    const textDisplay = document.getElementById('reason-text-display');
    const numDisplay = document.getElementById('reason-num-display');
    const nextBtn = document.getElementById('btn-next-reason');
    const canvas = document.getElementById('reasons-particles-canvas');
    const ctx = canvas.getContext('2d');
    let burstParticles = [];
    
    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    class ReasonBurstHeart {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 12 + 6;
            this.angle = Math.random() * Math.PI * 2;
            this.speed = Math.random() * 5 + 2;
            this.decay = Math.random() * 0.02 + 0.01;
            this.opacity = 1;
            this.gravity = 0.08;
            
            // Random pink/red palette
            const colors = ['#f8a5c2', '#e66767', '#fce4ec', '#ff4d6d'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed + this.gravity;
            this.opacity -= this.decay;
            if (this.size > 0.2) this.size -= 0.05;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.translate(this.x, this.y);
            ctx.scale(this.size / 10, this.size / 10);
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-5, -5, -10, -2, -10, 5);
            ctx.bezierCurveTo(-10, 12, -2, 17, 0, 20);
            ctx.bezierCurveTo(2, 17, 10, 12, 10, 5);
            ctx.bezierCurveTo(10, -2, 5, -5, 0, 0);
            ctx.fill();
            ctx.restore();
        }
    }
    
    function triggerHeartBurst() {
        const rect = nextBtn.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        
        // Find local coordinates on canvas matching button center
        const startX = rect.left + rect.width / 2 - canvasRect.left;
        const startY = rect.top + rect.height / 2 - canvasRect.top;
        
        // Spawn 25 heart burst particles
        for (let i = 0; i < 30; i++) {
            burstParticles.push(new ReasonBurstHeart(startX, startY));
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        burstParticles = burstParticles.filter(p => p.opacity > 0);
        
        burstParticles.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
    // Cycle Reasons
    nextBtn.addEventListener('click', () => {
        triggerHeartBurst();
        
        // Card transition effect
        textDisplay.classList.add('changing');
        
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % reasons.length;
            numDisplay.textContent = `Sebep #${currentIndex + 1}`;
            textDisplay.textContent = reasons[currentIndex];
            textDisplay.classList.remove('changing');
            
            // Add a little heartbeat bounce to the card
            const card = document.getElementById('reasons-card-box');
            card.style.transform = 'scale(0.97)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 100);
        }, 300);
    });
}

// 8. Carousel / Slider Implementation
function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextBtn = document.getElementById('btn-slide-right');
    const prevBtn = document.getElementById('btn-slide-left');
    const dotsNav = document.querySelector('.carousel-nav');
    const dots = Array.from(dotsNav.children);
    
    let activeIndex = 0;
    let autoplayTimer = null;
    
    function updateSlide(targetIndex) {
        // Handle wrapping limits
        if (targetIndex < 0) targetIndex = slides.length - 1;
        if (targetIndex >= slides.length) targetIndex = 0;
        
        // Toggle current slide classes
        slides[activeIndex].classList.remove('current-slide');
        slides[targetIndex].classList.add('current-slide');
        
        // Update dots UI
        dots[activeIndex].classList.remove('current-indicator');
        dots[targetIndex].classList.add('current-indicator');
        
        activeIndex = targetIndex;
    }
    
    // Button clicks
    nextBtn.addEventListener('click', () => {
        updateSlide(activeIndex + 1);
        resetAutoplay();
    });
    
    prevBtn.addEventListener('click', () => {
        updateSlide(activeIndex - 1);
        resetAutoplay();
    });
    
    // Dot clicks
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateSlide(index);
            resetAutoplay();
        });
    });
    
    // Autoplay logic
    function startAutoplay() {
        autoplayTimer = setInterval(() => {
            updateSlide(activeIndex + 1);
        }, 5000);
    }
    
    function resetAutoplay() {
        clearInterval(autoplayTimer);
        startAutoplay();
    }
    
    // Pause autoplay on mouse hover
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    carouselContainer.addEventListener('mouseleave', startAutoplay);
    
    // Swipe Touch Gesture Support for Mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    carouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carouselContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const threshold = 50;
        if (touchStartX - touchEndX > threshold) {
            // Swiped Left
            updateSlide(activeIndex + 1);
            resetAutoplay();
        } else if (touchEndX - touchStartX > threshold) {
            // Swiped Right
            updateSlide(activeIndex - 1);
            resetAutoplay();
        }
    }
    
    startAutoplay();
}

// 9. Audio Ambient Track Controls
function initAudioController() {
    const audio = document.getElementById('bg-audio');
    const toggleBtn = document.getElementById('music-toggle');
    let isPlaying = false;
    
    function playAudio() {
        return audio.play().then(() => {
            isPlaying = true;
            toggleBtn.classList.add('playing');
            toggleBtn.setAttribute('title', 'Müziği Duraklat');
            // Remove interaction fallback since play succeeded
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
        }).catch(err => {
            console.log("Audio play blocked by browser. Awaiting user interaction.", err);
        });
    }

    function pauseAudio() {
        audio.pause();
        isPlaying = false;
        toggleBtn.classList.remove('playing');
        toggleBtn.setAttribute('title', 'Müziği Başlat');
    }

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering document autoplay click listener
        if (!isPlaying) {
            playAudio();
        } else {
            pauseAudio();
        }
    });

    // Autoplay on first user interaction on the page (fallback if initial play is blocked)
    const handleFirstInteraction = () => {
        if (!isPlaying) {
            playAudio();
        }
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    // Attempt to play directly when the script runs
    playAudio();
}

// 10. Click Sparkles Effect
function initClickSparkles() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-control, .carousel-button');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const rect = btn.getBoundingClientRect();
            // Relative click positions
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Create sparkles wrapper
            const sparkleWrapper = document.createElement('div');
            sparkleWrapper.classList.add('sparkle-wrapper');
            sparkleWrapper.style.left = `${x}px`;
            sparkleWrapper.style.top = `${y}px`;
            btn.appendChild(sparkleWrapper);
            
            // Spawn 8 sparkles
            for (let i = 0; i < 8; i++) {
                const sparkle = document.createElement('i');
                sparkle.classList.add('fa-solid', 'fa-star', 'btn-sparkle');
                
                const angle = (i / 8) * Math.PI * 2;
                const distance = Math.random() * 30 + 15;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                
                sparkle.style.setProperty('--tx', `${tx}px`);
                sparkle.style.setProperty('--ty', `${ty}px`);
                sparkle.style.fontSize = `${Math.random() * 6 + 4}px`;
                
                // Color choices
                const colors = ['#f5cd79', '#ffffff', '#f8a5c2'];
                sparkle.style.color = colors[Math.floor(Math.random() * colors.length)];
                
                sparkleWrapper.appendChild(sparkle);
            }
            
            setTimeout(() => {
                sparkleWrapper.remove();
            }, 800);
        });
    });
}

// Sparkle CSS rules injection to handle button click sparks dynamically
const styleSheet = document.createElement("style");
styleSheet.innerText = `
.sparkle-wrapper {
    position: absolute;
    width: 1px;
    height: 1px;
    pointer-events: none;
    z-index: 100;
}
.btn-sparkle {
    position: absolute;
    top: -4px;
    left: -4px;
    animation: button-sparkle-burst 0.7s forwards cubic-bezier(0.1, 0.8, 0.3, 1);
    opacity: 1;
}
@keyframes button-sparkle-burst {
    0% { transform: translate(0, 0) scale(0); opacity: 1; }
    100% { transform: translate(var(--tx), var(--ty)) scale(1.2) rotate(180deg); opacity: 0; }
}
.cursor-heart {
    position: fixed;
    pointer-events: none;
    z-index: 9999;
}
`;
document.head.appendChild(styleSheet);
