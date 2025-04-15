import { IPCController, IPCCall, IPCRequest } from "../ipcControllerDecorator";
import { BaseIPCController } from "../ipcController";
// import { contextBridge } from "electron";
import { mapIPCRoute } from "../decoratorUtils";
import { IPC_MODE } from "../metadataDefine";
// import { createProxyChannelWrappers } from "../proxyChannel";

@IPCController("example", { mode: IPC_MODE.ELECTRON_IPC })
export class ExampleIPC extends BaseIPCController {
  constructor() {
    // 可选择性传入 BrowserWindow 实例
    // 默认情况下会使用当前焦点窗口或第一个窗口 BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0]
    super();
  }

  @IPCCall()
  testCall(_event: Electron.IpcMainEvent, arg1: string, arg2: number) {
    console.log("testCall", arg1, arg2);
  }

  @IPCRequest()
  async testRequest(
    event: Electron.IpcMainInvokeEvent,
    arg1: string,
    arg2: number
  ): Promise<string> {
    console.log("testRequest", arg1, arg2);
    return `testRequest ${arg1} ${arg2}`;
  }

  @IPCCall()
  repaintWindow(_event: Electron.IpcMainEvent, arg1: string, arg2: number) {
    this.sendMessageToWindow("repaintWindow", arg1, arg2);
  }

  @IPCCall("customCallName")
  custom(_event: Electron.IpcMainEvent, arg1: string, arg2: number) {}
}

const example = new ExampleIPC();
const ipcRoutes = mapIPCRoute<ExampleIPC>(example);
// const handlerWrappers = createProxyChannelWrappers(example, ipcRoutes);
// console.log("handlerWrappers", handlerWrappers);
// console.log("ipcRoutes", ipcRoutes);
example.sendMessageToWindow("registerModuleRoutes", "example", ipcRoutes);
