<template>
  <el-container>
    <el-aside width='200px'>
      <app-aside />
    </el-aside>
    <el-container>
      <el-header><app-header /></el-header>
      <el-main><router-view /></el-main>
    </el-container>
  </el-container>
</template>

<script>
import Vue from 'vue'
import AppAside from './components/app-aside'
import AppHeader from './components/app-header'

export default Vue.extend({
  name: 'Layout',
  components: {
    AppAside,
    AppHeader
  }
})
</script>

<style lang="scss" scoped>
.el-container {
  min-height: 100vh;
  min-width: 980px;
}

.el-aside {
  background: #d3dce6;
}

.el-header {
  background: #fff;
}

.el-main {
  background: #e9eef3;
}
</style>
