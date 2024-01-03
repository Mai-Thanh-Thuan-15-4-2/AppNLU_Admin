import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation, userRole }) => {
  const [isAdmin] = useState(userRole === 'admin');

  const handleAddAccountPress = () => {
    navigation.navigate('AddAccount');
  };

  return (
    <View style={styles.container}>
      {/* Nội dung trang chủ ở đây */}

      {/* Nút thêm tài khoản */}
      {/* {isAdmin && ( */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddAccountPress}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      {/* )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Rest of your styles
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'blue',
    padding: 16,
    borderRadius: 30, // Nếu bạn muốn nút tròn
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
