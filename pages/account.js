import crypto from 'crypto';

// Works whether the credentials were auto-injected by the Vercel Upstash
// integration (KV_REST_API_*) or set manually (UPSTASH_REDIS_REST_*).
const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// The access code that lets someone CREATE an account. Distribute this in the
// paid members area. Change it any time to rotate — existing accounts keep
// working because they log in with their own codename + password, not this.
const ACCESS_CODE = process.env.OE_ACCESS_CODE || '';

async function redis(command) {
  const r = await fetch(REDIS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });
  if (!r.ok) throw new Error('store_error');
  const j = await r.json();
  return j.result;
}

const userKey = (u) => `oe:user:${u}`;
const normUser = (u) => String(u || '').trim().toLowerCase();

function hashPassword(password, salt) {
  return crypto.scryptSync(String(password), salt, 64).toString('hex');
}
function makeToken() { return crypto.randomBytes(24).toString('hex'); }
function makeSalt() { return crypto.randomBytes(16).toString('hex'); }
function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!REDIS_URL || !REDIS_TOKEN) return res.status(500).json({ error: 'Account storage is not configured yet.' });

  const { action, username, password, token, data, accessCode } = req.body || {};
  const u = normUser(username);

  try {
    if (action === 'register') {
      if (!u || u.length < 3 || u.length > 24 || !/^[a-z0-9_]+$/.test(u)) {
        return res.status(400).json({ error: 'Codename must be 3-24 chars: letters, numbers, underscore.' });
      }
      if (!password || String(password).length < 4) {
        return res.status(400).json({ error: 'Password must be at least 4 characters.' });
      }
      if (!ACCESS_CODE || String(accessCode || '') !== ACCESS_CODE) {
        return res.status(403).json({ error: 'Invalid access code.' });
      }
      const existing = await redis(['GET', userKey(u)]);
      if (existing) return res.status(409).json({ error: 'That codename is already taken.' });
      const salt = makeSalt();
      const record = {
        username: u,
        salt,
        hash: hashPassword(password, salt),
        token: makeToken(),
        data: data || {},
        createdAt: Date.now(),
      };
      await redis(['SET', userKey(u), JSON.stringify(record)]);
      return res.status(200).json({ token: record.token, data: record.data });
    }

    if (action === 'login') {
      if (!u) return res.status(400).json({ error: 'Enter your codename.' });
      const raw = await redis(['GET', userKey(u)]);
      if (!raw) return res.status(401).json({ error: 'No account with that codename.' });
      const record = JSON.parse(raw);
      if (!safeEqual(hashPassword(password || '', record.salt), record.hash)) {
        return res.status(401).json({ error: 'Incorrect password.' });
      }
      // Token is NOT rotated on login, so the same account works on multiple
      // devices at once.
      return res.status(200).json({ token: record.token, data: record.data || {} });
    }

    if (action === 'load') {
      if (!u) return res.status(400).json({ error: 'Missing user.' });
      const raw = await redis(['GET', userKey(u)]);
      if (!raw) return res.status(401).json({ error: 'Account not found.' });
      const record = JSON.parse(raw);
      if (!token || !safeEqual(token, record.token)) {
        return res.status(401).json({ error: 'Session expired. Log in again.' });
      }
      return res.status(200).json({ data: record.data || {} });
    }

    if (action === 'save') {
      if (!u) return res.status(400).json({ error: 'Missing user.' });
      const raw = await redis(['GET', userKey(u)]);
      if (!raw) return res.status(401).json({ error: 'Account not found.' });
      const record = JSON.parse(raw);
      if (!token || !safeEqual(token, record.token)) {
        return res.status(401).json({ error: 'Session expired.' });
      }
      record.data = data || record.data;
      record.updatedAt = Date.now();
      await redis(['SET', userKey(u), JSON.stringify(record)]);
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: 'Unknown action.' });
  } catch (e) {
    console.error('account error:', e);
    return res.status(500).json({ error: 'Account server error. Try again.' });
  }
}
