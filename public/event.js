// event.js
// イベント管理

export const EventManager = {
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
        handlers.forEach(({ type, handler, options }) =>
            element.removeEventListener(type, handler, options)
        );
        this.handlers.delete(element);
    }
};