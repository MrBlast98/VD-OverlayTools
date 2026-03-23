const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'change-this-secret-in-production';
const ACTIVE_WINDOW_MS = 2 * 60 * 1000;
const DB_PATH = path.join(__dirname, 'db.json');

const ALLOWED_ROLES = ['user', 'premium', 'tester', 'dev'];

function ensureDb() {
  if (!fs.existsSync(DB_PATH)) {
    const initial = { users: [], premiumCodes: [], auditLogs: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
  }
}

function readDb() {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  const db = JSON.parse(raw);
  if (!Array.isArray(db.users)) db.users = [];
  if (!Array.isArray(db.premiumCodes)) db.premiumCodes = [];
  if (!Array.isArray(db.auditLogs)) db.auditLogs = [];
  return db;
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt || null,
    lastSeenAt: user.lastSeenAt || null
  };
}

function nowIso() {
  return new Date().toISOString();
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

function pushAuditLog(db, event, req, user) {
  db.auditLogs.push({
    id: crypto.randomUUID(),
    event,
    userId: user?.id || null,
    username: user?.username || null,
    ip: getClientIp(req),
    userAgent: String(req.headers['user-agent'] || ''),
    timestamp: nowIso()
  });

  if (db.auditLogs.length > 3000) {
    db.auditLogs = db.auditLogs.slice(db.auditLogs.length - 3000);
  }
}

function createCode(prefix = 'PREMIUM') {
  const chunk = crypto.randomBytes(4).toString('hex').toUpperCase();
  const chunk2 = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `${prefix}-${chunk}-${chunk2}`;
}

function isActive(lastSeenAt) {
  if (!lastSeenAt) return false;
  const ms = Date.now() - new Date(lastSeenAt).getTime();
  return ms >= 0 && ms <= ACTIVE_WINDOW_MS;
}

function getAppInviteCode() {
  return String(process.env.APP_INVITE_CODE || 'VDL-LIMITED').trim();
}

function isValidInviteCode(code) {
  const expected = getAppInviteCode();
  return String(code || '').trim().toUpperCase() === expected.toUpperCase();
}

app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax'
    }
  })
);

app.use(express.static(path.join(__dirname, 'public')));

function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const db = readDb();
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) {
    req.session.destroy(() => {});
    return res.status(401).json({ error: 'Not authenticated' });
  }
  if (user.isBanned) {
    req.session.destroy(() => {});
    return res.status(403).json({ error: 'Your account is banned.' });
  }

  req.currentUser = user;
  next();
}

function requireDev(req, res, next) {
  const user = req.currentUser;
  if (!user || user.role !== 'dev') {
    return res.status(403).json({ error: 'Dev role required' });
  }
  next();
}

app.post('/api/auth/register', async (req, res) => {
  const username = String(req.body.username || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const db = readDb();
  if (db.users.some((u) => u.username === username)) {
    return res.status(409).json({ error: 'Username already exists.' });
  }

  const role = db.users.length === 0 ? 'dev' : 'user';
  const passwordHash = await bcrypt.hash(password, 10);
  const timestamp = nowIso();

  const user = {
    id: crypto.randomUUID(),
    username,
    passwordHash,
    role,
    createdAt: timestamp,
    lastLoginAt: null,
    lastSeenAt: null,
    isBanned: false,
    banReason: null,
    bannedAt: null
  };

  db.users.push(user);
  pushAuditLog(db, 'register', req, user);
  writeDb(db);

  return res.status(201).json({
    message: role === 'dev' ? 'Registered as first user (dev).' : 'Registered successfully.'
  });
});

app.post('/api/auth/register-invite', async (req, res) => {
  const inviteCode = String(req.body.inviteCode || '').trim();
  const email = String(req.body.email || '').trim();
  const username = String(req.body.username || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (!inviteCode) {
    return res.status(400).json({ error: 'Invite code is required.' });
  }
  if (!isValidInviteCode(inviteCode)) {
    return res.status(403).json({ error: 'Invalid invite code.' });
  }
  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const db = readDb();
  if (db.users.some((u) => u.username === username)) {
    return res.status(409).json({ error: 'Username already exists.' });
  }

  const role = db.users.length === 0 ? 'dev' : 'user';
  const passwordHash = await bcrypt.hash(password, 10);
  const timestamp = nowIso();

  const user = {
    id: crypto.randomUUID(),
    username,
    email,
    passwordHash,
    role,
    createdAt: timestamp,
    lastLoginAt: null,
    lastSeenAt: null,
    isBanned: false,
    banReason: null,
    bannedAt: null
  };

  db.users.push(user);
  pushAuditLog(db, 'register-invite', req, user);
  writeDb(db);

  return res.status(201).json({
    message: role === 'dev' ? 'Registered as first user (dev).' : 'Registered successfully.'
  });
});

app.post('/api/auth/login', async (req, res) => {
  const username = String(req.body.username || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  const db = readDb();
  const user = db.users.find((u) => u.username === username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials.' });
  if (user.isBanned) return res.status(403).json({ error: 'Your account is banned.' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials.' });

  const timestamp = nowIso();
  user.lastLoginAt = timestamp;
  user.lastSeenAt = timestamp;
  pushAuditLog(db, 'login', req, user);
  writeDb(db);

  req.session.userId = user.id;
  return res.json({ user: publicUser(user) });
});

app.post('/api/auth/logout', (req, res) => {
  const db = readDb();
  const user = db.users.find((u) => u.id === req.session.userId);
  if (user) {
    pushAuditLog(db, 'logout', req, user);
    writeDb(db);
  }
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

app.get('/api/auth/me', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });

  const db = readDb();
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  if (user.isBanned) return res.status(403).json({ error: 'Your account is banned.' });

  return res.json({ user: publicUser(user) });
});

app.patch('/api/account/username', requireAuth, async (req, res) => {
  const newUsername = String(req.body.newUsername || '').trim().toLowerCase();
  const currentPassword = String(req.body.currentPassword || '');

  if (newUsername.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters.' });
  }
  if (!currentPassword) {
    return res.status(400).json({ error: 'Current password is required.' });
  }

  const db = readDb();
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const passwordOk = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!passwordOk) {
    return res.status(401).json({ error: 'Current password is incorrect.' });
  }

  if (db.users.some((u) => u.username === newUsername && u.id !== user.id)) {
    return res.status(409).json({ error: 'Username already exists.' });
  }

  const oldUsername = user.username;
  user.username = newUsername;
  pushAuditLog(db, `change-username:${oldUsername}->${newUsername}`, req, user);
  writeDb(db);

  return res.json({ user: publicUser(user) });
});

app.patch('/api/account/password', requireAuth, async (req, res) => {
  const currentPassword = String(req.body.currentPassword || '');
  const newPassword = String(req.body.newPassword || '');

  if (!currentPassword) {
    return res.status(400).json({ error: 'Current password is required.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters.' });
  }

  const db = readDb();
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const passwordOk = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!passwordOk) {
    return res.status(401).json({ error: 'Current password is incorrect.' });
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  pushAuditLog(db, 'reset-password', req, user);
  writeDb(db);

  return res.json({ ok: true, message: 'Password updated.' });
});

app.post('/api/activity/heartbeat', requireAuth, (req, res) => {
  const db = readDb();
  const user = db.users.find((u) => u.id === req.session.userId);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  user.lastSeenAt = nowIso();
  writeDb(db);

  return res.json({ ok: true, active: true, lastSeenAt: user.lastSeenAt });
});

app.get('/api/dev/active-users', requireAuth, requireDev, (req, res) => {
  const db = readDb();

  const users = db.users.map((u) => {
    const active = isActive(u.lastSeenAt);
    return {
      ...publicUser(u),
      active,
      isBanned: !!u.isBanned,
      banReason: u.banReason || null
    };
  });

  const summary = {
    total: users.length,
    activeNow: users.filter((u) => u.active).length,
    byRole: {
      user: users.filter((u) => u.role === 'user').length,
      premium: users.filter((u) => u.role === 'premium').length,
      tester: users.filter((u) => u.role === 'tester').length,
      dev: users.filter((u) => u.role === 'dev').length
    }
  };

  return res.json({ summary, users });
});

app.patch('/api/dev/users/:id/role', requireAuth, requireDev, (req, res) => {
  const id = String(req.params.id || '');
  const nextRole = String(req.body.role || '').trim().toLowerCase();

  if (!ALLOWED_ROLES.includes(nextRole)) {
    return res.status(400).json({ error: `Role must be one of: ${ALLOWED_ROLES.join(', ')}` });
  }

  const db = readDb();
  const target = db.users.find((u) => u.id === id);
  if (!target) return res.status(404).json({ error: 'User not found.' });

  target.role = nextRole;
  pushAuditLog(db, `role-change:${nextRole}`, req, target);
  writeDb(db);

  return res.json({ user: publicUser(target) });
});

app.post('/api/dev/users', requireAuth, requireDev, async (req, res) => {
  const username = String(req.body.username || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const role = String(req.body.role || 'user').trim().toLowerCase();

  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }
  if (!ALLOWED_ROLES.includes(role)) {
    return res.status(400).json({ error: `Role must be one of: ${ALLOWED_ROLES.join(', ')}` });
  }

  const db = readDb();
  if (db.users.some((u) => u.username === username)) {
    return res.status(409).json({ error: 'Username already exists.' });
  }

  const user = {
    id: crypto.randomUUID(),
    username,
    passwordHash: await bcrypt.hash(password, 10),
    role,
    createdAt: nowIso(),
    lastLoginAt: null,
    lastSeenAt: null,
    isBanned: false,
    banReason: null,
    bannedAt: null
  };

  db.users.push(user);
  pushAuditLog(db, 'dev-add-user', req, user);
  writeDb(db);
  return res.status(201).json({ user: publicUser(user) });
});

app.patch('/api/dev/users/:id/ban', requireAuth, requireDev, (req, res) => {
  const id = String(req.params.id || '');
  const banned = !!req.body.banned;
  const reason = String(req.body.reason || '').trim() || null;

  const db = readDb();
  const target = db.users.find((u) => u.id === id);
  if (!target) return res.status(404).json({ error: 'User not found.' });

  target.isBanned = banned;
  target.banReason = banned ? reason : null;
  target.bannedAt = banned ? nowIso() : null;

  pushAuditLog(db, banned ? 'ban-user' : 'unban-user', req, target);
  writeDb(db);

  return res.json({
    user: {
      ...publicUser(target),
      isBanned: target.isBanned,
      banReason: target.banReason,
      bannedAt: target.bannedAt
    }
  });
});

app.post('/api/dev/premium-codes/generate', requireAuth, requireDev, (req, res) => {
  const count = Math.max(1, Math.min(50, Number(req.body.count) || 1));
  const targetRole = String(req.body.role || 'premium').trim().toLowerCase();
  const expiresDaysRaw = Number(req.body.expiresDays);
  const expiresDays = Number.isFinite(expiresDaysRaw) ? Math.max(1, Math.min(365, expiresDaysRaw)) : 30;

  if (!['premium', 'tester'].includes(targetRole)) {
    return res.status(400).json({ error: 'Code role must be premium or tester.' });
  }

  const db = readDb();
  const created = [];
  const expiresAt = new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000).toISOString();

  for (let i = 0; i < count; i += 1) {
    const code = createCode(targetRole.toUpperCase());
    const entry = {
      id: crypto.randomUUID(),
      code,
      role: targetRole,
      createdAt: nowIso(),
      createdBy: req.currentUser.id,
      expiresAt,
      redeemedBy: null,
      redeemedAt: null,
      isActive: true
    };
    db.premiumCodes.push(entry);
    created.push(entry);
  }

  pushAuditLog(db, `generate-codes:${targetRole}:${count}`, req, req.currentUser);
  writeDb(db);
  return res.status(201).json({ codes: created });
});

app.get('/api/dev/premium-codes', requireAuth, requireDev, (req, res) => {
  const db = readDb();
  const codes = db.premiumCodes
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 300);
  return res.json({ codes });
});

app.post('/api/codes/redeem', requireAuth, (req, res) => {
  const code = String(req.body.code || '').trim().toUpperCase();
  if (!code) return res.status(400).json({ error: 'Code is required.' });

  const db = readDb();
  const user = db.users.find((u) => u.id === req.currentUser.id);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const entry = db.premiumCodes.find((c) => c.code === code);
  if (!entry) return res.status(404).json({ error: 'Code not found.' });
  if (!entry.isActive) return res.status(400).json({ error: 'Code is inactive.' });
  if (entry.redeemedBy) return res.status(400).json({ error: 'Code already redeemed.' });
  if (new Date(entry.expiresAt).getTime() < Date.now()) {
    return res.status(400).json({ error: 'Code has expired.' });
  }

  user.role = entry.role;
  entry.redeemedBy = user.id;
  entry.redeemedAt = nowIso();

  pushAuditLog(db, `redeem-code:${entry.role}`, req, user);
  writeDb(db);
  return res.json({ user: publicUser(user), code: entry.code, role: entry.role });
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  ensureDb();
  console.log(`Web portal running on http://localhost:${PORT}`);
});
