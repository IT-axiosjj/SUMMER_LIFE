<template>
  <div class="login-box">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="80px"
      class="demo-ruleForm"
    >
      <h2>后台管理系统</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="ruleForm.username" autocomplete="off" />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
          v-model="ruleForm.password"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          class="loginBtn"
          type="primary"
          @click="submitForm(ruleFormRef)"
          >登录</el-button
        >
        <el-button class="loginBtn" @click="resetForm"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { LoginData } from "../type/login";
import type { FormInstance } from "element-plus";
import {login} from '../request/api'
import {useRouter} from 'vue-router'
export default defineComponent({
  setup() {
    const data = reactive(new LoginData());
    const rules = {
      username: [
        {
          required: true,
          message: "请输入账号",
          trigger: "blur",
        },
        {
          min: 3,
          max: 10,
          message: "账号长度在3到10之间",
          trigger: "blur",
        },
      ],
      password: [
        {
          required: true,
          message: "请输入密码",
          trigger: "blur",
        },
        {
          min: 3,
          max: 10,
          message: "密码长度在3到10之间",
          trigger: "blur",
        },
      ],
    };
    //登录
    const ruleFormRef = ref<FormInstance>();
    const router = useRouter() //---->$router
    const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  // 对表单内容进行验证
  // valid布尔型 为true表示验证成功，反之false验证失败
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
      login(data.ruleForm).then((res)=>{
        // console.log('成功',res);
        //将token进行保存
        localStorage.setItem('token',res.data.token)
        // 跳转页面，首页
        router.push('/')
      })
    } else {
      console.log('error submit!')
      return false
    }
  })
  // console.log(formEl);
  
}

    //重置
    const resetForm = () => {
      data.ruleForm.username = ""; 
      data.ruleForm.password = "";
    };
    return { ...toRefs(data), rules, ruleFormRef, resetForm, submitForm };
  },
});
</script>

<style scoped>
.login-box {
  width: 100%;
  height: 100%;
  padding: 1px;
  text-align: center;
  background: url("../assets/bg.jpg");
}
.demo-ruleForm {
  width: 500px;
  margin: 200px auto;
  background-color: aliceblue;
  padding: 40px;
  border-radius: 20px;
}
.loginBtn {
  width: 48%;
}
h2 {
  margin-bottom: 10px;
}
</style>