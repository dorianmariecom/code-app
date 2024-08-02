import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import React, {useRef, useState, useEffect} from 'react';
import {NativeModules, Linking} from 'react-native';
import {Notifications} from 'react-native-notifications';
import {WebView} from 'react-native-webview';
import {getVersion, getBuildNumber} from 'react-native-device-info';

const {StatusBarManager} = NativeModules;

const CODE_ENV = Config.CODE_ENV || 'production';
const URLS = {
  local: 'http://localhost:3000',
  dev: 'https://dev.codedorian.com',
  staging: 'https://staging.codedorian.com',
  production: 'https://codedorian.com',
};
const CODE_URL = Config.CODE_URL || URLS[CODE_ENV] || URLS.production;
const CODE_HOST = (new URL(CODE_URL)).host
const VERSION = getVersion();
const BUILD_NUMBER = getBuildNumber();
const PLATFORM = 'ios';

const App = () => {
  const webViewRef = useRef();
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const [tokens, setTokens] = useState([]);
  const [deviceToken, setDeviceToken] = useState(null);

  const get = async key => {
    try {
      return await JSON.parse(AsyncStorage.getItem(key));
    } catch {
      return null;
    }
  };

  const set = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {}
  };

  const update = () => {
    postJSON({
      buildNumber: BUILD_NUMBER,
      config: Config,
      statusBarHeight,
      version: VERSION,
      device: deviceToken && {token: deviceToken, platform: PLATFORM},
    });
  };

  const postJSON = data => {
    webViewRef.current.postMessage(JSON.stringify(data));
  };

  const onMessage = async event => {
    const data = JSON.parse(event.nativeEvent.data);

    if ('tokens' in data) {
      await set('tokens', data.tokens);
      setTokens(data.tokens);
    }
  };

  const onShouldStartLoadWithRequest = request => {
    if (request.url && (new URL(request.url)).host !== CODE_HOST) {
      Linking.openURL(request.url);
      return false;
    } else {
      return true;
    }
  }

  useEffect(() => {
    const gets = async () => {
      setTokens([await get('tokens')]);
      setDeviceToken(await get('deviceToken'));
    };

    gets();
  }, []);

  useEffect(() => {
    Notifications.registerRemoteNotifications();

    Notifications.events().registerRemoteNotificationsRegistered(
      async event => {
        await set('deviceToken', event.deviceToken);
        setDeviceToken(event.deviceToken);
        update();
      },
    );
  }, [tokens]);

  StatusBarManager.getHeight(statusBarHeight => {
    setStatusBarHeight(statusBarHeight.height);
    update();
  });

  return (
    <WebView
      onMessage={onMessage}
      ref={webViewRef}
      source={{uri: CODE_URL}}
      onLoadStart={update}
      onLoad={update}
      onLoadEnd={update}
      onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
    />
  );
};

export default App;
