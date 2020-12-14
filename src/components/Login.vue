<template>
  <div class="login">
    <el-form ref="form" :status-icon="true" :rules="rules" :model="form" label-width="80px">
      <img src="../assets/avatar.jpg" alt />
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="login" type="primary" class="loginBtn">登录</el-button>
        <el-button @click="reset" type="primary" plain>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['blur', 'change']
          },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['blur', 'change']
          },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    async login () {
      // this.$refs.form.validate(valid => {
      //   // console.log(valid)
      //   if (!valid) return
      //   axios
      //     .post('http://localhost:8888/api/private/v1/login', this.form)
      //     .then(res => {
      //       // console.log(res)
      //       const { meta } = res.data
      //       if (meta.status === 200) {
      //         this.$message({
      //           message: meta.msg,
      //           type: 'success'
      //         })
      //         this.$router.push('/index')
      //       } else {
      //         this.$message({
      //           message: meta.msg,
      //           type: 'error'
      //         })
      //       }
      //     })
      // })
      await this.$refs.form.validate()
      const res = await axios.post('http://localhost:8888/api/private/v1/login', this.form)
      console.log(res)
      const { meta, data } = res.data
      // console.log(data.token)
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
        localStorage.setItem('token', data.token)
        this.$router.push('/index')
      } else {
        this.$message({
          message: meta.msg,
          type: 'error'
        })
      }
    },
    reset () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss">
.login {
  background-color: #2d434c;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .el-form {
    width: 400px;
    background-color: #fff;
    margin: 0 auto;
    margin-top: 200px;
    padding: 20px;
    padding-top: 70px;
    border-radius: 20px;
    position: relative;
    img {
      position: absolute;
      top: -70px;
      left: 50%;
      transform: translate(-50%);
      border-radius: 50%;
      border: 5px solid #fff;
    }
    .loginBtn {
      margin-right: 70px;
    }
  }
}
</style>
