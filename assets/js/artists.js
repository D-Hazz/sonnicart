document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initArtistsPage();
});

const artists = [
  {
    name: 'Kivulu',
    style: 'Afrobeats',
    country: 'RDC',
    city: 'Goma',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    bio: 'Kivulu mélange l’énergie afrobeats avec une écriture mélodique et moderne. Son univers visuel met en avant les textures africaines et les ambiances nocturnes.',
    description: 'Un artiste solaire qui construit des morceaux pensés pour la scène et les playlists.',
    details: [
      'Style principal : Afrobeats',
      'Origine : Goma, RDC',
      'Univers : mélodique, urbain, moderne',
      'Focus : performance live et identité visuelle forte'
    ],
    socials: {
      Instagram: 'https://instagram.com/',
      YouTube: 'https://youtube.com/',
      TikTok: 'https://tiktok.com/'
    }
  },
  {
    name: 'Muna Soul',
    style: 'Amapiano',
    country: 'RDC',
    city: 'Kinshasa',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80',
    bio: 'Muna Soul développe des productions dansantes avec une touche deep et élégante. Sa direction musicale fait le lien entre club culture et émotion.',
    description: 'Un profil orienté groove, rythme et ambiance nocturne.',
    details: [
      'Style principal : Amapiano',
      'Origine : Kinshasa, RDC',
      'Univers : dance, club, soulful',
      'Focus : sets live et sorties digitales'
    ],
    socials: {
      Instagram: 'https://instagram.com/',
      Facebook: 'https://facebook.com/',
      WhatsApp: 'https://wa.me/243819884016'
    }
  },
  {
    name: 'Amani K.',
    style: 'R&B',
    country: 'RDC',
    city: 'Bukavu',
    image: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?auto=format&fit=crop&w=1200&q=80',
    bio: 'Amani K. propose un R&B intime et cinématographique, porté par des mélodies douces et une écriture émotionnelle.',
    description: 'Une voix sensible qui raconte des histoires personnelles avec finesse.',
    details: [
      'Style principal : R&B',
      'Origine : Bukavu, RDC',
      'Univers : doux, émotionnel, cinématique',
      'Focus : songwriting et identité vocale'
    ],
    socials: {
      Instagram: 'https://instagram.com/',
      X: 'https://x.com/',
      YouTube: 'https://youtube.com/'
    }
  }
];

function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.setAttribute('data-theme', 'light');
  }

  toggle.addEventListener('click', () => {
    const isLight = document.body.getAttribute('data-theme') === 'light';

    if (isLight) {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });
}

function initArtistsPage() {
  const grid = document.getElementById('artistsGrid');
  const searchInput = document.getElementById('artistSearch');
  const genreFilter = document.getElementById('genreFilter');

  const modal = document.getElementById('artistModal');
  const modalClose = document.getElementById('modalClose');
  const modalImage = document.getElementById('modalImage');
  const modalGenre = document.getElementById('modalGenre');
  const modalTitle = document.getElementById('artistModalTitle');
  const modalDesc = document.getElementById('artistModalDesc');
  const modalBio = document.getElementById('modalBio');
  const modalDetails = document.getElementById('modalDetails');
  const modalSocials = document.getElementById('modalSocials');

  if (!grid || !searchInput || !genreFilter || !modal || !modalClose || !modalImage || !modalGenre || !modalTitle || !modalDesc || !modalBio || !modalDetails || !modalSocials) return;

  let currentArtist = null;

  function matchesQuery(artist, query) {
    const haystack = [
      artist.name,
      artist.style,
      artist.country,
      artist.city,
      artist.bio,
      artist.description,
      ...(artist.details || [])
    ].join(' ').toLowerCase();

    return haystack.includes(query.toLowerCase());
  }

  function renderArtists() {
    const query = searchInput.value.trim();
    const filter = genreFilter.value;

    const filtered = artists.filter(artist => {
      const okGenre = filter === 'all' ? true : artist.style === filter;
      const okQuery = !query ? true : matchesQuery(artist, query);
      return okGenre && okQuery;
    });

    grid.innerHTML = filtered.map((artist, index) => `
      <article class="artist-card">
        <img src="${artist.image}" alt="${artist.name}">
        <div class="artist-card-body">
          <div class="artist-name-row">
            <h3 class="artist-name">${artist.name}</h3>
            <span class="artist-style">${artist.style}</span>
          </div>
          <p class="artist-bio">${artist.bio}</p>
          <div class="artist-footer">
            <button class="more-btn" type="button" data-index="${artists.indexOf(artist)}">En savoir plus</button>
          </div>
        </div>
      </article>
    `).join('') || `<div class="empty-state">Aucun artiste trouvé.</div>`;

    grid.querySelectorAll('.more-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        openModal(idx);
      });
    });
  }

  function openModal(index) {
    currentArtist = artists[index];
    if (!currentArtist) return;

    modalImage.src = currentArtist.image;
    modalImage.alt = currentArtist.name;
    modalGenre.textContent = currentArtist.style;
    modalTitle.textContent = currentArtist.name;
    modalDesc.textContent = currentArtist.description;
    modalBio.textContent = currentArtist.bio;

    modalDetails.innerHTML = currentArtist.details.map(item => `<li>${item}</li>`).join('');

    modalSocials.innerHTML = Object.entries(currentArtist.socials).map(([label, url]) => `
      <a href="${url}" target="_blank" rel="noopener noreferrer">
        <i class="fas fa-link"></i> ${label}
      </a>
    `).join('');

    modal.showModal();
    modalClose.focus();
  }

  function closeModal() {
    modal.close();
  }

  modalClose.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    const rect = modal.querySelector('.modal-card').getBoundingClientRect();
    const clickedOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;

    if (clickedOutside) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.open) closeModal();
  });

  searchInput.addEventListener('input', renderArtists);
  genreFilter.addEventListener('change', renderArtists);

  renderArtists();
}