const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname); // Use __dirname instead of _dirname
defaultConfig.resolver.assetExts.push("cjs");

module.exports = defaultConfig;
