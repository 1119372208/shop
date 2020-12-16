<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-input placeholder="请输入关键字" v-model="query" class="input-with-select">
      <el-button @click="searchUser" slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-button @click="addUserDialog" class="addBtn" plain type="success">添加用户</el-button>
    <el-table :data="userList" style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template v-slot:default="obj">
          <el-switch @change="changeState(obj.row)" v-model="obj.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="obj">
          <el-button @click="editUserDialog(obj.row)" plain size="small" type="primary" icon="el-icon-edit"></el-button>
          <el-button @click="delUser(obj.row.id)" plain size="small" type="danger" icon="el-icon-delete"></el-button>
          <el-button plain size="small" type="success" icon="el-icon-check">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog
      @close="closeDialog"
      title="添加用户"
      :visible.sync="addDialog"
      width="40%">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button @click="addUser" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
     <el-dialog
      title="修改用户"
      :visible.sync="editDialog"
      width="40%">
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button @click="editUser" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  data () {
    return {
      total: 0,
      userList: [],
      query: '',
      pagenum: 1,
      pagesize: 2,
      addDialog: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editDialog: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 6, message: '长度在3到6个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 6, max: 12, message: '长度在6到12个字符', trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '请输入正确邮箱', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确手机号', trigger: ['blur', 'change'] }
        ]
      },
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data, meta } = await this.$axios.get(
        'users',
        {
          params: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        }
      )
      if (meta.status === 200) {
        this.userList = data.users
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
      // console.log(data)
      // console.log(this.total)
    },
    // 修改每页的条数
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getUserList()
    },
    // 当前页变化时, 触发
    handleCurrentChange (val) {
      this.pagenum = val
      this.getUserList()
    },
    async delUser (id) {
      console.log(id)
      try {
        await this.$confirm('确定要删除吗', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`users/${id}`)
        // console.log(data)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          if (this.userList.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getUserList()
        }
      } catch (e) {
        console.log(e)
      }
    },
    searchUser () {
      // console.log(12)
      this.pagenum = 1
      this.getUserList()
    },
    async changeState (row) {
      // console.log(row)
      console.log(row.id, row.mg_state)
      const { meta } = await this.$axios.put(`users/${row.id}/state/${row.mg_state}`)
      // console.log(res)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
    },
    addUserDialog () {
      this.addDialog = true
    },
    async addUser () {
      console.log(12)
      try {
        await this.$refs.form.validate()
        const { data, meta } = await this.$axios.post('users', this.form)
        console.log(data)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.addDialog = false
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (error) {
        console.log(error)
      }
    },
    closeDialog () {
      this.$refs.form.resetFields()
    },
    editUserDialog (row) {
      this.editDialog = true
      // console.log(row)
      this.editForm.id = row.id
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
    },
    async editUser () {
      // console.log('哈哈')
      try {
        await this.$refs.editForm.validate()
        const { meta } = await this.$axios.put(`users/${this.editForm.id}`, this.editForm)
        // console.log(res)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getUserList()
          this.editDialog = false
        } else {
          this.$message.error(meta.msg)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-breadcrumb {
     margin-bottom: 10px;
     border-bottom: 1px solid #ccc;
     height: 40px;
     line-height: 40px;
  }
  .input-with-select {
    width: 300px;
    margin-bottom: 10px;
  }
  .addBtn {
    margin: 0 20px;
  }
</style>
