import Mock from 'mockjs'

const List = []
const dnameArr = ['新用户', '总用户', '新访问', '总流量']
const dkeyArr = ['newuser', 'alluser', 'newuv', 'alluv']
const count = 4

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    dname: dnameArr[i],
    dkey: dkeyArr[i],
    total: '@natural(8000, 25000)',
    expectedData: () => {
      const _arr = []
      for (let i = 0; i < 7; i++) {
        _arr.push(Mock.Random.natural(100, 200))
      }
      return _arr
    },
    actualData: () => {
      const _arr = []
      for (let i = 0; i < 7; i++) {
        _arr.push(Mock.Random.natural(130, 250))
      }
      return _arr
    }
  }))
}

export default {
  getData: () => {
    return {
      status: 200,
      message: '数据获取成功',
      data: List
    }
  }
}
