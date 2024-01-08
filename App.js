
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MenuPane from './components/MenuPane';
import Login from './components/Login';
import Toast from 'react-native-toast-message';
import About from './components/About';
import AddAccountManager from './components/AddAccountManager';
import Profile from './components/ChangePassAccount';
import Statistic from './components/Statistic';

const App = () => {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialState={Login}>
        <Stack.Screen name="Login" component={Login} options={{ gestureEnabled: false, headerShown: false }}/>
        <Stack.Screen name="MenuPane" component={MenuPane} options={{ gestureEnabled: false, headerShown: false }} />
        <Stack.Screen name="Đổi mật khẩu" component={Profile} options={{headerShown: true, gestureEnabled: true }} />
        <Stack.Screen name="Hồ sơ" component={About} options={{headerShown: true, gestureEnabled: true }}/>      
        <Stack.Screen name="Thêm Tài Khoản" component={AddAccountManager} options={{headerShown: true, gestureEnabled: true }}/>      
        <Stack.Screen name="Thống Kê" component={Statistic} options={{headerShown: true, gestureEnabled: true }}/>      
      </Stack.Navigator>
      <Toast/>
    </NavigationContainer>
  );
};

export default App;