import request from '@/utils/request'
// 获取文章列表
export function fetchList(query) {
  return request({
    url: '/article/list',
    method: 'get',
    params: query
  })
}
// 获取文章详情
export function fetchArticle(query) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: query
  })
}
// 获取阅读数据
export function fetchPv(query) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: query
  })
}
// 文章新增
export function createArticle(data) {
  return request({
    url: '/article/create',
    method: 'post',
    params: data
  })
}
// 文章更新
export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    params: data
  })
}
// 文件上传的接口
export function uploadAction() {
  return 'https://jsonplaceholder.typicode.com/posts/'
}
