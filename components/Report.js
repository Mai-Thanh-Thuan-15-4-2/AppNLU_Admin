import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Alert, Text, View, FlatList, StyleSheet, TextInput, PanResponder, TouchableOpacity, ActivityIndicator, Animated, Dimensions } from 'react-native';
import { getAllReport, readReport, getAllUser, grantStarReport, rmStarReport, deleteReport } from '../service/NLUAppApiCaller';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';
import { loadPage } from '../BaseStyle/Style';
import Toast from 'react-native-toast-message';


function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}
const Report = () => {
  const [sortBy, setSortBy] = useState('');
  const [filterBy, setFilterBy] = useState('');
  const [reportData, setReportData] = useState([]);
  const [users, setUsers] = useState([]);
  const [general, setGeneral] = useState([]);
  const pan = useRef(new Animated.ValueXY()).current;
  const [itemToDelete, setItemToDelete] = useState(null);
  const panValues = useRef([]).current;
  const [showFullContentMap, setShowFullContentMap] = useState({});
  const [filteredGeneralData, setFilteredGeneralData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isLoading, setIsLoading] = useState(false);

  const createPanResponder = (index) => {
    return PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        panValues[index].setValue({ x: gestureState.dx, y: 0 });
      },
      onPanResponderRelease: async (_, gesture) => {
        if (gesture.dx < -200 || gesture.dx > 200) {
          if (gesture.dx < -200) {
            handleDeleteConfirmation(index);
          }
          Animated.spring(panValues[index], {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false
          }).start();
        } else {
          Animated.spring(panValues[index], {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false
          }).start();
        }
      }
    });
  };
  const handleDeleteConfirmation = async (index) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa báo cáo này?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
          onPress: () => {},
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              const idToDelete = general[index].id;
              const message = await deleteReport(idToDelete);
              const updateReportData = [...reportData];
              const updatedGeneral = [...general];
              const updatefilterData = [...general];
              updateReportData.splice(index, 1);
              updatedGeneral.splice(index, 1);
              updatefilterData.splice(index, 1);
              setFilteredGeneralData(updatefilterData);
              setGeneral(updatedGeneral);
              setReportData(updateReportData);
              panValues.splice(index, 1);
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Có lỗi xảy ra!',
                text2: 'Không thể lấy dữ liệu',
                visibilityTime: 2000,
                autoHide: true,
              });
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUser();
        setUsers(fetchedUsers);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Có lỗi xảy ra!',
          text2: 'Không thể lấy dữ liệu',
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    };

    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const fetchedReports = await getAllReport();
        setReportData(fetchedReports);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Có lỗi xảy ra!',
          text2: 'Không thể lấy dữ liệu',
          visibilityTime: 2000,
          autoHide: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
    fetchReports();
  }, []);

  useEffect(() => {
    if (reportData && users) {
      const combinedData = reportData.map(report => {
        const user = users.find(user => user.user_name === report.idReporter);
        const name = user ? user.name : null;
        return { ...report, name };
      });
      setGeneral(combinedData);
      const filteredData = () => {
        switch (filterBy.value) {
          case '1':
            return combinedData;
          case '2':
            return combinedData.filter(item => item.star === true);
          case '3':
            return combinedData.filter(item => item.star === false);
          case '4':
            return combinedData.filter(item => item.read === false);
          case '5':
            return combinedData.filter(item => item.read === true);
          default:
            return combinedData;
        }
      };

      const sortedData = () => {
        switch (sortBy.value) {
          case '1':
            return filteredData();
          case '2':
            return [...filteredData()].sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
          case '3':
            return [...filteredData()].sort((a, b) => new Date(a.createDate) - new Date(b.createDate));
          default:
            return filteredData();
        }
      };

      const filteredDataResult = sortedData();
      setFilteredGeneralData(filteredDataResult);
    }
  }, [users, reportData, filterBy, sortBy]);

  const dataSort = [
    { label: 'Mặc định', value: '1' },
    { label: 'Mới nhất', value: '2' },
    { label: 'Cũ nhất', value: '3' },
  ];
  const dataFilter = [
    { label: 'Mặc định', value: '1' },
    { label: 'Đánh dấu', value: '2' },
    { label: 'Không đánh dấu', value: '3' },
    { label: 'Chưa xem', value: '4' },
    { label: 'Đã xem', value: '5' },
  ];
  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleFilterChange = (value) => {
    setFilterBy(value);
  };
  const toggleStatus = async (itemId, currentStatus) => {
    try {
      setReportData(prevData =>
        prevData.map(item =>
          item.id === itemId ? { ...item, star: !currentStatus } : item
        )
      );
      if (currentStatus) {
        await rmStarReport(itemId);
      } else {
        await grantStarReport(itemId);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Có lỗi xảy ra!',
        text2: 'Không thể lấy dữ liệu',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };
  const toggleContent = async (itemId, currentStatus) => {
    try {
      if (!currentStatus) {
        setReportData(prevData =>
          prevData.map(item =>
            item.id === itemId ? { ...item, read: true } : item
          )
        );
        await readReport(itemId);
      }
      setShowFullContentMap(prevState => ({
        ...prevState,
        [itemId]: !prevState[itemId],
      }));
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Có lỗi xảy ra!',
        text2: 'Không thể lấy dữ liệu',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  const truncateText = (text, itemId) => {
    if (!showFullContentMap[itemId]) {
      if (text.length > 25) return text.slice(0, 25) + '...';
    }
    return text;
  };

  const renderItem = ({ item, index }) => {
    if (!panValues[index]) {
      panValues[index] = new Animated.ValueXY();
    }
    const { width: screenWidth } = Dimensions.get('window');
    return (
      <SafeAreaView style={{ flex: 1, marginTop: 5 }}>
        <Animated.View
          style={{
            transform: [{ translateX: panValues[index].x }],
          }}
          {...createPanResponder(index).panHandlers}
        >
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{ width: screenWidth - 30, marginRight: 5 }} onPress={() => {
              toggleContent(item.id, item.read);
            }}>
              <View style={styles.item}>
                <View style={styles.headReport}>
                  <Text style={styles.name}>{item.name ? item.name : "Admin"}</Text>
                  <Text style={styles.time}>{formatDateTime(item.createDate)}</Text>
                </View>
                <View style={styles.footReport}>
                  <Text style={item.read ? styles.havenotseen : styles.messShort}>
                    {truncateText(item.message, item.id)}
                  </Text>
                  <View style={styles.statusContainer}>
                    <TouchableOpacity onPress={() => toggleStatus(item.id, item.star)}>
                      <Icon
                        name={item.star === true ? 'star' : 'star-outline'}
                        size={22}
                        color={item.star === true ? 'gold' : 'gray'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: 'red', width: screenWidth * 0.5, marginTop: 5, justifyContent: 'center', height: '92%' }} onPress={() => handleDeleteConfirmation(index)}>
              <Icon style={styles.btnrm} name={'trash-outline'} size={22} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  };
  const handleSearch = (text) => {
    setSearchTerm(text);
    const filteredData = reportData.filter(item => item.message.toLowerCase().includes(text.toLowerCase()));
    const sortedData = [...filteredData].sort((a, b) =>
      sortOrder === 'asc' ? a.message.localeCompare(b.message) : b.message.localeCompare(a.message)
    );
    setFilteredGeneralData(sortedData);
  };
  const reloadPage = async () => {
    try {
      setIsLoading(true);
      const fetchedReports = await getAllReport();
      setReportData(fetchedReports);
      setFilteredGeneralData(fetchedReports);
      setGeneral(fetchedReports);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Có lỗi xảy ra!',
        text2: 'Không thể cập nhật dữ liệu',
        visibilityTime: 2000,
        autoHide: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ paddingHorizontal: 10 }}>
      <View style={{ flexDirection: 'row' }}>
        <TextInput
          style={styles.input}
          placeholder="Tìm kiếm..."
          placeholderTextColor={"lightgray"}
          value={searchTerm}
          onChangeText={handleSearch}
        />
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={reloadPage}
        >
          <Icon name="ios-refresh" size={30} style={{ marginTop: 5 }} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.dropdownContainer}>
        <Dropdown
          style={styles.dropdown}
          data={dataSort}
          labelField="label"
          valueField="value"
          placeholder="Sắp xếp"
          value={sortBy}
          onChange={handleSortChange}
        />
        <Dropdown
          style={styles.dropdown}
          data={dataFilter}
          labelField="label"
          valueField="value"
          placeholder="Lọc"
          value={filterBy}
          onChange={handleFilterChange}
        />
      </View>
      {
        isLoading ? (
          <View style={loadPage.loadingContainer} >
            <ActivityIndicator size="large" color="#2bc250" />
          </View>) : (<></>)
      }
      {filteredGeneralData.length > 0 ? (

        <FlatList
          style={[{ marginTop: 5, marginBottom: 120, marginLeft: 5 }]}
          data={filteredGeneralData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text style={styles.noDataText}>Không có dữ liệu</Text>
      )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    marginTop: 5,
    width: '90%',
    borderRadius: 5,
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dropdown: {
    backgroundColor: 'white',
    marginTop: 5,
    width: '45%',
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    backgroundColor: 'white',
  },
  statusContainer: {
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  time: {
    color: 'gray',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'blue',
  },
  headReport: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  footReport: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: '80%',
    maxWidth: '90%',
    maxHeight: '70%',
  },
  btnClose: {
    marginTop: 20,
    width: 100,
    height: 40,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
  },
  back: {
    color: 'white',
  },
  titleModal: {
    marginTop: 5,
    color: '#0D1282',
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
  },
  modalCont: {
    marginTop: 10,
  },
  row: {
    marginTop: 10,
    flexDirection: 'row',
  },
  label: {
    color: '#0D1282',
    fontWeight: 'bold',
  },
  mess: {
    textAlign: 'justify',
    padding: 5,
    fontSize: 13,
  },
  contentDetail: {
    marginTop: 10,
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
  messShort: {
    marginTop: 5,
    width: '80%',
    fontWeight: 'bold',
    textAlign: 'justify'
  },
  havenotseen: {
    marginTop: 5,
    width: '80%',
    color: 'gray',
    textAlign: 'justify'
  },
  nameuser: {
    marginTop: 5,
    fontWeight: 'bold',
    color: '#00CC03',

  },
  containerLabel: {
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContent: {
    fontWeight: 'bold',
    color: '#0D1282'
  },
  btnrm: {
    marginLeft: 10,
    color: 'white',
  },
  timedetail: {
    marginTop: 5,
    color: 'gray',
  },
  noDataText: {
    marginTop: 100,
    color: '#0D1282',
    fontSize: 20,
    textAlign: 'center',
    alignSelf: 'center',
  },
  refreshButton: {
    marginLeft: 5,
  },
});

export default Report;
