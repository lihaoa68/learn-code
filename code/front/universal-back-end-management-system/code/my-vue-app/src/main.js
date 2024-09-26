import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/assets/less/index.less'
import {createPinia} from 'pinia'
import '@/api/mock.js'
import api from '@/api/api'
import { userAllData } from './stores/store'

const app = createApp(App)
app.config.globalProperties.$api = api
app.use(ElementPlus)
//这一步是为了激活pinia，然后才能在其他组件中使用pinia中定义的数据
const pinia = createPinia()
app.use(pinia)
const store = userAllData()
store.addMenu(router,"refresh")
app.use(router)

console.log(router)
const isRoute = (to)=>{
  return router.getRoutes().filter(item=>item.path === to.path).length > 0
}
router.beforeEach((to,from)=>{
  console.log(to.path,"---",store.state.token)
  console.log(store.state.token)
  if(!store.state.token && to.path != '/login'){
    return {name :"login"}
  }
  if(!isRoute(to)){
    return {name:"404"}
  }
})
app.mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
