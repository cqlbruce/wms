<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="form-inline">
        <el-form-item label="出仓日期：">
          <el-date-picker v-model="listQuery.beginDate" align="right" type="date" value-format="yyyy-MM-dd" style="width: 150px;" placeholder="开始日期" /> -
          <el-date-picker v-model="listQuery.endDate" align="right" type="date" value-format="yyyy-MM-dd" style="width: 150px;" placeholder="截止日期" />
        </el-form-item>
        <el-form-item label="Shpt No：">
          <el-input v-model="listQuery.shptNo" placeholder="shptNo" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="出库单号：">
          <el-input v-model="listQuery.clp" placeholder="clp" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="车牌号：">
          <el-input v-model="listQuery.car" placeholder="car" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="柜型：">
          <el-select v-model="listQuery.cabinetType" placeholder="请选择" clearable style="width: 190px" class="filter-item">
            <el-option v-for="item in cabinettypeOption" :key="item.display_name" :label="item.key" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item class="search">
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="出仓日期" style="width: 25%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shippedDate | parseTime('{y}/{m}/{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Shpt No" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shptNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="CLP" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.clp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车牌号" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.car }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运输路线" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.route }}</span>
        </template>
      </el-table-column>
      <el-table-column label="柜型" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cabinetType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总出仓箱数" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shippedCtns }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总出仓体积" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shippedVolume }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchShippedFeeList, exportShippedFeeList } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const cabinettypeOption = [
  { key: '3T', display_name: '3T' },
  { key: '40HQ', display_name: '40HQ' },
  { key: '20GP', display_name: '20GP' }
]

export default {
  name: 'InboundFee',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        beginDate: undefined,
        endDate: undefined,
        shptNo: undefined,
        clp: undefined,
        car: undefined
      },
      downloadLoading: false,
      cabinettypeOption
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchShippedFeeList(this.listQuery).then(response => {
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

      exportShippedFeeList(this.listQuery).then(response => {
        this.exportList = response.data.items

        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['出仓日期', 'Shpt No', 'CLP', '车牌/柜号', '运输路线', '柜型', '总出仓箱数', '总出仓体积', '分拣cbm', '报关项数', '报关', '装货费', '出仓报关费', '商检费', '出闸费', 'IC卡捆绑费', '运费', '出仓分拣费', '录单费', '查验运输费', '港建费', '保安费', '快速扫描费', '外堆场预约费', '代垫费税款', '合计']
          const filterVal = ['shippedDate', 'shptNo', 'clp', 'car', 'route', 'cabinetType', 'shippedCtns', 'shippedVolume']
          const data = this.formatJson(filterVal, this.exportList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '出仓费用表'
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
