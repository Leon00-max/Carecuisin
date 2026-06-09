const memoryKey = '__CARECUISIN_LOCAL_DB__';

function memoryStore() {
  if (!globalThis[memoryKey]) {
    globalThis[memoryKey] = {};
  }
  return globalThis[memoryKey];
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function createId(prefix) {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${Date.now()}-${random}`;
}

export function nowIso() {
  return new Date().toISOString();
}

export function readCollection(key, fallback = []) {
  if (typeof window === 'undefined') {
    const store = memoryStore();
    if (!store[key]) store[key] = clone(fallback);
    return clone(store[key]);
  }

  try {
    const value = localStorage.getItem(key);
    if (!value) return clone(fallback);
    return JSON.parse(value);
  } catch (_) {
    return clone(fallback);
  }
}

export function writeCollection(key, records) {
  const value = clone(records);

  if (typeof window === 'undefined') {
    memoryStore()[key] = value;
    return value;
  }

  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new StorageEvent('storage', {
    key,
    newValue: JSON.stringify(value),
  }));
  window.dispatchEvent(new CustomEvent('carecuisin:data-change', {
    detail: { key },
  }));
  return value;
}

export function insertRecord(key, record) {
  const records = readCollection(key);
  const next = {
    ...record,
    createdAt: record.createdAt || nowIso(),
    updatedAt: nowIso(),
  };
  records.unshift(next);
  writeCollection(key, records);
  return next;
}

export function updateRecord(key, id, updates) {
  const records = readCollection(key);
  const index = records.findIndex(record => record.id === id);
  if (index === -1) return null;

  records[index] = {
    ...records[index],
    ...updates,
    updatedAt: nowIso(),
  };
  writeCollection(key, records);
  return records[index];
}

export function upsertRecord(key, record) {
  const records = readCollection(key);
  const index = records.findIndex(item => item.id === record.id);
  const next = {
    ...record,
    createdAt: record.createdAt || nowIso(),
    updatedAt: nowIso(),
  };

  if (index === -1) {
    records.unshift(next);
  } else {
    records[index] = { ...records[index], ...next };
  }

  writeCollection(key, records);
  return next;
}

export function removeRecord(key, id) {
  const records = readCollection(key);
  const next = records.filter(record => record.id !== id);
  writeCollection(key, next);
  return next.length !== records.length;
}

export function byNewest(records) {
  return [...records].sort(
    (a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0)
  );
}
