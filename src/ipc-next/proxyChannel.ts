export function createProxyChannel<T extends object>(target: T): T {
  const proxy = new Proxy(target, {
    get(target, prop) {
      if (prop in target) {
        return Reflect.get(target, prop);
      }
      return {};
    },

    set(_target, prop) {
      throw new Error(`Cannot set property ${String(prop)} on target`);
    },
  });
  return proxy;
}

/**
 * 主线程对外提供接口可以使用
 */
export function createProxyChannelWrappers<T extends object>(
  instance: T,
  mapIPCRoutes: any[] = []
) {
  return mapIPCRoutes.reduce((acc, route: any = {}) => {
    const { handlerName, ipcControllerName } = route;
    if (!Reflect.has(acc, ipcControllerName)) {
      Reflect.set(acc, ipcControllerName, {});
    }
    Reflect.set(acc[ipcControllerName], handlerName, (...args: any[]) => {
      const handler = Reflect.get(instance, handlerName);
      if (typeof handler === "function") {
        return handler.apply(instance, args);
      }
    });
    return acc;
  }, {});
}
