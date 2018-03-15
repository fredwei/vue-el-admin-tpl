import { param2Obj } from '@/utils'

const userMap = {
  admin: {
    roles: ['admin'],
    token: 'admin_token_12345',
    introduction: '我是超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  editor: {
    roles: ['editor'],
    token: 'editor_token_12345',
    introduction: '我是编辑',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default {
  loginByUsername: config => {
    const { username } = param2Obj(config.url)

    if (userMap[username]) {
      return {
        status: 200,
        message: '登录成功',
        data: userMap[username]
      }
    } else {
      return {
        status: 2002,
        message: '登录失败',
        data: null
      }
    }
  },
  getUserInfo: config => {
    const { token } = param2Obj(config.url)
    let uInfo = null
    for (const ukey in userMap) {
      if (userMap[ukey].token === token) {
        uInfo = userMap[ukey]
        continue
      }
    }
    if (uInfo) {
      return {
        status: 200,
        message: '获取用户信息成功',
        data: uInfo
      }
    } else {
      return {
        status: 50008,
        message: '获取用户信息失败',
        data: null
      }
    }
  },
  logout(config) {
    const { token } = param2Obj(config.url)

    console.log(token)

    return {
      status: 200,
      message: '退出成功',
      data: null
    }
  }
}
