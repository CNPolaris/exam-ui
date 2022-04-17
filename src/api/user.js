import request from '@/utils/request'
import Cookies from 'js-cookie'
import { getToken } from '@/utils/auth'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  })
}

export function getInfo() {
  return request({
    url: '/info',
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    }
  })
}

export function getUserList(page, data) {
  return request({
    url: '/user/list',
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + Cookies.get('Admin-Token'),
      'Content-Type': 'application/json'
    },
    params: page,
    data: data
  })
}

export function selectUser(id) {
  return request({
    url: '/user/select/' + id,
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    }
  })
}

export function deleteUser(id) {
  return request({
    url: '/user/delete/' + id,
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    }
  })
}

export function updateUser(query) {
  return request({
    url: '/user/update',
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    data: query
  })
}

export function createUser(data) {
  return request({
    url: '/user/create',
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    data: data
  })
}

export function updateUserStatus(id, status) {
  return request({
    url: '/user/status/' + id,
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    params: status
  })
}

export function getStudentList(data) {
  return request({
    url: '/user/student/list',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'post',
    params: data
  })
}

export function getTeacherList(data) {
  return request({
    url: '/user/teacher/list',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'post',
    params: data
  })
}

export function getAdminList(data) {
  return request({
    url: '/user/admin/list',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'post',
    params: data
  })
}

export function allocUserRole(data) {
  return request({
    url: '/user/role',
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    data: data
  })
}

export function selectByUsername(username) {
  return request({
    url: '/user/selectByUsername',
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    data: username
  })
}

export function uploadImg(file) {
  return request({
    url: '/user/uploadAvatar',
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'multipart/form-data'
    },
    data: file
  })
}

export function uploadAvatar(url) {
  return request({
    url: '/user/avatar/save',
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    data: url
  })
}

export function uploadUser(form) {
  return request({
    url: '/user/upload',
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    data: form
  })
}

