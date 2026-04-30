// ─── REVENUE TYPE PAGE ──────────────────────────

let revTypeCount = 4;
let editingRevRow = null;

function editRevType(btn) {
  editingRevRow = btn.closest('tr');
  const cells = editingRevRow.querySelectorAll('td');
  document.getElementById('modal-revtype-title').textContent = 'Edit Revenue Type';
  document.getElementById('rt-name').value = cells[1].textContent;
  document.getElementById('rt-rate').value = cells[2].textContent.replace(/[₱, ]/g, '');
  openModal('modal-revtype');
}

function saveRevType() {
  const name = document.getElementById('rt-name').value.trim();
  const rate = parseFloat(document.getElementById('rt-rate').value) || 0;
  if (!name) { showToast('Please enter a type name.', true); return; }
  if (editingRevRow) {
    const cells = editingRevRow.querySelectorAll('td');
    cells[1].textContent = name;
    cells[2].textContent = '₱ ' + rate.toFixed(2);
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

function addRevTypeInline() {
  const name = document.getElementById('add-rt-name').value.trim();
  const rate = parseFloat(document.getElementById('add-rt-rate').value) || 0;
  if (!name) { showToast('Please enter a type name.', true); return; }
  const tbody = document.getElementById('revtype-tbody');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>#${String(revTypeCount++).padStart(3,'0')}</td>
    <td>${name}</td>
    <td>₱ ${rate.toFixed(2)}</td>
    <td><button class="action-edit-btn" onclick="editRevType(this)" title="Edit"><span class="btn-icon-rev"><svg width="10" height="10" fill="none" viewBox="0 0 10 10"><path d="M1 9l1.5-1.5 5-5L9 4 4 9H1Z" stroke="white" stroke-width="1" stroke-linejoin="round"/><path d="M6.5 2.5l1 1" stroke="white" stroke-width="1" stroke-linecap="round"/></svg></span></button></td>
    <td><button class="action-remove-btn" onclick="removeRevType(this)" title="Remove"><span class="btn-icon-rev"><svg width="10" height="10" fill="none" viewBox="0 0 10 10"><path d="M1.5 3h7M4 3V2h2v1M2.5 3l.5 6h4l.5-6" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 5v2.5M6 5v2.5" stroke="white" stroke-width="1" stroke-linecap="round"/></svg></span></button></td>
  `;
  tbody.appendChild(tr);
  document.getElementById('add-rt-name').value = '';
  document.getElementById('add-rt-rate').value = '';
  showToast('Revenue type added!');
}
