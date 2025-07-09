// compress.js
// 画像圧縮専用ロジック

import { loadImageFromDataUrl, compressImage } from "./image.js";

/**
 * 任意のdataURL画像を指定圧縮率で再圧縮
 * @param {string} dataUrl
 * @param {number} ratio
 * @param {string} type
 * @returns {Promise<string>} 圧縮後dataURL
 */
export async function compressDataUrl(dataUrl, ratio = 0.2, type = 'image/jpeg') {
    const img = await loadImageFromDataUrl(dataUrl);
    return compressImage(img, ratio, type);
}