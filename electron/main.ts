import {app, BrowserWindow, ipcMain, IpcMainEvent} from "electron";
const path = require("path");
const fs = require("fs");

if (require("electron-squirrel-startup")) {
    app.quit();
}

function createWindow() {
    const is_dev_env = process.env.NODE_ENV !== "production";
    const win = new BrowserWindow({
        width: 240,
        height: 160,
        resizable: is_dev_env ? true : false,
        center: true,
        useContentSize: true,
        autoHideMenuBar: true,
        maximizable: false,
        title: "Golden Sun Engine - HTML5",
        icon: path.join(__dirname, "../public/static/favicon.ico"),
        webPreferences: {
            experimentalFeatures: true,
            spellcheck: false,
            devTools: is_dev_env ? true : false,
            backgroundThrottling: false,
            contextIsolation: true,
            disableDialogs: true,
            autoplayPolicy: "no-user-gesture-required",
            enableWebSQL: false,
            preload: path.join(__dirname, "preload.js"),
        },
    });

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }

    win.webContents.openDevTools();
}

app.commandLine.appendSwitch("disable-gpu-vsync");
// app.commandLine.appendSwitch('show-fps-counter');
app.commandLine.appendSwitch("force_high_performance_gpu");

function initializeLogger() {
    const log_dir = path.join(__dirname, "../logs");
    if (!fs.existsSync(log_dir)) {
        fs.mkdirSync(log_dir);
    }
    const log_filename = `gshtml5.${Date.now()}.log`;
    const log_full_path = path.join(log_dir, log_filename);
    const log_stream = fs.createWriteStream(log_full_path, {flags: "a"});
    const writeLine = (msg: string) => log_stream.write(msg + "\n");
    try {
        const version_info = fs.readFileSync("gshtml5.version", "utf8");
        writeLine(`VERSION: ${version_info.toString()}`);
    } catch (e: any) {
        writeLine("Could not get GSHTML5 version.");
    }
    ipcMain.on("register-log", (_: IpcMainEvent, msg: string) => {
        console.log(msg);
        writeLine(msg);
    });
}

app.on("ready", () => {
    createWindow();
    initializeLogger();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on("resize-window", (event: IpcMainEvent, width: number, height: number) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win.setContentSize(width, height);
});
