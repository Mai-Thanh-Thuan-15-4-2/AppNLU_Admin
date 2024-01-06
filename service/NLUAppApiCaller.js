import AsyncStorage from '@react-native-async-storage/async-storage';


//Login NLUApp Api
//return user object or null if error 
export async function LoginApi(username, password, name) {
    const urlString = "http://103.9.159.203:8001/authenticate/login";
    const params = `{"username":"${username}","password":"${password}", "name":"${name}"}`;

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: params,
    });

    if (response.ok) {
        const responseData = await response.json();
        const data = responseData.data;
        if (!data) return responseData.message;
        const token = responseData.data.access_token;
        AsyncStorage.setItem("tokenApp", token);
        // console.log(token + "token nè")
        return responseData.data;
    }
    return null;
}

export async function getUser(id) {
    const urlString = "http://103.9.159.203:8001/user/info/"+id;
    const token = await AsyncStorage.getItem('tokenApp');
    const params = "";

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: params,
    });

    if (response.ok) {
        const responseData = await response.json();
        const id = responseData.user_name;
        const name = responseData.name;
        const isNonLocked = responseData.non_locked;
        const isVip = responseData.vip;
        const expiredVipDate = responseData.expired_vip_date;
        const token = responseData.access_token;
        return {id: id, name: name, isNonLocked: isNonLocked, isVip: isVip, expiredVipDate: expiredVipDate, token: token};
    }
    return null;
}

export async function getAllUser() {
    const urlString = "http://103.9.159.203:8001/user/getAll";
    const token = await AsyncStorage.getItem('tokenApp');
    const params = "";

    const response = await fetch(urlString, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: params,
    });

    if (response.ok) {

        // console.log(response)
        const responseData = await response.json();
        if (responseData.code == 200){
            return responseData.data;
        }
        console.log(responseData)
    }
    return null;
}

export async function lockUser(id) {
    const urlString = "http://103.9.159.203:8001/user/lock/"+id;
    const token = await AsyncStorage.getItem('tokenApp');
    const params = "";

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: params,
    });

    if (response.ok) {
        const responseData = await response.json();
        // console.log(response.message)
        return responseData.message
    }
    return null;
}

export async function unlockUser(id) {
    const urlString = "http://103.9.159.203:8001/user/unlock/"+id;
    const token = await AsyncStorage.getItem('tokenApp');
    const params = "";

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: params,
    });

    if (response.ok) {
        const responseData = await response.json();
        return responseData.message
    }
    return null;
}

export async function addVip(id, days) {
    const urlString = "http://103.9.159.203:8001/user/addVip";
    const token = await AsyncStorage.getItem('tokenApp');

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
            username: id,
            days: days,
        }),
    });

    if (response.ok) {
        const responseData = await response.json();
        return responseData.message
    }
    return null;
}

export async function changePassword(old_pass, new_pass, re_new_pass) {
    const urlString = "http://103.9.159.203:8001/user/changePassword";
    const token = await AsyncStorage.getItem('tokenApp');

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
            old_pass: old_pass,
            new_pass: new_pass,
            re_new_pass : re_new_pass,
        }),
    });

    if (response.ok) {
        const responseData = await response.json();
        return responseData.message
    }
    return null;
}
export async function addManager(username, password, name) {
    const urlString = "http://103.9.159.203:8001/user/addManager";
    const token = await AsyncStorage.getItem('tokenApp');

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
            username: username,
            password: password,
            name : name,
        }),
    });

    if (response.ok) {
        const responseData = await response.json();
        return responseData.message
    }
    return null;
}

export async function getAllReport() {
    const urlString = "http://103.9.159.203:8001/report/getAll";
    const token = await AsyncStorage.getItem('tokenApp');

    const response = await fetch(urlString, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: "",
    });

    if (response.ok) {
        const responseData = await response.json();
        return responseData.data
    }
    return null;
}

export async function readReport(id) {
    const urlString = "http://103.9.159.203:8001/report/read/"+id;
    const token = await AsyncStorage.getItem('tokenApp');

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: "",
    });

    if (response.ok) {
        const responseData = await response.json();
        return responseData.message
    }
    return null;
}
export async function grantStarReport(id) {
    const urlString = "http://103.9.159.203:8001/report/grantStar/"+id;
    const token = await AsyncStorage.getItem('tokenApp');

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: "",
    });

    if (response.ok) {
        const responseData = await response.json();
        return responseData.message
    }
    return null;
}
export async function rmStarReport(id) {
    const urlString = "http://103.9.159.203:8001/report/rmStar/"+id;
    const token = await AsyncStorage.getItem('tokenApp');

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: "",
    });

    if (response.ok) {
        const responseData = await response.json();
        return responseData.message
    }
    return null;
}
export async function deleteReport(id) {
    const urlString = "http://103.9.159.203:8001/report/delete/"+id;
    const token = await AsyncStorage.getItem('tokenApp');

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: "",
    });

    if (response.ok) {
        const responseData = await response.json();
        return responseData.message
    }
    return null;
}