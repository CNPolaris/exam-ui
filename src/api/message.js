import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function getAdminMessageList(query) {
  return request({
    url: '/admin/message/admin/list',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'get',
    params: query
  })
}

export function sendMessage(query) {
  return request({
    url: '/admin/message/send',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: query
  })
}
