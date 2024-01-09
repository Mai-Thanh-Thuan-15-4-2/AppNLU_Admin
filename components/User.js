import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import { StringToDate, getAllUser, lockUser, unlockUser, addVip, deleteUser } from '../service/NLUAppApiCaller';
import { Dropdown } from 'react-native-element-dropdown';
import { colors, loadPage } from '../BaseStyle/Style';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUser } from '../service/NLUAppApiCaller';

var listUserFirst = [];
const User = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [userList, setUserList] = useState([]);
  // const [listUserFirst, setListUserFirst] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listOption, setListOption] = useState([]);
  const [selectedIdOption, setSelectedIdOption] = useState(0);
  const [isUserLocked, setIsUserLocked] = useState(null);
  const [isVip, setIsVip] = useState(null);
  const [vipDays, setVipDays] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchProfileData = async () => {
      const user = await getUser();
      setUser(user);
      console.log(user)
    };

    fetchProfileData();
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true)
      const data = await getAllUser();
      if (data != null) {
        setUserList(data);
        listUserFirst = [...data];
        // console.log(listUserFirst)
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

    fetchUserData();

  }, []);

  /* Dropdown */
  useEffect(() => {
    const data = [
      { id: 0, value: 'Tất cả' },
      { id: 1, value: 'Chỉ User' },
      { id: 2, value: 'Chỉ Manager' },
    ];
    setListOption(data);

    const formattedListOption = data.map(option => ({
      label: `${option.value}`,
      value: option.id,
    }));
    setListOption(formattedListOption)
  }, []);
  // console.log(listUserFirst)

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const openOptionsModal = (user) => {
    setSelectedUser(user);
    setIsUserLocked(user.nonLocked);
    setIsVip(user.vip);
    toggleModal();
  };

  const closeOptionsModal = () => {
    setSelectedUser(null);
    toggleModal();
  };


  const onRefresh = async () => {
    const data = await getAllUser();
    setRefreshing(true);
    if (data) {
      setUserList(data);
      listUserFirst = [...data];
      handleOptionChange(selectedIdOption);
    }
    setRefreshing(false);
  };

  const filteredUsers = userList.filter(user => user.user_name.includes(searchTerm.toLowerCase()));

  const sortedUsers = [...filteredUsers].sort((a, b) =>
    sortOrder === 'asc' ? a.user_name.localeCompare(b.user_name) : b.user_name.localeCompare(a.user_name)
  );

  //  Modal tùy chọn quản lí người dùng : khóa tk, xóa tk,...
  const handleOptionPress = (option) => {
    switch (option) {
      case 'Khóa tài khoản':
        Alert.alert(
          'Xác nhận',
         isUserLocked ? 'Bạn có chắc chắn muốn khóa tài khoản này?' : 'Bạn có chắc muốn mở khóa tài khoản này?',
          [
            {
              text: 'Quay lại',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                onLockAccount(selectedUser.user_name, isUserLocked);
              },
            },
          ],
          { cancelable: false }
        );
       
        break;
      case 'Thêm VIP':
        if (vipDays === '') {
          Toast.show({
            type: 'error',
            text1: 'Có lỗi xảy ra!',
            text2: 'Bạn chưa điền số ngày VIP',
            visibilityTime: 2000,
            autoHide: true,
          });
        }else{

          addVipAccount(selectedUser.user_name, selectedUser.vip, vipDays);
        }
        break;
      case 'Xóa tài khoản':
        Alert.alert(
          'Xác nhận',
          'Bạn có chắc chắn muốn xóa tài khoản này?',
          [
            {
              text: 'Quay lại',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                deleteAccount(selectedUser.user_name);
              },
            },
          ],
          { cancelable: false }
        );
       
        break;
      default:
        break;
    }
    closeOptionsModal();
  };
  const onLockAccount = async (userId, currentStatus) => {
    try {
      setUserList(prevData =>
        prevData.map(user =>
          user.user_name === userId ? { ...user, nonLocked: !currentStatus } : user
        )
      );
      if (currentStatus) {
        await lockUser(userId);
      } else {
        await unlockUser(userId);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  // lọc
  const filterUsers = async (role) => {
    const filteredUsers = [...listUserFirst].filter(user => user.role === role);
    setUserList(filteredUsers);
  }
  // thêm VIP
  const addVipAccount = async (userId, currentStatus, days) => {
    let expired_vip = addDaysToCurrentDate(parseInt(days));

        setUserList(prevData =>
          prevData.map(user =>
            user.user_name === userId ? {
              ...user,
              vip: !currentStatus,
              expired_vip_date: expired_vip,
            } : user
          )
        );

        await addVip(userId, days);
            setVipDays('')

  };
  function addDaysToCurrentDate(days) {
    const currentDate = new Date(); // Lấy ngày và giờ hiện tại
    const newDate = new Date(currentDate);


    newDate.setDate(currentDate.getDate() + days);

    const formattedDate = newDate.toISOString().split('T')[0] + ' ' + newDate.toTimeString().split(' ')[0];

    return formattedDate;
  }
  //  xóa TK
  const deleteAccount = async (userId) => {
 
    try {
      setUserList(prevData =>
        prevData.filter(user =>
          user.user_name !== userId)
      );
      await deleteUser(userId);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleOptionChange = (id) => {
    switch (id) {
      case 0:
        setSelectedIdOption(id);
        setUserList(listUserFirst);
        break;
      case 1:
        setSelectedIdOption(id);
        filterUsers('USER');
        break;
      case 2:
        setSelectedIdOption(id);
        filterUsers('MANAGER');
        break;
      default:
        // setSelectedIdOption(id);
        setUserList(listUserFirst);
        break;
    }
    setIsLoading(false);
  };

  const [expandedItem, setExpandedItem] = useState(null);

  const openOptionsModalUserItem = (item) => {
    setExpandedItem(item.user_name === expandedItem ? null : item.user_name);
  };
  function formatDateTime(inputString) {
    if (inputString === null) return null;
    const date = new Date(inputString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Tạo chuỗi định dạng "dd-mm-yyyy hh-mm-ss"
    const formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

    return formattedDateTime;
  }


  const renderItem = ({ item }) => {
    const isExpanded = (item.user_name === expandedItem);

    return (
      <TouchableOpacity style={styles.userListStyle} onPress={() => openOptionsModalUserItem(item)}>
        <View style={styles.userItem}>
          {item.vip === true ? (
            <Icon5 name='crown' style={[styles.expandedItemTextVip, styles.crown]} />
          ) : (
            <Icon5 name='crown' style={[styles.expandedItemTextVip, styles.crown, styles.crown_white]} />
          )}
          <View style={styles.circleContainer}>
            <Text style={styles.userItemText}>{item.user_name}</Text>

          </View>

          <View style={styles.circleContainer}>
            {item.nonLocked === true ? (
              <Text style={[styles.userItemText, styles.userItemTextNormal]}>{'Active'}</Text>
            ) : (
              <Text style={[styles.userItemText, styles.userItemTextBlock]}>{'Blocked'}</Text>
            )}

          </View>
          <View style={styles.circleContainer}>
            {item.role === 'Admin' ? (
              <Text style={[styles.userItemText, styles.userItemTextNormal]}>{item.role}</Text>
            ) : (
              <Text style={[styles.userItemText]}>{item.role}</Text>
            )}

          </View>
          <View>
            <TouchableOpacity onPress={() => openOptionsModal(item)} style={styles.optionsMenu}>
              <Text style={[{ fontWeight: 'bold' }]}>...</Text>
            </TouchableOpacity>

          </View>


        </View>
        {isExpanded && (

          <View style={styles.expandedInfo}>
            <Text style={styles.expandedItemText}>{`ID: ${item.user_name}`}</Text>
            <Text style={styles.expandedItemText}>{`Tên: ${item.name}`}</Text>
            <Text style={styles.expandedItemText}>{`Quyền hạn: ${item.role}`}</Text>
            <Text style={styles.expandedItemText}>{`Ngày hết hạn VIP: ${formatDateTime(item.expired_vip_date)}`}</Text>

          </View>
        )}
      </TouchableOpacity>
    );
  };



  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholderTextColor={"lightgray"}
        placeholder="Tìm kiếm theo MSSV"
        onChangeText={text => setSearchTerm(text)}
      />
      <View style={styles.containerChild}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          <Text>{`MSSV ${sortOrder === 'asc' ? 'tăng dần' : 'giảm dần'}`}</Text>
        </TouchableOpacity>
        <Dropdown
          style={styles.dropdown}
          data={listOption}
          labelField="label"
          valueField="value"
          placeholder="Tất cả"
          value={selectedIdOption}
          onChange={(item) => handleOptionChange(item.value)}
        />
      </View>
      {sortedUsers.length > 0 ? (
        <FlatList
          style={[{ marginTop: 20, marginBottom: 80 }]}
          data={sortedUsers}
          renderItem={renderItem}
          keyExtractor={item => item.user_name}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View>
          <FlatList
            style={[{ marginTop: 5, marginBottom: 120, marginLeft: 5, minHeight: 150 }]}
            data={sortedUsers}
            renderItem={renderItem}
            keyExtractor={item => item.user_name}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
          <Text style={styles.noDataText}>Không có dữ liệu</Text>
        </View>
      )}


      {/* Options Modal */}
      <Modal isVisible={isModalVisible}
        onBackdropPress={closeOptionsModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => handleOptionPress('Khóa tài khoản')} style={styles.modalOption}>
            <Icon name={!isUserLocked ? "lock-open" : "ios-lock-closed"} size={18} color="#333" style={styles.icon} />
            <Text style={styles.optionText}>{!isUserLocked ? "Mở khóa" : "Khóa tài khoản"}</Text>
          </TouchableOpacity>

          {isVip ? (
            <></>
          ) : (
            <View style={styles.modalOption}>
              <Icon name="ios-star" size={18} color={colors.vip} style={styles.icon} />
              <Text style={styles.optionText}>Thêm VIP</Text>
              <View style={styles.expandableContent}>
                <TextInput
                  style={styles.input}
                  placeholder="Số ngày"
                  placeholderTextColor={'lightgray'}
                  borderRadius={5}
                  keyboardType="numeric"
                  value={vipDays}
                  onChangeText={(text) => setVipDays(text.replace(/[^0-9]/g, ''))} // Chỉ cho phép nhập số
                />
                <TouchableOpacity style={styles.confirmButton} onPress={() => handleOptionPress('Thêm VIP')}>
                  <Text style={styles.buttonTxt}>Xác nhận</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}


          {user.role === "ADMIN" ? (
            <TouchableOpacity onPress={() => handleOptionPress('Xóa tài khoản')} style={[styles.modalOption, styles.noneBorderBottom]}>
              <Icon name="ios-trash" size={18} color={colors.dangerous} style={styles.icon} />
              <Text style={styles.optionText}>Xóa tài khoản</Text>
            </TouchableOpacity>
          ) : (<></>)}

        </View >
      </Modal >
      {
        isLoading ? (
          <View style={loadPage.loadingContainer} >
            <ActivityIndicator size="large" color="#2bc250" />
          </View>) : (<></>)
      }
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    padding: 10,
  },
  containerChild: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchInput: {
    height: 40,
    borderColor: colors.black,
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    width: '100%',
    borderRadius: 5,

    backgroundColor: 'white',
  },
  dropdown: {
    height: 40,
    width: '49%',
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 15,
    backgroundColor: 'white',
  },
  sortButton: {
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: '49%',
    borderWidth: 1,
    borderColor: colors.black,

    backgroundColor: 'white',
  },
  userListStyle: {
    flexDirection: 'column',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    width: '100%',

    backgroundColor: 'white',
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,

  },
  expandedInfo: {
    marginTop: 10,
    flexDirection: 'column',

    justifyContent: 'space-between',
  },
  expandedItemText: {
    fontSize: 14,
    paddingVertical: 5,
  },
  expandedItemTextVip: {
    color: colors.vip,
    fontWeight: 'bold',
  },
  userItemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userItemTextNormal: {
    color: colors.success,
  },
  userItemTextBlock: {
    color: colors.dangerous,
  },
  optionsMenu: {
    padding: 5,
    borderRadius: 5,
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  noneBorderBottom: { borderBlockColor: 'transparent' },
  icon: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
  },
  crown: {
    zIndex: 1000,
    top: 0,
    left: -2,
    color: colors.vip,
    fontSize: 20,
    transform: [{ rotate: '-10deg' }],
  },
  crown_white: {
    color: 'transparent',
  },
  circleContainer: {
    justifyContent: 'center',
    width: '20%',
    height: 40,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  expandableOption: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  expandableContent: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginLeft: 100,
    width: '30%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 8,
    padding: 8,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonTxt: {
    color: colors.white,
  },
  noDataText: {
    color: colors.primary,
    fontSize: 20,
    textAlign: 'center',
  },

});

export default User;
