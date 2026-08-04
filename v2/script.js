/* ============================================================
   RABEEUL MAHABBA — script.js (v2.0 Phase 1)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. LOADING SCREEN ---------- */
  const loadingScreen = document.getElementById('loadingScreen');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      fireConfetti();          // celebrate once the site is ready
    }, 700);
  });

  /* ---------- 2. HERO SLIDER ---------- */
  buildHeroSlider();
  function buildHeroSlider(){
    const sliderEl = document.getElementById('heroSlider');
    const dotsEl = document.getElementById('sliderDots');
    CONFIG.heroSlides.forEach((slide, i) => {
      const div = document.createElement('div');
      div.className = 'slide' + (i === 0 ? ' active' : '') + (slide.image ? ' has-image' : '');
      div.dataset.slide = i;
      div.style.backgroundImage = slide.image ? `url(${slide.image})` : '';
      div.style.backgroundSize = 'cover';
      div.style.backgroundPosition = 'center';
      div.innerHTML = `
        <div class="slide-content">
          <div class="slide-kicker">${slide.kicker}</div>
          <h1 class="slide-title">${slide.title}</h1>
          <p class="slide-sub">${slide.subtitle}</p>
        </div>`;
      sliderEl.appendChild(div);

      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsEl.appendChild(dot);
    });
  }

  let currentSlide = 0;
  let slideTimer;
  function goToSlide(i){
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dots button');
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = i % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    resetSlideTimer();
  }
  function resetSlideTimer(){
    clearInterval(slideTimer);
    slideTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }
  resetSlideTimer();

  /* ---------- 3. COUNTDOWN ---------- */
  const target = new Date(CONFIG.festDate).getTime();
  function tickCountdown(){
    const diff = target - Date.now();
    const els = {
      d: document.getElementById('cdDays'),
      h: document.getElementById('cdHours'),
      m: document.getElementById('cdMins'),
      s: document.getElementById('cdSecs')
    };
    if (diff <= 0){ els.d.textContent = els.h.textContent = els.m.textContent = els.s.textContent = 0; return; }
    els.d.textContent = Math.floor(diff / 86400000);
    els.h.textContent = Math.floor((diff % 86400000) / 3600000);
    els.m.textContent = Math.floor((diff % 3600000) / 60000);
    els.s.textContent = Math.floor((diff % 60000) / 1000);
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);

  /* ---------- 4. GOOGLE SHEET LIVE RESULTS ---------- */
  loadResults();

  async function loadResults(){
    const statusEl = document.getElementById('sheetStatus');
    let rows = CONFIG.fallbackResults;
    let isLive = false;

    if (CONFIG.resultsSheetCsvUrl && CONFIG.resultsSheetCsvUrl.trim() !== '') {
      try {
        const res = await fetch(CONFIG.resultsSheetCsvUrl, { cache: 'no-store' });
        const csvText = await res.text();
        const parsed = parseCsv(csvText);
        if (parsed.length) { rows = parsed; isLive = true; }
      } catch (err) {
        console.warn('Google Sheet fetch failed, showing fallback data:', err);
      }
    }

    statusEl.textContent = isLive
      ? '🟢 Google Sheet-ൽ നിന്ന് ലൈവ് ആയി ലോഡ് ചെയ്തു'
      : '⚪ സാമ്പിൾ ഡാറ്റ കാണിക്കുന്നു — data.js-ൽ Google Sheet ലിങ്ക് ചേർക്കുക';
    statusEl.classList.toggle('live', isLive);

    window.RESULTS_DATA = rows.map((r, i) => ({ ...r, id: i }));
    renderResults();
  }

  // Minimal CSV parser: handles quoted fields with commas inside them.
  function parseCsv(text){
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    const headers = splitCsvLine(lines[0]).map(h => h.trim().toLowerCase());
    return lines.slice(1).map(line => {
      const cells = splitCsvLine(line);
      const obj = {};
      headers.forEach((h, i) => obj[h] = (cells[i] || '').trim());
      return {
        cat: (obj.category || '').toLowerCase(),
        gender: obj.gender || '',
        type: obj.type || '',
        name: obj.event || '',
        first: obj.first || '',
        second: obj.second || '',
        third: obj.third || ''
      };
    }).filter(r => r.name);
  }
  function splitCsvLine(line){
    const out = []; let cur = ''; let inQuotes = false;
    for (let i = 0; i < line.length; i++){
      const c = line[i];
      if (c === '"'){ inQuotes = !inQuotes; }
      else if (c === ',' && !inQuotes){ out.push(cur); cur = ''; }
      else { cur += c; }
    }
    out.push(cur);
    return out;
  }

  /* ---------- 5. RESULTS SEARCH / FILTER / RENDER ---------- */
  const listEl = document.getElementById('resultsList');
  const searchEl = document.getElementById('searchInput');
  const filterEl = document.getElementById('catFilter');
  let openId = null;

  searchEl.addEventListener('input', renderResults);
  filterEl.addEventListener('change', renderResults);

  function renderResults(){
    if (!window.RESULTS_DATA) return;
    const q = searchEl.value.trim().toLowerCase();
    const cat = filterEl.value;
    const filtered = window.RESULTS_DATA.filter(r => {
      const matchesCat = cat === 'all' || r.cat === cat;
      const matchesQ = !q || r.name.toLowerCase().includes(q);
      return matchesCat && matchesQ;
    });
    listEl.innerHTML = '';
    if (!filtered.length){
      listEl.innerHTML = '<div class="no-results">ഒന്നും കണ്ടെത്തിയില്ല</div>';
      return;
    }
    filtered.forEach(r => {
      const published = !!(r.first && r.first.trim());
      const card = document.createElement('div');
      card.className = 'result-card' + (openId === r.id ? ' open' : '');
      const body = published
        ? `<div>🥇 <span class="rc-win">${r.first}</span></div>
           <div style="margin-top:4px;">🥈 ${r.second || '—'}</div>
           <div style="margin-top:4px;">🥉 ${r.third || '—'}</div>`
        : 'ഫലം ഉടൻ പ്രഖ്യാപിക്കും';
      card.innerHTML = `
        <div class="rc-head">
          <div class="rc-badge${published ? ' won' : ''}">${published ? '🏆' : '⏳'}</div>
          <div class="rc-title">
            <div class="rc-name">${r.name}</div>
            <div class="rc-cat">${CONFIG.catLabels[r.cat] || r.cat} · ${r.gender} · ${r.type}</div>
          </div>
          <div class="rc-chev">▾</div>
        </div>
        <div class="rc-body">${body}</div>`;
      card.querySelector('.rc-head').addEventListener('click', () => {
        openId = openId === r.id ? null : r.id;
        renderResults();
      });
      listEl.appendChild(card);
    });
  }

  /* ---------- 6. CONFETTI (worker-safe) ---------- */
  window.fireConfetti = fireConfetti;
  function fireConfetti(){
    if (typeof confetti === 'undefined') return;
    const myConfetti = confetti.create(null, { resize: true, useWorker: false });
    myConfetti({ particleCount: 160, spread: 110, origin: { y: 0.5 }, colors: ['#c9a227','#e3c583','#ffffff'] });
    setTimeout(() => myConfetti({ particleCount: 90, angle: 60, spread: 70, origin: { x: 0, y: 0.6 }, colors: ['#0f6b41','#1c8a58','#c9a227'] }), 250);
    setTimeout(() => myConfetti({ particleCount: 90, angle: 120, spread: 70, origin: { x: 1, y: 0.6 }, colors: ['#0f6b41','#1c8a58','#c9a227'] }), 500);
  }

});
