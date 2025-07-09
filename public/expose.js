// export.js
// アイテムデータのエクスポート用

import { getValue } from "./storage.js";

/**
 * すべての保存アイテムをJSONでエクスポート
 * @returns {Promise<string>}
 */
export async function exportAllItems() {
    const all = await getValue();
    return JSON.stringify(all, null, 2);
}