import request from '@/utils/request'
import qs from 'qs'

export const getCoursePages = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/course/getQueryCourses',
    data
  })
}

export const changeState = (params: any) => {
  return request({
    method: 'GET',
    url: '/boss/course/changeState',
    params
  })
}

export const saveOrUpdateCourse = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/course/saveOrUpdateCourse',
    data
  })
}

export const uploadCourseImg = (data: any, onUploadProgress?: (progressEvent: ProgressEvent) => void) => {
  return request({
    method: 'POST',
    url: '/boss/course/upload',
    data,
    // HTML5新增的上传响应事件，原生的叫progress，axios进行了包装
    onUploadProgress
  })
}

export const getCourseInfo = (courseId: string | number) => {
  return request({
    method: 'GET',
    url: '/boss/course/getCourseById',
    params: {
      courseId
    }
  })
}
