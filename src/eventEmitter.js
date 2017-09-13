const isFunction = fn => (
  typeof fn === 'function'
);

class EventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  on(eventName, fn) {
    if (fn && !isFunction(fn)) {
      throw new Error('[ERROR] Listener is not a function.');
    }
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName).push(fn);
    return this;
  }

  once(eventName, fn) {
    const emitter = this;
    function onceFn(...args) {
      emitter.off(eventName, onceFn);
      fn(...args);
    }
    this.on(eventName, onceFn);
    return this;
  }

  off(eventName, fn) {
    const listeners = this.listeners.get(eventName);
    listeners.forEach((listener, i) => {
      if (isFunction(listener) && listener === fn) {
        listeners.splice(i, 1);
      }
    });
    if (listeners.length === 0) {
      this.listeners.delete(eventName);
    }
    return this;
  }

  emit(eventName, ...args) {
    const listeners = this.listeners.get(eventName);
    if (listeners && listeners.length > 0) {
      listeners.forEach((listener) => {
        listener(...args);
      });
    }
    return this;
  }
}

export default EventEmitter;
