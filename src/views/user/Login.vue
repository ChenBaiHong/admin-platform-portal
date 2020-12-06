<template>
  <div class="main">
    <a-form :form="form" class="user-layout-login" ref="formLogin" id="formLogin">
      <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick">
        <a-tab-pane key="tab1" tab="账号密码登陆">
          <a-form-item>
            <a-input
              size="large"
              v-decorator="['username',validatorRules.username,{ validator: this.handleUsernameOrEmail }]"
              type="text"
              placeholder="请输入帐户名 / admin">
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input
              v-decorator="['password',validatorRules.password]"
              size="large"
              type="password"
              autocomplete="false"
              placeholder="密码 / 123456">
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-row :gutter="0">
            <a-col :span="16">
              <a-form-item>
                <a-input
                  v-decorator="['inputCode',validatorRules.inputCode]"
                  size="large"
                  type="text"
                  @change="inputCodeChange"
                  placeholder="请输入验证码">
                  <a-icon slot="prefix" type="smile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8" style="text-align: right">
              <img v-if="requestCodeSuccess" style="margin-top: 2px;" :src="randCodeImage"
                   @click="handleChangeCheckCode"/>
              <img v-else style="margin-top: 2px;" src="../../assets/checkcode.png" @click="handleChangeCheckCode"/>
            </a-col>
          </a-row>
          <a-form-item style="margin-top:24px">
            <a-button
              size="large"
              type="primary"
              htmlType="submit"
              class="login-button"
              :loading="loginBtn"
              @click.stop.prevent="handleSubmit"
              :disabled="loginBtn">确定
            </a-button>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="tab2" tab="手机号登陆">
          <a-form-item>
            <a-input
              v-decorator="['mobile',validatorRules.mobile]"
              size="large"
              type="text"
              placeholder="手机号">
              <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-row :gutter="16">
            <a-col class="gutter-row" :span="16">
              <a-form-item>
                <a-input
                  v-decorator="['captcha',validatorRules.captcha]"
                  size="large"
                  type="text"
                  placeholder="请输入验证码">
                  <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-button
                class="getCaptcha"
                tabindex="-1"
                :disabled="state.smsSendBtn"
                @click.stop.prevent="getCaptcha"
                v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"></a-button>
            </a-col>
          </a-row>
          <a-form-item style="margin-top:24px">
            <a-button
              size="large"
              type="primary"
              htmlType="submit"
              class="login-button"
              :loading="loginBtn"
              @click.stop.prevent="handleSubmit"
              :disabled="loginBtn">确定
            </a-button>
          </a-form-item>
        </a-tab-pane>
        <!--<a-tab-pane :forceRender="true" key="wechat" tab="企业微信登录">
          <div flex="main:center" id="wxqrcode"></div>
        </a-tab-pane>-->
      </a-tabs>
    </a-form>

  </div>
</template>

<script>

  import { v4 as uuidv4 } from 'uuid'
  import { mapActions } from 'vuex'
  import { timeFix } from '@/utils/util'
  import Vue from 'vue'

  import { AUTHORIZATION, ENCRYPTED_STRING, USER_INFO } from '@/store/mutation-types'
  import { getAction, postAction, putAction } from '@/api/manage'
  import store from '@/store/'

  export default {
    components: {},
    data () {
      return {
        customActiveKey: 'tab1',
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        form: this.$form.createForm(this),
        state: {
          time: 60,
          smsSendBtn: false,
        },
        validatorRules: {
          username: { rules: [{ required: true, message: '请输入用户名!' }, { validator: this.handleUsernameOrEmail }] },
          password: { rules: [{ required: true, message: '请输入密码!', validator: 'click' }] },
          mobile: { rules: [{ validator: this.validateMobile }] },
          captcha: { rule: [{ required: true, message: '请输入验证码!' }] },
          inputCode: { rules: [{ required: true, message: '请输入验证码!' }] }
        },
        verifiedCode: '',
        deviceId: uuidv4(),
        inputCodeContent: '',
        inputCodeNull: true,

        departList: [],
        departVisible: false,
        departSelected: '',
        currentUsername: '',
        validate_status: '',
        currentDateTime: '',
        randCodeImage: '',
        requestCodeSuccess: false
      }
    },
    created () {
      this.currentDateTime = new Date().getTime()
      Vue.ls.remove(AUTHORIZATION)
      this.getRouterData()
      this.handleChangeCheckCode()

    },
    methods: {
      ...mapActions(['Login', 'Logout']),

      /**
       * 登陆账户框规则校验 函数
       * @param rule
       * @param value
       * @param callback
       */
      handleUsernameOrEmail (rule, value, callback) {
        const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
        if (regex.test(value)) {
          this.loginType = 0
        } else {
          this.loginType = 1
        }
        callback()
      },
      /**
       * tab 栏切换 触发事件函数
       * @param key
       */
      handleTabClick (key) {
        this.customActiveKey = key
      },
      /**
       * 表单提交 触发事件函数
       */
      async handleSubmit () {
        try {
          let loginParams = {}
          // 用户名密码登陆
          if (this.customActiveKey === 'tab1') {
            const values = await this.form.validateFields(['username', 'password', 'inputCode'], { force: true })
            if (values) {
              loginParams.username = values.username
              loginParams.password = values.password
              loginParams.validCode = this.inputCodeContent
              loginParams.deviceId = this.deviceId
              loginParams.grant_type = 'password_code'
              const result = await this.Login(loginParams)
              this.departConfirm(result)
            } else {
              this.loginBtn = false
            }
          }
          // 使用手机号码登陆
          else {
            const values = await this.form.validateFields(['mobile', 'captcha'], { force: true })
            if (values) {
              loginParams.mobile = values.mobile
              loginParams.captcha = values.captcha
              loginParams.grant_type = 'mobile_password'
              const result = await this.Login(loginParams)
              this.departConfirm(result)
            } else {
              this.loginBtn = false
            }
          }
        } catch (err) {
          this.requestFailed(err)
        }
      },

      /**
       * 获取手机登陆短信验证码 触发事件函数
       * @param e
       */
      async getCaptcha (e) {
        e.preventDefault()
        let interval
        try {
          const values = await this.form.validateFields(['mobile'], { force: true })
          if (values) {
            if (!values.mobile) {
              this.cmsFailed('请输入手机号')
            } else {
              this.state.smsSendBtn = true
              interval = window.setInterval(() => {
                if (this.state.time-- <= 0) {
                  this.state.time = 60
                  this.state.smsSendBtn = false
                  window.clearInterval(interval)
                }
              }, 1000)
              const hide = this.$message.loading('验证码发送中..', 0)
              let mobile = values.mobile
              const result = await getAction(`/validate/sms-code/${mobile}`)
              if (result) {
                setTimeout(hide, 0)
                this.cmsFailed(res.message)
                console.log(res)
                setTimeout(hide, 500)
              }
            }
          }
        } catch (err) {
          setTimeout(hide, 1)
          clearInterval(interval)
          this.state.time = 60
          this.state.smsSendBtn = false
          this.requestFailed(err)
        }
      },

      /**
       * 获取图形验证码 事件函数
       */
      async handleChangeCheckCode () {
        try {
          this.currentDateTime = new Date().getTime()
          const result = await getAction(`/api/oauth-center/validate/random-code/${this.deviceId}`)
          if (result) {
            this.randCodeImage = result
            this.requestCodeSuccess = true
          } else {
            this.$message.error(res.message)
            this.requestCodeSuccess = false
          }
        } catch (e) {
          this.requestCodeSuccess = false
        }
      },
      /**
       * 登陆成功提示
       */
      loginSuccess () {
        this.$router.push({ name: 'dashboard' })
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`,
        })
      },
      /**
       * 登陆失败提示
       * @param err
       */
      cmsFailed (err) {
        this.$notification['error']({
          message: '登录失败',
          description: err,
          duration: 4,
        })
      },
      /**
       * 请求错误 提示函数
       * @param err
       */
      requestFailed (err) {
        this.$notification['error']({
          message: '登录失败',
          description: ((err.response || {}).data || {}).message || err.message || '请求出现错误，请稍后再试',
          duration: 4,
        })
        this.loginBtn = false
      },

      /**
       * 手机号码 正则校验事件函数
       * @param rule
       * @param value
       * @param callback
       */
      validateMobile (rule, value, callback) {
        if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
          callback()
        } else {
          callback('您的手机号码格式不正确!')
        }

      },
      /**
       * 验证校验 函数
       * @param rule
       * @param value
       * @param callback
       */
      validateInputCode (rule, value, callback) {
        if (!value || this.verifiedCode === this.inputCodeContent) {
          callback()
        } else {
          callback('您输入的验证码不正确!')
        }
      },
      /**
       *
       * @param value
       */
      generateCode (value) {
        this.verifiedCode = value.toLowerCase()
      },
      /**
       * 验证码输入框 输入事件函数
       * @param e
       */
      inputCodeChange (e) {
        this.inputCodeContent = e.target.value
      },

      /**
       * 用户部门
       * @param result
       */
      departConfirm (result) {
        if (result) {
          let multi_depart = result.multi_depart
          //0:无部门 1:一个部门 2:多个部门
          if (multi_depart === 0) {
            this.loginSuccess()
            this.$notification.warn({
              message: '提示',
              description: `您尚未归属部门,请确认账号信息`,
              duration: 3
            })
          } else if (multi_depart === 2) {
            this.departVisible = true
            this.currentUsername = this.form.getFieldValue('username')
            this.departList = result.departs
          } else {
            this.loginSuccess()
          }
        } else {
          this.Logout()
        }
      },

      departOk () {
        if (!this.departSelected) {
          this.validate_status = 'error'
          return false
        }
        let obj = {
          orgCode: this.departSelected,
          username: this.form.getFieldValue('username')
        }
        putAction('/sys/selectDepart', obj).then(res => {
          if (res.success) {
            const userInfo = res.result.userInfo
            Vue.ls.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
            store.commit('SET_INFO', userInfo)
            //console.log("---用户信息---userInfo-------",store.getters.userInfo.orgCode);
            this.departClear()
            this.loginSuccess()
          } else {
            this.requestFailed(res)
            this.Logout().then(() => {
              this.departClear()
            })
          }
        })
      },
      departClear () {
        this.departList = []
        this.departSelected = ''
        this.currentUsername = ''
        this.departVisible = false
        this.validate_status = ''
      },
      departChange (value) {
        this.validate_status = 'success'
        this.departSelected = value
      },
      getRouterData () {
        this.$nextTick(() => {
          if (this.$route.params.username) {
            this.form.setFieldsValue({
              'username': this.$route.params.username
            })
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>

  .user-layout-login {
    label {
      font-size: 14px;
    }

    .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }

    .forge-password {
      font-size: 14px;
    }

    button.login-button {
      padding: 0 15px;
      font-size: 16px;
      height: 40px;
      width: 100%;
    }

    .user-login-other {
      text-align: left;
      margin-top: 24px;
      line-height: 22px;

      .item-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, .2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color .3s;

        &:hover {
          color: #1890ff;
        }
      }

      .register {
        float: right;
      }
    }
  }

</style>
<style>
  .valid-error .ant-select-selection__placeholder {
    color: #f5222d;
  }
</style>