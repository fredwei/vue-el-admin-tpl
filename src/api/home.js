import request from '@/utils/request'

export function fetchData() {
  return request({
    url: '/statistics/data',
    method: 'get'
  })
}
