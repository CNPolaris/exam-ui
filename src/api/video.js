import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function videoList(subjectId) {
  return request({
    url: '/video/list',
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    params: subjectId
  })
}

export function saveVideo(query) {
  return request({
    url: '/video/save',
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    data: query
  })
}

export function uploadVideo(file) {
  return request({
    url: '/video/upload',
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'multipart/form-data'
    },
    data: file
  })
}

export function uploadCover(file) {
  return request({
    url: '/video/upload/cover',
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'multipart/form-data'
    },
    data: file
  })
}

export function deleteVideo(id) {
  return request({
    url: '/video/delete/' + id,
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    }
  })
}

export function selectVideo(id) {
  return request({
    url: '/video/select/' + id,
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    }
  })
}
