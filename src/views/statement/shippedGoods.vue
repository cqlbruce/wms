<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="form-inline">
        <el-form-item label="客户">
          <el-select v-model="listQuery.custId" placeholder="请选择" clearable>
            <el-option v-for="item in accountArr" :key="item.custId" :label="item.custShortName" :value="item.custId" />
          </el-select>
        </el-form-item>
        <el-form-item label="出仓日期">
          <el-date-picker v-model="listQuery.beginDate" align="right" type="date" value-format="yyyy-MM-dd" style="width: 150px;" placeholder="开始日期" /> -
          <el-date-picker v-model="listQuery.endDate" align="right" type="date" value-format="yyyy-MM-dd" style="width: 150px;" placeholder="截止日期" />
        </el-form-item>
        <el-form-item label="入仓落货纸号">
          <el-input v-model="listQuery.so" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="客户采购订单号">
          <el-input v-model="listQuery.po" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="入仓编号">
          <el-input v-model="listQuery.inbundNo" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item class="search">
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="width: 50%;">
      <el-form ref="analysisForm" :model="shippedStatistics" :label-position="labelPosition" :inline="true">
        <el-row>
          <el-col style="width: 300px">
            <el-form-item label="当日出仓总车数">{{ shippedStatistics.veryDayCarCount }}</el-form-item>
          </el-col>
          <el-col style="width: 300px">
            <el-form-item label="当日出仓总体积">{{ shippedStatistics.veryDayShippedVolume }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="客户" style="width: 25%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.custShortName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.projectId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出仓日期" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shippedDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出仓单号" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.clp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入仓落货纸号" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.so }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货物款号" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.item }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入仓编号" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inboundNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品编码" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.customsMerchNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.merchName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="120"
        fixed="right"
      >
        <template slot-scope="{row}">
          <el-button size="mini" @click="handleDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />
    <!-- 详情展示 -->
    <el-dialog title="详情" :visible.sync="detailVisible" :close-on-click-modal="false" width="80%" destroy-on-close>
      <el-form
        ref="detailForm"
        :model="detailTemp"
        :label-position="labelPosition"
        :inline="true"
        label-width="140px"
      >
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="客户:">{{ detailTemp.custShortName }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目:">{{ detailTemp.projectId }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出仓日期:">{{ detailTemp.shippedDate }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出仓单号:">{{ detailTemp.clp }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="入仓落货纸号:">{{ detailTemp.so }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="货物款号:">{{ detailTemp.item }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入仓编号:">{{ detailTemp.inboundNo }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品编码:">{{ detailTemp.customsMerchNo }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="商品名称:">{{ detailTemp.merchName }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="成交单位:">{{ detailTemp.declaUnit }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出仓箱数:">{{ detailTemp.shippedCtns }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出仓件数:">{{ detailTemp.shippedPcs }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="出仓体积:">{{ detailTemp.shippedVolume }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 文件导出 -->
    <el-dialog title="导出" :visible.sync="exportShippedGoodsVisible" width="60%">
      <div class="filter-container">
        <el-form ref="exportShippedGoodsForm" :rules="rules" :model="listQuery" label-position="left" label-width="120px" style="width: 1200px; margin-left:30px;">
          <el-form-item label="账单起止日：">
            <el-date-picker v-model="listQuery.billsBeginDate" align="right" type="date" value-format="yyyy-MM-dd" style="width: 150px;" placeholder="开始日期" /> -
            <el-date-picker v-model="listQuery.billsEndDate" align="right" type="date" value-format="yyyy-MM-dd" style="width: 150px;" placeholder="截止日期" />
          </el-form-item>
          <el-form-item label="超仓租单价：" prop="overStockUnitPrice">
            <el-input v-model="listQuery.overStockUnitPrice" placeholder="超仓租单价" style="width: 200px;" class="filter-item" clearable />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="exportShippedGoodsVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleDownload()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchShippedGoodsList, exportShippedGoodsList, loanAccountInfo, fetchShippedtatistics } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'InboundFee',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      labelPosition: 'right',
      accountArr: [],
      tableKey: 0,
      list: null,
      exportList: null,
      shippedStatistics: null,
      total: 0,
      listQuery: {
        page: 1,
        size: 20,
        beginDate: undefined,
        endDate: undefined,
        so: undefined,
        po: undefined,
        billsBeginDate: undefined,
        billsEndDate: undefined,
        overStockUnitPrice: undefined,
        inbundNo: undefined,
        custId: undefined
      },
      detailTemp: {},
      rules: {

      },
      downloadLoading: false,
      exportShippedGoodsVisible: false,
      detailVisible: false,
      listLoading: true
    }
  },
  created() {
    this.getALLData()
    this.getList()
  },
  methods: {
    // 获取客户信息
    getALLData() {
      const that = this
      this.Axios.all([loanAccountInfo({}), fetchShippedtatistics({})])
        .then(
          this.Axios.spread(function(AccountInfo, ShippedStatistics) {
            that.accountArr = AccountInfo.data.items
            that.shippedStatistics = ShippedStatistics.data
          })
        )
        .catch(err => {
          console.log(err)
        })
    },
    // 客户姓名匹配
    matchAccount(value) {
      let str = '--'
      this.accountArr.forEach(item => {
        if (item.custId === value) {
          str = item.custShortName
        }
      })
      return str
    },
    getList() {
      this.listLoading = true
      fetchShippedGoodsList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        if (this.list === null) {
          this.list = []
        }
        // 客户类型转换
        this.list.forEach(item => {
          item.custShortName = this.matchAccount(item.custId)
        })
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleExport() {
      this.exportShippedGoodsVisible = true
      this.$nextTick(() => {
        this.$refs['exportShippedGoodsForm'].clearValidate()
      })
    },
    handleDownload() {
      this.exportShippedGoodsVisible = false
      this.downloadLoading = true

      exportShippedGoodsList(this.listQuery).then(response => {
        this.exportList = response.data.items
        // 客户类型转换
        this.exportList.forEach(item => {
          item.custShortName = this.matchAccount(item.custId)
        })
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['客户', '项目', '出仓日期', '出仓单号', '入仓落货纸号', '货物款号', '入仓编号', '商品编码', '商品名称', '成交单位', '出仓箱数', '出仓件数', '出仓体积', '备注']
          const filterVal = ['custShortName', 'projectId', 'shippedDate', 'clp', 'so', 'item', 'inboundNo', 'customsMerchNo', 'merchName', 'declaUnit', 'shippedCtns', 'shippedPcs', 'shippedVolume', '']
          const data = this.formatJson(filterVal, this.exportList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '出仓货物表'
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
    },
    // 详情页面
    handleDetail(row) {
      this.detailTemp = Object.assign({}, row)
      this.detailVisible = true
    }
  }
}
</script>
