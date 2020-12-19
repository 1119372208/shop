<template>
  <el-container class="index">
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <div class="title">
        <h1>电商后台管理系统</h1>
      </div>
      <div class="logout">
        <a href="javascript:;" @click="logout">退出</a>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          router
          unique-opened
          :default-active="defaultActive"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu v-for="item in menuList" :index="item.path" :key="item.id">
            <!-- 标题 -->
            <template v-slot:title>
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>

            <el-menu-item v-for="item in item.children" :key="item.id" :index="item.path">
              <i class="el-icon-menu"></i>
              <span slot="title">{{item.authName}}</span>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: []
    }
  },
  async created () {
    const { meta, data } = await this.$axios.get('menus')
    if (meta.status === 200) {
      this.menuList = data
    } else {
      this.$message.error(meta.msg)
    }
    // console.log(data)
  },
  methods: {
    async logout () {
      try {
        await this.$confirm('确定要退出吗', '温馨提示', {
          type: 'warning'
        })
        localStorage.removeItem('token')
        this.$message.success('退出成功')
        this.$router.push('/login')
      } catch (e) {
        console.log(e)
        this.$message.error('取消退出')
      }
    }
  },
  computed: {
    defaultActive () {
      // console.log(this.$route)
      return this.$route.path.slice(1).split('-')[0]
    }
  }
}
</script>

<style lang="scss" scoped>
.index {
  height: 100%;
  .el-header {
    background-color: #d8d8d8;
    display: flex;
    .logo {
      width: 180px;
      img {
        // width: 100%;
        height: 40px;
        margin-top: 10px;
      }
    }
    .title {
      flex: 1;
      text-align: center;
      color: #545c64;
      line-height: 60px;
    }
    .logout {
      width: 180px;
      text-align: right;
      line-height: 60px;
      font-weight: 700;
      a {
        color: orange;
      }
    }
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-main {
    background-color: #ecf0f1;
  }
}
</style>
