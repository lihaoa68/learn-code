<template>
  <div class="body-login">
    <el-form class="login-container" :model="formLogin">
      <h1>欢迎登录</h1>
      <el-form-item>
        <el-input
          placeholder="输入用户名"
          type="text"
          v-model="formLogin.username"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="输入密码"
          type="password"
          v-model="formLogin.password"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import { userAllData } from "@/stores/store";

import { ref, getCurrentInstance, reactive } from "vue";
const { proxy } = getCurrentInstance();
const store = userAllData();
const router = useRouter();
const handleLogin = async () => {
  const res = await proxy.$api.getMenu(formLogin);
  console.log(res)
  store.updateMenu(res.menuList);
  store.state.token = res.token;
  store.addMenu(router)
  store.state.tags =  [{
                path: "/home",
                name: "home",
                label: "首页",
                icon: 'home'
            }

        ]
  router.push("/home");

};
const formLogin = reactive({
  username: "",
  password: "",
});
</script>
<style lang="less" scoped>
.body-login {
  width: 100%;
  height: 100%;
  background-image: url("../assets/images/background.png");
  background-size: 100%;
  overflow: hidden;
}
.login-container {
  width: 400px;
  background-color: #fff;
  border: 1px solid #eaeaea;
  border-radius: 15px;
  padding: 35px 35px 15px 35px;
  box-shadow: 0 0 25px #cacaca;
  margin: 250px auto;
  h1 {
    text-align: center;
    margin-bottom: 20px;
    color: #505450;
  }
  :deep(.el-form-item__content) {
    justify-content: center;
  }
}
</style>