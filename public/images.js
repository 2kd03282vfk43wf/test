// image.js
// 画像圧縮・サムネイル生成・clipboard画像処理のユーティリティ

/**
 * DataURLからImageオブジェクトを生成
 * @param {string} dataUrl
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImageFromDataUrl(dataUrl) {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = dataUrl;
    });
}

/**
 * img要素→canvasに描画し、DataURLとして圧縮
 * @param {HTMLImageElement} img
 * @param {number} quality 0.1〜1.0
 * @param {string} type 'image/jpeg'など
 * @returns {string} 圧縮後dataURL
 */
export function compressImage(img, quality = 0.2, type = 'image/jpeg') {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL(type, quality);
}

/**
 * 画像ファイルやClipboardDataからDataURLを抽出
 * @param {File|ClipboardItem|Blob} fileOrBlob
 * @returns {Promise<string>} dataURL
 */
export function getDataUrlFromFile(fileOrBlob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(fileOrBlob);
    });
}

/**
 * video要素からサムネイルをキャプチャ（JPEG/PNG）
 * @param {HTMLVideoElement} video
 * @param {number} quality
 * @returns {string} dataURL
 */
export function captureVideoThumbnail(video, quality = 0.3) {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', quality);
}