<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="form-inline">
        <el-form-item label="文件类型：">
          <el-select v-model="listQuery.fileType" placeholder="请选择" clearable style="width: 190px" class="filter-item">
            <el-option v-for="item in fileTypeOption" :key="item.display_name" :label="item.key" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item class="search">
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleDownload">下载</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { download } from '@/utils'

const fileTypeOption = [
  { key: '1', display_name: '入库导入模板' },
  { key: '2', display_name: '出库导入模板' }
]

export default {
  name: 'FilesDownload',
  directives: { waves },
  data() {
    return {
      listLoading: true,
      listQuery: {
        fileType: undefined
      },
      downloadLoading: false,
      fileTypeOption
    }
  },
  created() {

  },
  methods: {
    handleDownload() {
      this.downloadLoading = true
      download('/download/stockFile', this.listQuery, '入库模板.xlsx').then(response => {
        this.downloadLoading = false
      })
    }
  }
}
</script>
