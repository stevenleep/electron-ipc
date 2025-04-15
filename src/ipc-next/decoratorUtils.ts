import {
  IPC_HANDLER_METADATA_FLAG,
  IPC_HANDLER_METADATA_KEY,
  IPC_HANDLER_METADATA_FLAG_VALUE_KEY,
} from "./metadataDefine";

export function mapIPCRoute<C = any>(instance: C) {
  const prototype = Object.getPrototypeOf(instance);
  const routes = Object.getOwnPropertyNames(prototype)
    .filter((methodName) => {
      const isFunction = typeof prototype[methodName] === "function";
      const hasMetadata = Reflect.hasMetadata(
        IPC_HANDLER_METADATA_KEY,
        prototype,
        methodName
      );
      if (
        !isFunction ||
        !hasMetadata ||
        Reflect.getMetadata(IPC_HANDLER_METADATA_KEY, prototype, methodName) !==
          IPC_HANDLER_METADATA_FLAG
      ) {
        return false;
      }
      return isFunction && hasMetadata;
    })
    .map((methodName) => {
      return Reflect.getMetadata(
        IPC_HANDLER_METADATA_FLAG_VALUE_KEY,
        prototype,
        methodName
      );
    });
  return routes;
}

export function createIPCName(prefix: string, methodName: string | symbol) {
  return `${prefix}:${String(methodName)}`;
}
