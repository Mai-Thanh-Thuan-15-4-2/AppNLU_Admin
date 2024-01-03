
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MenuPane from './components/MenuPane';
import Login from './components/Login';

const App = () => {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
    <Stack.Screen name="Login" component={Login}/>
    <Stack.Screen name="MenuPane" component={MenuPane} options={{ gestureEnabled: false }} />
    </NavigationContainer>
  );
};

export default App;