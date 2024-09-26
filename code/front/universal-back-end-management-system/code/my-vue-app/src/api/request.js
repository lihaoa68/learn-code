import axios from 'axios'
import {ElMessage} from 'element-plus'
import config from '../config/index'
const service = axios.create({
    baseURL:config.baseApi
})
const NETWORK_ERROR="网络错误..."

// 添加请求拦截器
service.interceptors.request.use(function (config) {
   
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use((res)=>{
    console.log("---data---")
    // console.log(res)
    console.log(res.data)
    const {code,data,msg} = res.data
    if(code == 200){
        return data
    }else{
        const NETWORK_ERROR="网络错误..."
        ElMessage.error(msg || NETWORK_ERROR)
        return Promise.reject(msg||NETWORK_ERROR)
    }

});

function request(options){
    console.log("--options----")
    console.log(options)
    options.method = options.method || "get"
    // console.log("------service()----")
    // console.log(service())
    // console.log("------service(options)----")
    // console.log(service(options))
    // console.log("------options----")
    // console.log(options)
    // console.log("------options.method----")
    // console.log(options.method)
//关于get请求参数调整
    if(options.method.toLowerCase()==="get"){
        options.params = options.data
    }
    //对mock的开关做一个处理
    let isMock = config.mock

    if(typeof options.mock !=="undefined"){
        isMock = options.mock
    }


    //针对环境做一个mock
    if(config.env  ==="prod"){
        service.defaults.baseURL = config.baseApi
    }else{
        // console.log("isMock",isMock)
        service.defaults.baseURL = isMock? config.mockApi : config.baseApi
        console.log(service.defaults.baseURL) 
    }
    return service(options)
}

export default request