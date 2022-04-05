import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function getQuestionList(page, query) {
  return request({
    url: '/question/list',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    method: 'post',
    params: page,
    data: query
  })
}

export function selectQuestion(id) {
  return request({
    url: '/question/select/' + id,
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'get'
  })
}

export function createQuestion(query) {
  return request({
    url: '/question/create',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: query
  })
}

export function updateQuestion(query) {
  return request({
    url: '/question/update',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: query
  })
}

export function editQuestion(query) {
  return request({
    url: '/question/edit',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: query
  })
}

export function deleteQuestion(id) {
  return request({
    url: '/question/delete/' + id,
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'get'
  })
}

