import { contextBridge, ipcRenderer } from "electron";

ipcRenderer.on("registerModuleRoutes", (event, moduleName, routes = []) => {
  contextBridge.exposeInMainWorld(
    moduleName,
    routes.reduce((acc: any = {}, route: any) => {
      acc[route.ipcHandlerName] = (...args: any[]) => {
        switch (route.callMode) {
          case "call": {
            ipcRenderer.send(route.routeName, ...args);
            break;
          }
          case "request": {
            ipcRenderer.invoke(route.routeName, ...args);
            break;
          }
        }
      };
    }, {})
  );
});
