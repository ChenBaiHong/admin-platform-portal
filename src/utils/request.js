import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import { VueAxios } from './axios'
import { Modal, notification } from 'ant-design-vue'
import { AUTHORIZATION } from '@/store/mutation-types'

//自动设置后台服务 baseURL
let baseDomain = window._CONFIG['domianURL']
console.log('baseDomain= ', baseDomain)

/**
 * 创建 axios 实例
 * @type {AxiosInstance}
 */
const service = axios.create({
  baseURL: baseDomain,
  withCredentials: true,
  timeout: 9000 // 请求超时时间
})

/**
 *
 * @param error
 * @returns {Promise<never>}
 */
const err = (error) => {
  if (error.response) {
    let data = error.response.data
    const token = Vue.ls.get(AUTHORIZATION)
    switch (error.response.status) {
      case 403:
        notification.error({ message: '系统提示', description: '拒绝访问', duration: 4 })
        break
      case 500:
        if (token && data.message === 'Token失效，请重新登录') {
          Modal.error({
            title: '登录已过期',
            content: '很抱歉，登录已过期，请重新登录',
            okText: '重新登录',
            mask: false,
            onOk: () => {
              store.dispatch('Logout').then(() => {
                Vue.ls.remove(AUTHORIZATION)
                window.location.reload()
              })
            }
          })
        }
        break
      case 404:
        notification.error({ message: '系统提示', description: '很抱歉，资源未找到!', duration: 4 })
        break
      case 504:
        notification.error({ message: '系统提示', description: '网络超时' })
        break
      case 401:
        notification.error({ message: '系统提示', description: '未授权，请重新登录', duration: 4 })
        if (token) {
          store.dispatch('Logout').then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          })
        }
        break
      default:
        notification.error({
          message: '系统提示',
          description: data.message,
          duration: 4
        })
        break
    }
  }
  return Promise.reject(error)
}

/**
 * 请求拦截 加入认证 token
 */
service.interceptors.request.use(config => {
  const token = Vue.ls.get(AUTHORIZATION)
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

/**
 *
 */
service.interceptors.response.use(response => {
  //文件流拦截
  if (response.data.constructor === Blob) {
    return response
  }
  if (response.data.code === 0 || response.data.code === 200) {
    return response.data.result || response.data
  }
  return err(response.data)
}, err)

const installer = {
  vm: {},
  install (Vue, router = {}) {
    Vue.use(VueAxios, router, service)
  }
}

export {
  installer as VueAxios,
  service as request
}