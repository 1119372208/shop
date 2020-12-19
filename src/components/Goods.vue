<template>
  <div class="goods">
     <el-button @click="goAdd" class="addBtn" plain type="success">添加商品</el-button>
     <el-table
      :data="goodsList"
      style="width: 100%">
      <el-table-column
       type="index"
        :index="indexMethod">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格"
        width="180">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量">
      </el-table-column>
      <el-table-column
        prop="add_time"
        label="创建时间">
        <template v-slot:default="{row}">
          {{row.add_time | time}}
        </template>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodsList: [],
      Pnp: '',
      pagenum: 1,
      pagesize: 5,
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const { meta, data } = await this.$axios.get('goods', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          Pnp: this.Pnp
        }
      })
      // console.log(res)
      if (meta.status === 200) {
        this.goodsList = data.goods
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
    },
    indexMethod (value) {
      return value + 1 + (this.pagenum - 1) * this.pagesize
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum = 1
      this.getGoodsList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getGoodsList()
    },
    goAdd () {
      this.$router.push('./goods-add')
    }
  }
}
</script>

<style lang="scss" scoped>
  .addBtn {
    margin-bottom: 10px;
  }
</style>
