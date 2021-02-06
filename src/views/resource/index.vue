<template>
  <div>
    <resource-list />
  </div>
</template>

<script>
import Vue from 'vue'
import ResourceList from './components/List'
export default Vue.extend({
  name: 'Resource',
  components: {
    ResourceList
  }
})
</script>

<style>

</style>
