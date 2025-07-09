// menu.js
// サイドバーや各種メニュー生成補助

/**
 * タブサイドバーのメニュー生成
 * @param {Array<{label:string,icon?:string,active?:boolean,onclick:Function}>} tabs
 * @returns {HTMLDivElement}
 */
export function createSidebar(tabs) {
    const sidebar = document.createElement("div");
    sidebar.className = "tabSidebar";
    tabs.forEach(tab => {
        const btn = document.createElement("button");
        btn.className = "tab-vertical" + (tab.active ? " active" : "");
        btn.textContent = tab.icon ? "" : tab.label;
        if (tab.icon) {
            const img = document.createElement("img");
            img.src = tab.icon;
            btn.appendChild(img);
        }
        btn.onclick = tab.onclick;
        sidebar.appendChild(btn);
    });
    return sidebar;
}