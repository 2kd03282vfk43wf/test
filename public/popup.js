// popup.js
// ポップアップ/サブメニュー/右クリックメニュー管理

/**
 * シンプルなポップアップ生成
 * @param {string} content
 * @param {object} [options]
 * @returns {HTMLDivElement}
 */
export function createPopup(content, options = {}) {
    const popup = document.createElement("div");
    popup.className = "subMenu";
    popup.innerHTML = content;
    Object.assign(popup.style, options.style || {});
    document.body.appendChild(popup);
    if (options.x !== undefined && options.y !== undefined) {
        popup.style.left = options.x + "px";
        popup.style.top = options.y + "px";
    }
    return popup;
}

/**
 * ポップアップを消す
 * @param {HTMLElement} popup
 */
export function removePopup(popup) {
    if (popup && popup.parentNode) popup.parentNode.removeChild(popup);
}