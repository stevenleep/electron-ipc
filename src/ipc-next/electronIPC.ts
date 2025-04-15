import { ipcMain, IpcMainInvokeEvent } from "electron";

export function createElectronCallIPCListener(
  context: any,
  routeName: string,
  handler: Function,
  config = {}
) {
  ipcMain.on(routeName, async (event: IpcMainInvokeEvent, ...args: any[]) => {
    try {
      await handler.apply(context, [event, ...args]);
    } catch (error) {
      console.error(error);
    }
  });
}

export function createElectronRequestIPCListenerWithResponse(
  context: any,
  routeName: string,
  handler: Function,
  config = {}
) {
  ipcMain.handle(
    routeName,
    async (event: IpcMainInvokeEvent, ...args: any[]) => {
      try {
        return await handler.apply(context, [event, ...args]);
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  );
}
