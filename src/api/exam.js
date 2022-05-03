import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function getExamPaperList(query) {
  return request({
    url: '/admin/exam/list',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'post',
    params: query
  })
}

export function updateExamPaperStatus(id, status) {
  return request({
    url: '/admin/exam/status/' + id,
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'get',
    params: status
  })
}

export function deleteExamPaper(id) {
  return request({
    url: '/admin/exam/delete/' + id,
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'get'
  })
}

export function updateExamPaper(data) {
  return request({
    url: '/admin/exam/update',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}

export function createExamPaper(data) {
  return request({
    url: '/admin/exam/create',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}

export function selectExamPaper(id) {
  return request({
    url: '/admin/exam/select/' + id,
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'get'
  })
}

export function paperAnswerList(query) {
  return request({
    url: '/admin/exam/answer/record/list',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'post',
    data: query
  })
}

export function complete(query) {
  return request({
    url: '/admin/exam/answer/complete/list',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'post',
    data: query
  })
}

export function paperRead(id) {
  return request({
    url: '/admin/exam/answer/read/' + id,
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'get'
  })
}

export function submitJudge(query) {
  return request({
    url: '/admin/exam/answer/edit',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'post',
    data: query
  })
}
