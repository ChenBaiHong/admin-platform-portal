import { api_uaa } from './api'
import { CLIENT_ID, CLIENT_SECRET } from '@/store/mutation-types'
import { request } from '@/utils/request'
import { base64_encode } from '@/utils/base64'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return request({
    url: api_uaa.PASSWORD_LOGIN_PRO_URL,
    method: 'post',
    params: parameter,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + base64_encode(CLIENT_ID + ':' + CLIENT_SECRET)
    }
  })
}

export function phoneLogin (parameter) {
  return request({
    url: api_uaa.MOBILE_TOKEN_URL,
    method: 'post',
    params: parameter,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + base64_encode(CLIENT_ID + ':' + CLIENT_SECRET)
    }
  })
}

/**
 * 获取短信验证码
 * @param parameter
 * @returns {*}
 */
export function getSmsCaptcha (parameter) {
  return request({
    url: api_uaa.MOBILE_VALIDATE_CODE_URL_PREFIX,
    method: 'get',
    data: parameter
  })
}

/**
 * 退出登陆
 * @param accessToken
 * @returns {*}
 */
export function logout (accessToken) {
  return request({
    url: api_uaa.LOGOUT_URL + '?access_token=' + accessToken,
    method: 'get'
  })
}