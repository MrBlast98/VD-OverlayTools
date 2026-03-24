const path = require('path');
const { flipFuses, FuseVersion, FuseV1Options } = require('@electron/fuses');

module.exports = async function afterPack(context) {
  const productName = context && context.packager && context.packager.appInfo
    ? context.packager.appInfo.productFilename
    : '';
  const platform = String(context && context.electronPlatformName ? context.electronPlatformName : process.platform);

  if (!productName || !context || !context.appOutDir) {
    throw new Error('afterPack fuse hook could not resolve packaged executable path.');
  }

  let executablePath = '';
  if (platform === 'win32') {
    executablePath = path.join(context.appOutDir, `${productName}.exe`);
  } else if (platform === 'darwin') {
    executablePath = path.join(context.appOutDir, `${productName}.app`, 'Contents', 'MacOS', productName);
  } else {
    executablePath = path.join(context.appOutDir, productName);
  }

  await flipFuses(executablePath, {
    version: FuseVersion.V1,
    [FuseV1Options.RunAsNode]: false,
    [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
    [FuseV1Options.EnableNodeCliInspectArguments]: false,
    [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
    [FuseV1Options.OnlyLoadAppFromAsar]: true
  });
};
