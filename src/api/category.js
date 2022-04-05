import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function getCategoryList() {
  return request({
    url: '/category/list',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'get'
  })
}

export function deleteCategory(id) {
  return request({
    url: '/category/delete/' + id,
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'get'
  })
}

export function updateCategory(id, data) {
  return request({
    url: '/category/update/' + id,
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}

export function createCategory(data) {
  return request({
    url: '/category/create',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}
