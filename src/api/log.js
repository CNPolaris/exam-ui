import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function getUserLastLog() {
  return request({
    url: '/admin/log/login/last',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'get'
  })
}
