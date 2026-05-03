// ─── RECORDS + REQUESTS (COMBINED) ──────────────

// ── Tab switching ────────────────────────────────
function switchTab(tab) {
  const isRecords = tab === 'records';
  document.getElementById('panel-records').style.display  = isRecords ? '' : 'none';
  document.getElementById('panel-requests').style.display = isRecords ? 'none' : '';
  document.getElementById('tab-records').classList.toggle('active', isRecords);
  document.getElementById('tab-requests').classList.toggle('active', !isRecords);
  document.getElementById('page-title-text').textContent = isRecords ? 'Payment Records' : 'Modification Requests';
  document.getElementById('page-sub-text').textContent   = isRecords
    ? 'View and manage all payment records'
    : 'Review and approve or reject payment modification requests';
}

// ── RECORDS DATA ─────────────────────────────────
const records = [
  { id:'RCP-0012', payee:'Gomez, Selena A.',     type:'Business Permit',  amount:2000, date:'2026-03-25 03:32 PM', status:'Pending'  },
  { id:'RCP-0011', payee:'Man, Spider R.',        type:"Mayor's Permit",   amount:1850, date:'2026-03-25 11:40 AM', status:'Pending'  },
  { id:'RCP-0010', payee:'Tolomea, Gabriel',      type:'Business Tax',     amount:1000, date:'2026-03-25 09:22 AM', status:'Posted'   },
  { id:'RCP-0009', payee:'Rodrigo, Olivia L.',    type:"Mayor's Permit",   amount:1090, date:'2026-03-25 08:02 PM', status:'Rejected' },
  { id:'RCP-0008', payee:'Moonlight, Miya A.',    type:'Real Property Tax',amount:2200, date:'2026-10-08 02:11 PM', status:'Posted'   },
  { id:'RCP-0007', payee:'Chua, Janice Angel L.', type:'Business Tax',     amount:500,  date:'2026-10-08 08:26 AM', status:'Posted'   },
  { id:'RCP-0006', payee:'Kim, Jennie J.',         type:'Water Fees',       amount:750,  date:'2026-10-08 08:26 AM', status:'Pending'  },
  { id:'RCP-0005', payee:'Park, Rosie',            type:'CTC',              amount:300,  date:'2026-10-08 08:26 AM', status:'Rejected' },
];

function renderRecords(data) {
  const tbody = document.getElementById('records-tbody');
  if (!tbody) return;
  if (!data) data = records;
  tbody.innerHTML = data.length === 0
    ? '<tr><td colspan="7" style="text-align:center;color:var(--text-3);padding:24px">No records found.</td></tr>'
    : data.map(r => `
    <tr>
      <td style="font-weight:700;color:var(--green-dark)">${r.id}</td>
      <td>${r.payee}</td>
      <td>${r.type}</td>
      <td style="font-weight:600">₱ ${r.amount.toLocaleString('en-PH',{minimumFractionDigits:2})}</td>
      <td style="color:var(--text-3)">${r.date}</td>
      <td><span class="status-text-${r.status.toLowerCase()}">${r.status}</span></td>
      <td>
        <button class="action-view-btn" onclick="viewRecord(${records.indexOf(r)})" title="View">
          <span class="btn-icon"><svg width="10" height="10" fill="none" viewBox="0 0 10 10"><circle cx="5" cy="5" r="2" fill="white"/><path d="M1 5s1.5-3 4-3 4 3 4 3-1.5 3-4 3-4-3-4-3Z" stroke="white" stroke-width="1"/></svg></span>
        </button>
      </td>
    </tr>`).join('');
}

function filterRecords(query) {
  const q = query.toLowerCase();
  renderRecords(records.filter(r =>
    r.id.toLowerCase().includes(q) ||
    r.payee.toLowerCase().includes(q) ||
    r.type.toLowerCase().includes(q)
  ));
}

function viewRecord(idx) {
  const r = records[idx];
  document.getElementById('modal-view-title').textContent = 'Payment Record';
  document.getElementById('modal-record-content').innerHTML = `
    <div style="font-size:12px;color:var(--text-3);margin-bottom:10px">${r.id} — <span class="status-text-${r.status.toLowerCase()}">${r.status}</span></div>
    <div class="receipt-row"><span>Payor:</span><strong>${r.payee}</strong></div>
    <div class="receipt-row"><span>Collection Type:</span><span>${r.type}</span></div>
    <div class="receipt-row"><span>Date Issued:</span><span>${r.date}</span></div>
    <div class="receipt-row"><span>Total Amount:</span><strong>₱ ${r.amount.toLocaleString('en-PH',{minimumFractionDigits:2})}</strong></div>
  `;
  openModal('modal-view-record');
}

// ── REQUESTS DATA ────────────────────────────────
let approveRecords = [
  { reqId:'REQ-0008', id:'RCP-0012', payee:'Gomez, Selena A.',     type:'Business Permit',  amount:2000, date:'2026-03-25 03:32 PM', status:'Pending'  },
  { reqId:'REQ-0007', id:'RCP-0011', payee:'Man, Spider R.',        type:"Mayor's Permit",   amount:1850, date:'2026-03-25 11:40 AM', status:'Pending'  },
  { reqId:'REQ-0006', id:'RCP-0010', payee:'Tolomea, Gabriel',      type:'Business Tax',     amount:1000, date:'2026-03-25 09:22 AM', status:'Posted'   },
  { reqId:'REQ-0005', id:'RCP-0009', payee:'Rodrigo, Olivia L.',    type:"Mayor's Permit",   amount:1090, date:'2026-03-25 08:02 PM', status:'Rejected' },
  { reqId:'REQ-0004', id:'RCP-0008', payee:'Moonlight, Miya A.',    type:'Real Property Tax',amount:2200, date:'2026-10-08 02:11 PM', status:'Posted'   },
  { reqId:'REQ-0003', id:'RCP-0007', payee:'Chua, Janice Angel L.', type:'Business Tax',     amount:500,  date:'2026-10-08 08:26 AM', status:'Posted'   },
  { reqId:'REQ-0002', id:'RCP-0006', payee:'Kim, Jennie J.',         type:'Water Fees',       amount:750,  date:'2026-10-08 08:26 AM', status:'Pending'  },
  { reqId:'REQ-0001', id:'RCP-0005', payee:'Park, Rosie',            type:'CTC',              amount:300,  date:'2026-10-08 08:26 AM', status:'Rejected' },
];

let approveTarget = null;
let rejectTarget  = null;

function updateBadge() {
  const pending = approveRecords.filter(r => r.status === 'Pending').length;
  const badge = document.getElementById('tab-badge');
  if (badge) {
    badge.textContent = pending;
    badge.style.display = pending > 0 ? '' : 'none';
  }
}

function renderApprove(data) {
  const tbody = document.getElementById('approve-tbody');
  if (!tbody) return;
  if (!data) data = approveRecords;
  tbody.innerHTML = data.length === 0
    ? '<tr><td colspan="8" style="text-align:center;color:var(--text-3);padding:24px">No requests found.</td></tr>'
    : data.map(r => {
        const i = approveRecords.indexOf(r);
        return `<tr>
          <td style="font-weight:700;color:var(--text-2)">${r.reqId}</td>
          <td style="font-weight:700;color:var(--green-dark)">${r.id}</td>
          <td>${r.payee}</td>
          <td>${r.type}</td>
          <td style="font-weight:600">₱ ${r.amount.toLocaleString('en-PH',{minimumFractionDigits:2})}</td>
          <td style="color:var(--text-3)">${r.date}</td>
          <td>Collector Swift</td>
          <td style="white-space:nowrap">
            <button class="action-approve-btn" onclick="openApprove(${i})" title="Approve"><span class="btn-icon">✓</span></button>
            <button class="action-reject-btn"  onclick="openReject(${i})"  title="Reject"><span class="btn-icon">✕</span></button>
            <button class="action-view-btn"    onclick="viewRequest(${i})" title="View">
              <span class="btn-icon"><svg width="10" height="10" fill="none" viewBox="0 0 10 10"><circle cx="5" cy="5" r="2" fill="white"/><path d="M1 5s1.5-3 4-3 4 3 4 3-1.5 3-4 3-4-3-4-3Z" stroke="white" stroke-width="1"/></svg></span>
            </button>
          </td>
        </tr>`;
      }).join('');
}

function filterApprove(query) {
  const q = query.toLowerCase();
  renderApprove(approveRecords.filter(r =>
    r.id.toLowerCase().includes(q) ||
    r.payee.toLowerCase().includes(q) ||
    r.type.toLowerCase().includes(q)
  ));
}

function viewRequest(idx) {
  const r = approveRecords[idx];
  document.getElementById('modal-view-title').textContent = 'Request Detail';
  document.getElementById('modal-record-content').innerHTML = `
    <div style="font-size:12px;color:var(--text-3);margin-bottom:10px">${r.id} — <span class="status-text-${r.status.toLowerCase()}">${r.status}</span></div>
    <div class="receipt-row"><span>Request ID:</span><strong>${r.reqId}</strong></div>
    <div class="receipt-row"><span>Payor:</span><strong>${r.payee}</strong></div>
    <div class="receipt-row"><span>Request Type:</span><span>${r.type}</span></div>
    <div class="receipt-row"><span>Date:</span><span>${r.date}</span></div>
    <div class="receipt-row"><span>Amount:</span><strong>₱ ${r.amount.toLocaleString('en-PH',{minimumFractionDigits:2})}</strong></div>
    <div class="receipt-row"><span>Issued By:</span><span>Collector Swift</span></div>
  `;
  openModal('modal-view-record');
}

function openApprove(idx) {
  approveTarget = idx;
  openModal('modal-confirm-approve');
}

function confirmApprove() {
  approveRecords[approveTarget].status = 'Posted';
  closeModal('modal-confirm-approve');
  renderApprove();
  updateBadge();
  showToast('Modification approved!');
}

function openReject(idx) {
  rejectTarget = idx;
  document.getElementById('reject-reason').value = '';
  openModal('modal-confirm-reject');
}

function confirmReject() {
  approveRecords[rejectTarget].status = 'Rejected';
  closeModal('modal-confirm-reject');
  renderApprove();
  updateBadge();
  showToast('Modification rejected.');
}

// ── Init ─────────────────────────────────────────
renderRecords();
renderApprove();
updateBadge();
