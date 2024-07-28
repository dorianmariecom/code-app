import React from 'react';
import {Text, View} from 'react-native';
import Config from 'react-native-config';

const CODE_ENV = Config.CODE_ENV || "production";
const URLS = {
  local: "http://localhost:3000",
  dev: "https://dev.codedorian.com",
  staging: "https://staging.codedorian.com",
  production: "https://codedorian.com"
};
const CODE_URL = URLS[CODE_ENV] || URLS.production;

const App = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>CODE_ENV = {CODE_ENV}</Text>
    </View>
  );
};

export default App;
