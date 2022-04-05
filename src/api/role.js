import request from '@/utils/request'
import Cookies from 'js-cookie'

export function getRoleList(page, param) {
  return request({
    url: '/admin/role/list',
    headers: {
      'Authorization': 'Bearer ' + Cookies.get('Admin-Token'),
      'Content-Type': 'application/json'
    },
    method: 'post',
    params: page,
    data: param
  })
}

export function createRole(query) {
  return request({
    url: '/admin/role/create',
    headers: {
      'Authorization': 'Bearer ' + Cookies.get('Admin-Token'),
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: query
  })
}

export function deleteRole(id) {
  return request({
    url: '/admin/role/delete/' + id,
    headers: {
      'Authorization': 'Bearer ' + Cookies.get('Admin-Token')
    },
    method: 'get'
  })
}

export function updateRole(query) {
  return request({
    url: '/admin/role/update',
    headers: {
      'Authorization': 'Bearer ' + Cookies.get('Admin-Token'),
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: query
  })
}

export function updateRoleStatus(id, status) {
  return request({
    url: '/admin/role/status/' + id,
    headers: {
      'Authorization': 'Bearer ' + Cookies.get('Admin-Token')
    },
    method: 'get',
    params: status
  })
}
