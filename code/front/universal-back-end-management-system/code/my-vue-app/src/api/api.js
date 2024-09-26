/**
 * 统一管理整个项目
 */

import request from './request'

//请求表格数据
export default{

    getTableData(){
        return request({
            url:"/home/getTableData",
            method:"get",
            //用mock假数据，还是真数据
            mock:false
        })
    },
    getCountData(){
        return request({
            url:"/home/getCountData",
            method:"get",
            //用mock假数据，还是真数据
            mock:false
        })
    }, 
    getChartData(){
        return request({
            url:"/home/getChartData",
            method:"get",
            //用mock假数据，还是真数据
            mock:false
        })
    },
    getUserData(params) {
        return request({
          url: '/user/getUserData',
          method: 'get',
          data: params
        })
      },  
      deleteUser(params) {
        return request({
          url: '/user/deleteUser',
          method: 'get',
          data: params
        })
      },
      addUser(params) {
        return request({
          url: '/user/addUser',
          method: 'post',
          data: params
        })
      },
      editUser(params) {
        return request({
          url: '/user/editUser',
          method: 'post',
          data: params
        })
      },
      getMenu(params){
        return request({
          url:'/permission/getMenu',
          method:'post',
          data:params
        })
      }

}
