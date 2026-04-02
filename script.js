// Artistes avec vraies images Unsplash (libres)
const artists = [
    { 
        name: 'Burna Boy', 
        image: 'https://images.unsplash.com/photo-1578632342130-85d35a67a2c1?w=300&h=250&fit=crop', 
        preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    { 
        name: 'Tyla', 
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=250&fit=crop', 
        preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
    { 
        name: 'Wizkid', 
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=250&fit=crop', 
        preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    }
];

// Init
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(hideLoader, 1500); // Loader 1.5s
    initThemeToggle();
    initCarousel();
    initAudio();
    initStats();
    initServices();
    initScrollAnimations();
    initForm();
});

// Loader
function hideLoader() {
    document.getElementById('loader').classList.add('hidden');
}

// Theme Toggle
function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const body = document.body;
    const isDark = localStorage.getItem('theme') !== 'light';
    if (isDark) body.setAttribute('data-theme', 'dark');
    else body.setAttribute('data-theme', 'light');
    
    toggle.onclick = () => {
        const current = body.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        toggle.querySelector('i').className = next === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    };
    toggle.querySelector('i').className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

// Hero BG
const heroBg = document.querySelector('.hero-bg');
function animateHero() {
    heroBg.style.transform = `scale(${1 + Math.sin(Date.now() / 10000) * 0.05})`;
    requestAnimationFrame(animateHero);
}
animateHero();

// Scroll to
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Services
function initServices() {
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', () => card.querySelector('.icon i').style.textShadow = '0 0 20px var(--gold)');
        card.addEventListener('mouseleave', () => card.querySelector('.icon i').style.textShadow = 'none');
    });
}

// Carousel
let currentSlide = 0;
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    artists.forEach((artist, idx) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.innerHTML = `<img src="${artist.image}" alt="${artist.name}"><h3>${artist.name}</h3>`;
        slide.onclick = () => loadPreview(artist.preview);
        track.appendChild(slide);
    });
    document.querySelector('.carousel-next').onclick = () => nextSlide();
    document.querySelector('.carousel-prev').onclick = () => prevSlide();
}
function nextSlide() { currentSlide = (currentSlide + 1) % artists.length; updateCarousel(); }
function prevSlide() { currentSlide = (currentSlide - 1 + artists.length) % artists.length; updateCarousel(); }
function updateCarousel() {
    document.getElementById('carouselTrack').style.transform = `translateX(-${currentSlide * 302}px)`;
}

// Audio
let audio = document.getElementById('audioPlayer');
function initAudio() {
    const playBtn = document.getElementById('playBtn');
    const progressBar = document.getElementById('progressBar');
    const volumeBar = document.getElementById('volumeBar');
    
    playBtn.onclick = togglePlay;
    progressBar.oninput = (e) => { audio.currentTime = (e.target.value / 100) * audio.duration; };
    volumeBar.oninput = (e) => { audio.volume = e.target.value; };
    
    audio.ontimeupdate = updateProgress;
    audio.onloadedmetadata = () => {
        document.getElementById('duration').textContent = formatTime(audio.duration);
    };
}
function togglePlay() {
    const playBtn = document.getElementById('playBtn');
    const icon = playBtn.querySelector('i');
    if (audio.paused) {
        audio.play();
        icon.className = 'fas fa-pause';
    } else {
        audio.pause();
        icon.className = 'fas fa-play';
    }
}
function loadPreview(src) {
    audio.src = src;
    audio.load();
    togglePlay();
}
function updateProgress() {
    if (audio.duration) {
        const value = (audio.currentTime / audio.duration) * 100;
        document.getElementById('progressBar').value = value;
        document.getElementById('currentTime').textContent = formatTime(audio.currentTime);
    }
}
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Stats
function initStats() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                observer.unobserve(entry.target);
            }
        });
    });
    observer.observe(document.querySelector('.stats'));
}
function animateNumbers() {
    document.querySelectorAll('.stat-number').forEach(num => {
        const target = parseInt(num.dataset.target);
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                num.textContent = `${num.querySelector('i').outerHTML} ${target.toLocaleString()}`;
                clearInterval(timer);
            } else {
                num.innerHTML = `${num.querySelector('i').outerHTML} ${Math.floor(current).toLocaleString()}`;
            }
        }, 20);
    });
}

// Scroll reveal
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    document.querySelectorAll('section').forEach(sec => {
        sec.style.opacity = '0';
        sec.style.transform = 'translateY(50px)';
        sec.style.transition = 'all 0.8s ease-out';
        observer.observe(sec);
    });
}

// Form
function initForm() {
    const steps = document.querySelectorAll('.step');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    let currentStep = 0;

    nextBtn.onclick = () => {
        if (validateStep(currentStep)) {
            steps[currentStep].classList.remove('active');
            currentStep++;
            updateFormNav();
        }
    };
    prevBtn.onclick = () => {
        steps[currentStep].classList.remove('active');
        currentStep--;
        updateFormNav();
    };
    submitBtn.onclick = (e) => {
        e.preventDefault();
        alert('Message envoyé avec succès ! (Simulé - intègre EmailJS pour prod)');
    };
}
function updateFormNav() {
    const steps = document.querySelectorAll('.step');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    steps[currentStep].classList.add('active');
    if (currentStep === 0) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'inline-flex';
        submitBtn.style.display = 'none';
    } else if (currentStep === steps.length - 1) {
        prevBtn.style.display = 'inline-flex';
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-flex';
    } else {
        prevBtn.style.display = 'inline-flex';
        nextBtn.style.display = 'inline-flex';
        submitBtn.style.display = 'none';
    }
}
function validateStep(step) {
    return Array.from(document.querySelectorAll(`.step[data-step="${step + 1}"] input, .step[data-step="${step + 1}"] textarea`)).every(input => input.value.trim());
}