const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: "./images/logo.png",
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-dmg",
      config: {
        format: "ULFO",
        icon: "./images/logo.icns",
        background: './images/installBackground658.png',
        iconSize: 1024,
        name: "Tea Package Builder",
        overwrite: true
      },
    },
    {
      name: "@electron-forge/maker-deb",
      config: {
        options: {
          maintainer: "Andrii Riabchenko",
          homepage: "https://github.com/ArionThinker/tea-package-builder",
          icon: "./images/logo.png",
          categories: ["Development"],
          name: "Tea Package Builder",
          description: "Package builder for tea.xyz pantry.",
          productDescription:
            "Tea Package Builder is a tool that helps create packages for Tea.xyz quickly and conveniently. The program fetches an up-to-date list of packages from tea.xyz, enabling convenient input fields with autocomplete for dependencies.",
          genericName: "Tea Package Builder",
        },
      },
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
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
