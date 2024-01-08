import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getAllUser, getAllReport } from '../service/NLUAppApiCaller';
import { colors, loadPage } from '../BaseStyle/Style';
import Toast from 'react-native-toast-message';

const Statistic = () => {
  const [userList, setUserList] = useState([]);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const [accountStats, setAccountStats] = useState({
    lockedAccounts: 0,
    regularUsers: 0,
    admins: 0,
    totalAccounts: 0,
  });

  useEffect(() => {
    const fetchDataAndSetStats = async () => {
      setIsLoading(true)
      const data = await getAllUser();
      if (data.length > 0) {
        setUserList(data);
        setAccountStats({
          lockedAccounts: data.filter(user => user.non_locked === false).length,
          regularUsers: data.filter(user => user.vip === false).length,
          admins: data.filter(user => user.role === 'MANAGER').length,
          totalAccounts: data.length
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Có lỗi xảy ra!',
          text2: 'Không thể lấy dữ liệu',
          visibilityTime: 2000,
          autoHide: true,
        });
      }
      setIsLoading(false)

    };

    fetchDataAndSetStats();
  }, []);
  useEffect(() => {
    getAllReport()
      .then((data) => {
        setReports(data);
      })
      .catch((error) => {
        Toast.show({
          type: 'error',
          text1: 'Có lỗi xảy ra!',
          text2: 'Không thể lấy dữ liệu',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  }, []);
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const reportStats = {
    totalReports: reports.length,
    starredReports: reports.filter(report => report.star).length,
    unreadReports: reports.filter(report => !report.read).length,
    newReportsThisWeek: reports.filter(report => new Date(report.createDate) >= oneWeekAgo).length
  };

  return (
    <>
      <View style={styles.container}>
        {/* Grid items */}
        <View style={[styles.gridItem, { backgroundColor: '#3498db' }]}>
          <Text style={styles.gridItemText}>Tài khoản bị khóa </Text>
          <Text style={[styles.gridItemText, { textAlign: 'right', fontSize: 20, fontWeight: 'bold' }]}>{accountStats.lockedAccounts}</Text>
        </View>
        <View style={[styles.gridItem, { backgroundColor: '#2ecc71' }]}>
          <Text style={styles.gridItemText}>Người dùng thường </Text>
          <Text style={[styles.gridItemText, { textAlign: 'right', fontSize: 20, fontWeight: 'bold' }]}>{accountStats.regularUsers}</Text>
        </View>
        <View style={[styles.gridItem, { backgroundColor: '#e74c3c' }]}>
          <Text style={styles.gridItemText}>Người dùng MANAGER </Text>
          <Text style={[styles.gridItemText, { textAlign: 'right', fontSize: 20, fontWeight: 'bold' }]}>{accountStats.admins}</Text>
        </View>
        <View style={[styles.gridItem, { backgroundColor: '#f39c12' }]}>
          <Text style={styles.gridItemText}>Tổng số người dùng </Text>
          <Text style={[styles.gridItemText, { textAlign: 'right', fontSize: 20, fontWeight: 'bold' }]}>{accountStats.totalAccounts}</Text>
        </View>

        <View style={{ height: 2, backgroundColor: '#03116e', width: '100%', marginBottom: 30, marginTop: 20 }} />

        <View style={[styles.gridItem, { backgroundColor: '#3498db' }]}>
          <Text style={styles.gridItemText}>Báo cáo tuần này</Text>
          <Text style={[styles.gridItemText, { textAlign: 'right', fontSize: 20, fontWeight: 'bold' }]}>{reportStats.newReportsThisWeek}</Text>
        </View>

        <View style={[styles.gridItem, { backgroundColor: '#2ecc71' }]}>
          <Text style={styles.gridItemText}>Báo cáo chưa đọc</Text>
          <Text style={[styles.gridItemText, { textAlign: 'right', fontSize: 20, fontWeight: 'bold' }]}>{reportStats.unreadReports}</Text>
        </View>

        <View style={[styles.gridItem, { backgroundColor: '#e74c3c' }]}>
          <Text style={styles.gridItemText}>Báo cáo quan trọng</Text>
          <Text style={[styles.gridItemText, { textAlign: 'right', fontSize: 20, fontWeight: 'bold' }]}>{reportStats.starredReports}</Text>
        </View>

        <View style={[styles.gridItem, { backgroundColor: '#f39c12' }]}>
          <Text style={styles.gridItemText}>Tổng số báo cáo </Text>
          <Text style={[styles.gridItemText, { textAlign: 'right', fontSize: 20, fontWeight: 'bold' }]}>{reportStats.totalReports}</Text>
        </View>
      </View>
      {
        isLoading ? (
          <View style={loadPage.loadingContainer} >
            <ActivityIndicator size="large" color="#2bc250" />
          </View>) : (<></>)
      }
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  container2: {
    marginTop: -200,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
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
    height: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },

});

export default Statistic;
