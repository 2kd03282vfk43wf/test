// import.js
// アイテムデータのインポート用

import { setValue } from "./storage.js";

/**
 * JSON文字列からデータをまるごと上書き
 * @param {string} json
 * @returns {Promise<void>}
 */
export async function importAllItems(json) {
    const obj = JSON.parse(json);
    for (const k in obj) {
        await setValue(k, obj[k]);
    }
}