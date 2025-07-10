import { registerRootComponent } from 'expo';
import { AppRegistry, LogBox } from 'react-native';
import App from './App';

LogBox.ignoreLogs([
  "[Reanimated]",
  "Tried to modify key",
  "valueUnpacker",
  "ENOENT"
]);

// Add global error handler
if (__DEV__) {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Ignore specific errors during development
    const errorString = args.join(' ');
    if (
      errorString.includes('valueUnpacker') ||
      errorString.includes('ENOENT') ||
      errorString.includes('Reanimated')
    ) {
      return;
    }
    originalConsoleError(...args);
  };
}


// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
