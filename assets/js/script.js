// Artistes avec vraies images Unsplash (libres)
// Artistes avec vraies images Unsplash (libres)
const artists = [
  { 
    name: 'Tyla',
    role: 'Amapiano • ZA',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    tags: ['Amapiano', 'Viral', 'Club']
  },
  { 
    name: 'Wizkid',
    role: 'AfroPop • NG',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    tags: ['AfroPop', 'Streams', 'Crossover']
  },
  { 
    name: 'Burna Boy',
    role: 'Afrobeats • NG',
    image: 'https://images.unsplash.com/photo-1578632342130-85d35a67a2c1?w=400&h=300&fit=crop',
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    tags: ['Afrobeats', 'Grammy', 'Global']
  },
  { 
    name: 'Tyla',
    role: 'Amapiano • ZA',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    tags: ['Amapiano', 'Viral', 'Club']
  },
  { 
    name: 'Wizkid',
    role: 'AfroPop • NG',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    tags: ['AfroPop', 'Streams', 'Crossover']
  }
];

// Init
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(hideLoader, 1500); // Loader 1.5s
    initThemeToggle();
    initMobileNav();
    initCarousel();
    initAudio();
    initStats();
    initServices();
    initScrollAnimations();
    initForm();
    initCurrentYear();
});

// Loader
function hideLoader() {
    document.getElementById('loader').classList.add('hidden');
}

// Theme Toggle + header scroll
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  const body = document.body;
  const header = document.querySelector('.header');

  const saved = localStorage.getItem('theme');
  const isDark = saved ? saved === 'dark' : true;
  body.setAttribute('data-theme', isDark ? 'dark' : 'light');

  // Init icônes (la classe CSS gère l’opacité, on garde juste data-theme à jour)
  toggle.onclick = () => {
    const current = body.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  // Effet header scrolled
  const onScroll = () => {
    if (window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll);
  onScroll();
}


function initMobileNav() {
  const toggle = document.getElementById('mobileNavToggle');
  const closeBtn = document.getElementById('mobileNavClose');
  const panel = document.getElementById('mobileNav');

  if (!toggle || !closeBtn || !panel) return;

  const open = () => panel.classList.add('open');
  const close = () => panel.classList.remove('open');

  toggle.addEventListener('click', open);
  closeBtn.addEventListener('click', close);

  panel.addEventListener('click', (e) => {
    if (e.target === panel) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

// Utilitaire pour les boutons mobile (scroll + fermer)
function mobileNavigate(sectionId) {
  const panel = document.getElementById('mobileNav');
  if (panel) panel.classList.remove('open');
  scrollToSection(sectionId);
}

// Hero animation (blobs)
function animateHeroBlobs() {
  const t = Date.now() / 1000;
  document.querySelectorAll('.hero-blob').forEach((blob, index) => {
    const offset = index * 0.8;
    const tx = Math.sin(t * 0.25 + offset) * 10;
    const ty = Math.cos(t * 0.22 + offset) * 8;
    blob.style.transform = `translate(${tx}px, ${ty}px)`;
  });
  requestAnimationFrame(animateHeroBlobs);
}
animateHeroBlobs();

// Scroll to
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}


// Services
function initServices() {
  const cards = document.querySelectorAll('.service-card');

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('active');
    });
  });
}


let currentSlide = 0;
let audio = null;

// Carousel
function initCarousel() {
  const track = document.getElementById('carouselTrack');

  artists.forEach((artist, idx) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.innerHTML = `
      <img src="${artist.image}" alt="${artist.name}">
      <div class="carousel-slide-hover-play">
        <button data-index="${idx}">
          <i class="fas fa-play"></i>
        </button>
      </div>
      <div class="carousel-slide-body">
        <div class="carousel-slide-header">
          <div class="carousel-slide-title">${artist.name}</div>
          <div class="carousel-slide-badge">
            <i class="fas fa-wave-square"></i> ${idx === 0 ? 'Featured' : 'Artist'}
          </div>
        </div>
        <div class="carousel-slide-meta">
          <i class="fas fa-music"></i>
          <span>${artist.role}</span>
        </div>
        <div class="carousel-slide-tags">
          ${artist.tags.map(tag => `<span>#${tag}</span>`).join('')}
        </div>
      </div>
    `;
    slide.dataset.index = idx;
    track.appendChild(slide);
  });

  document.querySelector('.carousel-next').onclick = () => nextSlide();
  document.querySelector('.carousel-prev').onclick = () => prevSlide();

  track.addEventListener('click', (e) => {
    const button = e.target.closest('button[data-index]');
    const slide = e.target.closest('.carousel-slide');
    if (!button && !slide) return;
    const index = parseInt((button || slide).dataset.index, 10);
    selectArtist(index);
  });

  // Stagger reveal
  const slides = track.querySelectorAll('.carousel-slide');
  slides.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'all 0.4s ease-out';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 130);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % artists.length;
  updateCarousel();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + artists.length) % artists.length;
  updateCarousel();
}

function updateCarousel() {
  const track = document.getElementById('carouselTrack');
  const slide = track.querySelector('.carousel-slide');
  if (!slide) return;

  const slideWidth = slide.offsetWidth;
  const style = getComputedStyle(track);
  const gap = parseFloat(style.columnGap || style.gap || 16);

  const offset = currentSlide * (slideWidth + gap);
  track.style.transform = `translateX(-${offset}px)`;
}

function selectArtist(index) {
  const artist = artists[index];
  const titleEl = document.getElementById('currentTrackTitle');
  const artistEl = document.getElementById('currentTrackArtist');
  const tagsEl = document.getElementById('currentTrackTags');

  titleEl.textContent = artist.name;
  artistEl.textContent = artist.role;
  tagsEl.innerHTML = artist.tags.map(tag => `<span>#${tag}</span>`).join('');

  loadPreview(artist.preview);
}

// Audio
function initAudio() {
  audio = document.getElementById('audioPlayer');
  const playBtn = document.getElementById('playBtn');
  const progressBar = document.getElementById('progressBar');
  const volumeBar = document.getElementById('volumeBar');

  playBtn.onclick = togglePlay;
  progressBar.oninput = (e) => {
    if (!audio.duration) return;
    audio.currentTime = (e.target.value / 100) * audio.duration;
  };
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
  // autoplay à la sélection de l'artiste
  const playBtn = document.getElementById('playBtn');
  const icon = playBtn.querySelector('i');
  audio.play().then(() => {
    icon.className = 'fas fa-pause';
  }).catch(() => {
    icon.className = 'fas fa-play';
  });
}

function updateProgress() {
  if (!audio.duration) return;
  const value = (audio.currentTime / audio.duration) * 100;
  document.getElementById('progressBar').value = value;
  document.getElementById('currentTime').textContent = formatTime(audio.currentTime);
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
        const target = parseInt(num.dataset.target, 10);
        let current = 0;
        const increment = target / 100;
        const iconSpan = num.parentElement.querySelector('.stat-icon'); // icône fixe

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                num.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                num.textContent = Math.floor(current).toLocaleString();
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
  const statusEl = document.getElementById('formStatus');
  const progressBar = document.getElementById('formProgressBar');
  const stepDots = document.querySelectorAll('.step-dot');
  let currentStep = 0;

  if (!steps.length || !nextBtn || !prevBtn || !submitBtn) return;

  function showStep(index) {
    steps.forEach((step, i) => {
      step.classList.toggle('active', i === index);
    });

    stepDots.forEach((dot, i) => {
      dot.classList.toggle('active', i <= index);
    });

    const progress = ((index + 1) / steps.length) * 100;
    progressBar.style.width = progress + '%';

    prevBtn.style.display = index === 0 ? 'none' : 'inline-flex';
    nextBtn.style.display = index === steps.length - 1 ? 'none' : 'inline-flex';
    submitBtn.style.display = index === steps.length - 1 ? 'inline-flex' : 'none';
  }

  function validateStep(index) {
    const step = steps[index];
    const fields = step.querySelectorAll('input, textarea, select');

    let valid = true;

    fields.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#ef5350';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    return valid;
  }

  nextBtn.addEventListener('click', () => {
    if (!validateStep(currentStep)) {
      statusEl.textContent = 'Merci de compléter tous les champs de cette étape avant de continuer.';
      statusEl.className = 'form-status error';
      return;
    }

    statusEl.textContent = '';
    statusEl.className = 'form-status';

    if (currentStep < steps.length - 1) {
      currentStep++;
      showStep(currentStep);
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep--;
      statusEl.textContent = '';
      statusEl.className = 'form-status';
      showStep(currentStep);
    }
  });

  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      statusEl.textContent = 'Merci de compléter tous les champs avant l’envoi.';
      statusEl.className = 'form-status error';
      return;
    }

    statusEl.textContent = 'Message envoyé avec succès. Nous reviendrons vers toi sous 24h.';
    statusEl.className = 'form-status success';
  });

  showStep(currentStep);
}

// Footer - Année courante
function initCurrentYear() {
  const el = document.getElementById('currentYear');
  if (el) el.textContent = new Date().getFullYear();
}
