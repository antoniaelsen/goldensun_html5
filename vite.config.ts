const path = require("path");
import {defineConfig} from "vite";

const is_dev_env = process.env.NODE_ENV !== "production";

export default defineConfig({
    build: {
        // Avoid naming conflict with existing 'assets' folder
        assetsDir: "dist",
        sourcemap: is_dev_env ? "inline" : false,
    },
    server: {
        open: true,
        port: 9000,
        watch: {
            ignored: [
                path.resolve(__dirname, "dist"),
                path.resolve(__dirname, ".git"),
                path.resolve(__dirname, "code_docs"),
                path.resolve(__dirname, "scripts"),
                path.resolve(__dirname, "electron"),
            ],
        },
    },
});
