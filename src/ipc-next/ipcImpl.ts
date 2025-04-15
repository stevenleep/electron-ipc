import {
  createElectronCallIPCListener,
  createElectronRequestIPCListenerWithResponse,
} from "./electronIPC";
import { IPCControllerConfig } from "./ipcControllerDecorator";
import { IPC_MODE } from "./metadataDefine";

const ipcMaps = new Map<
  IPC_MODE,
  {
    call: (
      context: any,
      routeName: string,
      handler: Function,
      config: IPCControllerConfig
    ) => void;
    request: (
      context: any,
      routeName: string,
      handler: Function,
      config: IPCControllerConfig
    ) => void;
  }
>();

// Register the IPC implementations for Electron
createIPCImpl(
  IPC_MODE.ELECTRON_IPC,
  createElectronCallIPCListener,
  createElectronRequestIPCListenerWithResponse
);

function createIPCImpl(
  mode: IPC_MODE,
  call: (
    context: any,
    routeName: string,
    handler: Function,
    config: IPCControllerConfig
  ) => void,
  request: (
    context: any,
    routeName: string,
    handler: Function,
    config: IPCControllerConfig
  ) => void
) {
  ipcMaps.set(mode, { call, request });
}

export function getIPCImpl(mode: IPC_MODE) {
  const ipcImpl = ipcMaps.get(mode);
  if (!ipcImpl) {
    throw new Error(`IPC implementation for mode ${mode} not found`);
  }
  return ipcImpl;
}
