import homeApi from '@/api/mockData/home'
import Mock from 'mockjs';
import userApi from './mockData/user'
import permissionApi from './mockData/permission';
Mock.mock(/user\/addUser/,"post", userApi.createUser)
Mock.mock(/api\/user\/getUserData/,"get", userApi.getUserList)
Mock.mock(/api\/user\/deleteUser/,"get",userApi.deleteUser)
Mock.mock(/api\/user\/deleteUser/,"get",userApi.deleteUser)
Mock.mock(/api\/permission\/getMenu/, "post",permissionApi.getMenu)
Mock.mock(/api\/home\/getTableData/,"get",homeApi.getTableData)
Mock.mock(/api\/home\/getCountData/,"get",homeApi.getCountData)
Mock.mock(/api\/home\/getChartData/,"get",homeApi.getChartData)