
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MenuPane from './components/MenuPane';
import Login from './components/Login';
import Toast from 'react-native-toast-message';

const App = () => {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialState={Login}>
        <Stack.Screen name="Login" component={Login} options={{ gestureEnabled: false, headerShown: false }}/>
        <Stack.Screen name="MenuPane" component={MenuPane} options={{ gestureEnabled: false, headerShown: false }} />
      </Stack.Navigator>
      <Toast/>
    </NavigationContainer>
  );
};

export default App;