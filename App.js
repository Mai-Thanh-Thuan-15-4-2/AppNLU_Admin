
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MenuPane from './components/MenuPane';
const App = () => {
  return (
    <NavigationContainer>
      <MenuPane />
    </NavigationContainer>
  );
};

export default App;