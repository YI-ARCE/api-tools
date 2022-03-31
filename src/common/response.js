import axios from "axios";
import {Notification} from "element-ui";
import Crypto from 'crypto-js';
import Md5 from 'blueimp-md5';

let notify = Notification;

let base = 'http://127.0.0.1'

let token = '';
let version = '1.0';

const timestampK = '606a36623f66a9e1';
const nonceK = '9236660ef60a4531';
const signK = 'ed6663291354a06f';
const dataK = 'e94ef35e0ff63169';

// let tokenKey = 'f60a4531923666de';
let timestampKey = '606a36623f66a9e1';
let nonceKey = '9236660ef60a4531';
let signKey = 'ed6663291354a06f';
let dataKey = 'e94ef35e0ff63169';

let request = axios.create({
    baseURL: base,
    timeout: 20000,
    responseType: ''
});
request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

request.interceptors.request.use((config) => {
    config.headers['access-token'] = token;
    config.headers['yc-version'] = version;
    return config;
})

request.interceptors.response.use((response) => {

    if (response.data.code <= 0) {
        let message;
        if (typeof (response.data.scope) === 'undefined') {
            message = ''
        } else {
            message = (response.data.scope['必要时复制此字段给后台人员']['源提示'].replace(" ", ''))
        }
        notify({
            type: 'error',
            message: "<p>" + response.data.msg + "</p><p>" + message + "</p>",
            showClose: false,
            duration: 3000,
            position: 'top-left',
            dangerouslyUseHTMLString: true
        });
    }
    return response.data

})

let id

let v

let list = {}

if(list[id] !== undefined){
    list[id].push(v)
}else{
    list[id] = [v]
}

let encrypt = (data, key) => {
    if (typeof data === 'object'){
        data = JSON.stringify(data)
    }
    let _key = Crypto["enc"].Utf8.parse(key);
    let _data = Crypto["enc"].Utf8.parse(data);
    let enc = Crypto["AES"].encrypt(_data, _key, {
        mode: Crypto["mode"].ECB,
        padding: Crypto["pad"].Pkcs7
    });
    return enc.toString();
}

let header = (pay, data = {}) => {
    let header = {};
    let timestamp = parseInt((new Date()).getTime() / 100, 10);
    let nonce = Md5(timestamp)
    if (pay) {
        header['yc-timestamp'] = encrypt(timestamp, timestampKey)
        header['yc-nonce'] = encrypt(nonce, nonceKey)
        if ( Object.keys(data).length > 0) {
            data = rsort(data)
            console.log(timestamp + nonce + JSON.stringify(data))
            header['yc-sign'] = encrypt(Md5(timestamp + nonce + JSON.stringify(data)), signKey)
        }else{
            header['yc-sign'] = encrypt(Md5(timestamp + nonce), signKey)
        }
    } else {
        header['yc-timestamp'] = encrypt(timestamp, timestampKey)
        header['yc-nonce'] = encrypt(nonce, nonceKey)
        header['yc-sign'] = encrypt(Md5(timestamp + nonce), signKey)
    }
    return header
}

let rsort = (data) => {
    let keys = Object.keys(data).sort()
    let _data = {}
    keys.forEach((key) => {
        if(data[key] === null || data[key] === undefined || data[key] === ''){
            return
        }
        if(typeof data[key] === 'object'){
            _data[key] = rsort(data[key])
        }else{
            _data[key] = data[key]
        }
    })
    return _data
}

let send = (uri,method,data,header) =>{
    let req = {
        baseURL:base,
        url: uri,
        method: method,
        headers: header
    }
    if(method === 'get'){
        req["params"] = {body: encrypt(data, dataKey)}
    }else{
        req["data"] = encrypt(data, dataKey)
    }
    return  request(req)
}




export function get(uri, data = {}, pay = false) {
    if(uri.indexOf('wallet') !== -1){
        pay = true
    }
    data = rsort(data)
    let h = header(pay,data)
    return {response:send(uri,'get',data,h),header:h}
}

export function post(uri, data = {}, pay = false) {
    if(uri.indexOf('wallet') !== -1){
        pay = true
    }
    data = rsort(data)
    let h = header(pay,data)
    return {response:send(uri,'post',data,h),header:h}
}

export function setToken(t) {
    token = t
}

export function setVersion(v) {
    version = v
}

export function setBaseUrl(baseUrl){
    base = baseUrl
}

export function setKey(data){
    timestampKey = data.timestampKey
    dataKey = data.dataKey
    nonceKey = data.nonceKey
    signKey = data.signKey
}

export function initKey(){
    timestampKey = timestampK
    dataKey = dataK
    nonceKey = nonceK
    signKey = signK
}

export default {get, post, setToken, setVersion,setBaseUrl,setKey,initKey,request}


