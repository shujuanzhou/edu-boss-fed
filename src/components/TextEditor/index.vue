<template>
  <div ref='editor' class='text-editor'></div>
</template>

<script lang='ts'>
import Vue from 'vue'
import E from 'wangeditor'
import { uploadCourseImg } from '@/services/course'

export default Vue.extend({
  name: 'TextEditor',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  mounted () {
    this.initEditor()
  },
  methods: {
    initEditor () {
      const editor = new E(this.$refs.editor as any)
      // 事件监听必须在create之前
      editor.config.onchange = (value: string) => {
        this.$emit('input', value)
      }
      editor.create()
      // 设置初始值必须在create之后
      editor.txt.html(this.value)
      editor.config.customUploadImg = async function (resultFiles: any, insertImgFn: any) {
        const fd = new FormData()
        fd.append('file', resultFiles[0])
        const { data } = await uploadCourseImg(fd)
        insertImgFn(data.data.name)
        // console.log(resultFiles, insertImgFn)
      }
    }
  }
})
</script>

<style>

</style>
