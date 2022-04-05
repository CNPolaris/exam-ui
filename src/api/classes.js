import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function getClassList(query) {
  return request({
    url: '/class/list',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'post',
    params: query
  })
}

export function getStudentList(id) {
  return request({
    url: '/class/list/student/' + id,
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'get'
  })
}

export function deleteClass(id) {
  return request({
    url: '/class/delete/' + id,
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'get'
  })
}

export function updateClass(id, query) {
  return request({
    url: '/class/update/' + id,
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'post',
    data: query
  })
}

export function editClass(query) {
  return request({
    url: '/class/edit',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'post',
    data: query
  })
}
