// ─── RECORDS PAGE ────────────────────────────────

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
    : data.map((r, i) => `
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
  const filtered = records.filter(r =>
    r.id.toLowerCase().includes(q) ||
    r.payee.toLowerCase().includes(q) ||
    r.type.toLowerCase().includes(q)
  );
  renderRecords(filtered);
}

function viewRecord(idx) {
  const r = records[idx];
  document.getElementById('modal-record-content').innerHTML = `
    <div style="font-size:12px;color:var(--text-3);margin-bottom:10px">${r.id} — <span class="status-text-${r.status.toLowerCase()}">${r.status}</span></div>
    <div class="receipt-row"><span>Payor:</span><strong>${r.payee}</strong></div>
    <div class="receipt-row"><span>Collection Type:</span><span>${r.type}</span></div>
    <div class="receipt-row"><span>Date Issued:</span><span>${r.date}</span></div>
    <div class="receipt-row"><span>Total Amount:</span><strong>₱ ${r.amount.toLocaleString('en-PH',{minimumFractionDigits:2})}</strong></div>
  `;
  openModal('modal-view-record');
}

renderRecords();
