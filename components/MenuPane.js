import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import User from './User';
import Admin from './Admin';
import Report from './Report';
import Statistic from './Statistic';

const Tab = createBottomTabNavigator();

const MenuPane = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { justifyContent: "center", display: 'flex'},
        tabBarStyle: { display: 'flex' },
        tabBarItemStyle: { width: 'auto' },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconSize = focused ? 30 : 20;

          if (route.name === 'Người dùng') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Báo cáo') {
            iconName = focused ? 'bug' : 'bug-outline';
          } else if (route.name === 'Thống kê') {
            iconName = focused ? 'grid' : 'grid-outline';
          } 

          return <Icon name={iconName} size={iconSize} color="#000" />;
        },
      })}
    >
      <Tab.Screen name="Người dùng" component={User} />
      <Tab.Screen name="Báo cáo" component={Report}/>
      <Tab.Screen name="Thống kê" component={Statistic}/>
      
    </Tab.Navigator>
  );
};

export default MenuPane;