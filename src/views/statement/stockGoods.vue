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
          <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="收货日期" style="width: 25%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.rcvdDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入仓编号" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inboundNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入仓落货纸号" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.so }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户采购订单号" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.po }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货物款号" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sku }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总库存件数" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stockPcs }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总库存体积" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stockVolume }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />

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
import { fetchStockGoodsList, exportStockGoodsList, loanAccountInfo } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'InboundFee',
  components: { Pagination },
  directives: { waves },
  data() {
    // const validateNumber = (rule, value, callback) => {
    //   // const flag = new RegExp('^([1-9][0-9]*(\.\d{1,2})?)|(0\.\d{1,2})?$').test(value)
    //   if (value !== '' && value !== null) {
    //     if (value <= 0) {
    //       callback(new Error('请输入正数'))
    //     }
    //   }
    //   callback()
    // }
    return {
      tableKey: 0,
      list: null,
      exportList: null,
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
      downloadLoading: false,
      exportStockGoodsVisible: false,
      rules: {
        // volumeMoreThanZero: [{ validator: validateNumber, trigger: 'blur' }],
        // pcsMoreThanZero: [{ validator: validateNumber, trigger: 'blur' }]
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
      this.Axios.all([loanAccountInfo({})])
        .then(
          this.Axios.spread(function(AccountInfo) {
            that.accountArr = AccountInfo.data.items
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
      fetchStockGoodsList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
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
    handleExport() {
      this.exportStockGoodsVisible = true
      this.$nextTick(() => {
        this.$refs['exportStockGoodsForm'].clearValidate()
      })
    },
    handleDownload() {
      this.exportStockGoodsVisible = false
      this.downloadLoading = true

      exportStockGoodsList(this.listQuery).then(response => {
        this.exportList = response.data.items

            import('@/vendor/Export2Excel').then(excel => {
              const tHeader = ['收货日期', '入仓编号', '入仓落货纸号', '客户采购订单号', '货物款号', '总库存件数', '总库存体积', '账单起算时间', '账单截止时间', '超仓期起算时间', '超仓租天数', '超仓租单价', '超仓租总费用']
              const filterVal = ['rcvdDate', 'inboundNo', 'so', 'po', 'sku', 'stockPcs', 'stockVolume', 'billsBeginDate', 'billsEndDate', 'overStockDate', 'overStockDays', 'overStockUnitPrice', 'overStockFee']
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
    }
  }
}
</script>
