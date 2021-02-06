<template>
  <el-card>
    <div slot="header">
      <el-steps :active="activeStep" finish-status="success">
        <el-step
          v-for="(item, index) in steps"
          :title="item.title"
          :key="index"
          @click.native="item.click"
          ></el-step>
      </el-steps>
    </div>
    <el-form label-width="80px">
      <div v-show="activeStep === 0">
        <el-form-item label="课程名称">
          <el-input v-model="course.courseName"></el-input>
        </el-form-item>
        <el-form-item label="课程简介">
          <el-input v-model="course.brief"></el-input>
        </el-form-item>
        <el-form-item label="课程概述">
          <el-input
            v-model="course.previewFirstField"
            style="margin-bottom: 20px"
            placeholder="概述1"
          ></el-input>
          <el-input
            v-model="course.previewSecondField"
            placeholder="概述2"
          ></el-input>
        </el-form-item>
        <el-form-item label="讲师姓名">
          <el-input v-model="course.teacherDTO.teacherName"></el-input>
        </el-form-item>
        <el-form-item label="讲师简介">
          <el-input v-model="course.teacherDTO.description"></el-input>
        </el-form-item>
        <el-form-item label="课程排序">
          <el-input-number v-model="course.sortNum" label="描述文字"></el-input-number>
        </el-form-item>
      </div>

      <div v-show="activeStep === 1">
        <el-form-item label="课程封面">
          <course-image v-model="course.courseListImg"/>
        </el-form-item>
        <el-form-item label="介绍封面">
          <course-image v-model="course.courseImgUrl"/>
        </el-form-item>
        <el-form-item></el-form-item>
      </div>

      <div v-show="activeStep === 2">
        <el-form-item label="售卖价格">
          <el-input v-model="course.discounts">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品原价">
          <el-input v-model="course.price">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="销量">
          <el-input v-model="course.sales">
            <template slot="append">单</template>
          </el-input>
        </el-form-item>
        <el-form-item label="活动标签">
          <el-input v-model="course.priceTag">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
      </div>

      <div v-show="activeStep === 3">
        <el-form-item label="限时秒杀开关">
          <el-switch
            v-model="isSeckill"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <template v-if="isSeckill">
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="course.activityCourseDTO.beginTime"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" >
            <el-date-picker
              v-model="course.activityCourseDTO.endTime"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="秒杀价">
            <el-input v-model="course.amount">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="秒杀库存">
            <el-input v-model="course.stock">
              <template slot="append">个</template>
            </el-input>
          </el-form-item>
        </template>
      </div>

      <div v-show="activeStep === 4">
        <el-form-item label="课程详情">
          <text-editor v-model="course.courseDescriptionMarkDown"/>
        </el-form-item>
        <el-form-item label="是否发布">
          <el-switch
            v-model="course.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>

        <el-form-item>
          <el-button  @click="handleSave">提交</el-button>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button  @click="activeStep--" v-if="activeStep > 0 && activeStep <= 4">上一步</el-button>
        <el-button  @click="activeStep++" v-if="activeStep >= 0 && activeStep < 4">下一步</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang='ts'>
import Vue from 'vue'
import CourseImage from './CourseImage.vue'
import TextEditor from '@/components/TextEditor/index.vue'
import { saveOrUpdateCourse, getCourseInfo } from '@/services/course'
import moment from 'moment'

export default Vue.extend({
  name: 'CreateOrUpdate',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    courseId: {
      type: [String, Number]
    }
  },
  data () {
    return {
      activeStep: 0,
      steps: [
        {
          title: '基本信息',
          click: () => {
            (this as any).activeStep = 0
          }
        },
        {
          title: '课程封面',
          click: () => {
            (this as any).activeStep = 1
          }
        },
        {
          title: '销售信息',
          click: () => {
            (this as any).activeStep = 2
          }
        },
        {
          title: '秒杀活动',
          click: () => {
            (this as any).activeStep = 3
          }
        },
        {
          title: '课程详情',
          click: () => {
            (this as any).activeStep = 4
          }
        }
      ],
      imageUrl: '', // 预览图片地址
      isSeckill: false,
      course: {
        // id: 0,
        courseName: '',
        brief: '',
        teacherDTO: {
          // id: 0,
          // courseId: 0,
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        courseDescriptionMarkDown: '',
        price: 0,
        discounts: 0,
        priceTag: '',
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        courseListImg: '',
        courseImgUrl: '',
        sortNum: 0,
        previewFirstField: '',
        previewSecondField: '',
        status: 0,
        sales: 0,
        activityCourse: true,
        activityCourseDTO: {
          // id: 0,
          // courseId: 0,
          beginTime: '',
          endTime: '',
          amount: 0,
          stock: 0
        },
        autoOnlineTime: ''
      }
    }
  },
  created () {
    if (this.isEdit) {
      this.loadCourse()
    }
  },
  methods: {
    async loadCourse () {
      console.log(this.courseId)
      const { data } = await getCourseInfo(this.courseId)
      const { activityCourseDTO } = data.data
      if (activityCourseDTO && activityCourseDTO.beginTime) {
        activityCourseDTO.beginTime = moment(activityCourseDTO.beginTime).format('yyyy-MM-dd')
      }
      if (activityCourseDTO && activityCourseDTO.endTime) {
        activityCourseDTO.endTime = moment(activityCourseDTO.endTime).format('yyyy-MM-dd')
      }
      this.course = data.data
    },
    async handleSave () {
      const { data } = await saveOrUpdateCourse(this.course)
      this.$router.push({
        name: 'CourseIndex'
      })
    }
  },
  components: {
    CourseImage,
    TextEditor
  }
})
</script>

<style>
.el-step{
  cursor: pointer;
}
</style>
