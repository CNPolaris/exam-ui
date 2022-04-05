import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function monitorServer() {
  return request({
    url: '/monitor/server',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'get'
  })
}

export function loginLog(query) {
  return request({
    url: '/log/login/list',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'get',
    params: query
  })
}

export function getUserEventLog(query) {
  return request({
    url: '/user/event/log/list',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'get',
    params: query
  })
}

