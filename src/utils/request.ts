import axios from 'axios';
import qs from 'querystring';
import { message } from 'antd';

switch (process.env.NODE_ENV) {
  case 'production':
    // 你的生产环境地址 / Your production mode api
    axios.defaults.baseURL = 'https://netease-cloud-music-api-33xx-c6qn7rm8t-cloudwangyi.vercel.app/';
    break;

  default:
    // development
    axios.defaults.baseURL = 'http://localhost:3000';
    break;
}

axios.defaults.timeout = 10000;
// axios.defaults.withCredentials = false; //例如：登录校验session和cookie

axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'; //声明请求格式
axios.defaults.transformRequest = (data) => qs.stringify(data); //qs是第三方库，转换为x-www-form-urlencoded
axios.defaults.withCredentials = true; // 跨域

/**
 * 设置响应拦截器
 * 服务器端返回信息->[响应拦截器]->客户端js获取到信息
 * response中包含属性：
 * data：相应数据,status:响应状态码,statusText：响应状态信息,headers：响应头,config：响应提供的配置信息,request
 */
axios.interceptors.response.use(
  ({ data }) => {
    if (data)
      return data; //将主体内容返回  axios.get().then(result=>{拿到的就是响应主体})
    else return Promise.reject(data);
  },
  (error) => {
    let { response } = error;
    // 如果有返回结果
    if (response) {
      const { data } = response;
      if (data) {
        message.error(`工口发生，错误信息：${data.message}`);
        switch (data.code) {
          //这里面根据公司需求进行写
          case 503:
            //进行错误跳转之类
            break;
          case 301:
            break;
          default:
            break;
        }
      } else {
        message.error('请求超时，请稍后重试');
      }
    } else {
      //服务器没有返回结果 分两种情况 断网  服务器崩了
      if (!window.navigator.onLine) {
        //断网处理：跳转到断网页面
        return;
      }
      // 服务器崩了
      message.error('工口发生，可能是网络问题');
      return Promise.reject(error);
    }
  },
);

export default axios;
