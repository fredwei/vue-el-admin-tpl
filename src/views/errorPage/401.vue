<template>
  <div class="errPage-container">
    <router-link to="/" class="pan-back-btn">返回首页</router-link>
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">没有访问权限!</h1>
        <h2>你没有权限访问该页面</h2>
        <h6>如有疑问请联系网站管理员</h6>
        <ul class="list-unstyled">
          <li>或者你可以点击下方按钮:</li>
          <li class="link-type">
            <el-button @click="back" class="pan-back-btn">返回上一页</el-button>
          </li>
        </ul>
      </el-col>
      <el-col :span="12">
        <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream.">
      </el-col>
    </el-row>
    <el-dialog title="随便看" :visible.sync="dialogVisible">
      <img class="pan-img" :src="ewizardClap">
    </el-dialog>
  </div>
</template>

<script>
import errGif from '@/assets/401_images/401.gif'

export default {
  name: 'page401',
  data() {
    return {
      errGif: errGif + '?' + +new Date(),
      ewizardClap: 'https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646',
      dialogVisible: false
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .errPage-container {
    width: 800px;
    margin: 100px auto;
    .pan-back-btn {
      background: #008489;
      color: #fff;
    }
    .pan-gif {
      margin: 0 auto;
      display: block;
    }
    .pan-img {
      display: block;
      margin: 0 auto;
    }
    .text-jumbo {
      font-size: 60px;
      font-weight: 700;
      color: #484848;
    }
    .list-unstyled {
      font-size: 14px;
      li {
        padding-bottom: 5px;
      }
      a {
        color: #008489;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
