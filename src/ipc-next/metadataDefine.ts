export const IPC_CONTROLLER_METADATA_KEY = Symbol.for(
  "IPC_CONTROLLER_METADATA_KEY"
);

export const IPC_CONTROLLER_CONFIG_METADATA_KEY = Symbol.for(
  "IPC_CONTROLLER_CONFIG_METADATA_KEY"
);

export const IPC_HANDLER_METADATA_KEY = Symbol.for("IPC_HANDLER_METADATA_KEY");
export const IPC_HANDLER_METADATA_FLAG = Symbol.for(
  "IPC_HANDLER_METADATA_FLAG"
);
export const IPC_HANDLER_METADATA_FLAG_VALUE_KEY = Symbol.for(
  "IPC_HANDLER_METADATA_FLAG_VALUE_KEY"
);

export enum IPC_MODE {
  ELECTRON_IPC = "electron:ipc",
  HTTP = "http",
  TCP = "tcp",
}
