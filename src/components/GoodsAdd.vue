<template>
  <div class="goodsAdd">
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <el-tabs v-model="activeTab" tab-position="left" @tab-click="handleClick">
      <el-tab-pane name="0" label="用户管理">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="商品名称" prop="roleName">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="roleDesc">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
           <el-form-item label="商品重量" prop="roleDesc">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
           <el-form-item label="商品数量" prop="roleDesc">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
           <el-form-item label="商品分类" prop="roleDesc">
            <el-cascader
              v-model="form.goods_cat"
              :options="options"
              :props=props>
            </el-cascader>
          </el-form-item>
        </el-form>
        <el-button @click="next" type="primary">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane name="1" label="配置管理">
        <el-upload
          action="http://localhost:8888/api/private/v1/upload"
          :headers="headers"
          multiple
          name="file"
          :on-success="handleSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          list-type="picture-card">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <el-button @click="next" type="primary">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane name="2" label="角色管理">
         <quill-editor
          ref="myQuillEditor"
          v-model="form.goods_introduce"
        />
        <el-button @click="addGoods" type="primary">添加商品</el-button>
      </el-tab-pane>
    </el-tabs>
    <!-- <el-button @click="prev" type="primary">上一步</el-button> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      form: {
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: []

      },
      options: [],
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      activeTab: '0',
      headers: {
        Authorization: localStorage.getItem('token')
      },
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  async created () {
    const { meta, data } = await this.$axios.get('categories?type=3')
    // console.log(meta, data)
    if (meta.status === 200) {
      this.options = data
    }
  },
  methods: {
    handleClick (tab) {
      // console.log(tab)
      this.active = +tab.index
    },
    next () {
      if (this.active > 1) return
      this.active++
      this.activeTab = this.active + ''
    },
    handleSuccess (response) {
      const { meta, data } = response
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.form.pics.push({
          pic: data.tmp_path
        })
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
      this.form.pics = this.form.pics.filter(item => item.pic !== file.response.data.tmp_path)
    },
    handlePictureCardPreview (file) {
      console.log(file)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    async addGoods () {
      const { meta } = await this.$axios.post('goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join(',')
      })
      // console.log(res)
      if (meta.status === 201) {
        this.$router.push('/goods')
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
    }
    // prev () {
    //   // console.log(1234)
    //   if (this.active < 1) return
    //   this.active--
    //   console.log(this.active)
    //   this.activeTab = this.active + ''
    // }
  }

}
</script>

<style lang="scss" scoped>
  .quill-editor {
    background-color: #fff;
   ::v-deep .ql-editor {
      min-height: 400px;
    }
  }
</style>
