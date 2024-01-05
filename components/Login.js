import React, { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { Text, StyleSheet, View, Image, TextInput, BackHandler, TouchableWithoutFeedback, Keyboard, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LoginApi } from '../service/NLUAppApiCaller';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../BaseStyle/Style.js';

export default function Login({ navigation }) {
    var isBack = false;
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const backAction = () => {
            if (isBack) BackHandler.exitApp();
            else {
                isBack = true;
                Toast.show({
                    type: 'info',
                    text1: 'Nhấn nút back lần nữa để thoát nhé',
                    visibilityTime: 2000,
                    autoHide: true,
                });
            }
            setTimeout(() => {
                isBack = false;
            }, 2000);
            return true;
        };

        const onInactive = navigation.addListener('blur', () => {
            BackHandler.removeEventListener('hardwareBackPress', backAction);
        });

        const onActive = navigation.addListener('focus', () => {
            BackHandler.addEventListener('hardwareBackPress', backAction);
        });

        return () => {
            onActive();
            onInactive();
        };
    }, [navigation]);

    async function login() {
        if (username === '') {
            Toast.show({
                type: 'error',
                text1: 'Tên đăng nhập không được bỏ trống',
                visibilityTime: 2000,
                autoHide: true,
            });
            return;
        }
        if (password === '') {
            Toast.show({
                type: 'error',
                text1: 'Mật khẩu không được bỏ trống',
                visibilityTime: 2000,
                autoHide: true,
            });
            return;
        }

        setIsLoading(true);
        const user = await LoginApi(username, password);
        setIsLoading(false);
        if (user) {         
            Toast.show({
                type: 'success',
                text1: 'Đăng nhập thành công!',
                visibilityTime: 2000,
                autoHide: true,
            });
            navigation.navigate('MenuPane');

        } else {
            Toast.show({
                type: 'error',
                text1: 'Sai tài khoản hoặc mật khẩu!',
                visibilityTime: 20000,
                autoHide: false,
            });
        }

    }

    return (
        <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
        }}>

            <View style={styles.container}>
                <Image source={require('../resource/images/logo_nlu.png')} style={styles.logo} />
                <View style={styles.forms}>
                    <TextInput style={styles.inputText} placeholderTextColor={"lightgray"} placeholder='Tên đăng nhập' value={username} onChangeText={(val) => setUsername(val)} />
                    <TextInput style={styles.inputText} placeholderTextColor={"lightgray"} placeholder='Mật khẩu' value={password} secureTextEntry={true} onChangeText={(val) => setPassword(val)} />
                    <TouchableOpacity style={styles.loginButton} onPress={login}>
                        <Text style={styles.titleButton}>ĐĂNG NHẬP</Text>
                    </TouchableOpacity>
                </View>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#2bc250" />
                    </View>) : (<></>)
                }

            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: '#2bc250',
        // height: '100%'
    },
    logo: {
        width: 200,
        height: 200,
        objectFit: "cover",
        marginTop: 70,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    forms: {
        width: "100%",

        alignItems: "center",
        ...Platform.select({
            ios: {
                marginTop: 40,
            },
            android: {
                marginTop: 20,
            },
        }),
    },
    inputText: {
        width: "80%",
        marginTop: 0,
        marginBottom: 20,
        padding: 10,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        textAlign: 'center'
    },
    loginButton: {
        backgroundColor: colors.primary,
        padding: 10,
        marginTop: 10,
        borderRadius: 3,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    titleButton: {
        fontWeight: 'bold',
        color: 'white'
    },

    loadingContainer: {
        position: 'absolute',
        zIndex: 1,
        backgroundColor: '#bec4c2',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -75 }, { translateY: 0 }],
        width: 150,
        height: 150,
        justifyContent: 'center',
        borderRadius: 10,
        opacity: 0.8,
    }
})