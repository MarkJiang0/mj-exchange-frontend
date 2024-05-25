import axios from 'axios';
import { stringify } from 'querystring';
import os from 'os'

//保存环境变量
const isPrd = process.env.NODE_ENV == 'production';

const ip = '192.168.0.104'
//区分开发环境还是生产环境基础URL
export const basicUrl = isPrd ? 'https://www.production.com' : `http://${ip}:6001`
export const marketBasicUrl = isPrd ? 'https://www.production.com' : `http://${ip}:6004`

//设置axios基础路径
const http = axios.create({
  baseURL: basicUrl
})

export const marketHttp = axios.create({
  baseURL: marketBasicUrl
})

// 请求拦截器
http.interceptors.request.use(config => { 
  // 每次发送请求之前本地存储中是否存在token，也可以通过Redux这里只演示通过本地拿到token
  // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
  // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断 
  const token = window.localStorage.getItem('token') || window.sessionStorage.getItem('token');
  //在每次的请求中添加token
  config.data = Object.assign({}, config.data, {
    token: token,
  })
  //设置请求头
  config.headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
  }
  //序列化请求参数，不然post请求参数后台接收不正常
  config.data = stringify(config.data)
  return config
}, error => { 
    return error;
})

// 响应拦截器
http.interceptors.response.use(response => {
  //根据返回不同的状态码做不同的事情
  // 这里一定要和后台开发人员协商好统一的错误状态码
  if (response.status) {
    switch (response.status) {
      case 200:
        return response.data;
      case 401:
        //未登录处理方法
        break;
      case 403:
        //token过期处理方法
        break;
      default:
        console.log(response.data.msg)
    }
  } else { 
    return response;
  }
})

marketHttp.interceptors.request.use(config => { 
  // 每次发送请求之前本地存储中是否存在token，也可以通过Redux这里只演示通过本地拿到token
  // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
  // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断 
  const token = window.localStorage.getItem('token') || window.sessionStorage.getItem('token');
  //在每次的请求中添加token
  config.data = Object.assign({}, config.data, {
    token: token,
  })
  //设置请求头
  config.headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
  }
  //序列化请求参数，不然post请求参数后台接收不正常
  config.data = stringify(config.data)
  return config
}, error => { 
    return error;
})

// 响应拦截器
http.interceptors.response.use(response => {
  //根据返回不同的状态码做不同的事情
  // 这里一定要和后台开发人员协商好统一的错误状态码
  if (response.status) {
    switch (response.status) {
      case 200:
        return response.data;
      case 401:
        //未登录处理方法
        break;
      case 403:
        //token过期处理方法
        break;
      default:
        console.log(response.data.msg)
    }
  } else { 
    return response;
  }
})

function getNetworkIp() {
  // 打开的 host
  let needHost = '';
  try {
    // 获得网络接口列表
    let network = os.networkInterfaces();
    
    for (let dev in network) {
      let iface = network[dev];
      for (let i = 0; i < iface.length; i++) {
        let alias = iface[i];
        if (
          alias.family === 'IPv4' &&
          alias.address !== '127.0.0.1' &&
          !alias.internal
        ) {
          needHost = alias.address;
        }
      }
    }
  } catch (e) {
    needHost = 'http://127.0.0.1';
  }
  return needHost;
}

export default http
