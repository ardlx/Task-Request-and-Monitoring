import Vue from 'vue'
import VueRouter from 'vue-router'
// import store from '@/store'
// import CryptoJS from 'crypto-js'

import Monitoring from '../views/t_MonitoringForm.vue'
import Request from '../views/t_RequestForm.vue'
import NotFound from '../views/NotFound'

Vue.use(VueRouter)

const routes = [
  {
    path: '/Monitoring',
    name: 'Monitoring',
    component: Monitoring
  },
  {
    path: '/Request',
    name: 'Request',
    component: Request
  },
  {
    path: '*',
    component: NotFound
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// function DecryptText(text){
//   var bytes  = CryptoJS.AES.decrypt(text, process.env.VUE_APP_SECRETKEY )
//   var originalText = bytes.toString(CryptoJS.enc.Utf8)
//   return originalText
// }


// ======================================== REQUEST
// router.beforeEach((to, from, next) => {
//   if(to.path !== "/Request")        {next("/Request")}                                                                       {next()}          // Go to Next Page
// })
// ======================================== 




// ======================================== MONITORING
// router.beforeEach((to, from, next) => {
//   if(to.path !== "/Monitoring")        {next("/Monitoring")}                                                                       {next()}          // Go to Next Page
// })
// // ======================================== 

export default router