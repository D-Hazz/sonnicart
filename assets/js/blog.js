document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initBlog();
});

const tracks = [
  {
    title: 'Nuit Bleue',
    artist: 'Kivulu',
    genre: 'Afrobeats',
    date: '2026-05-01T18:00:00',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    tags: ['Afrobeats', 'Vibes', 'NewRelease'],
    description: 'Un morceau énergique avec une ambiance moderne et mélodique.'
  },
  {
    title: 'Goma Sunrise',
    artist: 'Muna Soul',
    genre: 'Amapiano',
    date: '2026-04-29T10:30:00',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    tags: ['Amapiano', 'Dance', 'Fresh'],
    description: 'Un son dansant pensé pour les clubs et les playlists street.'
  },
  {
    title: 'Sous la lune',
    artist: 'Amani K.',
    genre: 'R&B',
    date: '2026-04-26T20:15:00',
    image: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?auto=format&fit=crop&w=1200&q=80',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    tags: ['R&B', 'Love', 'Soft'],
    description: 'Une production douce avec une émotion intime et cinématographique.'
  },
  {
    title: 'Concrete Flow',
    artist: 'Nuru Zed',
    genre: 'HipHop',
    date: '2026-05-02T12:20:00',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    tags: ['HipHop', 'Bars', 'Urban'],
    description: 'Un titre brut avec des punchlines et une attitude très urbaine.'
  },
  {
    title: 'Mwamba',
    artist: 'Jah Tayo',
    genre: 'AfroPop',
    date: '2026-04-20T08:00:00',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    tags: ['AfroPop', 'Sunset', 'Groove'],
    description: 'Un morceau solaire, mélodique, pensé pour les écoutes larges.'
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

function initBlog() {
  const grid = document.getElementById('tracksGrid');
  const searchInput = document.getElementById('searchInput');
  const genreFilter = document.getElementById('genreFilter');
  const sortFilter = document.getElementById('sortFilter');
  const audio = document.getElementById('blogAudio');
  const playBtn = document.getElementById('blogPlayBtn');
  const progress = document.getElementById('blogProgress');
  const volume = document.getElementById('blogVolume');
  const miniTitle = document.getElementById('miniTrackTitle');
  const miniMeta = document.getElementById('miniTrackMeta');
  const timeEl = document.getElementById('blogTime');

  if (!grid || !searchInput || !genreFilter || !sortFilter || !audio || !playBtn || !progress || !volume || !miniTitle || !miniMeta || !timeEl) return;

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  }

  function matchesSearch(track, query) {
    const haystack = [
      track.title,
      track.artist,
      track.genre,
      track.description,
      ...(track.tags || [])
    ].join(' ').toLowerCase();

    return haystack.includes(query.toLowerCase());
  }

  function renderTracks() {
    const genre = genreFilter.value;
    const sort = sortFilter.value;
    const query = searchInput.value.trim();

    const filtered = tracks
      .filter(t => genre === 'all' ? true : t.genre === genre)
      .filter(t => !query ? true : matchesSearch(t, query))
      .sort((a, b) => {
        const da = new Date(a.date).getTime();
        const db = new Date(b.date).getTime();
        return sort === 'latest' ? db - da : da - db;
      });

    grid.innerHTML = filtered.map((track) => `
      <article class="track-card">
        <img src="${track.image}" alt="${track.title}">
        <div class="track-body">
          <div class="track-top">
            <h3 class="track-title">${track.title}</h3>
            <span class="track-genre">${track.genre}</span>
          </div>
          <div class="track-meta">${track.artist} • ${formatDate(track.date)}</div>
          <p class="track-desc">${track.description}</p>
          <div class="track-tags">
            ${track.tags.map(tag => `<span>#${tag}</span>`).join('')}
          </div>
          <div class="track-actions">
            <button class="track-play-btn" type="button" data-index="${tracks.indexOf(track)}">
              <i class="fas fa-play"></i> Jouer
            </button>
          </div>
        </div>
      </article>
    `).join('') || `<p class="no-results">Aucun morceau trouvé.</p>`;

    grid.querySelectorAll('.track-play-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        playTrack(idx);
      });
    });
  }

  function playTrack(index) {
    const currentTrack = tracks[index];
    if (!currentTrack) return;

    audio.src = currentTrack.audio;
    audio.load();

    miniTitle.textContent = currentTrack.title;
    miniMeta.textContent = `${currentTrack.artist} • ${currentTrack.genre} • ${formatDate(currentTrack.date)}`;

    audio.play().then(() => {
      playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }).catch(() => {
      playBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
  }

  playBtn.addEventListener('click', () => {
    if (!audio.src && tracks.length) {
      playTrack(0);
      return;
    }

    if (audio.paused) {
      audio.play();
      playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
      audio.pause();
      playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
  });

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    progress.value = (audio.currentTime / audio.duration) * 100;
    timeEl.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener('loadedmetadata', () => {
    timeEl.textContent = `0:00 / ${formatTime(audio.duration)}`;
  });

  progress.addEventListener('input', (e) => {
    if (!audio.duration) return;
    audio.currentTime = (e.target.value / 100) * audio.duration;
  });

  volume.addEventListener('input', (e) => {
    audio.volume = parseFloat(e.target.value);
  });

  audio.addEventListener('play', () => {
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  });

  audio.addEventListener('pause', () => {
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
  });

  genreFilter.addEventListener('change', renderTracks);
  sortFilter.addEventListener('change', renderTracks);
  searchInput.addEventListener('input', renderTracks);

  renderTracks();
}