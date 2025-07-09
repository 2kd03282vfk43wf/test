// state.js
// 状態管理モジュール

import { getValue, setValue } from "./storage.js";

export const state = {
    window: null,
    customTabs: new Set(),
    tabColors: new Map(),
    tabThumbnails: new Map(),
    selectionMode: false,
    videoThumbnailMode: false,
    tagExtractionMode: false,
    compressionRate: 0.2,
    currentCompressedImage: null,
    isDraggingToolbar: false,
    offsetXToolbar: 0,
    offsetYToolbar: 0,
    zIndexCounter: 10000,
    activeMenu: null,
    activePopup: null,
    isHoverEnabled: false,
    setWindow(windowObj) { this.window = windowObj; setValue('savedWindow', windowObj ? windowObj.id : null); },
    updateCustomTabs(tabs) { this.customTabs = new Set(tabs); setValue('customTabs', [...this.customTabs]); },
    setTabColor(tab, color) { this.tabColors.set(tab, color); setValue('tabColors', Object.fromEntries(this.tabColors)); },
    setTabThumbnail(tab, thumbnail) { this.tabThumbnails.set(tab, thumbnail); setValue('tabThumbnails', Object.fromEntries(this.tabThumbnails)); }
};

export async function initState() {
    state.customTabs = new Set(await getValue('customTabs', ['メモ']));
    state.tabColors = new Map(Object.entries(await getValue('tabColors', {})));
    state.tabThumbnails = new Map(Object.entries(await getValue('tabThumbnails', {})));
    // 他の初期値も必要に応じて
}