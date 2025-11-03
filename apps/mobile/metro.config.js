const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Configure monorepo support
config.watchFolders = [workspaceRoot];

// Exclude backend and other non-mobile directories
config.resolver.blockList = [
  /apps\/backend\/.*/,
  /apps\/web\/.*/,
  /apps\/docs\/.*/,
  /\.git\/.*/,
  /node_modules\/.*\/node_modules\/react-native\/.*/,
];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

module.exports = withNativeWind(config, { input: "./app/global.css" });
