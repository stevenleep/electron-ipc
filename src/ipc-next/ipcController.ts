import { BrowserWindow, IpcMainEvent } from "electron";

export type RequestHandler = (
  event: IpcMainEvent,
  ...args: unknown[]
) => Promise<unknown>;
export type NotificationHandler = (event: IpcMainEvent, ...args: any[]) => void;

export abstract class BaseIPCController {
  protected constructor(protected readonly browserWindow?: BrowserWindow) {
    this.registerIpcHandler();
  }

  protected registerIpcHandler(): void {
    // 基类中的空实现，子类不需要显式调用super.registerIpcHandler()
  }

  /**
   * 获取主窗口
   */
  public getMainWindow(): BrowserWindow {
    if (this.browserWindow && !this.browserWindow.isDestroyed()) {
      return this.browserWindow;
    }
    const mainWindow =
      BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
    if (!mainWindow) {
      throw new Error("No available window found");
    }
    return mainWindow;
  }

  /**
   * 向窗口发送消息
   */
  public sendMessageToWindow(channel: string, ...args: any[]): void {
    const mainWindow = this.getMainWindow();
    if (!mainWindow.isDestroyed()) {
      mainWindow.webContents.send(channel, ...args);
      return;
    }
    throw new Error("Window is destroyed");
  }

  /**
   * 广播消息到所有窗口
   */
  public broadcast(channel: string, ...args: any[]): void {
    BrowserWindow.getAllWindows().forEach((window) => {
      if (!window.isDestroyed()) {
        window.webContents.send(channel, ...args);
      }
    });
  }
}
