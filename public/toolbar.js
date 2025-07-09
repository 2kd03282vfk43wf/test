// toolbar.js
import { state } from "./state.js";
import { EventManager as events } from "./event.js";
import { saveImage } from "./item.js";
import { logMessage } from "./utils.js";

export const Toolbar = {
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
        // ...ほかのイベントもtest.txt通り実装
        logMessage("ツールバーリスナー設定完了");
    },
    // ...他のメソッドはtest.txt Toolbar部をモジュール化
};