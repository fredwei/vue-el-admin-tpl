<template>
  <div>
    <el-upload
      :action="action"
      :data="params"
      :multiple="limit != 1"
      :limit="limit"
      :accept="accept"
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-error="handleError"
      :on-success="handleSuccess"
      :on-exceed="handleExceed"
      :before-upload="handleBeforeUpload">
      <i class="el-icon-plus"></i>
      <div slot="tip" class="el-upload__tip">只允许上传{{accept}}格式的文件，且不超过500kb，最多上传{{limit}}个文件</div>
    </el-upload>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import { uploadAction } from '@/api/article'

  export default {
    props: {
      action: {
        type: String,
        default: uploadAction()
      },
      params: {
        type: Object,
        default() {
          return {}
        }
      },
      limit: {
        type: Number,
        default: 1
      },
      size: {
        type: Number,
        default: 500
      },
      accept: {
        type: String,
        default: 'image/gif, image/png, image/jpeg, image/jpg'
      },
      fileList: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false
      }
    },
    methods: {
      // 删除图片
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      // 点击图片触发
      handlePreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      // 超出文件个数
      handleExceed(files, fileList) {
        console.log(files, fileList)

        this.$message({
          message: '最多上传' + this.limit + '个文件！',
          type: 'error'
        })
      },
      // 上传前进行校验
      handleBeforeUpload(file) {
        const typeIdx = this.accept.indexOf(file.type)
        const isType = typeIdx !== -1
        const isSize = file.size / 1024 < this.size

        if (!isType) {
          this.$message.error(file.name + ' 文件只能是 ' + this.accept + ' 格式!')
        }
        if (!isSize) {
          this.$message.error(file.name + ' 文件大小不能超过 ' + this.size + ' KB!')
        }

        return isType && isSize
      },
      // 上传失败
      handleError(err, file, fileList) {
        console.log(err, file, fileList)

        this.$message({
          message: file.name + '上传失败，请重新尝试！',
          type: 'error'
        })
      },
      // 上传成功
      handleSuccess(response, file, fileList) {
        console.log(response, file, fileList)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
