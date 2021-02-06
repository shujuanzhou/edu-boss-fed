<template>
  <div class="role-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item prop="name" label="角色名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit"
              :disabled="isLoading"
            >查询搜索</el-button>
            <el-button
              @click="onReset"
              :disabled="isLoading"
            >重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button size="medium" @click="handleAddRole">添加角色</el-button>
      </div>
      <el-table
        :data="roles"
        style="width: 100%; margin-bottom: 20px"
        v-loading="isLoading"
      >
        <el-table-column
          type="index"
          label="编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="description"
          width="180"
          label="描述">
        </el-table-column>
        <el-table-column
          width="260"
          prop="createdTime"
          label="添加时间">
        </el-table-column>
        <el-table-column
          width="300"
          label="操作">
          <template slot-scope="scope">
            <div>
              <el-button
                type="text"
                @click="$router.push({
                  name: 'alloc-menu',
                  params: {
                    roleId: scope.row.id
                  }
                })"
              >分配菜单</el-button>
              <el-button
                type="text"
                @click="$router.push({
                  name: 'alloc-resource',
                  params: {
                    roleId: scope.row.id
                  }
                })"
              >分配资源</el-button>
            </div>
            <div>
              <el-button
                type="text"
                @click="handleEdit(scope.row)"
              >编辑</el-button>
              <el-button
                size="mini"
                type="text"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!--
        total 总记录数
        page-size 每页大小
        分页组件会自动根据 total 和 page-size 计算出一共分多少页
       -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :disabled="isLoading"
        :current-page.sync="form.current"
        :page-sizes="[5, 10, 20]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </el-card>

    <el-dialog
      :title="isEdit ? '编辑角色' : '新增角色' "
      :visible.sync="dialogFormVisible">
      <create-or-edit-role
        v-if="dialogFormVisible"
        :is-edit="isEdit"
        :role-id="roleId"
        @success="onSuccess"
        @cancle="onCancle"/>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { getRolesPages, deleteRole } from '@/services/role'
import CreateOrEditRole from './CreateOrEdit.vue'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'RoleList',
  components: {
    CreateOrEditRole
  },
  data () {
    return {
      roles: [], // 资源列表
      form: {
        name: '',
        current: 1, // 默认查询第1页数据
        size: 10 // 每页大小
      },
      totalCount: 0,
      isLoading: true, // 加载状态
      dialogFormVisible: false,
      roleId: null, // 编辑角色的id
      isEdit: false
    }
  },
  created () {
    this.loadRoles()
  },
  methods: {
    async loadRoles () {
      this.isLoading = true // 展示加载中状态
      const { data } = await getRolesPages(this.form)
      this.roles = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false // 关闭加载中状态
    },

    onSubmit () {
      this.form.current = 1 // 筛选查询从第 1 页开始
      this.loadRoles()
    },

    handleAddRole () {
      this.isEdit = false
      this.dialogFormVisible = true
    },

    handleEdit (item: any) {
      this.isEdit = true
      this.dialogFormVisible = true
      this.roleId = item.id
    },

    handleDelete (item: any) {
      this.$confirm('确认删除吗？', '删除提示', {})
        .then(async () => { // 确认执行这里
          // 请求删除操作
          const { data } = await deleteRole(item.id)
          if (data.code === '000000') {
            this.$message.success('删除成功')
            this.loadRoles() // 更新数据列表
          } else {
            this.$message.error(data.mesg)
          }
        })
        .catch(() => { // 取消执行这里
          this.$message.info('已取消删除')
        })
    },

    onSuccess () {
      this.dialogFormVisible = false
      this.loadRoles()
    },

    onCancle () {
      this.dialogFormVisible = false
    },

    onReset () {
      (this.$refs.form as Form).resetFields()
      this.form.current = 1 // 重置回到第1页
      this.loadRoles()
    },

    handleSizeChange (val: number) {
      this.form.size = val
      this.form.current = 1 // 每页大小改变重新查询第1页数据
      this.loadRoles()
    },

    handleCurrentChange (val: number) {
      // 请求获取对应页码的数据
      this.form.current = val // 修改要查询的页码
      this.loadRoles()
    }
  }
})
</script>

<style>

</style>
