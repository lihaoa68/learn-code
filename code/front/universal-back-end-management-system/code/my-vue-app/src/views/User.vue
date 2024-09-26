<script setup>
import { ref, reactive, getCurrentInstance, onMounted,nextTick } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
const list = ref([]);
const tableData = ref([]);
const tableLabel = reactive([
  {
    prop: "name",
    label: "姓名",
  },
  {
    prop: "age",
    label: "年龄",
  },
  {
    prop: "sexLabel",
    label: "性别",
  },
  {
    prop: "birth",
    label: "出生日期",
    width: 200,
  },
  {
    prop: "addr",
    label: "地址",
    width: 400,
  },
]);
const { proxy } = getCurrentInstance();
const getUserData = async function () {
  let data = await proxy.$api.getUserData(config);

  tableData.value = data.list.map((item) => ({
    ...item,
    sexLabel: item.sex === "1" ? "男" : "女",
  }));

  config.total = data.count;
};

onMounted(() => {
  getUserData();
});
const formItem = reactive({});
//其中total是数据总条数，page是当前的页数，设置name根据name进行条件搜索
const config = reactive({
  total: 0,
  page: 1,
  name: "",
});

const handleSearch = function (name) {
  config.name = name;
  getUserData();
};
const handleChange = function (page) {
  console.log(page);
  config.page = page;
  getUserData();
};

const handleDelete = (val) => {
  // ElMessageBox.

  ElMessageBox.confirm("确定删除吗？", "Warning", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
  })
    .then(async () => {
      await proxy.$api.deleteUser({ id: val.id });
      getUserData();
      ElMessage({
        type: "success",
        showClose: true,
        message: "删除成功",
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "删除失败",
      });
    });
};
const changePage = (page) => {};

//控制对话框是否显示
let dialogVisible = ref(false);

//新增和编辑共用一个窗口，所以通过设置action区分
const action = ref("add");

const formUser = reactive({ sex: "1" });
//表单校验规则
const rules = reactive({
  name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
  age: [
    { required: true, message: "年龄是必填项", trigger: "blur" },
    { type: "number", message: "年龄必须是数字" },
  ],
  sex: [{ required: true, message: "性别是必选项", trigger: "change" }],
  birth: [{ required: true, message: "出生日期是必选项" }],
  addr: [{ required: true, message: "地址是必填项" }],
});

//这个方法之前定义过
const handleAdd = () => {
  action.value = "add";
  //打开对话窗
  dialogVisible.value = true;
};

//对话框右上角的关闭事件
const handleClose = () => {
  //获取到表单dom，执行resetFields重置表单
  //关闭对话框
  dialogVisible.value = false;
  proxy.$refs["userForm"].resetFields();
};

//对话框右下角的取消事件
const handleCancel = () => {
  dialogVisible.value = false;
  proxy.$refs["userForm"].resetFields();
};

//编辑用户信息
  const handleEdit = (val) => {
    console.log(val)
    dialogVisible.value = true
    action.value = "edit"
    nextTick(()=>{
      Object.assign(formUser,{...val,sex:""+val.sex})
    })
  };

//修改增加的用户的出生日期的格式
// const timeFormat = (time) => {
//   var date = new Date(time);
//   var year = date.getFullYear();
//   var month = date.getMonth();
//   var day = date.getDate();
//   function add(m) {
//     return m < 10 ? "0" + m : m;
//   }
//   return year + "-" + add(month) + "-" + add(day);
// };
//这里的格式转换可以用value-format属性直接修改，参考element-plus文档

const onSubmit = () => {
  //验证表单是否有效
  proxy.$refs["userForm"].validate(async (valid) => {
    console.log(formUser);

    if (valid) {
      let res = null;
      // formUser.birth = /^\d{4}-\d{2}-\d{2}$/.test(formUser.birth)
      //   ? formUser.birth
      //   : timeFormat(formUser.birth);
      if (action.value === "add") {
        res = await proxy.$api.addUser(formUser);
      }else{
        res = await proxy.$api.editUser(formUser)
      }
      if (res) {
        console.log("--res---", res);
        dialogVisible.value = false;
        proxy.$refs["userForm"].resetFields();
        getUserData();
      }
    } else {
      ElMessage({
        showClose: true,
        type: "error",
        message: "请输入正确内容",
      });
    }
  });
};
</script>

<template>
  <div>
    <el-header class="user-header">
      <el-button type="primary" @click="handleAdd()">+新增</el-button>
      <el-form :inline="true" v-model="formItem">
        <el-form-item label="请输入">
          <el-input
            placeholder="请输入用户名"
            type="text"
            v-model="formItem.name"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch(formItem.name)"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
    </el-header>
    <div class="table">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column
          v-for="item in tableLabel"
          :key="item.prop"
          :label="item.label"
          :width="item.width ? item.width : 125"
          :prop="item.prop"
        />
        <el-table-column fixed="right" label="Operations" min-width="120">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)"> 编辑 </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pager"
        background
        layout="prev, pager, next"
        size="small"
        :total="config.total"
        @current-change="handleChange"
      />
    </div>
    <el-dialog
      v-model="dialogVisible"
      :title="action == 'add' ? '新增用户' : '编辑用户'"
      width="35%"
      :before-close="handleClose"
    >
      <!--需要注意的是设置了:inline="true"，
		会对el-select的样式造成影响，我们通过给他设置一个class=select-clearn
		在css进行处理-->
      <el-form :inline="true" :model="formUser" :rules="rules" ref="userForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="formUser.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input
                v-model.number="formUser.age"
                placeholder="请输入年龄"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item class="select-clearn" label="性别" prop="sex">
              <el-select v-model="formUser.sex" placeholder="请选择">
                <el-option label="男" value="1" />
                <el-option label="女" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期" prop="birth">
              <el-date-picker
                v-model="formUser.birth"
                type="date"
                placeholder="请输入"
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="地址" prop="addr">
            <el-input v-model="formUser.addr" placeholder="请输入地址" />
          </el-form-item>
        </el-row>
        <el-row style="justify-content: flex-end">
          <el-form-item>
            <el-button type="primary" @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="onSubmit()">确定</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.user-header {
  display: flex;
  justify-content: space-between;
}
.table {
  position: relative;
  height: 520px;
  .pager {
    position: absolute;
    right: 10px;
    bottom: 30px;
  }
  .el-table {
    width: 100%;
    height: 500px;
  }
}
.select-clearn {
  display: flex;
}
</style>
