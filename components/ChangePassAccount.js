
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { colors } from '../BaseStyle/Style';
import { changePassword } from '../service/NLUAppApiCaller';

const ChangePassAccount = ({ navigation }) => {
    const [password, setPassword] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const handleChangePass = async () => {

        if (password === '' || newPass === '' || confirmPassword === '') {
            alert('Vui lòng nhập đầy đủ thông tin!!!');
            return;
        }

        if (newPass !== confirmPassword) {
            alert('Mật khẩu nhập lại không khớp!');
            return;
        }
        const message = await changePassword(password, newPass, confirmPassword)
        if (message) {
            alert("Đổi mật khẩu thành công ^^");
        } else {
            alert("Đổi mật khẩu không thành công :(")
        }
        setPassword('');
        setNewPass('');
        setConfirmPassword('');

    };
    return (

        <View style={styles.centeredModal}>

            <TextInput
                placeholder="Mật khẩu hiện tại"
                placeholderTextColor={"#ccc"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.inputStyle}
            />
            <TextInput
                placeholder="Mật khẩu mới"
                placeholderTextColor={"#ccc"}
                value={newPass}
                onChangeText={setNewPass}
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
            <TouchableOpacity onPress={handleChangePass} style={styles.modalAddBtn}>
                <Text style={styles.buttonAddAccount}>Đổi Mật Khẩu</Text>
            </TouchableOpacity>

        </View>

    );
};

const styles = StyleSheet.create({
    centeredModal: {
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noneBorderBottom: { borderBlockColor: 'transparent' },
    inputStyle: {
        padding: 10,
        margin: 10,
        borderWidth: 1,
         borderColor: '#000',
        width: '90%',
         height: 50,
        borderRadius: 5,
    },
    modalAddBtn: {
        backgroundColor: colors.primary,
        padding: 15, margin: 14,
         borderRadius: 5,
          width: 150,
    },
    buttonAddAccount: {
        color: 'white',
         textAlign: 'center',
    },
});

export default ChangePassAccount;
