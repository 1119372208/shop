<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button @click="addRoleDialog" class="addRoleBtn" plain type="success">添加角色</el-button>
    <el-table :data="rolesList" style="width: 100%">
      <el-table-column type="expand">
        <template v-slot:default="{row}">
          <!-- {{row}} -->
          <el-row class="l1" v-for="l1 in row.children" :key="l1.id">
            <!-- 一级权限 -->
            <el-col :span="4">
              <el-tag @close="delRolesRight(row, l1.id)" closable>{{l1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <!-- 二级权限 -->
            <el-col :span="20">
              <el-row class="l2" v-for="l2 in l1.children" :key="l2.id">
                <el-col :span="4">
                  <el-tag @close="delRolesRight(row, l2.id)" closable>{{l2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <!-- 三级权限 -->
                  <el-tag
                    @close="delRolesRight(row, l3.id)"
                    class="l3"
                    closable
                    v-for="l3 in l2.children"
                    :key="l3.id"
                  >{{l3.authName}}</el-tag>
                  <!-- <i class="el-icon-arrow-right"></i> -->
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column prop="address" label="操作">
        <template v-slot:default="obj">
          <el-button @click="editRoleDialog(obj.row)" plain size="small" type="primary" icon="el-icon-edit"></el-button>
          <el-button @click="delRole(obj.row.id, $event)" plain size="small" type="danger" icon="el-icon-delete"></el-button>
          <el-button
            @click="showAssignDialog(obj.row)"
            plain
            size="small"
            type="success"
            icon="el-icon-check"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="分配权限" :visible.sync="assignVisible" width="40%">
      <el-tree ref="tree" node-key="id" show-checkbox default-expand-all :data="data" :props="defaultProps"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignVisible = false">取 消</el-button>
        <el-button @click="assignRights" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="添加角色"
      :visible.sync="addDialog"
      width="40%">
      <el-form ref="addRoleForm" :model="addRoleForm" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button @click="addRole" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改角色"
      :visible.sync="editDialog"
      width="40%">
      <el-form ref="addRoleForm" :model="editRoleForm" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button @click="editRole" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleId: '',
      rolesList: [],
      assignVisible: false,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      addDialog: false,
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: ['blur', 'change'] }
        ]
      },
      editDialog: false,
      editRoleForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data, meta } = await this.$axios.get('roles')
      // console.log(data)
      if (meta.status === 200) {
        this.rolesList = data
      }
    },
    async delRolesRight (row, id) {
      console.log(row, id)
      const { meta, data } = await this.$axios.delete(
        `roles/${row.id}/rights/${id}`
      )
      console.log(data)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        row.children = data
      }
    },
    async showAssignDialog (row) {
      // console.log(row)
      // console.log(row.children)
      // console.log(row.children.children)
      this.assignVisible = true
      this.roleId = row.id
      const { data, meta } = await this.$axios.get('rights/tree')
      // console.log(res)
      if (meta.status === 200) {
        this.data = data
        const ids = []
        row.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              // console.log(l3.id)
              ids.push(l3.id)
            })
          })
        })
        // console.log(ids)
        this.$refs.tree.setCheckedKeys(ids)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async assignRights () {
      const ids = this.$refs.tree.getCheckedKeys()
      const halfs = this.$refs.tree.getHalfCheckedKeys()
      // console.log(ids, halfs)
      const rids = [...ids, ...halfs].join(',')
      console.log(rids)
      const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      // console.log(res)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.getRolesList()
        this.assignVisible = false
      } else {
        this.$message.error(meta.msg)
      }
    },
    async delRole (id, e) {
      console.log(e)
      if (e.target.nodeName === 'BUTTON') {
        e.target.blur()
      } else {
        e.target.parentNode.blur()
      }
      // console.log(id)
      try {
        await this.$confirm('确定要删除吗', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`roles/${id}`)
        // console.log(meta)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getRolesList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (error) {
        // console.log(error)
        // this.$message.error(meta.msg)
      }
    },
    addRoleDialog () {
      this.addDialog = true
    },
    async addRole () {
      try {
        await this.$refs.addRoleForm.validate()
        const { meta } = await this.$axios.post('roles', this.addRoleForm)
        // console.log(res)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.getRolesList()
          this.addDialog = false
        } else {
          this.$message.error(meta.msg)
        }
      } catch (error) {
        console.log(error)
      }
    },
    editRoleDialog (row) {
      this.editDialog = true
      console.log(row)
      this.editRoleForm.roleName = row.roleName
      this.editRoleForm.roleDesc = row.roleDesc
      this.editRoleForm.id = row.id
    },
    async editRole () {
      // console.log(123)
      const { id, roleName, roleDesc } = this.editRoleForm
      const { meta } = await this.$axios.put(`roles/${id}`, { roleName, roleDesc })
      // console.log(res)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.getRolesList()
        this.editDialog = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.roles {
  .l1 {
    margin-bottom: 10px;
  }
  .l2 {
    margin-bottom: 10px;
  }
  .l3 {
    margin-bottom: 10px;
    margin-right: 5px;
  }
  .addRoleBtn {
    margin-bottom: 10px;
  }
}
</style>
