<template>
  <div class='course-video'>课程视频</div>
</template>

<script lang='ts'>
import Vue from 'vue'

export default Vue.extend({
  name: 'CourseVideo',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  components: {},
  data () {
    return {}
  },
  methods: {}
})
</script>

<style lang="scss" scoped>

</style>
