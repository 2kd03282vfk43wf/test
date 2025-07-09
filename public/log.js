// log.js
// ログウィンドウやデバッグ出力管理

/**
 * ログウィンドウを表示
 * @param {string[]} logs
 */
export function showLogWindow(logs) {
    let win = document.getElementById("logWindow");
    if (!win) {
        win = document.createElement("div");
        win.id = "logWindow";
        win.className = "subMenu";
        win.innerHTML = "<div class='menuBar'><span>Log</span><button id='closeLog'>×</button></div><div class='logContent'></div>";
        document.body.appendChild(win);
        win.querySelector("#closeLog").onclick = () => win.remove();
    }
    win.querySelector(".logContent").innerHTML = logs.map(l => `<div>${l}</div>`).join("");
}

/**
 * ログメッセージを追記
 * @param {string} message
 */
export function appendLog(message) {
    let win = document.getElementById("logWindow");
    if (win) {
        const content = win.querySelector(".logContent");
        content.innerHTML += `<div>${message}</div>`;
    }
}