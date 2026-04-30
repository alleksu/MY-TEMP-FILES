// ─── RECORD PAYMENT PAGE ────────────────────────

function savePayment() {
  const fname = document.getElementById('pay-fname').value.trim();
  const lname = document.getElementById('pay-lname').value.trim();
  const date  = document.getElementById('pay-date').value;
  const type  = document.getElementById('pay-coltype').value;
  if (!fname || !lname || !date || !type) {
    showToast('Please fill in required fields.', true); return;
  }
  showToast('Payment recorded successfully!');
  setTimeout(() => window.location.href = 'records.html', 1200);
}

function parseGrandTotal() {
  const txt = document.getElementById('grand-total').textContent;
  return parseFloat(txt.replace(/[₱,]/g,'')) || 0;
}

// ─── LINE ITEMS ──────────────────────────────────
function addLineItem() {
  const tbody = document.getElementById('line-items-body');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><select style="width:100%;padding:6px 8px;background:var(--gray-input);border:1px solid transparent;border-radius:6px;font-size:13px;font-family:inherit"><option>Business Tax</option><option>Mayor's Permit</option><option>Market Stall Fee</option><option>Real Property Tax</option><option>Water Fees</option></select></td>
    <td><input type="number" value="1" min="1" style="width:60px"></td>
    <td><input type="number" placeholder="0.00" oninput="calcLine(this)"></td>
    <td><input type="number" placeholder="0.00" oninput="calcLine(this)"></td>
    <td><input type="number" placeholder="0.00" oninput="calcLine(this)"></td>
    <td class="line-total" style="font-weight:700">₱ 0.00</td>
    <td><button onclick="removeLineItem(this)" style="background:none;border:none;color:var(--red);font-size:16px;cursor:pointer;padding:0 4px">✕</button></td>
  `;
  tbody.appendChild(tr);
}

function removeLineItem(btn) {
  btn.closest('tr').remove();
  updateGrandTotal();
}

function calcLine(inp) {
  const row = inp.closest('tr');
  const inputs = row.querySelectorAll('input[type=number]');
  const qty       = parseFloat(inputs[0].value) || 1;
  const base      = parseFloat(inputs[1].value) || 0;
  const surcharge = parseFloat(inputs[2].value) || 0;
  const interest  = parseFloat(inputs[3].value) || 0;
  const total = (base + surcharge + interest) * qty;
  row.querySelector('.line-total').textContent = '₱ ' + total.toFixed(2);
  updateGrandTotal();
}

function updateGrandTotal() {
  let sum = 0;
  document.querySelectorAll('.line-total').forEach(td => {
    sum += parseFloat(td.textContent.replace('₱','').trim()) || 0;
  });
  document.getElementById('grand-total').textContent = '₱ ' + sum.toFixed(2);
}
