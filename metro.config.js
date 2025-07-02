const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname, {
  // Add this configuration
  resolver: {
    sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx'],
    extraNodeModules: {
      '@expo/metro-runtime': require.resolve('@expo/metro-runtime'),
    },
  },
});

module.exports = withNativeWind(config, { input: './app/globals.css' })