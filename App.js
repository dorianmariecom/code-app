import React, {useRef} from 'react';
import Config from 'react-native-config';
import {WebView} from 'react-native-webview';

const CODE_ENV = Config.CODE_ENV || 'production';
const URLS = {
  local: 'http://localhost:3000',
  dev: 'https://dev.codedorian.com',
  staging: 'https://staging.codedorian.com',
  production: 'https://codedorian.com',
};
const CODE_URL = Config.CODE_URL || URLS[CODE_ENV] || URLS.production;

const App = () => {
  const webViewRef = useRef();

  const onLoad = () => {
    webViewRef.current.postMessage(JSON.stringify({config: Config}));
  };

  return (
    <WebView ref={webViewRef} source={{uri: CODE_URL}} onLoad={onLoad} />
  );
};

export default App;
