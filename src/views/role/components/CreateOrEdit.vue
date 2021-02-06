<template>
  <div>
    <el-form>
      <el-form-item label="角色名称" :label-width="formLabelWidth">
        <el-input v-model="role.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色编码" :label-width="formLabelWidth">
        <el-input v-model="role.code" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" :label-width="formLabelWidth">
        <el-input v-model="role.description" autocomplete="off" type="textarea" :rows="4"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancle">取 消</el-button>
      <el-button type="primary" @click="handleOk">确 定</el-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { createOrEditRole, getRoleById } from '@/services/role'

export default Vue.extend({
  name: 'CreateOrEditRole',
  props: {
    roleId: {
      type: [String, Number]
    },
    isEdit: {
      type: Boolean
    }
  },
  data () {
    return {
      formLabelWidth: '120',
      role: {
        name: '',
        code: '',
        description: ''
      }
    }
  },
  created () {
    if (this.isEdit) {
      this.loadRole()
    }
  },
  methods: {
    async handleOk () {
      const { data } = await createOrEditRole(this.role)
      if (data.code === '000000') {
        this.$message.success('提交成功')
        this.$emit('success')
      }
    },
    async loadRole () {
      const { data } = await getRoleById(this.roleId)
      this.role = data.data
    },
    handleCancle () {
      this.$emit('cancle')
    }
  }
})
</script>

<style>

</style>
