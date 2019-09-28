<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="form-inline">
        <el-form-item label="进仓日期：">
          <el-date-picker v-model="listQuery.beginDate" align="right" type="date" value-format="yyyy-MM-dd" style="width: 150px;" placeholder="开始日期" /> -
          <el-date-picker v-model="listQuery.endDate" align="right" type="date" value-format="yyyy-MM-dd" style="width: 150px;" placeholder="截止日期" />
        </el-form-item>
        <el-form-item label="入仓落货纸号：">
          <el-input v-model="listQuery.so" placeholder="so" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item class="search">
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="进仓日期" style="width: 25%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stockDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入仓落货纸号" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.so }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车牌/柜号" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.car }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入仓总箱数" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stockCtns }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入仓总体积" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stockVolume }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />
  </div>
</template>

<script>
import { fetchStockFeeList, exportStockFeeList } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'InboundFee',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      exportList: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20,
        beginDate: undefined,
        endDate: undefined,
        so: undefined
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchStockFeeList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true

      exportStockFeeList(this.listQuery).then(response => {
        this.exportList = response.data.items

        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['进仓日期', '入仓落货纸号', '车牌/柜号', '入仓总箱数', '入仓总体积', '报关', '卸货费', '入仓报关费', '删单费', '续页', '查商检', '入闸费', 'IC卡捆绑费', '运输费', '压车费', '仓库加班费', '停车费', '混装费', '代做核注单', '查验费', '代垫费用税6%', '合计']
          const filterVal = ['stockDate', 'so', 'car', 'stockCtns', 'stockVolume']
          const data = this.formatJson(filterVal, this.exportList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '入仓费用表'
          })
          this.downloadLoading = false
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
