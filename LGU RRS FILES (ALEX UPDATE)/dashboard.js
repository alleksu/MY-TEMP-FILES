// ─── DASHBOARD PAGE ──────────────────────────────

// ── Highlights Carousel ──
(function () {
  const TOTAL_CARDS = 8;
  const VISIBLE     = 3;
  const STEP        = 1;
  const MAX_OFFSET  = TOTAL_CARDS - VISIBLE;

  let offset = 0;

  const track    = document.getElementById('highlights-track');
  const viewport = document.getElementById('highlights-viewport');
  const prevBtn  = document.getElementById('hl-prev');
  const nextBtn  = document.getElementById('hl-next');
  const dotsEl   = document.getElementById('hl-dots');

  // Build dots
  for (let i = 0; i <= MAX_OFFSET; i++) {
    const d = document.createElement('button');
    d.className = 'hl-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(d);
  }

  function goTo(idx) {
    offset = Math.max(0, Math.min(MAX_OFFSET, idx));
    const cardW = (viewport.clientWidth - 24) / 3 + 12;
    track.style.transform = 'translateX(-' + (offset * cardW) + 'px)';
    prevBtn.disabled = offset === 0;
    nextBtn.disabled = offset === MAX_OFFSET;
    dotsEl.querySelectorAll('.hl-dot').forEach((d, i) => d.classList.toggle('active', i === offset));
  }

  prevBtn.addEventListener('click', () => goTo(offset - STEP));
  nextBtn.addEventListener('click', () => goTo(offset + STEP));

  // Touch swipe
  let touchStartX = 0;
  viewport.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? offset + STEP : offset - STEP);
  }, { passive: true });

  goTo(0);
  window.addEventListener('resize', () => goTo(offset));

  // MTD widget
  const now = new Date();
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const pctMonth = Math.round((now.getDate() / daysInMonth) * 100);
  const mtdSub = document.getElementById('hl-mtd-sub');
  const mtdBar = document.getElementById('hl-mtd-bar');
  if (mtdSub) mtdSub.textContent = now.getDate() + ' days · ' + months[now.getMonth()];
  if (mtdBar) mtdBar.style.width = pctMonth + '%';

  // Shift tracker
  function updateShift() {
    const n = new Date();
    const shiftStart = new Date(n); shiftStart.setHours(8, 0, 0, 0);
    const shiftEnd   = new Date(n); shiftEnd.setHours(17, 0, 0, 0);
    const pct = Math.max(0, Math.min(100, Math.round(((n - shiftStart) / (shiftEnd - shiftStart)) * 100)));
    const hh = String(n.getHours()).padStart(2, '0');
    const mm = String(n.getMinutes()).padStart(2, '0');
    const timeEl   = document.getElementById('hl-shift-time');
    const remainEl = document.getElementById('hl-shift-remain');
    const barEl    = document.getElementById('hl-shift-bar');
    if (timeEl)   timeEl.textContent   = hh + ':' + mm;
    if (barEl)    barEl.style.width    = pct + '%';
    if (remainEl) {
      if (n < shiftStart)    remainEl.textContent = 'Shift not started';
      else if (n > shiftEnd) remainEl.textContent = 'Shift ended';
      else {
        const rem = shiftEnd - n;
        remainEl.textContent = Math.floor(rem / 3600000) + 'h ' + Math.floor((rem % 3600000) / 60000) + 'm remaining';
      }
    }
  }
  updateShift();
  setInterval(updateShift, 60000);
})();

// ── Chart toggle ──
document.querySelectorAll('.chart-toggle button').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.chart-toggle').querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ── Customize Highlight Cards ──
const ALL_CARDS = [
  { id: 'hl-card-1', icon: '🪙', name: 'Collected Today' },
  { id: 'hl-card-2', icon: '💳', name: 'Payments Recorded' },
  { id: 'hl-card-3', icon: '📨', name: 'Requests for Approval' },
  { id: 'hl-card-4', icon: '📆', name: 'Month-to-Date Collection' },
  { id: 'hl-card-5', icon: '🎯', name: 'Daily Target' },
  { id: 'hl-card-6', icon: '🕐', name: 'Shift Tracker' },
  { id: 'hl-card-7', icon: '🏆', name: 'Top Revenue Today' },
  { id: 'hl-card-8', icon: '⏳', name: 'Oldest Pending' },
];

let cardState    = ALL_CARDS.map(c => ({ ...c, visible: true }));
let dragSrcIndex = null;

function openCustomizeModal() {
  renderCustomizeList();
  openModal('modal-customize');
}

function renderCustomizeList() {
  const list = document.getElementById('cust-card-list');
  list.innerHTML = '';
  cardState.forEach((card, i) => {
    const item = document.createElement('div');
    item.className = 'cust-card-item';
    item.draggable = true;
    item.dataset.index = i;
    item.innerHTML = `
      <span class="cust-drag-handle">⠿</span>
      <span class="cust-card-icon">${card.icon}</span>
      <span class="cust-card-name">${card.name}</span>
      <button class="cust-toggle ${card.visible ? 'on' : ''}" onclick="toggleCard(${i})" title="${card.visible ? 'Hide' : 'Show'}"></button>
    `;
    item.addEventListener('dragstart', () => {
      dragSrcIndex = i;
      setTimeout(() => item.classList.add('dragging'), 0);
    });
    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      document.querySelectorAll('.cust-card-item').forEach(el => el.classList.remove('drag-over'));
    });
    item.addEventListener('dragover', e => {
      e.preventDefault();
      document.querySelectorAll('.cust-card-item').forEach(el => el.classList.remove('drag-over'));
      item.classList.add('drag-over');
    });
    item.addEventListener('drop', e => {
      e.preventDefault();
      if (dragSrcIndex === null || dragSrcIndex === i) return;
      const moved = cardState.splice(dragSrcIndex, 1)[0];
      cardState.splice(i, 0, moved);
      dragSrcIndex = null;
      renderCustomizeList();
    });
    list.appendChild(item);
  });
}

function toggleCard(index) {
  if (cardState[index].visible && cardState.filter(c => c.visible).length <= 1) {
    showToast('At least 1 card must remain visible.', true);
    return;
  }
  cardState[index].visible = !cardState[index].visible;
  renderCustomizeList();
}

function applyCustomizeCards() {
  const track = document.getElementById('highlights-track');
  cardState.forEach(card => {
    const el = track.querySelector(`[data-card-id="${card.id}"]`);
    if (!el) return;
    el.style.display = card.visible ? '' : 'none';
    if (card.visible) track.appendChild(el);
  });
  closeModal('modal-customize');
  showToast('Highlight cards updated!');
}
