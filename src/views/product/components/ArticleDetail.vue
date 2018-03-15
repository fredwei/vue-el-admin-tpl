<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm" label-width="65px">

      <sticky :className="'sub-navbar '+postForm.status">
        <template v-if="fetchSuccess">
          <el-dropdown trigger="click">
            <el-button plain>{{!postForm.comment_disabled?'评论已打开':'评论已关闭'}}
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu class="no-padding" slot="dropdown">
              <el-dropdown-item>
                <el-radio-group style="padding: 10px;" v-model="postForm.comment_disabled">
                  <el-radio :label="true">关闭评论</el-radio>
                  <el-radio :label="false">打开评论</el-radio>
                </el-radio-group>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-dropdown trigger="click">
            <el-button plain>平台
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu class="no-border" slot="dropdown">
              <el-checkbox-group v-model="postForm.platforms" style="padding: 5px 15px;">
                <el-checkbox v-for="item in platformsOptions" :label="item.key" :key="item.key">
                  {{item.name}}
                </el-checkbox>
              </el-checkbox-group>
            </el-dropdown-menu>
          </el-dropdown>

          <el-dropdown trigger="click">
            <el-button plain>
              外链
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu class="no-padding no-border" style="width:300px" slot="dropdown">
              <el-form-item label-width="0px" style="margin-bottom: 0px" prop="source_uri">
                <el-input placeholder="请输入内容" v-model="postForm.source_uri">
                  <template slot="prepend">填写url</template>
                </el-input>
              </el-form-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm()">发布上线
          </el-button>
          <el-button v-loading="loading" type="warning" @click="draftForm">存入草稿</el-button>
        </template>
        <template v-else>
          <el-tag>发送异常错误,刷新页面,或者联系开发人员</el-tag>
        </template>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="21">
            <el-form-item style="margin-bottom: 40px;" label="标题:" prop="title">
              <el-input placeholder="请输入标题，不超过100个字符" v-model="postForm.title">
              </el-input>

              <span v-show="postForm.title.length>=26" class='title-prompt'>标题长度超过26个字符时提示</span>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="作者:" class="postInfo-container-item" prop="author">
                    <multiselect v-model="postForm.author" :options="userLIstOptions" @search-change="getRemoteUserList" placeholder="搜索用户" selectLabel="选择"
                      deselectLabel="删除" track-by="key" :internalSearch="false" label="key">
                      <span slot='noResult'>无结果</span>
                    </multiselect>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-tooltip class="item" effect="dark" content="将替换作者" placement="top">
                    <el-form-item label="来源:" class="postInfo-container-item" prop="source_name">
                      <el-input placeholder="将替换作者" style='min-width:150px;' v-model="postForm.source_name">
                      </el-input>
                    </el-form-item>
                  </el-tooltip>
                </el-col>

                <el-col :span="8">
                  <el-form-item label-width="80px" label="发布时间:" class="postInfo-container-item" prop="display_time">
                    <el-date-picker v-model="postForm.display_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item label="关键词:">
          <el-input placeholder="请填写产品关键词，用分号分隔" style='min-width:150px;' v-model="postForm.keywords" prop="keywords">
          </el-input>
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;" label="封面图:" prop="image_uri">
          <Upload :fileList="postForm.image_uri"></Upload>
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;" label="产品图:" prop="pic_uri">
          <Upload :fileList="postForm.pic_uri"></Upload>
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;" label="摘要:" prop="content_short">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入摘要，不超过200字"
            v-model="postForm.content_short">
          </el-input>
          <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;" label="内容:" prop="content">
          <div class="editor-container">
            <tinymce :height=500 ref="editor" v-model="postForm.content"></tinymce>
          </div>
        </el-form-item>        
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleImage4'
import MDinput from '@/components/MDinput'
import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
import Sticky from '@/components/Sticky' // 粘性header组件
import { validateURL } from '@/utils/validate'
import { number2Date, date2Number } from '@/utils/formatDate'
import { fetchArticle, createArticle } from '@/api/article'
import { userSearch } from '@/api/remoteSearch'

// 文章详情默认字段
const defaultForm = {
  status: 'draft',
  // 文章题目
  title: '',
  // 文章内容
  content: '',
  // 文章摘要
  content_short: '',
  // 文章外链
  source_uri: '',
  // 文章关键词
  keywords: '',
  // 文章封面图
  image_uri: [],
  // 文章图片
  pic_uri: [],
  // 文章外部作者
  source_name: '',
  // 发布时间
  display_time: new Date(),
  // 文章id
  id: undefined,
  // 发布平台
  platforms: ['a-platform'],
  // 是否开启评论
  comment_disabled: false
}

export default {
  name: 'productDetail',
  components: { Tinymce, MDinput, Upload, Multiselect, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    detailId: {
      type: String,
      default: undefined
    }
  },
  data() {
    // 字段校验 - 必填
    const validateRequire = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error(rule.field + '为必填项'))
      } else {
        callback()
      }
    }
    // 字段校验 - URL
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validateURL(value)) {
          callback()
        } else {
          callback(new Error(rule.field + '链接填写不正确'))
        }
      } else {
        callback(new Error(rule.field + '为必填项'))
      }
    }
    return {
      // 页面表单数据集
      postForm: Object.assign({}, defaultForm),
      // 编辑——获取数据是否正确
      fetchSuccess: true,
      // 是否在请求中
      loading: false,
      // 作者字段拉去的用户信息列表
      userLIstOptions: [],
      // 发布平台筛选数据
      platformsOptions: [
        { key: 'a-platform', name: '平台A' },
        { key: 'b-platform', name: '平台B' },
        { key: 'c-platform', name: '平台C' }
      ],
      // 校验规则 - 注意：被校验的字段必须加上prop属性
      rules: {
        image_uri: [{ validator: validateRequire }],
        pic_uri: [{ validator: validateRequire }],
        title: [
          { validator: validateRequire, trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
        ],
        content_short: [
          { validator: validateRequire },
          { min: 5, max: 200, message: '长度在 5 到 100 个字符', trigger: 'blur' }
        ],
        content: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      }
    }
  },
  computed: {
    // 返回摘要内容长度
    contentShortLength() {
      return this.postForm.content_short.length
    }
  },
  created() {
    // 判断是否是编辑态并且传入id
    if (this.isEdit && this.detailId) {
      this.fetchData({
        id: this.detailId
      })
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
  },
  methods: {
    // 编辑状态时，获取数据
    fetchData(query) {
      fetchArticle(query).then(response => {
        // 日期要转换Date类型，否则插件使用会不正常
        response.data.display_time = number2Date(response.data.display_time)
        // console.log(response.data.display_time instanceof Date)
        console.log(response)
        this.postForm = response.data
      }).catch(err => {
        this.fetchSuccess = false
        console.log(err)
      })
    },
    // 提交数据-发布上线
    submitForm() {
      console.log(this.postForm)
      // 表单校验
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.postForm.status = 'published'

          // 发布时间处理
          this.postForm.display_time = date2Number(this.postForm.display_time)

          // 发起请求
          this.postData()
        } else {
          console.log('表单校验不通过!')
          return false
        }
      })
    },
    // 提交数据-存入草稿
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.loading = true
      this.postForm.status = 'draft'

      this.postData()
    },
    // 数据提交操作
    postData() {
      createArticle(this.postForm).then(response => {
        this.loading = false

        if (response.status === 200) {
          this.$notify({
            title: '成功',
            message: '文章保存成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '文章保存失败',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    // 获取用户
    getRemoteUserList(query) {
      userSearch(query).then(response => {
        if (!response.data.items) {
          this.userLIstOptions = []
        } else {
          this.userLIstOptions = response.data.items.map(v => ({
            key: v.name
          }))
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .title-prompt{
    position: absolute;
    right: 0px;
    top: 40px;
    line-height: 1;
    font-size: 12px;
    color:#ff4949;
  }
  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
            text-align: right;
            margin-right: 10px;
            .editor-upload-btn {
                display: inline-block;
            }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }
</style>

