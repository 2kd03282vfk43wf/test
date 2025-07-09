// storage.js
// nordjsローカルサーバーストレージAPIクライアント

const NORDJS_API = 'http://127.0.0.1:17001/api';

/**
 * 値取得（非同期）
 * @param {string} key
 * @param {any} def
 * @returns {Promise<any>}
 */
export async function getValue(key, def) {
    try {
        const res = await fetch(`${NORDJS_API}/get`);
        const all = await res.json();
        if (!key) return all;
        if (typeof all === "object" && all !== null && key in all) return all[key];
        return def;
    } catch (e) {
        return def;
    }
}

/**
 * 値保存（非同期）
 * @param {string} key
 * @param {any} value
 * @returns {Promise<void>}
 */
export async function setValue(key, value) {
    let all = {};
    try {
        const res = await fetch(`${NORDJS_API}/get`);
        all = await res.json();
    } catch {}
    if (typeof all !== "object" || all === null) all = {};
    all[key] = value;
    await fetch(`${NORDJS_API}/set`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(all)
    });
}