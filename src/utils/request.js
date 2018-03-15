import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(config => {
  // 请求拦截操作
  if (store.getters.token) {
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['X-Token'] = getToken()
  }
  return config
}, error => {
  // 请求拦截报错
  console.log(error)
  Promise.reject(error)
})

// 反应拦截器
service.interceptors.response.use(
  // response => response,
  /**
  * 重新封住接口返回的数据格式
  */
  response => {
    const res = response.data

    if (res.status !== 200) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })

      // 50008:非法的token
      // 50012:其他客户端登录了
      // 50014:Token 过期了
      if (res.status === 50008 || res.status === 50012 || res.status === 50014) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            // 为了重新实例化vue-router对象 避免bug
            location.reload()
          })
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('response err:' + error)
    Message({
      message: '网络请求故障，请检查您的网络情况！',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })

export default service
