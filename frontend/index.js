/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => {
  if (__DEV__) {
    const { connectToDevTools } = require('react-devtools-core');
    connectToDevTools({
      host: Platform.select({ android: '10.0.2.2', ios: 'localhost' }),
      port: 8097,
    });
    console.log(
      `[DevTools] connecting to React DevTools on ${Platform.OS}→${Platform.select({
        android: '10.0.2.2',
        ios: 'localhost',
      })}:8097`
    );
  }
  return App;
});