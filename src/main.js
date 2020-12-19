import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import moment from 'moment'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor /* { default global options } */)

Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.prototype.$axios = axios
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // console.log(config)
    config.headers.Authorization = localStorage.getItem('token')
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    response = response.data
    if (response.meta.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
      // this.$message.error(response.meta.msg)
    }
    console.log(response)
    return response
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)
Vue.filter('time', function (value) {
  return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
