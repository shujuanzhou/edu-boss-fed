<template>
  <div class="resource-list">
    <el-card class="box-card">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item prop="courseName" label="课程名称">
          <el-input v-model="form.courseName"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-select v-model="form.status" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <el-button type="primary" size="medium" @click="handleAdd">添加课程</el-button>
      </div>
      <el-table
        :data="courses"
        style="width: 100%; margin-bottom: 20px"
        v-loading="isLoading"
      >
        <el-table-column
          type="index"
          label="ID"
          width="100">
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="课程名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="price"
          width="180"
          label="价值">
        </el-table-column>
        <el-table-column
          prop="sortNum"
          width="180"
          label="排序">
        </el-table-column>
        <el-table-column
          width="180"
          prop="createdTime"
          label="上架状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              :disabled="scope.row.isStatusLoading"
              @change="onStatusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          width="180"
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleContenManage(scope.row)">内容管理</el-button>
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
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getCoursePages, changeState } from '@/services/course'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'ResourceList',
  data () {
    return {
      courses: [], // 资源列表
      form: {
        currentPage: 0,
        pageSize: 10,
        courseName: '',
        status: 0
      },
      totalCount: 0,
      isLoading: true, // 加载状态
      dialogFormVisible: false,
      formLabelWidth: 200,
      options: [
        {
          label: '启用',
          value: 1
        },
        {
          label: '禁用',
          value: 0
        }
      ]
    }
  },

  created () {
    this.loadCourse()
  },

  methods: {
    async loadCourse () {
      this.isLoading = true // 展示加载中状态
      const { data } = await getCoursePages(this.form)
      data.data.records.forEach((item: any) => {
        item.isStatusLoading = false
      })
      this.courses = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false // 关闭加载中状态
    },

    onSubmit () {
      this.form.currentPage = 1 // 筛选查询从第 1 页开始
      this.loadCourse()
    },

    handleEdit (item: any) {
      this.$router.push({
        name: 'course-edit',
        params: {
          courseId: item.id
        }
      })
    },

    handleSizeChange (val: number) {
      this.form.pageSize = val
      this.form.currentPage = 1 // 每页大小改变重新查询第1页数据
      this.loadCourse()
    },

    handleCurrentChange (val: number) {
      // 请求获取对应页码的数据
      this.form.currentPage = val // 修改要查询的页码
      this.loadCourse()
    },

    onReset () {
      (this.$refs.form as Form).resetFields()
      this.form.currentPage = 1 // 重置回到第1页
      this.loadCourse()
    },
    handleAdd () {
      this.$router.push({
        name: 'course-create'
      })
    },
    handleContenManage (row: any) {
      this.$router.push({
        name: 'course-section',
        params: {
          courseId: row.id
        }
      })
    },
    async onStatusChange (course: any) {
      course.isStatusLoading = true
      const { data } = await changeState({
        courseId: course.id,
        status: course.status
      })
      this.$message.success(`${course.status === 0 ? '下架' : '上架'}成功`)
      course.isStatusLoading = false
    }
  }
})
</script>

<style lang="scss" scoped></style>
