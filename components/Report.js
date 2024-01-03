import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { getAllReport, LoginApi, getUserData } from '../service/NLUAppApiCaller';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';

const Report = () => {
  const [reportData, setReportData] = useState([
    {
      id: '1',
      message: 'App xấu quá',
      time: '00:00:00 01-01-2024',
      name: '20130127',
      status: 1
    },
    {
      id: '2',
      message: 'ljkdcskdsfkjdfchiờhcủhfikcreoihfkncreoihkfỉegdihv',
      time: '00:00:00 01-01-2024',
      name: '20130125',
      status: 0
    },
    {
      id: '3',
      message: 'Những suy nghĩ, tình cảm của con người đều tồn tại ở dạng trừu tượng bởi vậy, khó có thể biết được những phẩm chất tốt của con người thông qua suy nghĩ, tình cảm của họ. Hành động chính là thước đo chân thực của mọi phẩm chất tốt đẹp. - Mặt khác, nếu có những suy nghĩ, tình cảm tốt đẹp mà chỉ giữ trong lòng, hoặc nói suông không thể hiện ra bằng hành động thì đó chỉ là sự huyễn hoặc người khác và tự huyễn hoặc bản thân về phẩm chất tốt của mình. VD: một bộ phận giới trẻ là những “anh hùng bàn phím” trên các rang mạng xã hội, chỉ biết nói những diều hay nhưng thực tế lại không thực hiện.',
      time: '00:00:00 01-01-2024',
      name: '20130120',
      status: 1
    },
  ]);
  const dataSort = [
    { label: 'Mới nhất', value: '1' },
    { label: 'Cũ nhất', value: '2' },
  ];
  const dataFilter = [
    { label: 'Đánh dấu', value: '1' },
    { label: 'Không đánh dấu', value: '2' },
  ];
  const [sortBy, setSortBy] = useState('');
  const [filterBy, setFilterBy] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleFilterChange = (value) => {
    setFilterBy(value);
  };
  const toggleStatus = (itemId) => {
    // setReportData(prevData =>
    //   prevData.map(item =>
    //     item.id === itemId ? { ...item, status: item.status === 1 ? 0 : 1 } : item
    //   )
    // );
  };
  const truncateText = (text, limit, charLimit) => {
    if (text.length > charLimit) {
      return text.slice(0, charLimit) + '...';
    } else if (text.split(' ').length > limit) {
      return text.split(' ').slice(0, limit).join(' ') + '...';
    }
    return text;
  };
  
  
  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };
  const handleDelete = (itemId) => {
      Alert.alert(
        "Xác nhận xóa",
        "Bạn có chắc chắn muốn xóa báo cáo này không?",
        [
          {
            text: "Hủy",
            style: "cancel"
          },
          {
            text: "Xóa",
          }
        ]
      );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => {
      setSelectedItem(item);
      setModalVisible(true);
    }}>
      <View style={styles.item}>
      <View style={styles.headReport}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <View style={styles.footReport}>
        <Text style={styles.messShort}>{truncateText(item.message, 5, 25)}</Text>
        <View style={styles.statusContainer}>
        <TouchableOpacity onPress={() => toggleStatus(item.id)}>
            <Icon
              name={item.status === 1 ? 'star' : 'star-outline'}
              size={22}
              color={item.status === 1 ? 'gold' : 'gray'}
            />
          </TouchableOpacity>
          <Text>   </Text>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Icon
              name={'trash-outline'}
              size={22}
              color={'red'}
            />
          </TouchableOpacity>
        </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={{ paddingHorizontal: 10 }}>
      <TextInput
        style={styles.input}
        placeholder="Tìm kiếm..."
      />
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
      <FlatList
      style={styles.FlatList}
        data={reportData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
       <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
    <TouchableOpacity
    style={styles.centeredView}
    activeOpacity={1}
    onPress={closeModal}>
          <View style={styles.modalView}>
            {selectedItem && (
              <View>
                <Text style={styles.titleModal}>Thông tin chi tiết</Text>
                <View style={styles.modalCont}>
                <View style={styles.row}>
                <Icon style={styles.label} name='person-circle-outline' size={25}></Icon><Text>  </Text><Text style={styles.nameuser}>{selectedItem.name}</Text>
                </View>
                <View style={styles.row}>
                <Icon style={styles.label} name='time-outline' size={25}></Icon><Text>  </Text><Text style={styles.nameuser}>{selectedItem.time}</Text>
                </View>
                <View style={styles.contentDetail}>
                <Text style={styles.mess}>{selectedItem.message}</Text>
                </View>
                </View>
                <TouchableOpacity style={styles.btnClose} onPress={closeModal}>
                <Text style={styles.back}>Quay lại</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    marginTop: 5,
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
    marginTop: 5,
    backgroundColor: 'white',
  },
  FlatList:{
  margin: 5,
  },
  statusContainer: {
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  time:{
    color: 'gray',
  },
  name: {
   fontWeight: 'bold',
   fontSize: 16,
   color: 'blue',
  },
  mess:{
   textAlign: 'justify',
   padding: 5,
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
  titleModal:{
    marginTop: 5,
    color: 'blue',
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
  },
  modalCont:{
    marginTop: 10,
  },
  row:{
    marginTop: 10,
    flexDirection: 'row', 
  },
  label:{
    color: '#0E5454',
    fontWeight: 'bold',
  },
  contentDetail:{
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'gray', 
    borderRadius: 5, 
  },
  messShort:{
    marginTop: 5,
  },
  nameuser:{
   marginTop: 5,
  },

});

export default Report;
