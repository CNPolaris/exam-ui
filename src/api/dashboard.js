import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function dashInfo() {
  return request({
    url: '/admin/dash/base/count',
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    }
  })
}

export function getLoginLog() {
  return request({
    url: '/admin/dash/log',
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    }
  })
}

export function getQuestionCreateCount() {
  return request({
    url: '/admin/dash/question',
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    }
  })
}
