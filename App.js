import Config from 'react-native-config';
import {getVersion, getBuildNumber} from 'react-native-device-info';
import React, {useRef, useState} from 'react';
import {NativeModules} from 'react-native';
import {WebView} from 'react-native-webview';
const {StatusBarManager} = NativeModules;
const CODE_ENV = Config.CODE_ENV || 'production';
const URLS = {
  local: 'http://localhost:3000',
  dev: 'https://dev.codedorian.com',
  staging: 'https://staging.codedorian.com',
  production: 'https://codedorian.com',
};
const CODE_URL = Config.CODE_URL || URLS[CODE_ENV] || URLS.production;
const VERSION = getVersion();
const BUILD_NUMBER = getBuildNumber();

const App = () => {
  const webViewRef = useRef();
  const [statusBarHeight, setStatusBarHeight] = useState(0);

  const update = () => {
    postJSON({
      buildNumber: BUILD_NUMBER,
      config: Config,
      statusBarHeight,
      version: VERSION,
    });
  };

  const postJSON = data => {
    webViewRef.current.postMessage(JSON.stringify(data));
  };

  StatusBarManager.getHeight(statusBarHeight => {
    setStatusBarHeight(statusBarHeight.height);
    update();
  });

  return (
    <WebView
      ref={webViewRef}
      source={{uri: CODE_URL}}
      onLoadStart={update}
      onLoad={update}
      onLoadEnd={update}
    />
  );
};

export default App;
