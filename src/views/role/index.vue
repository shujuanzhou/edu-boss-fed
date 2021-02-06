<template>
  <div>
    <role-list />
  </div>
</template>

<script>
import Vue from 'vue'
import RoleList from './components/List'
export default Vue.extend({
  name: 'Role',
  components: {
    RoleList
  }
})
</script>

<style>

</style>
