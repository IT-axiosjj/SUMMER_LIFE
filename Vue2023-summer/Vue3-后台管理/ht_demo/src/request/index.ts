import axios from 'axios'
//创建axios实例
const  service  =axios.create({
  baseURL:"https://www.fastmock.site/mock/bf1fcb3c2e2945669c2c8d0ecb8009b8/api" ,
  timeout:5000,
  headers:{
    "Content-Type":'application/json;charset=utf-8'
  }
})
//请求拦截
service.interceptors.request.use((config)=>{
  config.headers = config.headers || {} 
  if(localStorage.getItem('token')){
    console.log('请求拦截');
    config.headers.token = localStorage.getItem('token') || ""
  }
  return config
})
// 响应拦截
service.interceptors.response.use((res)=>{
  const code:number = res.data.code
  if(code != 200){
    console.log('响应拦截');
    // console.log(res.data);
    // 返回接口返回的错误信息
    // ------------------为解决----------影响登录跳转
    // return Promise.reject(res.data) 
  }
  return res.data
},(err)=>{
  console.log(err)
})
export default service