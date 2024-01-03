import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Statistic = () => {
  const [accountStats, setAccountStats] = useState({
    lockedAccounts: 0,
    regularUsers: 0,
    admins: 0,
    totalUsers: 0,
    totalAccounts: 0,
  });

  useEffect(() => {
    // Lấy dữ liệu thống kê từ API hoặc lưu trữ
    // Thông thường bạn sẽ gọi API ở đây và cập nhật state dựa trên dữ liệu trả về
    // Ví dụ: fetchDataAndSetStats();
  }, []);

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
        <Text style={styles.gridItemText}>Người dùng admin: {accountStats.admins}</Text>
      </View>

      <View style={[styles.gridItem, { backgroundColor: '#f39c12' }]}>
        <Text style={styles.gridItemText}>Tổng số người dùng: {accountStats.totalUsers}</Text>
      </View>

      <View style={[styles.gridItem, { backgroundColor: '#9b59b6' }]}>
        <Text style={styles.gridItemText}>Tổng số tài khoản: {accountStats.totalAccounts}</Text>
      </View>
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
    width: '48%', // Cho hai cột, bạn có thể điều chỉnh theo nhu cầu
    aspectRatio: 1, // Đảm bảo tỷ lệ giữa chiều rộng và chiều cao là 1:1
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
  },
  gridItemText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Statistic;
