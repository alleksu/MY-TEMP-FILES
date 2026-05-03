// ─── REVENUE TYPE PAGE ──────────────────────────

let revTypeCount = 4;
let editingRevRow = null;

// Store line items per revenue type row (keyed by row index)
const lineItemsStore = {};
let currentLineItemsRow = null;

function editRevType(btn) {
  editingRevRow = btn.closest('tr');
  const cells = editingRevRow.querySelectorAll('td');
  document.getElementById('modal-revtype-title').textContent = 'Edit Revenue Type';
  document.getElementById('rt-name').value = cells[1].textContent;
  document.getElementById('rt-rate').value = cells[2].textContent.replace(/[₱, ]/g, '');
  document.getElementById('rt-surcharge').value = cells[3].textContent.replace('%', '').trim();
  document.getElementById('rt-interest').value = cells[4].textContent.replace('%', '').trim();
  openModal('modal-revtype');
}

function saveRevType() {
  const name = document.getElementById('rt-name').value.trim();
  const rate = parseFloat(document.getElementById('rt-rate').value) || 0;
  const surcharge = parseFloat(document.getElementById('rt-surcharge').value) || 0;
  const interest = parseFloat(document.getElementById('rt-interest').value) || 0;
  if (!name) { showToast('Please enter a type name.', true); return; }
  if (editingRevRow) {
    const cells = editingRevRow.querySelectorAll('td');
    cells[1].textContent = name;
    cells[2].textContent = '₱ ' + rate.toFixed(2);
    cells[3].textContent = surcharge + '%';
    cells[4].textContent = interest + '%';
    showToast('Revenue type updated!');
  }
  closeModal('modal-revtype');
}

function removeRevType(btn) {
  if (confirm('Remove this revenue type?')) {
    btn.closest('tr').remove();
    showToast('Removed.');
  }
}

// ─── LINE ITEMS PICKER (toolbar button) ──────────
function openLineItemsPicker() {
  const rows = document.querySelectorAll('#revtype-tbody tr');
  const list = document.getElementById('li-picker-list');
  list.innerHTML = '';

  if (!rows.length) {
    list.innerHTML = '<p style="color:#888;font-size:13px;padding:8px 0">No revenue types found.</p>';
  } else {
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      const id = cells[0].textContent.trim();
      const name = cells[1].textContent.trim();
      const btn = document.createElement('button');
      btn.className = 'li-picker-item';
      btn.innerHTML = `<span class="li-picker-id">${id}</span><span class="li-picker-name">${name}</span>`;
      btn.onclick = () => {
        closeModal('modal-li-picker');
        openLineItems(row);
      };
      list.appendChild(btn);
    });
  }

  openModal('modal-li-picker');
}

// ─── LINE ITEMS POPUP ────────────────────────────
function openLineItems(row) {
  currentLineItemsRow = row;
  const cells = currentLineItemsRow.querySelectorAll('td');
  const typeName = cells[1].textContent.trim();

  document.getElementById('modal-lineitems-title').textContent = 'Line Items — ' + typeName;
  document.getElementById('modal-lineitems-sub').textContent = 'Manage revenue line items for ' + typeName;

  // Load stored items or start with one blank row
  const rowKey = currentLineItemsRow.dataset.liKey || ('li-' + Date.now());
  currentLineItemsRow.dataset.liKey = rowKey;

  const tbody = document.getElementById('lineitems-body');
  tbody.innerHTML = '';

  const stored = lineItemsStore[rowKey];
  if (stored && stored.length) {
    stored.forEach(item => addLineItemRow(item));
  } else {
    addLineItemRow();
  }

  updateLiTotal();
  openModal('modal-lineitems');
}

function addLineItemRow(data) {
  const tbody = document.getElementById('lineitems-body');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="text" placeholder="Description…" value="${data ? data.desc : ''}"></td>
    <td><input type="number" value="${data ? data.qty : 1}" min="1" style="width:54px" oninput="calcLineItem(this)"></td>
    <td><input type="number" placeholder="0.00" value="${data ? data.base : ''}" oninput="calcLineItem(this)"></td>
    <td><input type="number" placeholder="0.00" value="${data ? data.surcharge : ''}" oninput="calcLineItem(this)"></td>
    <td><input type="number" placeholder="0.00" value="${data ? data.interest : ''}" oninput="calcLineItem(this)"></td>
    <td class="li-line-total" style="font-weight:700;white-space:nowrap">₱ 0.00</td>
    <td><button onclick="this.closest('tr').remove();updateLiTotal()" style="background:none;border:none;color:var(--red);font-size:15px;cursor:pointer;padding:0 4px">✕</button></td>
  `;
  tbody.appendChild(tr);
  if (data) calcLineItem(tr.querySelector('input[type=number]'));
}

function calcLineItem(inp) {
  const row = inp.closest('tr');
  const inputs = row.querySelectorAll('input[type=number]');
  const qty       = parseFloat(inputs[0].value) || 1;
  const base      = parseFloat(inputs[1].value) || 0;
  const surcharge = parseFloat(inputs[2].value) || 0;
  const interest  = parseFloat(inputs[3].value) || 0;
  const total = (base + surcharge + interest) * qty;
  row.querySelector('.li-line-total').textContent = '₱ ' + total.toFixed(2);
  updateLiTotal();
}

function updateLiTotal() {
  let sum = 0;
  document.querySelectorAll('#lineitems-body .li-line-total').forEach(td => {
    sum += parseFloat(td.textContent.replace('₱','').trim()) || 0;
  });
  document.getElementById('li-grand-total').textContent = '₱ ' + sum.toFixed(2);
}

function saveLineItems() {
  if (!currentLineItemsRow) return;
  const rowKey = currentLineItemsRow.dataset.liKey;
  const items = [];
  document.querySelectorAll('#lineitems-body tr').forEach(tr => {
    const inputs = tr.querySelectorAll('input');
    items.push({
      desc:      inputs[0].value,
      qty:       inputs[1].value,
      base:      inputs[2].value,
      surcharge: inputs[3].value,
      interest:  inputs[4].value,
    });
  });
  lineItemsStore[rowKey] = items;
  showToast('Line items saved!');
  closeModal('modal-lineitems');
}

function addRevTypeInline() {
  const name = document.getElementById('add-rt-name').value.trim();
  const rate = parseFloat(document.getElementById('add-rt-rate').value) || 0;
  const surcharge = parseFloat(document.getElementById('add-rt-surcharge').value) || 0;
  const interest = parseFloat(document.getElementById('add-rt-interest').value) || 0;
  if (!name) { showToast('Please enter a type name.', true); return; }
  const tbody = document.getElementById('revtype-tbody');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>#${String(revTypeCount++).padStart(3,'0')}</td>
    <td>${name}</td>
    <td>₱ ${rate.toFixed(2)}</td>
    <td>${surcharge}%</td>
    <td>${interest}%</td>
    <td><button class="action-edit-btn" onclick="editRevType(this)" title="Edit"><span class="btn-icon-rev"><svg width="10" height="10" fill="none" viewBox="0 0 10 10"><path d="M1 9l1.5-1.5 5-5L9 4 4 9H1Z" stroke="white" stroke-width="1" stroke-linejoin="round"/><path d="M6.5 2.5l1 1" stroke="white" stroke-width="1" stroke-linecap="round"/></svg></span></button></td>
    <td><button class="action-remove-btn" onclick="removeRevType(this)" title="Remove"><span class="btn-icon-rev"><svg width="10" height="10" fill="none" viewBox="0 0 10 10"><path d="M1.5 3h7M4 3V2h2v1M2.5 3l.5 6h4l.5-6" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 5v2.5M6 5v2.5" stroke="white" stroke-width="1" stroke-linecap="round"/></svg></span></button></td>
  `;
  tbody.appendChild(tr);
  document.getElementById('add-rt-name').value = '';
  document.getElementById('add-rt-rate').value = '';
  document.getElementById('add-rt-surcharge').value = '';
  document.getElementById('add-rt-interest').value = '';
  showToast('Revenue type added!');
}