const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("ipc", {
    register_log: message => ipcRenderer.send("register-log", message),
    resize_window: (width, height) => ipcRenderer.send("resize-window", width, height),
});
