/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FirstAac from './screens/firstAac';
import Splash from './screens/splash';
import CameraPage from './screens/Camera';
import Images from './screens/Images';
import { Provider } from 'react-redux';
import { Store } from './redux/store';

const Stack = createNativeStackNavigator();

const App = () => {

  return (
    <Provider store={Store}>
        <NavigationContainer>
          <Stack.Navigator
          initialRouteName='Splash'
          >
            <Stack.Screen 
              name='FirstAac'
              component={FirstAac}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen 
              name='Splash'
              component={Splash}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen 
              name='Camera'
              component={CameraPage}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen 
              name='Images'
              component={Images}
              options={{
                headerShown: false
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
    </Provider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
