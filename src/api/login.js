import request from '@/utils/request'

export function loginByUsername(query) {
  // 获取token
  return request({
    url: '/login/login',
    method: 'post',
    params: query
  })
}

export function logout(query) {
  return request({
    url: '/login/logout',
    method: 'post',
    params: query
  })
}

export function getUserInfo(query) {
  // 校验token，获取用户信息
  return request({
    url: '/user/info',
    method: 'get',
    params: query
  })
}

