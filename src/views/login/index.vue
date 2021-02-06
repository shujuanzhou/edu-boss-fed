<template>
  <div class='login'>
    <h1 class='title'>Edu Boss 管理系统</h1>
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
      label-position="top"
      class="login-form"
      :rules="rules"
    >
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type='password'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
        type="primary"
        @click="onSubmit"
        class='login-btn'
        :loading='isLogin'
        >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { Form } from 'element-ui'
import { login } from '@/services/user'

export default Vue.extend({
  name: 'LoginIndex',
  data () {
    return {
      form: {
        phone: '18201288771',
        password: '111111'
      },
      isLogin: false,
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async onSubmit () {
      try {
        // 表单验证
        await (this.$refs.form as Form).validate()
        this.isLogin = true
        const { data } = await login(this.form)
        if (data.state !== 1) {
          this.$message.error(data.message)
        } else {
          this.$store.commit('setUser', data.content)
          this.$router.push(this.$route.query.redirect as string || '/')
          this.$message.success('登录成功')
        }
      } catch (err) {
        console.log(err)
      }
      this.isLogin = false
    }
  }
})
</script>

<style lang='scss' scoped>
.login{
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .title{
    padding:150px 0 20px;
  }
  .login-form{
    background-color: #fff;
    width: 400px;
    border-radius: 5px;
    padding: 10px;
    .login-btn{
      width: 100%;
    }
  }
}
</style>
