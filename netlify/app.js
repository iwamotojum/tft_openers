const data = [
  {"units": ["ezreal", "rek'sai", "pantheon", "samira"]},
  {"units": ["aatrox", "twisted fate", "talon", "jax"]},
  {"units": ["nasus", "teemo", "mordekaiser", "gwen"]},
  {"units": ["leona", "teemo", "mordekaiser", "zoe"]},
  {"units": ["teemo", "leona", "mordekaiser", "zoe"]},
  {"units": ["briar", "jinx", "aurora"]},
  {"units": ["briar", "jinx", "illaoi"]},
  {"units": ["leona", "lissandra", "mordekaiser", "zoe"]},
  {"units": ["briar", "rek'sai", "bel'veth", "jinx"]},
  {"units": ["cho'gath", "rek'sai", "briar", "bel'veth"]},
  {"units": ["rek'sai", "milio", "pantheon", "lulu"]},
  {"units": ["briar", "cho'gath", "rek'sai", "kai'sa"]},
  {"units": ["aatrox", "twisted fate", "caitlyn", "jax"]},
  {"units": ["cho'gath", "ezreal", "lissandra", "pantheon"]},
  {"units": ["lissandra", "poppy", "veigar", "mipim"]},
  {"units": ["aatrox", "poppy", "mipim", "gnar"]},
  {"units": ["rek'sai", "ezreal", "gnar", "pantheon"]},
  {"units": ["cho'gath", "lissandra", "pantheon", "miss fortune"]}
];

const traits = {
  "ezreal": ["rasga-tempo", "atirador de elite"],
  "rek'sai": ["primordiano", "lutador"],
  "pantheon": ["rasga-tempo", "lutador", "replicador"],
  "samira": ["embalos do espaço", "atirador de elite"],
  "aatrox": ["n.o.v.a", "bastião"],
  "twisted fate": ["astromante", "tecelão do destino"],
  "talon": ["astromante", "ladino"],
  "jax": ["astromante", "bastião"],
  "nasus": ["embalos no espaço", "vanguarda"],
  "teemo": ["embalos no espaço", "pastor"],
  "mordekaiser": ["estrela negra", "conduíte", "vanguarda"],
  "gwen": ["embalos no espaço", "ladino"],
  "leona": ["árbitro", "vanguarda"],
  "zoe": ["árbitro", "conduíte"],
  "briar": ["anima", "primordiano", "ladino"],
  "jinx": ["anima", "desafiante"],
  "aurora": ["anima", "viajante"],
  "illaoi": ["anima", "vanguarda", "pastor"],
  "lissandra": ["estrela negra", "pastor", "replicador"],
  "bel'veth": ["primordiano", "desafiante", "saqueador"],
  "cho'gath": ["estrela negra", "lutador"],
  "milio": ["rasga-tempo", "tecelão do destino"],
  "lulu": ["astromante", "replicador"],
  "kai'sa": ["estrela negra", "ladino"],
  "caitlyn": ["n.o.v.a", "tecelão do destino"],
  "poppy": ["mipo", "bastião"],
  "veigar": ["mipo", "replicador"],
  "mipim": ["mipo", "pastor", "viajante"],
  "gnar": ["mipo", "atirador de elite"],
  "miss fortune": ["conduíte", "desafiante", "replicador"]
};

function getTraitCounts(units) {
  const counts = {};
  for (const u of units) {
    const t = traits[u] || [];
    for (const tr of t) counts[tr] = (counts[tr] || 0) + 1;
  }
  return counts;
}

const stackEl = document.getElementById('stack');
const search = document.getElementById('search');

const traitPalette = [
  '#ff5555','#ff79c6','#bd93f9','#8be9fd','#50fa7b',
  '#ffb86c','#f1fa8c','#6272a4','#cba6f7','#f38ba8',
  '#89b4fa','#fab387','#a6e3a1','#f9e2af','#74c7ec',
  '#b4befe','#94e2d5','#eba0ac','#6c7086','#585b70'
];

function champImageFile(name) {
  return name.toLowerCase().replace(/'/g, '');
}
function traitImageFile(trait) {
  return trait.toLowerCase().replace(/\s+/g, '_').replace(/\./g, '');
}
function normalizeSearch(s) {
  return s.toLowerCase().replace(/['.\s]/g, '');
}

const FAV_KEY = 'tft_favorites';
function entryKey(entry) { return entry.units.join('|'); }
function getFavorites() {
  try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]')); }
  catch { return new Set(); }
}
function toggleFavorite(key) {
  const f = getFavorites();
  if (f.has(key)) f.delete(key); else f.add(key);
  localStorage.setItem(FAV_KEY, JSON.stringify([...f]));
}

function traitColor(trait) {
  let h = 0;
  for (let i = 0; i < trait.length; i++) h = ((h << 5) - h) + trait.charCodeAt(i), h |= 0;
  return traitPalette[Math.abs(h) % traitPalette.length];
}

let filtered = [...data];
let currentIdx = 0;
let animating = false;

function buildCardHtml(entry, q) {
  let units = entry.units;
  const nq = q ? normalizeSearch(q) : '';
  if (q) {
    units = [...units].sort((a, b) => {
      const al = normalizeSearch(a);
      const bl = normalizeSearch(b);
      const aScore = al.startsWith(nq) ? 2 : (al.includes(nq) ? 1 : 0);
      const bScore = bl.startsWith(nq) ? 2 : (bl.includes(nq) ? 1 : 0);
      return bScore - aScore;
    });
  }
  const champHtml = units.map(u => {
    const isMatch = q && normalizeSearch(u).includes(nq);
    const imgSrc = `images/champions/${champImageFile(u)}.png`;
    const champTraits = (traits[u] || []).map(t =>
      `<img class="trait-img champ-trait" style="border-color:${traitColor(t)}" src="images/traits/${traitImageFile(t)}.png" alt="${t}" title="${t}" loading="lazy">`
    ).join('');
    return `<div class="champ"><span class="champ-img-wrap"><img class="champ-img" src="${imgSrc}" alt="${u}" loading="lazy"></span><div class="champ-info"><div class="champ-name ${isMatch ? 'matched' : ''}">${u}</div><div class="champ-traits">${champTraits}</div></div></div>`;
  }).join('');

  const traitCounts = getTraitCounts(units);
  const sorted = Object.entries(traitCounts).sort((a, b) => b[1] - a[1]);
  const summaryHtml = sorted.length > 0
    ? sorted.map(([trait, cnt]) => {
        const c = cnt >= 2 ? traitColor(trait) : '#555';
        const isMatch = q && normalizeSearch(trait).includes(nq);
        const traitImgSrc = `images/traits/${traitImageFile(trait)}.png`;
        return `<span class="tag ${cnt >= 2 ? 'highlighted' : ''}${isMatch ? ' matched' : ''}" style="border-color:${c};color:${c}"><img class="trait-img" src="${traitImgSrc}" alt="${trait}" loading="lazy">${trait} (${cnt})</span>`;
      }).join('')
    : '';

  const key = entryKey(entry);
  const isFav = getFavorites().has(key);
  const star = `<span class="star ${isFav ? 'favorited' : ''}" data-key="${key}">★</span>`;
  return `${star}${champHtml}${summaryHtml ? `<div class="trait-summary">${summaryHtml}</div>` : ''}`;
}

function renderDots() {
  const dotsEl = document.getElementById('dots');
  if (filtered.length <= 1) {
    dotsEl.innerHTML = '';
    return;
  }
  dotsEl.innerHTML = filtered.map((_, i) =>
    `<span class="dot ${i === currentIdx ? 'active' : ''}" data-idx="${i}"></span>`
  ).join('');
  dotsEl.querySelectorAll('.dot').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      goTo(parseInt(el.dataset.idx));
    });
  });
}

function goTo(idx) {
  if (idx === currentIdx || idx < 0 || idx >= filtered.length) return;
  if (animating) {
    const cards = stackEl.querySelectorAll('.card-stack');
    for (const card of cards) {
      card.style.transition = 'none';
      const localI = parseInt(card.dataset.idx) - currentIdx;
      card.style.transform = `translateX(${localI * 190}px)`;
    }
    animating = false;
  }
  animating = true;
  const forward = idx > currentIdx;
  currentIdx = idx;
  renderAnimated(forward);
}

function applyFilterAndSort(q) {
  const nq = q ? normalizeSearch(q) : '';
  let result = q ? data.filter(entry =>
    entry.units.some(u => normalizeSearch(u).includes(nq)) || entry.units.some(u => (traits[u] || []).some(t => normalizeSearch(t).includes(nq)))
  ) : [...data];
  const favs = getFavorites();
  result.sort((a, b) => {
    const aFav = favs.has(entryKey(a));
    const bFav = favs.has(entryKey(b));
    if (aFav !== bFav) return aFav ? -1 : 1;
    if (q) {
      const score = (entry) => {
        const names = entry.units.map(u => normalizeSearch(u));
        const allTraits = entry.units.flatMap(u => (traits[u] || []).map(t => normalizeSearch(t)));
        const starts = [...names, ...allTraits].some(s => s.startsWith(nq)) ? 1 : 0;
        const contains = [...names, ...allTraits].some(s => s.includes(nq)) ? 1 : 0;
        let traitScore = 0;
        const traitCounts = getTraitCounts(entry.units);
        for (const [trait, cnt] of Object.entries(traitCounts)) {
          if (normalizeSearch(trait).includes(nq)) traitScore += cnt;
        }
        return starts * 100 + contains * 10 + traitScore;
      };
      return score(b) - score(a);
    }
    return data.indexOf(a) - data.indexOf(b);
  });
  return result;
}

function renderAnimated(forward) {
  const q = search.value.toLowerCase().trim();
  filtered = applyFilterAndSort(q);
  if (currentIdx >= filtered.length) currentIdx = 0;
  if (filtered.length === 0) {
    stackEl.innerHTML = '<div class="empty-state">No openers found</div>';
    animating = false;
    renderDots();
    return;
  }

  const showCount = Math.min(15, filtered.length - currentIdx);
  const visible = filtered.slice(currentIdx, currentIdx + showCount);
  const offset = 190;
  const shift = forward ? offset : -offset;

  const favs = getFavorites();
  stackEl.innerHTML = visible.map((entry, i) => {
    const isCurrent = i === 0;
    const isFav = favs.has(entryKey(entry));
    return `<div class="card-stack ${isCurrent ? 'current' : 'behind'}${isFav ? ' favorited' : ''}" data-idx="${currentIdx + i}"
      style="transform: translateX(${(i * offset + shift)}px); z-index: ${100 - i};">
      ${buildCardHtml(entry, q)}
    </div>`;
  }).join('');

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const cards = stackEl.querySelectorAll('.card-stack');
      for (const card of cards) {
        const localI = parseInt(card.dataset.idx) - currentIdx;
        card.style.transform = `translateX(${localI * offset}px)`;
      }
      const lastCard = cards[cards.length - 1];
      if (lastCard) {
        const onEnd = () => {
          lastCard.removeEventListener('transitionend', onEnd);
          animating = false;
        };
        lastCard.addEventListener('transitionend', onEnd);
      } else {
        animating = false;
      }
    });
  });

  renderDots();
}

function render() {
  const q = search.value.toLowerCase().trim();
  filtered = applyFilterAndSort(q);
  if (currentIdx >= filtered.length) currentIdx = 0;
  if (filtered.length === 0) {
    stackEl.innerHTML = '<div class="empty-state">No openers found</div>';
    renderDots();
    return;
  }

  const showCount = Math.min(15, filtered.length - currentIdx);
  const visible = filtered.slice(currentIdx, currentIdx + showCount);
  const offset = 190;

  const favs = getFavorites();
  stackEl.innerHTML = visible.map((entry, i) => {
    const isCurrent = i === 0;
    const isFav = favs.has(entryKey(entry));
    return `<div class="card-stack ${isCurrent ? 'current' : 'behind'}${isFav ? ' favorited' : ''}" data-idx="${currentIdx + i}"
      style="transform: translateX(${i * offset}px); z-index: ${100 - i};">
      ${buildCardHtml(entry, q)}
    </div>`;
  }).join('');

  renderDots();
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
    e.preventDefault();
    goTo(currentIdx + 1);
  }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    goTo(currentIdx - 1);
  }
});

document.addEventListener('wheel', e => {
  if (e.target.closest('#stack')) {
    e.preventDefault();
    if (e.deltaY > 0) goTo(currentIdx + 1);
    else goTo(currentIdx - 1);
  }
}, { passive: false });


stackEl.addEventListener('click', e => {
  const target = e.target.closest('.star, .champ-name, .tag, .card-stack.behind');
  if (!target) return;

  if (target.classList.contains('star')) {
    e.stopPropagation();
    const key = target.dataset.key;
    const wasFav = getFavorites().has(key);
    toggleFavorite(key);
    const q = search.value.toLowerCase().trim();
    filtered = applyFilterAndSort(q);
    if (wasFav) {
      currentIdx = Math.min(currentIdx, filtered.length - 1);
    } else {
      currentIdx = 0;
    }
    render();
    return;
  }

  if (target.classList.contains('champ-name')) {
    e.stopPropagation();
    search.value = target.textContent.trim();
    search.dispatchEvent(new Event('input'));
    return;
  }

  if (target.classList.contains('tag')) {
    e.stopPropagation();
    const text = target.textContent.trim().replace(/\s*\(\d+\)$/, '');
    search.value = text;
    search.dispatchEvent(new Event('input'));
    return;
  }

  if (target.classList.contains('behind')) {
    goTo(parseInt(target.dataset.idx));
  }
});

document.getElementById('clearFavs').addEventListener('click', () => {
  localStorage.removeItem(FAV_KEY);
  currentIdx = 0;
  animating = false;
  render();
});

const allChamps = [...new Set(data.flatMap(e => e.units))];
const allTraitsList = [...new Set(Object.values(traits).flat())];
const champSet = new Set(allChamps);

function updateSuggestions() {
  const q = search.value.toLowerCase().trim();
  const el = document.getElementById('suggestions');
  if (!q) { el.classList.remove('open'); return; }
  const nq = normalizeSearch(q);
  const matches = [...allChamps, ...allTraitsList].filter(n => normalizeSearch(n).includes(nq));
  if (matches.length === 0 || matches.length >= 5) { el.classList.remove('open'); return; }
  el.innerHTML = matches.map(n => {
    const isChamp = champSet.has(n);
    const src = isChamp ? `images/champions/${champImageFile(n)}.png` : `images/traits/${traitImageFile(n)}.png`;
    return `<div class="opt"><img class="opt-img" src="${src}" alt="${n}" loading="lazy">${n}</div>`;
  }).join('');
  el.classList.add('open');
}

search.addEventListener('input', () => {
  currentIdx = 0;
  animating = false;
  renderAnimated(true);
  updateSuggestions();
});

document.getElementById('suggestions').addEventListener('click', e => {
  const opt = e.target.closest('.opt');
  if (!opt) return;
  search.value = opt.textContent.trim();
  search.dispatchEvent(new Event('input'));
});

document.addEventListener('click', e => {
  if (!e.target.closest('.search-wrapper'))
    document.getElementById('suggestions').classList.remove('open');
});

render();
window.addEventListener('resize', () => render());
