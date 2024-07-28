import React from 'react';
import {Text, View} from 'react-native';
import Config from 'react-native-config';

const CODE_ENV = Config.CODE_ENV;

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
