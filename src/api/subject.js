import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function getSubjectList(query) {
  return request({
    url: '/admin/subject/list',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'post',
    params: query
  })
}

export function updateSubjectStatus(id, status) {
  return request({
    url: '/admin/subject/status/' + id,
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'get',
    params: status
  })
}

export function createSubject(query) {
  return request({
    url: '/admin/subject/create',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: query
  })
}

export function updateSubject(id, query) {
  return request({
    url: '/admin/subject/update/' + id,
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: query
  })
}

export function deleteSubject(id) {
  return request({
    url: '/admin/subject/delete/' + id,
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'get'
  })
}

export function getSubjectName() {
  return request({
    url: '/admin/subject/name',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'get'
  })
}

export function selectSubject(id) {
  return request({
    url: '/admin/subject/select/' + id,
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'get'
  })
}

export function allSubjectList() {
  return request({
    url: '/admin/subject/all',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'get'
  })
}
