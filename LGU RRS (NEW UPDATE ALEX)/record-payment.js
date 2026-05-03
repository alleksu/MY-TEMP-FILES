// ─── RECORD PAYMENT PAGE ────────────────────────

// ─── MOCK PAYOR DATA (replace with real API/DB calls) ───
const PAYORS = [
  { fname:'Juan', mname:'Santos', lname:'Cruz', suffix:'', contact:'09171234567', email:'juan@email.com', address:'123 Mabini St., Cebu City' },
  { fname:'Maria', mname:'', lname:'Reyes', suffix:'', contact:'09281234567', email:'maria@email.com', address:'456 Rizal Ave., Mandaue City' },
  { fname:'Pedro', mname:'Lim', lname:'Santos', suffix:'Jr.', contact:'09391234567', email:'', address:'789 Colon St., Cebu City' },
  { fname:'Ana', mname:'', lname:'Garcia', suffix:'', contact:'09501234567', email:'ana@email.com', address:'10 Osmeña Blvd., Cebu City' },
  { fname:'Roberto', mname:'Cruz', lname:'Dela Cruz', suffix:'Sr.', contact:'09611234567', email:'', address:'22 M. Velez St., Cebu City' },
];

let selectedPayor = null;

// ─── TRANSACTION ID ──────────────────────────────
function genTxnId() {
  const now = new Date();
  const d = now.getFullYear().toString().slice(-2)
    + String(now.getMonth()+1).padStart(2,'0')
    + String(now.getDate()).padStart(2,'0');
  const r = Math.random().toString(36).toUpperCase().slice(2,7);
  return 'TXN-' + d + '-' + r;
}

function regenTxnId() {
  document.getElementById('pay-txnid').value = genTxnId();
}

// ─── PAYOR SEARCH ────────────────────────────────
function searchPayors(query) {
  const dd = document.getElementById('payor-dropdown');
  if (!query.trim()) { dd.innerHTML = ''; dd.classList.remove('open'); return; }

  const q = query.toLowerCase();
  const results = PAYORS.filter(p => {
    const full = [p.fname, p.mname, p.lname, p.suffix, p.contact].join(' ').toLowerCase();
    return full.includes(q);
  });

  if (!results.length) {
    dd.innerHTML = `<div class="payor-dd-empty">No payors found. <span onclick="openModal('payor-modal')" style="color:var(--green);cursor:pointer;font-weight:700">Add new?</span></div>`;
    dd.classList.add('open');
    return;
  }

  dd.innerHTML = results.map((p, i) => {
    const full = [p.fname, p.mname, p.lname, p.suffix].filter(Boolean).join(' ');
    const meta = [p.contact, p.email].filter(Boolean).join(' · ');
    return `<div class="payor-dd-item" onclick="selectPayor(${PAYORS.indexOf(p)})">
      <div class="payor-dd-avatar">${p.fname[0]}${p.lname[0]}</div>
      <div>
        <div class="payor-dd-name">${full}</div>
        <div class="payor-dd-meta">${meta || p.address}</div>
      </div>
    </div>`;
  }).join('');
  dd.classList.add('open');
}

function selectPayor(idx) {
  const p = PAYORS[idx];
  selectedPayor = p;

  // Populate hidden fields
  document.getElementById('pay-fname').value   = p.fname;
  document.getElementById('pay-mname').value   = p.mname;
  document.getElementById('pay-lname').value   = p.lname;
  document.getElementById('pay-suffix').value  = p.suffix;
  document.getElementById('pay-contact').value = p.contact;
  document.getElementById('pay-email').value   = p.email;
  document.getElementById('pay-address').value = p.address;

  // Show selected card
  const full = [p.fname, p.mname, p.lname, p.suffix].filter(Boolean).join(' ');
  const meta = [p.contact, p.email, p.address].filter(Boolean).join(' · ');
  document.getElementById('sel-avatar').textContent = p.fname[0] + p.lname[0];
  document.getElementById('sel-name').textContent   = full;
  document.getElementById('sel-meta').textContent   = meta;
  document.getElementById('selected-payor-card').classList.remove('hidden');

  // Clear search
  document.getElementById('payor-search').value = '';
  const dd = document.getElementById('payor-dropdown');
  dd.innerHTML = ''; dd.classList.remove('open');
}

function clearPayor() {
  selectedPayor = null;
  ['pay-fname','pay-mname','pay-lname','pay-suffix','pay-contact','pay-email','pay-address']
    .forEach(id => document.getElementById(id).value = '');
  document.getElementById('selected-payor-card').classList.add('hidden');
}

// ─── ADD NEW PAYOR MODAL ─────────────────────────
function saveNewPayor() {
  const fname = document.getElementById('new-fname').value.trim();
  const lname  = document.getElementById('new-lname').value.trim();
  if (!fname || !lname) { showToast('First and last name are required.', true); return; }

  const p = {
    fname,
    mname:   document.getElementById('new-mname').value.trim(),
    lname,
    suffix:  document.getElementById('new-suffix').value.trim(),
    contact: document.getElementById('new-contact').value.trim(),
    email:   document.getElementById('new-email').value.trim(),
    address: document.getElementById('new-address').value.trim(),
  };

  PAYORS.push(p);
  closeModal('payor-modal');

  // Clear modal fields
  ['new-fname','new-mname','new-lname','new-suffix','new-contact','new-email','new-address']
    .forEach(id => document.getElementById(id).value = '');

  selectPayor(PAYORS.length - 1);
  showToast('Payor added and selected.');
}

// ─── SAVE PAYMENT ────────────────────────────────
function savePayment() {
  const fname = document.getElementById('pay-fname').value.trim();
  const lname  = document.getElementById('pay-lname').value.trim();
  const date   = document.getElementById('pay-date').value;
  const type   = document.getElementById('pay-coltype').value;
  const collector = document.getElementById('pay-collector').value.trim();

  if (!fname || !lname) { showToast('Please select or add a payor first.', true); return; }
  if (!date || !type)   { showToast('Please fill in required payment fields.', true); return; }
  if (!collector)       { showToast('Please enter the collector name.', true); return; }

  showToast('Payment recorded successfully!');
  setTimeout(() => window.location.href = 'records.html', 1200);
}


// ─── CLOSE DROPDOWN ON OUTSIDE CLICK ────────────
document.addEventListener('click', e => {
  const wrap = document.querySelector('.payor-search-wrap');
  if (wrap && !wrap.contains(e.target)) {
    const dd = document.getElementById('payor-dropdown');
    if (dd) { dd.innerHTML = ''; dd.classList.remove('open'); }
  }
});

// ─── INIT ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('pay-txnid').value = genTxnId();
});