// ─── LOGIN PAGE ──────────────────────────────────
function doLogin() {
  const id = document.getElementById('login-id').value.trim();
  const pw = document.getElementById('login-pw').value.trim();
  if (!id || !pw) { showToast('Please enter ID and password.', true); return; }
  window.location.href = 'dashboard.html';
}
