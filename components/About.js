import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../BaseStyle/Style';
import AsyncStorage from '@react-native-async-storage/async-storage';

const About = () => {
  const navigation = useNavigation();

  const handleViewProfile = () => {
    navigation.navigate('Đổi mật khẩu');
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.navigate('Login');
  };

  const handleReportBug = () => {
    navigation.navigate('Thêm Tài Khoản');
  };
  const handleSetting = () => {
    navigation.navigate('Thống Kê');
  };

  return (
    <View style={styles.container}>
        {/* Item Cài đặt */}
        <TouchableOpacity style={styles.item} onPress={handleSetting}>
        <Icon name="bar-chart-outline" style={styles.icon} />
        <Text style={styles.itemText}>Thống Kê</Text>
      </TouchableOpacity>
      {/* Item Đổi MK */}
      <TouchableOpacity style={styles.item} onPress={handleViewProfile}>
        <Icon name="person" style={styles.icon} />
        <Text style={styles.itemText}>Đổi Mật Khẩu</Text>
      </TouchableOpacity>
    
        {/* Item thêm TK */}
        <TouchableOpacity style={styles.item} onPress={handleReportBug}>
        <Icon name="add" style={styles.icon} />
        <Text style={styles.itemText}>Thêm TK Manager</Text>
      </TouchableOpacity>
      {/* Item Đăng xuất */}
      <TouchableOpacity style={styles.item} onPress={handleLogout}>
        <Icon name="log-out" style={styles.icon_logout} />
        <Text style={styles.itemText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundColor,
    padding: 16,
    marginTop: 24,
    marginVertical: 30,
    marginHorizontal: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    height: 150,
    width: 150,
  },
  itemText: {
    marginTop: 8,
  },
  icon: {
    fontSize: 50,
    color: colors.primary,
  },
  icon_logout: {
    fontSize: 50,
    color: colors.dangerous,
  },
  icon_vip: {
    fontSize: 50,
    color: colors.vip,
  }
});

export default About;
