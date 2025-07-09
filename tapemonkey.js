// ==UserScript==
// @name         ash8-nordjs
// @namespace    http://tampermonkey.net/
// @version      8.0.0-nordjs
// @description  webclip (nordjsサーバーストレージ＆ローカルCSS版)
// @author
// @match        *://*/*
// @grant        none
// ==/UserScript==

/**
 * nordjsローカルサーバーストレージAPI
 * server.jsと連携し、全てのデータをファイル保存
 * 必須: server.js, public/style.css
 */

const NORDJS_API = 'http://127.0.0.1:17001/api';

async function nordGetValue(key, def) {
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
async function nordSetValue(key, value) {
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

// ローカルCSS読込
(function() {
    const cssUrl = "http://127.0.0.1:17001/public/style.css";
    fetch(cssUrl)
        .then(r => r.text())
        .then(css => {
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        });
})();

(async function() {
    'use strict';

    // logger
    const logMessage = (message) => console.log(`${new Date().toLocaleTimeString()} - ${message}`);

    // 状態管理
    const StateManager = {
        window: null,
        customTabs: new Set(await nordGetValue('customTabs', ['メモ'])),
        tabColors: new Map(Object.entries(await nordGetValue('tabColors', {}))),
        tabThumbnails: new Map(Object.entries(await nordGetValue('tabThumbnails', {}))),
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
        setWindow(windowObj) { this.window = windowObj; nordSetValue('savedWindow', windowObj ? windowObj.id : null); },
        updateCustomTabs(tabs) { this.customTabs = new Set(tabs); nordSetValue('customTabs', [...this.customTabs]); },
        setTabColor(tab, color) { this.tabColors.set(tab, color); nordSetValue('tabColors', Object.fromEntries(this.tabColors)); },
        setTabThumbnail(tab, thumbnail) { this.tabThumbnails.set(tab, thumbnail); nordSetValue('tabThumbnails', Object.fromEntries(this.tabThumbnails)); }
    };
    const state = new Proxy(StateManager, {
        set(target, prop, value) {
            Reflect.set(target, prop, value);
            if (prop === 'currentCompressedImage' && value) {
                const img = document.getElementById('compressedImage');
                if (img) img.src = value;
                if (document.getElementById('autoSaveCheckbox')?.checked) saveImage();
            }
            if (prop === 'window' && value) updateTabs(value);
            return true;
        }
    });

    // イベント管理
    const EventManager = {
        handlers: new WeakMap(),
        add(element, type, handler, options = {}) {
            if (!element) return;
            element.addEventListener(type, handler, options);
            const handlers = this.handlers.get(element) || [];
            handlers.push({ type, handler, options });
            this.handlers.set(element, handlers);
        },
        removeAll(element) {
            const handlers = this.handlers.get(element) || [];
            handlers.forEach(({ type, handler, options }) => element.removeEventListener(type, handler, options));
            this.handlers.delete(element);
        }
    };
    const events = EventManager;

    // ツールバーUI
    const Toolbar = {
        elements: null,
        init() {
            try {
                const toolbar = document.createElement('div');
                toolbar.id = 'toolbar';
                const fragment = document.createDocumentFragment();

                const handle = document.createElement('div'); handle.id = 'toolbarHandle';
                const selectImgBtn = document.createElement('button'); selectImgBtn.id = 'selectImageButton'; selectImgBtn.textContent = '📸';
                const selectVidBtn = document.createElement('button'); selectVidBtn.id = 'selectVideoThumbnailButton'; selectVidBtn.textContent = '📹';
                const extractTagsBtn = document.createElement('button'); extractTagsBtn.id = 'extractTagsButton'; extractTagsBtn.textContent = '📌';
                const pasteArea = document.createElement('textarea'); pasteArea.id = 'pasteImageArea'; pasteArea.placeholder = 'copy';
                const compressionDiv = document.createElement('div'); compressionDiv.id = 'compressionButtons';
                const comp30 = document.createElement('button'); comp30.id = 'compression30'; comp30.textContent = '30';
                const comp50 = document.createElement('button'); comp50.id = 'compression50'; comp50.textContent = '50';
                const comp70 = document.createElement('button'); comp70.id = 'compression70'; comp70.textContent = '70';
                compressionDiv.append(comp30, comp50, comp70);
                const saveBtn = document.createElement('button'); saveBtn.id = 'saveButton'; saveBtn.textContent = '💾';
                const autoSave = document.createElement('input'); autoSave.type = 'checkbox'; autoSave.id = 'autoSaveCheckbox'; autoSave.checked = true; autoSave.title = '自動保存';
                const toggleWinBtn = document.createElement('button'); toggleWinBtn.id = 'toggleWindowButton'; toggleWinBtn.textContent = '🖼️';
                const logBtn = document.createElement('button'); logBtn.id = 'logButton'; logBtn.textContent = 'log';
                const exportBtn = document.createElement('button'); exportBtn.id = 'exportButton'; exportBtn.textContent = '📤';
                const importBtn = document.createElement('button'); importBtn.id = 'importButton'; importBtn.textContent = '📥';
                const compRate = document.createElement('div'); compRate.id = 'compressionRate';
                const debugOut = document.createElement('div'); debugOut.id = 'debugOutput';

                fragment.append(handle, selectImgBtn, selectVidBtn, extractTagsBtn, pasteArea, compressionDiv, saveBtn, autoSave, toggleWinBtn, logBtn, exportBtn, importBtn, compRate, debugOut);
                toolbar.appendChild(fragment);
                document.body.appendChild(toolbar);

                this.elements = {
                    toolbar,
                    selectImageButton: toolbar.querySelector('#selectImageButton'),
                    selectVideoThumbnailButton: toolbar.querySelector('#selectVideoThumbnailButton'),
                    extractTagsButton: toolbar.querySelector('#extractTagsButton'),
                    pasteImageArea: toolbar.querySelector('#pasteImageArea'),
                    compressionRateDisplay: toolbar.querySelector('#compressionRate'),
                    debugOutput: toolbar.querySelector('#debugOutput'),
                    saveButton: toolbar.querySelector('#saveButton'),
                    autoSaveCheckbox: toolbar.querySelector('#autoSaveCheckbox'),
                    toggleWindowButton: toolbar.querySelector('#toggleWindowButton'),
                    logButton: toolbar.querySelector('#logButton'),
                    exportButton: toolbar.querySelector('#exportButton'),
                    importButton: toolbar.querySelector('#importButton'),
                    toolbarHandle: toolbar.querySelector('#toolbarHandle'),
                    compression30: toolbar.querySelector('#compression30'),
                    compression50: toolbar.querySelector('#compression50'),
                    compression70: toolbar.querySelector('#compression70')
                };

                logMessage("ツールバー追加成功");
                this.setupEventListeners();
                return this.elements;
            } catch (e) {
                logMessage(`ツールバー初期化失敗: ${e.message}`);
                return null;
            }
        },
        setupEventListeners() {
            events.add(window, 'load', () => this.elements.autoSaveCheckbox.checked = true);
            events.add(this.elements.selectImageButton, 'click', () => this.startImageSelectionMode());
            events.add(this.elements.selectVideoThumbnailButton, 'click', () => this.startVideoThumbnailMode());
            events.add(this.elements.extractTagsButton, 'click', () => this.startTagExtractionMode());
            events.add(this.elements.pasteImageArea, 'contextmenu', (e) => this.pasteImageFromClipboard(e));
            events.add(this.elements.saveButton, 'click', () => saveImage());
            events.add(this.elements.toggleWindowButton, 'click', () => this.toggleWindow());
            events.add(this.elements.logButton, 'click', () => createLogWindow());
            events.add(this.elements.exportButton, 'click', () => this.exportItems());
            events.add(this.elements.importButton, 'click', () => this.importItems());
            events.add(this.elements.compression30, 'click', () => this.setCompressionRate(0.3));
            events.add(this.elements.compression50, 'click', () => this.setCompressionRate(0.5));
            events.add(this.elements.compression70, 'click', () => this.setCompressionRate(0.7));
            this.setupDrag();
            logMessage("ツールバーリスナー設定完了");
        },
        // ...（test.txtのToolbarオブジェクトの機能をnordGetValue/nordSetValueで書き換え：省略部はtest.txt参照）
        // 以降もtest.txt同等のロジックをnordjsストレージ＋async/awaitで再現
    };

    // ...（Window, saveImage, extractTagsAndDate, その他関数もtest.txtと同等にnordGetValue/nordSetValueで書き換え）

    // 初期化
    const init = async () => {
        const toolbarElements = Toolbar.init();
        if (!toolbarElements) { logMessage("ツールバー初期化失敗、中止"); return; }
        let toolbarLeft = Math.max(0, Math.min(window.innerWidth - 80, parseFloat((await nordGetValue('toolbarPosition', { left: window.innerWidth - 80 })).left) || 0));
        let toolbarTop = Math.max(0, Math.min(window.innerHeight - 100, parseFloat((await nordGetValue('toolbarPosition', { top: 50 })).top) || 50));
        toolbarElements.toolbar.style.left = `${toolbarLeft}px`;
        toolbarElements.toolbar.style.top = `${toolbarTop}px`;
        toolbarElements.toolbar.style.right = 'auto';
        logMessage("ツールバー位置設定完了");

        // ...（フルスクリーン検知やwindow復元もtest.txt同等に）
    };

    await init();
})();