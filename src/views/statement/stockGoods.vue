<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="queryForm" :inline="true" :model="listQuery" :rules="rules" class="form-inline">
        <el-form-item label="客户">
          <el-select v-model="listQuery.custId" placeholder="请选择" clearable>
            <el-option v-for="item in accountArr" :key="item.custId" :label="item.custShortName" :value="item.custId" />
          </el-select>
        </el-form-item>
        <el-form-item label="收货日期">
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
        <el-form-item label="总库存体积大于零">
          <el-select v-model="listQuery.volumeMoreThanZero" placeholder="请选择" style="width: 100px;">
            <el-option v-for="item in isMoreThanZero" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="总库存件数大于零">
          <el-select v-model="listQuery.pcsMoreThanZero" placeholder="请选择" style="width: 100px;">
            <el-option v-for="item in isMoreThanZero" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item class="search">
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 查询列表 -->
    <div style="width: 100%;">
      <el-form ref="analysisForm" :model="stockStatistics" :label-position="labelPosition" :inline="true" size="medium">
        <el-row>
          <el-col style="width: 300px">
            <el-form-item label="实时总库存体积：">{{ stockStatistics.realTimeVolume }}</el-form-item>
          </el-col>
          <el-col style="width: 300px">
            <el-form-item label="实时总件数：">{{ stockStatistics.realTimePcs }}</el-form-item>
          </el-col>
          <el-col style="width: 300px">
            <el-form-item label="当天入库票数：">{{ stockStatistics.tickets }}</el-form-item>
          </el-col>
          <el-col style="width: 300px">
            <el-form-item label="当天入库总体积：">{{ stockStatistics.veryDayVolume }}</el-form-item>
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
          <span>{{ scope.row.projectName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收货日期" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.rcvdDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入仓落货纸号" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.so }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入仓号" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inboundNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存箱数" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stockCtns }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存件数" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stockPcs }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存体积" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stockVolume }}</span>
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
            <el-form-item label="项目:">{{ detailTemp.projectName }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="收货日期:">{{ detailTemp.rcvdDate }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入仓落货纸号:">{{ detailTemp.so }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="入仓号:">{{ detailTemp.inboundNo }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单号:">{{ detailTemp.po }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="货物款号:">{{ detailTemp.item }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品名称:">{{ detailTemp.productName }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="进仓箱数:">{{ detailTemp.rcvdCtns }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="进仓件数:">{{ detailTemp.rcvdPcs }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="成交单位:">{{ detailTemp.declaUnit }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="进仓体积:">{{ detailTemp.boxAllVolumeActul }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="已出仓箱数:">{{ detailTemp.shippedCtns }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="已出仓件数:">{{ detailTemp.shippedPcs }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="已出仓体积:">{{ detailTemp.shippedVolume }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="库存箱数:">{{ detailTemp.stockCtns }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="库存件数:">{{ detailTemp.stockPcs }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="库存体积:">{{ detailTemp.stockVolume }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="库位:">{{ detailTemp.warehousePosition }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 文件导出 -->
    <el-dialog title="导出" :visible.sync="exportStockGoodsVisible" width="60%">
      <div class="filter-container">
        <el-form ref="exportStockGoodsForm" :rules="rules" :model="listQuery" label-position="left" label-width="120px" style="width: 1200px; margin-left:30px;">
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
        <el-button @click="exportStockGoodsVisible = false">
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
import { fetchStockGoodsList, exportStockGoodsList, loanAccountInfo, fetchStockStatistics } from '@/api/article'
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
      tableKey: 0,
      list: null,
      exportList: null,
      stockStatistics: null,
      total: 0,
      listLoading: true,
      accountArr: [],
      listQuery: {
        page: 1,
        size: 20,
        beginDate: undefined,
        endDate: undefined,
        billsBeginDate: undefined,
        billsEndDate: undefined,
        overStockUnitPrice: undefined,
        so: undefined,
        po: undefined,
        inbundNo: undefined,
        volumeMoreThanZero: undefined,
        pcsMoreThanZero: undefined,
        custId: undefined
      },
      detailTemp: {},
      detailVisible: false,
      downloadLoading: false,
      exportStockGoodsVisible: false,
      rules: {
      },
      isMoreThanZero: [{ value: 'true', label: '是' }, { value: 'false', label: '否' }]
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
      this.Axios.all([loanAccountInfo({}), fetchStockStatistics({})])
        .then(
          this.Axios.spread(function(AccountInfo, StockStatistics) {
            that.accountArr = AccountInfo.data.items
            that.stockStatistics = StockStatistics.data
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
    // 项目匹配
    matchProject(value) {
      let str = '--'
      this.accountArr.forEach(item => {
        if (item.projectId === value) {
          str = item.projectName
        }
      })
      return str
    },
    getList() {
      this.listLoading = true
      fetchStockGoodsList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        if (this.list === null) {
          this.list = []
        }
        // 客户类型转换
        this.list.forEach(item => {
          item.custShortName = this.matchAccount(item.custId)
          item.projectName = this.matchProject(item.projectId)
        })
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.$refs['queryForm'].validate(validate => {
        if (validate) {
          this.listQuery.page = 1
          this.getList()
        }
      })
    },
    // handleExport() {
    //   this.exportStockGoodsVisible = true
    //   this.$nextTick(() => {
    //     this.$refs['exportStockGoodsForm'].clearValidate()
    //   })
    // },
    handleDownload() {
      // this.exportStockGoodsVisible = false
      this.downloadLoading = true

      exportStockGoodsList(this.listQuery).then(response => {
        this.exportList = response.data.items
        // 客户类型转换
        this.exportList.forEach(item => {
          item.custShortName = this.matchAccount(item.custId)
        })
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['客户', '项目', '收货日期', '入仓落货纸号', '入仓号', '订单号', '货物款号', '商品名称', '进仓箱数', '进仓件数', '成交单位', '进仓体积', '已出仓箱数', '已出仓件数', '已出仓体积', '库存箱数', '库存件数', '库存体积', '库位', '备注']
          const filterVal = ['custShortName', 'projectId', 'rcvdDate', 'so', 'inboundNo', 'po', 'item', 'productName', 'rcvdCtns', 'rcvdPcs', 'declaUnit', 'boxAllVolumeActul', 'shippedCtns', 'shippedPcs', 'shippedVolume', 'stockCtns', 'stockPcs', 'stockVolume', 'warehousePosition', '']
          const data = this.formatJson(filterVal, this.exportList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '存仓货物表'
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
