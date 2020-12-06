import Vue from 'vue'
import { request } from '@/utils/request'
import { login, logout, phoneLogin } from '@/api/login'
import { api_platf } from '@/api/api'
import { AUTHORIZATION, REFRESH_TOKEN, SYS_BUTTON_AUTH, USER_AUTH, USER_INFO, USER_NAME } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {

  state: {
    token: '',
    username: '',
    realname: '',
    welcome: '',
    avatar: '',
    permissionList: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { username, realname, welcome }) => {
      state.username = username
      state.realname = realname
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_PERMISSIONLIST: (state, permissionList) => {
      state.permissionList = permissionList
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
  },

  actions: {

    /**
     * CAS 验证登录
     * @param commit
     * @param userInfo
     * @returns {Promise<*>}
     * @constructor
     */
    async ValidateLogin ({ commit }, userInfo) {

    },

    /**
     * 用户 登陆
     * @param commit
     * @param userInfo
     * @returns {Promise<*>}
     * @constructor
     */
    async Login ({ commit }, userInfo) {
      try {
        let result = await login(userInfo)
        // 配置 访问安全 token
        Vue.ls.set(AUTHORIZATION, result.access_token, result.expires_in * 1000)
        Vue.ls.set(REFRESH_TOKEN, result.refresh_token, result.expires_in * 1000)
        commit('SET_TOKEN', result.access_token)
        // 获取登陆用户信息

        result = await request.get(api_platf.USER_BY_NAME_URL, { params: { 'username': userInfo.username } })
        userInfo = result.userInfo
        Vue.ls.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
        Vue.ls.set(USER_NAME, userInfo.username, 7 * 24 * 60 * 60 * 1000)
        commit('SET_INFO', userInfo)
        commit('SET_NAME', { username: userInfo.username, realname: userInfo.realname, welcome: welcome() })
        commit('SET_AVATAR', userInfo.avatar)

        return Promise.resolve(result)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    /**
     * 获取用户权限信息
     * @param commit
     * @param username
     * @returns {Promise<*>}
     * @constructor
     */
    async GetPermissionList ({ commit }, username) {
      try {
        const result = await request.get(api_platf.PERMISSION_URL, { params: { 'username': username } })
        const menuData = result.menu
        const authData = result.auth
        const allAuthData = result.allAuth
        sessionStorage.setItem(USER_AUTH, JSON.stringify(authData))
        sessionStorage.setItem(SYS_BUTTON_AUTH, JSON.stringify(allAuthData))
        if (menuData && menuData.length > 0) {
          //一级菜单的子菜单全部是隐藏路由，则一级菜单不显示------
          menuData.forEach((item, index) => {
            if (item['children']) {
              let hasChildrenMenu = item['children'].filter((i) => {
                return !i.hidden || i.hidden === false
              })
              if (hasChildrenMenu == null || hasChildrenMenu.length === 0) {
                item['hidden'] = true
              }
            }
          })
          console.log(' menu show json ', menuData)
          commit('SET_PERMISSIONLIST', menuData)
        } else {
          return Promise.reject('getPermissionList: permissions must be a non-null array !')
        }
        return Promise.resolve(result)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    /**
     * 用户退出登陆
     * @param commit
     * @param state
     * @returns {Promise<*>}
     * @constructor
     */
    async Logout ({ commit, state }) {
      let logoutToken = state.token
      commit('SET_TOKEN', '')
      commit('SET_PERMISSIONLIST', [])
      Vue.ls.remove(AUTHORIZATION)
      const result = await logout(logoutToken)
      if (result) {
        //var sevice = "http://"+window.location.host+"/";
        //var serviceUrl = encodeURIComponent(sevice);
        //window.location.href = window._CONFIG['casPrefixUrl']+"/logout?service="+serviceUrl;
        return Promise.resolve()
      }
      return Promise.reject('退出登陆失败 !')
    },
  }
}

export default user