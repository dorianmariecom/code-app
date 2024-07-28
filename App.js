import React from 'react';
import {Text, View} from 'react-native';
import Config from 'react-native-config';
import { WebView } from 'react-native-webview';

const CODE_ENV = Config.CODE_ENV || "production";
const URLS = {
  local: "http://localhost:3000",
  dev: "https://dev.codedorian.com",
  staging: "https://staging.codedorian.com",
  production: "https://codedorian.com"
};
const CODE_URL = Config.CODE_URL || URLS[CODE_ENV] || URLS.production;

const App = () => {
  return <WebView source={{ uri: CODE_URL }} />;
};

export default App;
