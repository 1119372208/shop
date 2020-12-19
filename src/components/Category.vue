<template>
  <div class="category">
    <el-button @click="addCategoryDialog" class="addBtn" plain type="success">添加分类</el-button>
    <el-table
      :data="categoryList"
      v-loading="loading"
      row-key="cat_id"
      style="width: 100%">
      <el-table-column
        prop="cat_name"
        label="分类名称">
      </el-table-column>
      <el-table-column
        label="是否有效"
        width="180">
        <template v-slot:default="{row}">
          {{row.cat_delete ? '否' : '是'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="cat_level"
        label="层级">
      </el-table-column>
      <el-table-column
        label="操作">
        <template v-slot:default="{}">
          <el-button
            plain
            size="small"
            type="primary"
            icon="el-icon-edit"
          ></el-button>
          <el-button
            plain
            size="small"
            type="danger"
            icon="el-icon-delete"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog @close="closeDialog" title="添加分类" :visible.sync="addDialog" width="40%">
      <el-form ref="addCategoryForm" :model="addCategoryForm" label-width="80px" :rules="rules">
         <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCategoryForm.cat_name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-cascader
            v-model="addCategoryForm.cat_pid"
            :options="options"
            :props="props"
            clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button @click="addCategory" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      categoryList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      loading: false,
      addDialog: false,
      addCategoryForm: {
        cat_name: '',
        cat_pid: [],
        cat_level: ''
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: ['blur', 'change'] }
        ]
      },
      options: [],
      props: {
        checkStrictly: true,
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      }
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    async getCategoryList () {
      this.loading = true
      const { meta, data } = await this.$axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      // console.log(data)
      if (meta.status === 200) {
        this.categoryList = data.result
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
      this.loading = false
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum = 1
      this.getCategoryList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getCategoryList()
    },
    async addCategoryDialog () {
      this.addDialog = true
      const { data, meta } = await this.$axios.get('categories?type=2')
      // console.log(data, meta)
      if (meta.status === 200) {
        this.options = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async addCategory () {
      try {
        this.$refs.addCategoryForm.validate()
        const { meta, data } = await this.$axios.post('categories', {
          cat_pid: this.addCategoryForm.cat_pid[this.addCategoryForm.cat_pid.length - 1] || 0,
          cat_name: this.addCategoryForm.cat_name,
          cat_level: this.addCategoryForm.cat_pid.length
        })
        console.log(meta, data)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.getCategoryList()
        // this.addDialog = false
        }
      } catch (error) {
        console.log(error)
      }
    },
    closeDialog () {
      this.$refs.addCategoryForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .category {
    .addBtn {
      margin-bottom: 10px;
    }
  }
</style>
