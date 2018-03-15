import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    author: '@first',
    reviewer: '@first',
    title: '@title(5, 10)',
    forecast: '@float(0, 100, 2, 2)',
    importance: '@integer(1, 3)',
    'type|1': ['CN', 'US', 'JP', 'EU'],
    // 'published', 'draft', 'deleted' 列表不返回deleted状态
    'status|1': ['published', 'draft'],
    display_time: '@datetime',
    pageviews: '@integer(300, 5000)'
  }))
}

export default {
  getList: config => {
    const { importance, type, title, page = 1, limit = 20, sort, status } = param2Obj(config.url)

    console.log('请求参数：')
    console.log(importance, type, title, page, limit, sort, status)

    let mockList = List.filter(item => {
      if (importance && item.importance !== +importance) return false
      if (type && item.type !== type) return false
      if (status && item.status !== status) return false
      if (title && item.title.indexOf(title) < 0) return false
      return true
    })

    if (sort === 'desc') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      status: 200,
      message: '数据获取成功',
      data: {
        total: mockList.length,
        items: pageList
      }
    }
  },
  getPv: config => {
    const { id } = param2Obj(config.url)
    console.log('请求参数：')
    console.log(id)
    return {
      status: 200,
      message: '阅读数据获取成功',
      data: [{ key: 'PC', pv: 1024 }, { key: 'mobile', pv: 1024 }, { key: 'ios', pv: 1024 }, { key: 'android', pv: 1024 }]
    }
  },
  getArticle: config => {
    const { id } = param2Obj(config.url)
    console.log('请求参数：')
    console.log(id)
    return {
      status: 200,
      message: '数据获取成功',
      data: {
        id: 120000000001,
        author: { key: 'mockPan' },
        source_name: '原创作者',
        category_item: [{ key: 'global', name: '全球' }],
        comment_disabled: true,
        keywords: '测试关键词',
        content: '<p>我是测试数据我是测试数据</p><p><img class="wscnph" src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943" data-wscntype="image" data-wscnh="300" data-wscnw="400" data-mce-src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>"',
        content_short: '我是测试数据',
        display_time: +new Date(),
        // 文章封面图
        image_uri: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }],
        // 文章图片
        pic_uri: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }, { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }],
        platforms: ['a-platform'],
        source_uri: 'https://github.com/PanJiaChen/vue-element-admin',
        status: 'published',
        tags: [],
        title: 'vue-element-admin'
      }
    }
  },
  createArticle: config => {
    const { title, image_uri, content } = param2Obj(config.url)
    console.log('请求参数：')
    console.log(title, image_uri, content)
    return {
      status: 200,
      message: '数据保存成功',
      data: 'success'
    }
  },
  updateArticle: config => {
    const { id } = param2Obj(config.url)
    console.log('请求参数：')
    console.log(id)
    return {
      status: 200,
      message: '数据更新成功',
      data: 'success'
    }
  }
}
