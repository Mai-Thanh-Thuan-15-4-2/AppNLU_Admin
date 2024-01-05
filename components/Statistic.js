import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import { StringToDate, getAllUser, lockUser, unlockUser, addVip, addManager } from '../service/NLUAppApiCaller';
import { Dropdown } from 'react-native-element-dropdown';
import { colors, loadPage } from '../BaseStyle/Style';
import Toast from 'react-native-toast-message';

const Statistic = () => {
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [accountStats, setAccountStats] = useState({
    lockedAccounts: 0,
    regularUsers: 0,
    admins: 0,
    totalUsers: 0,
    totalAccounts: 0,
  });

  useEffect(() => {

    const fetchDataAndSetStats = async () => {
      setIsLoading(true)
      const data = await getAllUser();
      if (data.length > 0) {
        setUserList(data);
        setAccountStats({
          lockedAccounts: userList.filter(user => user.non_locked === true).length,
          regularUsers: userList.filter(user => user.vip === false).length,
          admins: userList.filter(user => user.role === 'MANAGER').length,
          totalUsers: data.length,
          totalAccounts: data.length,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Có lỗi xảy ra!',
          text2: 'Không thể lấy dữ liệu từ trang ĐKMH',
          visibilityTime: 2000,
          autoHide: true,
        });
      }
      setIsLoading(false)

    };

    fetchDataAndSetStats();
  }, []);
  const handleAddAccountPress = () => {
    navigation.navigate('AddAccount');
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const closeOptionsModal = () => {
    setName('');
    setConfirmPassword('');
    setPassword('');
    toggleModal();
  };

  const handleAddAccount = async () => {
    console.log(name)
    console.log(username)
    console.log(password)
    console.log(confirmPassword)
    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
    await addManager(username, password, name)
    alert('Thêm tài khoản thành công!');
    toggleModal();
  };

  return (
    <View style={styles.container}>
      {/* Grid items */}
      <View style={[styles.gridItem, { backgroundColor: '#3498db' }]}>
        <Text style={styles.gridItemText}>Tài khoản bị khóa: {accountStats.lockedAccounts}</Text>
      </View>

      <View style={[styles.gridItem, { backgroundColor: '#2ecc71' }]}>
        <Text style={styles.gridItemText}>Người dùng thường: {accountStats.regularUsers}</Text>
      </View>

      <View style={[styles.gridItem, { backgroundColor: '#e74c3c' }]}>
        <Text style={styles.gridItemText}>Người dùng MANAGER: {accountStats.admins}</Text>
      </View>

      <View style={[styles.gridItem, { backgroundColor: '#f39c12' }]}>
        <Text style={styles.gridItemText}>Tổng số người dùng: {accountStats.totalUsers}</Text>
      </View>

      <View style={[styles.gridItem, { backgroundColor: '#9b59b6' }]}>
        <Text style={styles.gridItemText}>Tổng số tài khoản: {accountStats.totalAccounts}</Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        isVisible={isModalVisible}
        onBackdropPress={closeOptionsModal}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center'  }}>
            <TextInput
              placeholder="Tên người dùng"
              value={name}
              onChangeText={setName}
              style={styles.inputStyle}
            />
             <TextInput
              placeholder="Tên đăng nhập"
              value={username}
              onChangeText={setUsername}
              style={styles.inputStyle}
            />
            <TextInput
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.inputStyle}
            />
            <TextInput
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={styles.inputStyle}
            />
            <TouchableOpacity onPress={handleAddAccount} style={{ backgroundColor: colors.primary, padding: 10, borderRadius: 5, width: 150 }}>
              <Text style={{ color: 'white', textAlign: 'center' }}>Thêm Tài Khoản</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {
        isLoading ? (
          <View style={loadPage.loadingContainer} >
            <ActivityIndicator size="large" color="#2bc250" />
          </View>) : (<></>)
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  gridItem: {
    width: '48%', 
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
  },
  gridItemText: {
    color: 'white',
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
    width: 50,
    height:50,
    alignItems: 'center', 
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputStyle:{
    marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc', width: 250,
  },
});

export default Statistic;
