
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { colors, loadPage } from '../BaseStyle/Style'
import { addManager } from '../service/NLUAppApiCaller';

const AddAccountManager = ({ navigation }) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');



    const handleAddAccount = async () => {

        if (name === '' || username === '' || password === '' || confirmPassword === '') {
            alert('Vui lòng nhập đầy đủ thông tin!!!');
            return;
        }
        if (password !== confirmPassword) {
            alert('Mật khẩu không khớp!');
            return;
        }
        await addManager(username, password, name)
        alert('Thêm tài khoản thành công!');
        setName('');
        setUsername('');
        setConfirmPassword('');
        setPassword('');
        // setAccountStats({
        //   ...accountStats,
        //   admins: userList.filter(user => user.role === 'MANAGER').length + 1,
        //   totalUsers: userList.length + 1,
        //   totalAccounts: userList.length + 1,
        // });

        // toggleModal();
    };
    return (


        <View style={styles.centeredModal}>

            <TextInput
                placeholder="Tên người dùng"
                placeholderTextColor={"#ccc"}
                value={name}
                onChangeText={setName}
                style={styles.inputStyle}
            />
            <TextInput
                placeholder="Tên đăng nhập"
                placeholderTextColor={"#ccc"}
                value={username}
                onChangeText={setUsername}
                style={styles.inputStyle}
            />
            <TextInput
                placeholder="Mật khẩu"
                placeholderTextColor={"#ccc"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.inputStyle}
            />
            <TextInput
                placeholder="Nhập lại mật khẩu"
                placeholderTextColor={"#ccc"}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.inputStyle}
            />
            <TouchableOpacity onPress={handleAddAccount} style={styles.modalAddBtn}>
                <Text style={styles.buttonAddAccount}>Thêm</Text>
            </TouchableOpacity>

        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    // modal
    containerModal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {

        fontSize: 18, fontWeight: 'bold',
        paddingHorizontal: 0,

    },
    modal: {
        backgroundColor: '#fff',
        // width: 200,
        // overflow:'hidden',
    },
    centeredModal: {
       
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noneBorderBottom: { borderBlockColor: 'transparent' },
    inputStyle: {
        padding: 10,
        margin: 10,
        borderWidth: 1, borderColor: '#000',
        width: '90%', height: 50,
         borderRadius: 5,
    },
    modalAddBtn: { backgroundColor: colors.primary, padding: 15, margin: 14, borderRadius: 5, width: 100, },
    buttonAddAccount: {
        color: 'white', textAlign: 'center',
        borderBlockColor: 'transparent',
    },

});

export default AddAccountManager;
