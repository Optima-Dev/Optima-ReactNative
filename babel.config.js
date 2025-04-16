module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    ],
    'react-native-reanimated/plugin',
    ["module:react-native-dotenv", {
      "moduleName": "@env",
      "path": ".env"
    }]
  ],
};
