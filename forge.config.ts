import type {ForgeConfig} from "@electron-forge/shared-types";
import {MakerSquirrel} from "@electron-forge/maker-squirrel";
import {MakerZIP} from "@electron-forge/maker-zip";
import {MakerDeb} from "@electron-forge/maker-deb";
import {MakerRpm} from "@electron-forge/maker-rpm";
import {VitePlugin} from "@electron-forge/plugin-vite";
import {FusesPlugin} from "@electron-forge/plugin-fuses";
import {FuseV1Options, FuseVersion} from "@electron/fuses";

import {spawnSync} from "child_process";

const writeVersion = async (buildPath: string, _: string, platform: string, arch: string, __: any) => {
    const version = spawnSync('git log --format="%H" -n 1', {shell: true}).stdout.toString().trim();
    const today = new Date(Date.now()).toLocaleString();
    const path = `${buildPath}/gshtml5.version`;
    spawnSync(`echo ${today} : ${version} > ${path}`, {shell: true});
};

const config: ForgeConfig = {
    packagerConfig: {
        asar: true,
        icon: "static/favicon.ico",
        ignore: ["index.html"],
        name: "gshtml5",
        executableName: "gshtml5",
        overwrite: true,
        afterComplete: [writeVersion],
    },
    rebuildConfig: {},
    makers: [new MakerSquirrel({}), new MakerZIP({}, ["darwin"]), new MakerRpm({}), new MakerDeb({})],
    plugins: [
        new VitePlugin({
            build: [
                {
                    entry: "electron/main.ts",
                    config: "vite.main.config.ts",
                },
                {
                    entry: "electron/preload.ts",
                    config: "vite.preload.config.ts",
                },
            ],
            renderer: [
                {
                    name: "main_window",
                    config: "vite.renderer.config.ts",
                },
            ],
        }),
        new FusesPlugin({
            version: FuseVersion.V1,
            [FuseV1Options.RunAsNode]: false,
            [FuseV1Options.EnableCookieEncryption]: true,
            [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
            [FuseV1Options.EnableNodeCliInspectArguments]: false,
            [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
            [FuseV1Options.OnlyLoadAppFromAsar]: true,
        }),
    ],
};

export default config;
