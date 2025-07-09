// main.js
// すべての依存モジュールをimportし、初期化

import { Toolbar } from "./toolbar.js";
import { Window } from "./window.js";
import { state, initState } from "./state.js";
import { logMessage } from "./utils.js";

(async function() {
    await initState();
    Toolbar.init();
    Window.create();
    logMessage("初期化完了");
})();