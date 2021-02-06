import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'

const request = axios.create({})

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

function refreshToken () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtoken: store.state.user.refresh_token
    })
  })
}

// 请求拦截器
request.interceptors.request.use(function (config) {
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 响应拦截器
let isRefresh = false // 控制刷新token的次数
let requests: any[] = [] // 存储刷新token期间的401请求
request.interceptors.response.use(function (response) {
  return response
}, async function (error) { // http状态码超过2xx都执行这里
  if (error.response) { // 请求发出去收到响应了，但是状态码超出了2xx范围
    const { status } = error.response
    if (status === 400) {
      Message.error('请求参数错误')
    } else if (status === 401) {
      if (!store.state.user) {
        redirectLogin()
        return Promise.reject(error)
      }
      // 尝试获取新的token，单独创建得到新的实例，防止请求刷新token的接口也401，然后不断地进入死循环
      if (!isRefresh) {
        isRefresh = true
        return refreshToken().then(res => {
          if (!res.data.success) {
            throw new Error('刷新token失败')
          }
          store.commit('setUser', res.data.content)
          // 刷新token成功，把requests队列中的请求重新发出去
          requests.forEach(cb => cb())
          // 重置requests数组
          requests = []
          return request(error.config)
        }).catch(err => {
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(err)
        }).finally(() => {
          isRefresh = false
        })
      }
      // 刷新状态下，把请求挂起，放到requests中
      return new Promise(resolve => {
        requests.push(() => {
          resolve(request(error.config))
        })
      })
    } else if (status === 403) {
      Message.error('没有权限，请联系管理员')
    } else if (status === 404) {
      Message.error('请求资源不存在')
    } else if (status >= 500) {
      Message.error('服务端错误，请联系管理员')
    }
  } else if (error.request) { // 请求发出去没有收到响应，例如连接超时
    Message.error('请求超时，请重试')
  } else { // 在设置请求时发生了一些事情，触发了一个错误
    Message.error(`请求失败，${error.message}`)
  }
  return Promise.reject(error)
})

export default request
