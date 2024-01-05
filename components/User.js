import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import { StringToDate, getAllUser, lockUser, unlockUser } from '../service/NLUAppApiCaller';
import { Dropdown } from 'react-native-element-dropdown';
import { colors, loadPage } from '../BaseStyle/Style';



const User = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [listOption, setListOption] = useState([]);
  const [selectedIdOption, setSelectedIdOption] = useState(null);
  const [isUserLocked, setIsUserLocked] = useState(false);


  // const userData = [
  //   { mssv: '001', status: 'Active', role: 'User' },
  //   { mssv: '002', status: 'Blocked', role: 'Admin' },
  //   { mssv: '003', status: 'Active', role: 'User' },
  //   { mssv: '004', status: 'Active', role: 'User' },
  //   // Add more user data as needed
  // ];


  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true)
      const data = await getAllUser();
      console.log(data)

      if (data.length > 0) {
        setUserList(data);
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



  const filteredUsers = userList.filter(user => user.user_name.includes(searchTerm.toLowerCase()));

  const sortedUsers = [...filteredUsers].sort((a, b) =>
    sortOrder === 'asc' ? a.user_name.localeCompare(b.user_name) : b.user_name.localeCompare(a.user_name)
  );

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const openOptionsModal = (user) => {
    setSelectedUser(user);
    toggleModal();
  };

  const closeOptionsModal = () => {
    setSelectedUser(null);
    toggleModal();
  };
  const onLockAccount = (user) => {
    if (user.non_locked) {
      console.log("khóa" + user.user_name)

      // lockUser(user.user_name);
      setIsUserLocked(true);
    } else {
      console.log(" mở khóa" + user.user_name)
      // unlockUser(user.user_name);
      setIsUserLocked(false);
    }
  };
  const addVip = (user) => {
    console.log("thêm VIP")
  };
  const deleteUser = (user) => {
    console.log("xóa")
  };

  const handleOptionPress = (option) => {
    switch (option) {
      case 'Khóa tài khoản':
        onLockAccount(selectedUser); // Gọi hàm xử lý khóa tài khoản và truyền thông tin người dùng cần khóa
        break;
      case 'Thêm VIP':
        addVip(selectedUser);
        break;
      case 'Xóa tài khoản':
        deleteUser(selectedUser);
        break;
      default:
        break;
    }
    closeOptionsModal();
  };
  const handleOptionChange = async (id) => {
    // selectedIdOption(id);
    // setIsLoading(true);
    // gọi hàm lọc theo id 
    console.log(id);
    // setIsLoading(false)
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
          <Text style={styles.userItemText}>{item.user_name}</Text>

          {item.nonLocked === true ? (
            <Text style={[styles.userItemText, styles.userItemTextNormal]}>{'Active'}</Text>
          ) : (
            <Text style={[styles.userItemText, styles.userItemTextBlock]}>{'Blocked'}</Text>
          )}

          {item.role === 'Admin' ? (
            <Text style={[styles.userItemText, styles.userItemTextNormal]}>{item.role}</Text>
          ) : (
            <Text style={[styles.userItemText]}>{item.role}</Text>
          )}
          <TouchableOpacity onPress={() => openOptionsModal(item)} style={styles.optionsMenu}>
            <Text style={[{ fontWeight: 'bold' }]}>...</Text>
          </TouchableOpacity>
        </View>
        {isExpanded && (

          <View style={styles.expandedInfo}>
            <Text style={styles.expandedItemText}>{`Tên tài khoản: ${item.name}`}</Text>
            <Text style={styles.expandedItemText}>{`Ngày hết hạn VIP: ${formatDateTime(item.expired_vip_date)}`}</Text>
            {item.vip === true ? (
              <Text style={styles.expandedItemTextVip}>{` ${'VIP'}`}</Text>
            ) : (
              <Text style={styles.expandedItemText}>{`Tài khoản: ${'Thường'}`}</Text>
            )}
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
      <FlatList
        data={sortedUsers}
        renderItem={renderItem}
        keyExtractor={item => item.user_name}
      />

      {/* Options Modal */}
      <Modal isVisible={isModalVisible} onBackdropPress={closeOptionsModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => handleOptionPress('Khóa tài khoản')} style={styles.modalOption}>
            <Icon name={isUserLocked ? "ios-unlock" : "ios-lock-closed"} size={18} color="#333" style={styles.icon} />
            <Text style={styles.optionText}>{isUserLocked  ? "Mở khóa" : "Khóa tài khoản"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOptionPress('Thêm VIP')} style={styles.modalOption}>
            <Icon name="ios-star" size={18} color="#333" style={styles.icon} />
            <Text style={styles.optionText}>Thêm VIP</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOptionPress('Xóa tài khoản')} style={[styles.modalOption, styles.noneBorderBottom]}>
            <Icon name="ios-trash" size={18} color="#333" style={styles.icon} />
            <Text style={styles.optionText}>Xóa tài khoản</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* {isLoading ? (
        <View style={loadPage.loadingContainer}>
          <ActivityIndicator size="large" color="#2bc250" />
        </View>) : (<></>)
      } */}
    </View>
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
  },
  userListStyle: {
    flexDirection: 'column',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,

    marginBottom: 10,
    padding: 10,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  expandedInfo: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  expandedItemText: {
    fontSize: 14,
    paddingVertical: 5,
  },
  expandedItemTextVip: {
    color: colors.vip,
    fontWeight: 'bold',
    fontSize: 20,
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
  noneBorderBottom: { borderBlockColor: 'transparent', },
  icon: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
  },

});

export default User;
