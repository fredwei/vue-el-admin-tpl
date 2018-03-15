<template>
  <div class="app-container calendar-list-container">
    <!-- 头部操作区 -->
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.title')" v-model="listQuery.title">
      </el-input>

      <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.importance" :placeholder="$t('table.importance')">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>

      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" :placeholder="$t('table.type')">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
        </el-option>
      </el-select>

      <el-select @change='handleFilter' style="width: 140px" class="filter-item" v-model="listQuery.sort">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>

      <el-select @change='handleFilter' style="width: 140px" class="filter-item" v-model="listQuery.status" :placeholder="$t('table.status')">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" style="margin-left: 10px;" @click="handleFilter">{{$t('table.search')}}</el-button>

      <el-button class="filter-item" style="margin-left: 10px;" @click="handleToAdd" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>

      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      :key='tableKey'
      :data="list"
      v-loading="listLoading"
      element-loading-text="拼命加载中"
      border
      fit
      highlight-current-row
      style="width: 100%">

      <el-table-column align="center" :label="$t('table.id')" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" :label="$t('table.date')">
        <template slot-scope="scope">
          <span>{{scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="150px" :label="$t('table.title')">
        <template slot-scope="scope">
          <span class="link-type" @click="handleToEdit(scope.row)">{{scope.row.title}}</span>
          <el-tag>{{scope.row.type}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('table.author')">
        <template slot-scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('table.reviewer')">
        <template slot-scope="scope">
          <span style='color:red;'>{{scope.row.reviewer}}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" :label="$t('table.importance')">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" icon-class="star" class="meta-item__icon" :key="n"></svg-icon>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.readings')" width="95">
        <template slot-scope="scope">
          <span v-if="scope.row.pageviews" class="link-type" @click='handleFetchPv(scope.row)'>{{scope.row.pageviews}}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" :label="$t('table.status')" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | statusNameFilter}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleToEdit(scope.row)">{{$t('table.edit')}}</el-button>
          <template v-if="scope.row.status!='published'">
            <el-button size="mini" type="success" @click="handleModifyStatus(scope.row,'published')">{{$t('table.publish')}}
            </el-button>
          </template>
          <template v-else>
            <el-button size="mini" @click="handleModifyStatus(scope.row,'draft')">{{$t('table.draft')}}
            </el-button>
          </template>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column>      
    </el-table>

    <!-- 页码 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 阅读量等数据 -->
    <el-dialog title="阅读数据" :visible.sync="dialogPvVisible">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"> </el-table-column>
        <el-table-column prop="pv" label="Pv"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{$t('table.confirm')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
// 数据接口
import { fetchList, fetchPv, updateArticle } from '@/api/article'
// 按钮动画特效 - 水波纹指令
import waves from '@/directive/waves'
// 工具接口
import { parseTime } from '@/utils'

export default {
  name: 'product',
  directives: {
    waves
  },
  data() {
    return {
      // 表格的key，改变后表格会重新渲染
      tableKey: 0,
      // 列表数据集
      list: null,
      // 列表数据总计
      total: null,
      // 列表加载状态
      listLoading: true,
      // 列表请求条件，既给接口传递的参数
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: 'asc',
        status: undefined
      },
      // 列表头部的筛选条件 - 重要度
      importanceOptions: [1, 2, 3],
      // 列表头部的筛选条件 - 类型
      calendarTypeOptions: [
        { key: 'CN', display_name: 'China' },
        { key: 'US', display_name: 'USA' },
        { key: 'JP', display_name: 'Japan' },
        { key: 'EU', display_name: 'Eurozone' }
      ],
      // 列表头部的筛选条件 - 排序方式
      sortOptions: [
        { label: '按 ID 升序排列', key: 'asc' },
        { label: '按 ID 降序排列', key: 'desc' }
      ],
      // 列表头部的筛选条件 - 数据状态
      statusOptions: [
        { label: '已上线', key: 'published' },
        { label: '草稿', key: 'draft' }
      ],
      // 是否显示阅读数据弹出框
      dialogPvVisible: false,
      // 阅读数据集
      pvData: [],
      // 是否正在导出
      downloadLoading: false
    }
  },
  filters: {
    // 标签过滤器
    statusFilter(status) {
      // 数据状态对应标签的类型
      const statusMap = {
        // 已上线 —— success
        published: 'success',
        // 草稿 —— info
        draft: 'info'
      }

      return statusMap[status]
    },
    // 标签过滤器-名称
    statusNameFilter(status) {
      // 数据状态对应标签的类型
      const statusMap = {
        // 已上线 —— success
        published: '在线',
        // 草稿 —— info
        draft: '草稿'
      }

      return statusMap[status]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表数据
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        /*
        列表数据格式如下
        {
          total: 100,
          items: [{
            author: "Ruth",
            display_time: "1984-03-24 11:57:54",
            forecast: 21.38,
            id: 1,
            importance: 2,
            pageviews: 1252,
            reviewer: "Paul",
            // 状态 上架、下架、删除
            status: "draft",
            timestamp: 733565839025,
            title: "Vipiibhw Ereftdq Tbwr Ydgl Dvlrwc Dnvc Umtooiojd Qwtupmoi",
            type: "JP"
          }]
        }
        */
        console.log(response)
        // console.log(response.data.items[0])
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      }).catch(() => {})
    },
    // 修改筛选添加后重新加载列表数据
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 页码修改后重新加载
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    // 页码修改后重新加载
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    // 列表操作 上线、下架、删除
    handleModifyStatus(row, status) {
      const _opts = {
        id: row.id,
        status: status
      }
      updateArticle(_opts).then(response => {
        this.$message({
          message: status + '操作成功',
          type: 'success'
        })
        row.status = status
      }).catch(() => {})
    },
    // 前往添加页面
    handleToAdd() {
      this.$router.push({ path: '/product/add' })
    },
    // 前往编辑页面
    handleToEdit(row) {
      this.$router.push({ path: '/product/edit/' + row.id })
    },
    // 删除操作
    handleDelete(row) {
      const that = this
      that.$confirm('是否确认删除?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const _opts = {
          id: row.id,
          status: 'deleted'
        }
        updateArticle(_opts).then(response => {
          that.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = that.list.indexOf(row)
          that.list.splice(index, 1)
          row.status = 'deleted'
        }).catch(() => {})
      }).catch(() => {})
    },
    // 获取阅读数据量
    handleFetchPv(row) {
      const _opts = {
        id: row.id
      }
      fetchPv(_opts).then(response => {
        this.pvData = response.data
        this.dialogPvVisible = true
      }).catch(() => {})
    },
    // 下载导出数据
    handleDownload() {
      const that = this
      that.$confirm('将导出当前页面所显示的数据, 是否继续?', '导出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          // 要导出的字段名
          const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
          // 导出的字段名对应的表头
          const tHeader = ['时间', '标题', '类型', '重要性', '状态']
          // 根据要导出的字段名格式化要导出的数据
          const data = that.formatJson(filterVal, that.list)
          // 传入三个参数（表头、数据、导出的文件名）
          excel.export_json_to_excel(tHeader, data, 'table-list')
          that.downloadLoading = false
        }).catch(() => {})
      })
    },
    // 格式化数据
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          // 处理时间戳
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
