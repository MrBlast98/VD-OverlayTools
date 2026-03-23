const authCard = document.getElementById('authCard');
const appCard = document.getElementById('appCard');
const devPanel = document.getElementById('devPanel');
const lockedPanel = document.getElementById('lockedPanel');
const premiumSidebar = document.getElementById('premiumSidebar');
const buyPremiumBtn = document.getElementById('buyPremiumBtn');
const discordWarningModal = document.getElementById('discordWarningModal');
const discordContinueBtn = document.getElementById('discordContinueBtn');
const discordCancelBtn = document.getElementById('discordCancelBtn');

const loginUser = document.getElementById('loginUser');
const loginPass = document.getElementById('loginPass');
const loginBtn = document.getElementById('loginBtn');
const authMsg = document.getElementById('authMsg');

const welcome = document.getElementById('welcome');
const roleBadge = document.getElementById('roleBadge');
const logoutBtn = document.getElementById('logoutBtn');
const refreshBtn = document.getElementById('refreshBtn');
const summary = document.getElementById('summary');
const usersTable = document.getElementById('usersTable');
const codesTable = document.getElementById('codesTable');
const addUserUsername = document.getElementById('addUserUsername');
const addUserPassword = document.getElementById('addUserPassword');
const addUserRole = document.getElementById('addUserRole');
const addUserBtn = document.getElementById('addUserBtn');
const addUserMsg = document.getElementById('addUserMsg');
const codeRole = document.getElementById('codeRole');
const codeCount = document.getElementById('codeCount');
const codeExpiresDays = document.getElementById('codeExpiresDays');
const generateCodesBtn = document.getElementById('generateCodesBtn');
const codesMsg = document.getElementById('codesMsg');
const redeemCodeInput = document.getElementById('redeemCodeInput');
const redeemCodeBtn = document.getElementById('redeemCodeBtn');
const redeemMsg = document.getElementById('redeemMsg');
const changeNameInput = document.getElementById('changeNameInput');
const changeNamePassword = document.getElementById('changeNamePassword');
const changeNameBtn = document.getElementById('changeNameBtn');
const changeNameMsg = document.getElementById('changeNameMsg');
const resetCurrentPassword = document.getElementById('resetCurrentPassword');
const resetNewPassword = document.getElementById('resetNewPassword');
const resetPasswordBtn = document.getElementById('resetPasswordBtn');
const resetPasswordMsg = document.getElementById('resetPasswordMsg');

let me = null;
let heartbeatTimer = null;
let devRefreshTimer = null;

const DISCORD_INVITE_URL = 'https://discord.gg/EMsvghEefN';

function showMessage(message, isError = false) {
  authMsg.textContent = message;
  authMsg.classList.remove('hidden');
  authMsg.style.color = isError ? '#fca5a5' : '#86efac';
}

function showInlineMessage(el, message, isError = false) {
  if (!el) return;
  el.textContent = message;
  el.classList.remove('hidden');
  el.style.color = isError ? '#fca5a5' : '#86efac';
}

function hideMessage() {
  authMsg.classList.add('hidden');
}

async function api(path, options = {}) {
  const res = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  const contentType = String(res.headers.get('content-type') || '').toLowerCase();
  let body = {};

  if (contentType.includes('application/json')) {
    try {
      body = await res.json();
    } catch {
      body = {};
    }
  } else {
    const raw = await res.text();
    if (path.startsWith('/api/')) {
      throw new Error('Server returned non-JSON response. Restart the web-portal server and try again.');
    }
    body = { raw };
  }

  if (!res.ok) throw new Error(body.error || 'Request failed');
  return body;
}

function formatDate(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleString();
}

async function sendHeartbeat() {
  if (!me) return;
  try {
    await api('/api/activity/heartbeat', { method: 'POST' });
  } catch {
    // Ignore transient failures.
  }
}

function startHeartbeat() {
  stopHeartbeat();
  sendHeartbeat();
  heartbeatTimer = setInterval(sendHeartbeat, 20000);
}

function stopHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}

async function loadDevDashboard() {
  if (!me || me.role !== 'dev') return;

  const data = await api('/api/dev/active-users');
  summary.textContent = `Total: ${data.summary.total} | Active now: ${data.summary.activeNow} | Roles: user ${data.summary.byRole.user}, premium ${data.summary.byRole.premium}, tester ${data.summary.byRole.tester}, dev ${data.summary.byRole.dev}`;

  usersTable.innerHTML = '';
  data.users.forEach((user) => {
    const tr = document.createElement('tr');
    const banLabel = user.isBanned ? `BANNED${user.banReason ? ` (${user.banReason})` : ''}` : 'No';
    tr.innerHTML = `
      <td>${user.username}</td>
      <td>${user.role}</td>
      <td>${banLabel}</td>
      <td><span class="status ${user.active ? 'active' : 'offline'}">${user.active ? 'ACTIVE' : 'OFFLINE'}</span></td>
      <td>${formatDate(user.lastSeenAt)}</td>
      <td>
        <div class="row">
          <select data-user-id="${user.id}">
          <option value="user" ${user.role === 'user' ? 'selected' : ''}>user</option>
          <option value="premium" ${user.role === 'premium' ? 'selected' : ''}>premium</option>
          <option value="tester" ${user.role === 'tester' ? 'selected' : ''}>tester</option>
          <option value="dev" ${user.role === 'dev' ? 'selected' : ''}>dev</option>
          </select>
          <button class="${user.isBanned ? '' : 'danger'}" data-ban-user-id="${user.id}" data-ban-next="${user.isBanned ? '0' : '1'}">${user.isBanned ? 'Unban' : 'Ban'}</button>
        </div>
      </td>
    `;

    const select = tr.querySelector('select');
    select.addEventListener('change', async () => {
      try {
        await api(`/api/dev/users/${user.id}/role`, {
          method: 'PATCH',
          body: JSON.stringify({ role: select.value })
        });
        await loadDevDashboard();
      } catch (err) {
        alert(err.message);
      }
    });

    const banBtn = tr.querySelector('button[data-ban-user-id]');
    banBtn.addEventListener('click', async () => {
      const willBan = banBtn.dataset.banNext === '1';
      let reason = '';
      if (willBan) {
        reason = window.prompt('Ban reason (optional):', '') || '';
      }
      try {
        await api(`/api/dev/users/${user.id}/ban`, {
          method: 'PATCH',
          body: JSON.stringify({ banned: willBan, reason })
        });
        await loadDevDashboard();
        await loadCodes();
      } catch (err) {
        alert(err.message);
      }
    });

    usersTable.appendChild(tr);
  });
}

async function loadCodes() {
  if (!me || me.role !== 'dev') return;
  const data = await api('/api/dev/premium-codes');
  codesTable.innerHTML = '';
  data.codes.forEach((code) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${code.code}</td>
      <td>${code.role}</td>
      <td>${formatDate(code.expiresAt)}</td>
      <td>${code.redeemedAt ? formatDate(code.redeemedAt) : '-'}</td>
      <td>${code.redeemedBy ? 'Redeemed' : 'Available'}</td>
    `;
    codesTable.appendChild(tr);
  });
}

function startDevAutoRefresh() {
  stopDevAutoRefresh();
  if (!me || me.role !== 'dev') return;

  loadDevDashboard().catch(() => {});
  loadCodes().catch(() => {});
  devRefreshTimer = setInterval(() => {
    loadDevDashboard().catch(() => {});
    loadCodes().catch(() => {});
  }, 10000);
}

function stopDevAutoRefresh() {
  if (devRefreshTimer) {
    clearInterval(devRefreshTimer);
    devRefreshTimer = null;
  }
}

function renderAuthed() {
  authCard.classList.add('hidden');
  appCard.classList.remove('hidden');
  welcome.textContent = `Welcome, ${me.username}`;
  roleBadge.textContent = me.role;

  const isDev = me.role === 'dev';
  const isUser = me.role === 'user';
  devPanel.classList.toggle('hidden', !isDev);
  lockedPanel.classList.toggle('hidden', isDev);
  premiumSidebar.classList.toggle('hidden', !isUser);

  startHeartbeat();
  startDevAutoRefresh();
}

function renderLoggedOut() {
  me = null;
  authCard.classList.remove('hidden');
  appCard.classList.add('hidden');
  devPanel.classList.add('hidden');
  lockedPanel.classList.add('hidden');
  premiumSidebar.classList.add('hidden');
  discordWarningModal.classList.add('hidden');
  stopHeartbeat();
  stopDevAutoRefresh();
}

loginBtn.addEventListener('click', async () => {
  hideMessage();
  try {
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: loginUser.value,
        password: loginPass.value
      })
    });
    me = data.user;
    renderAuthed();
  } catch (err) {
    showMessage(err.message, true);
  }
});

logoutBtn.addEventListener('click', async () => {
  await api('/api/auth/logout', { method: 'POST' });
  renderLoggedOut();
});

refreshBtn.addEventListener('click', async () => {
  try {
    await loadDevDashboard();
    await loadCodes();
  } catch (err) {
    alert(err.message);
  }
});

if (addUserBtn) {
  addUserBtn.addEventListener('click', async () => {
    try {
      const data = await api('/api/dev/users', {
        method: 'POST',
        body: JSON.stringify({
          username: addUserUsername.value,
          password: addUserPassword.value,
          role: addUserRole.value
        })
      });
      const username = data && data.user && data.user.username ? data.user.username : null;
      if (!username) {
        throw new Error('Unexpected add-user response from server. Restart server and retry.');
      }

      showInlineMessage(addUserMsg, `Added user: ${username}`);
      addUserUsername.value = '';
      addUserPassword.value = '';
      addUserRole.value = 'user';
      await loadDevDashboard();
    } catch (err) {
      showInlineMessage(addUserMsg, err.message, true);
    }
  });
}

if (generateCodesBtn) {
  generateCodesBtn.addEventListener('click', async () => {
    try {
      const data = await api('/api/dev/premium-codes/generate', {
        method: 'POST',
        body: JSON.stringify({
          role: codeRole.value,
          count: Number(codeCount.value || 1),
          expiresDays: Number(codeExpiresDays.value || 30)
        })
      });
      const codes = Array.isArray(data && data.codes ? data.codes : null) ? data.codes : [];
      if (codes.length === 0) {
        throw new Error('Unexpected code-generation response from server. Restart server and retry.');
      }

      const first = codes[0] && codes[0].code ? codes[0].code : '';
      showInlineMessage(codesMsg, `Generated ${codes.length} code(s). First: ${first}`);
      await loadCodes();
    } catch (err) {
      showInlineMessage(codesMsg, err.message, true);
    }
  });
}

if (redeemCodeBtn) {
  redeemCodeBtn.addEventListener('click', async () => {
    try {
      const data = await api('/api/codes/redeem', {
        method: 'POST',
        body: JSON.stringify({ code: redeemCodeInput.value })
      });
      me = data.user;
      showInlineMessage(redeemMsg, `Code redeemed. New role: ${data.user.role}`);
      redeemCodeInput.value = '';
      renderAuthed();
    } catch (err) {
      showInlineMessage(redeemMsg, err.message, true);
    }
  });
}

if (changeNameBtn) {
  changeNameBtn.addEventListener('click', async () => {
    try {
      const data = await api('/api/account/username', {
        method: 'PATCH',
        body: JSON.stringify({
          newUsername: changeNameInput.value,
          currentPassword: changeNamePassword.value
        })
      });

      me = data.user;
      renderAuthed();
      showInlineMessage(changeNameMsg, `Username changed to ${data.user.username}`);
      changeNameInput.value = '';
      changeNamePassword.value = '';
    } catch (err) {
      showInlineMessage(changeNameMsg, err.message, true);
    }
  });
}

if (resetPasswordBtn) {
  resetPasswordBtn.addEventListener('click', async () => {
    try {
      const data = await api('/api/account/password', {
        method: 'PATCH',
        body: JSON.stringify({
          currentPassword: resetCurrentPassword.value,
          newPassword: resetNewPassword.value
        })
      });

      showInlineMessage(resetPasswordMsg, data.message || 'Password updated.');
      resetCurrentPassword.value = '';
      resetNewPassword.value = '';
    } catch (err) {
      showInlineMessage(resetPasswordMsg, err.message, true);
    }
  });
}

if (buyPremiumBtn) {
  buyPremiumBtn.addEventListener('click', () => {
    discordWarningModal.classList.remove('hidden');
  });
}

if (discordCancelBtn) {
  discordCancelBtn.addEventListener('click', () => {
    discordWarningModal.classList.add('hidden');
  });
}

if (discordContinueBtn) {
  discordContinueBtn.addEventListener('click', () => {
    discordWarningModal.classList.add('hidden');
    window.open(DISCORD_INVITE_URL, '_blank', 'noopener,noreferrer');
  });
}

(async function init() {
  try {
    const data = await api('/api/auth/me');
    me = data.user;
    renderAuthed();
  } catch {
    renderLoggedOut();
  }
})();
