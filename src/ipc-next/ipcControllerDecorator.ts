import { createIPCName } from "./decoratorUtils";
import { getIPCImpl } from "./ipcImpl";
import {
  IPC_CONTROLLER_CONFIG_METADATA_KEY,
  IPC_CONTROLLER_METADATA_KEY,
  IPC_MODE,
  IPC_HANDLER_METADATA_KEY,
  IPC_HANDLER_METADATA_FLAG,
  IPC_HANDLER_METADATA_FLAG_VALUE_KEY,
} from "./metadataDefine";

export interface IPCControllerConfig {
  sharedServer?: {};
  mode?: IPC_MODE;
}

export function IPCController(
  channel?: string,
  config: IPCControllerConfig = {
    mode: IPC_MODE.ELECTRON_IPC,
  }
) {
  return (target: Function) => {
    const channelName = channel || target?.name;
    Reflect.defineMetadata(IPC_CONTROLLER_METADATA_KEY, channelName, target);
    Reflect.defineMetadata(IPC_CONTROLLER_CONFIG_METADATA_KEY, config, target);
  };
}

export function createIPCDecorator(
  callMode: "call" | "request",
  channelName?: string
) {
  return (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const originalMethod = descriptor.value;
    const ipcChannel = channelName || propertyKey;

    if (!ipcChannel) {
      throw new Error(
        `IPC channel name is required for method: ${propertyKey}`
      );
    }

    // 延迟注册IPC处理器, 确保先完成 ClassDecorator 注册
    if (target.constructor.prototype.registerIpcHandler) {
      const originalRegister = target.constructor.prototype.registerIpcHandler;

      target.constructor.prototype.registerIpcHandler = function (this: any) {
        originalRegister.call(this);
        const prefix = Reflect.getMetadata(
          IPC_CONTROLLER_METADATA_KEY,
          this.constructor
        );
        const routeName = createIPCName(prefix, ipcChannel);
        const ipcControllerConfig = Reflect.getMetadata(
          IPC_CONTROLLER_CONFIG_METADATA_KEY,
          this.constructor
        );

        // 为mapRoute添加元数据
        Reflect.defineMetadata(
          IPC_HANDLER_METADATA_KEY,
          IPC_HANDLER_METADATA_FLAG,
          target,
          propertyKey
        );
        // 绑定方法
        Reflect.defineMetadata(
          IPC_HANDLER_METADATA_FLAG_VALUE_KEY,
          {
            routeName,
            ipcControllerName: prefix,
            ipcHandlerName: ipcChannel,
            handlerName: propertyKey,
            callMode,
          },
          target,
          propertyKey
        );

        // 调用不同的IPC实现
        const ipcImpl = getIPCImpl(ipcControllerConfig.mode);
        if (ipcImpl) {
          ipcImpl[callMode](
            this,
            routeName,
            originalMethod.bind(this),
            ipcControllerConfig
          );
        } else {
          throw new Error(
            `IPC implementation for mode ${ipcControllerConfig.mode} not found`
          );
        }
      };
    } else {
      throw new Error(
        `Class ${target.constructor.name} should implement registerIpcHandler method`
      );
    }
  };
}

export function IPCCall(ipcCallName?: string): MethodDecorator {
  return createIPCDecorator("call", ipcCallName);
}

export function IPCRequest(ipcRequestName?: string): MethodDecorator {
  return createIPCDecorator("request", ipcRequestName);
}
