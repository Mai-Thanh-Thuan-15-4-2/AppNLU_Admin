import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getAllUser, lockUser } from './service/NLUAppApiCaller';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  useEffect(() => {
    AsyncStorage.setItem('tokenApp', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aHVhbiIsImlhdCI6MTcwMzQxMTI5MSwiZXhwIjoxNzAzNDk3NjkxfQ.FWIPiX7RYCEp-1nAXj2kWyQXwq-dIAK5lqCJ2NuBZSIrAxzD76j04VMu13aeVv_38czSDWob-oer2Gaqx6phRQ').then(()=>{
     lockUser('20130426').then(res => console.log(res))
    })
  }, [])
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
