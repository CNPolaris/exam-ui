import request from '@/utils/request'
import Cookies from 'js-cookie'

export function getPermissionList(page, data) {
  return request({
    url: '/permission/list',
    headers: {
      'Authorization': 'Bearer ' + Cookies.get('Admin-Token'),
      'Content-Type': 'application/json'
    },
    method: 'post',
    params: page,
    data: data
  })
}

export function addPermission(data) {
  return request({
    url: '/permission/create',
    headers: {
      'Authorization': 'Bearer ' + Cookies.get('Admin-Token'),
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}

export function deletePermission(id) {
  return request({
    url: '/permission/delete/' + id,
    headers: {
      'Authorization': 'Bearer ' + Cookies.get('Admin-Token')
    },
    method: 'get'
  })
}

export function updatePermission(data) {
  return request({
    url: '/permission/update',
    headers: {
      'Authorization': 'Bearer ' + Cookies.get('Admin-Token'),
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}

export function allPermissionList() {
  return request({
    url: '/permission/all',
    headers: {
      'Authorization': 'Bearer ' + Cookies.get('Admin-Token')
    },
    method: 'get'
  })
}

export function selectPermissionByRoleId(roleId) {
  return request({
    url: '/permission/role',
    headers: {
      'Authorization': 'Bearer ' + Cookies.get('Admin-Token')
    },
    method: 'get',
    params: { roleId }
  })
}

export function selectPermissionByCategory(cateId) {
  return request({
    url: '/permission/category',
    headers: {
      'Authorization': 'Bearer ' + Cookies.get('Admin-Token')
    },
    method: 'get',
    params: { cateId }
  })
}

export function addRolePermission(data) {
  return request({
    url: '/rp/create',
    headers: {
      'Authorization': 'Bearer ' + Cookies.get('Admin-Token'),
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}

export function allocatePermission(data) {
  return request({
    url: '/permission/allocate',
    headers: {
      'Authorization': 'Bearer ' + Cookies.get('Admin-Token'),
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}

export function updatePermissionStatus(id, status) {
  return request({
    url: '/permission/status/' + id,
    headers: {
      'Authorization': 'Bearer ' + Cookies.get('Admin-Token')
    },
    method: 'get',
    params: status
  })
}

export function deleteRolePermission(id) {
  return request({
    url: '/rp/delete' + id,
    headers: {
      'Authorization': 'Bearer ' + Cookies.get('Admin-Token')
    },
    method: 'get'
  })
}

export function getRolePermissionList(param, data) {
  return request({
    url: '/rp/list',
    headers: {
      'Authorization': 'Bearer ' + Cookies.get('Admin-Token')
    },
    method: 'get',
    params: { param }
  })
}
