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
        <el-form-item label="ShptNo">
          <el-input v-model="listQuery.shptNo" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="出仓单号">
          <el-input v-model="listQuery.clp" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="项目">
          <el-select v-model="listQuery.projectId" placeholder="请选择" clearable>
            <el-option v-for="item in accountArr" :key="item.projectId" :label="item.projectName" :value="item.projectId" />
          </el-select>
        </el-form-item>
        <el-form-item class="search">
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
        </el-form-item>
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
      <el-table-column label="进仓日期" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shippedDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="shptNo" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shptNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出仓单号" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.clp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车牌" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.carNum }}</span>
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
      <el-table-column
        label="操作"
        align="center"
        width="220"
        fixed="right"
      >
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="handleUpdate(row)">修改</el-button>
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
            <el-form-item label="出仓日期:">{{ detailTemp.shippedDate }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="shptNo:">{{ detailTemp.shptNo }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="出仓单号:">{{ detailTemp.clp }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="车牌号:">{{ detailTemp.carNum }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="柜号:">{{ detailTemp.cntrNo }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="运输路线:">{{ detailTemp.trafficLine }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="总出仓箱数:">{{ detailTemp.shippedCtns }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总出仓体积:">{{ detailTemp.shippedVolume }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="分拣费:">{{ detailTemp.sortingFee }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="报关费:">{{ detailTemp.customsDeclarationFee }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="闸口费:">{{ detailTemp.enterGateFee }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="装卸单价:">{{ detailTemp.unloadUnitPrice }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="装货费:">{{ detailTemp.loadFee }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商检费:">{{ detailTemp.commercialInspectionFee }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="运输费:">{{ detailTemp.trafficFee }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="压车费:">{{ detailTemp.pledgeCarFee }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="代垫费:">{{ detailTemp.paymentInAdvanceFee }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="代垫税费:">{{ detailTemp.paymentInAdvanceTaxFee }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="费用合计:">{{ detailTemp.total }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog title="修改" :visible.sync="updateVisible" :close-on-click-modal="false" width="70%">
      <el-form
        ref="updateForm"
        :rules="updateRules"
        :model="updateTemp"
        :label-position="labelPosition"
        :inline="true"
        label-width="100px"
      >
        <el-row>
          <el-row>
            <el-form-item label="shptNo:" prop="shptNo">
              <el-input v-model="updateTemp.shptNo" clearable />
            </el-form-item>
            <el-form-item label="运输路线:" prop="trafficLine">
              <el-input v-model="updateTemp.trafficLine" clearable />
            </el-form-item>
            <el-form-item label="代垫费:" prop="paymentInAdvanceFee">
              <el-input v-model="updateTemp.paymentInAdvanceFee" clearable />
            </el-form-item>
            <el-form-item label="代垫税费:" prop="paymentInAdvanceTaxFee">
              <el-input v-model="updateTemp.paymentInAdvanceTaxFee" clearable />
            </el-form-item>
          </el-row>
          <el-form-item label="分拣费:" prop="sortingFee">
            <el-input v-model="updateTemp.sortingFee" clearable />
          </el-form-item>
          <el-form-item label="报关费:" prop="customsDeclarationFee">
            <el-input v-model="updateTemp.customsDeclarationFee" clearable />
          </el-form-item>
          <el-form-item label="闸口费:" prop="enterGateFee">
            <el-input v-model="updateTemp.enterGateFee" clearable />
          </el-form-item>
          <el-form-item label="装卸单价:" prop="unloadUnitPrice">
            <el-input v-model="updateTemp.unloadUnitPrice" clearable />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="装货费:" prop="loadFee">
            <el-input v-model="updateTemp.loadFee" clearable />
          </el-form-item>
          <el-form-item label="商检费:" prop="commercialInspectionFee">
            <el-input v-model="updateTemp.commercialInspectionFee" clearable />
          </el-form-item>
          <el-form-item label="运输费:" prop="trafficFee">
            <el-input v-model="updateTemp.trafficFee" clearable />
          </el-form-item>
          <el-form-item label="压车费:" prop="pledgeCarFee">
            <el-input v-model="updateTemp.pledgeCarFee" clearable />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="其他:" prop="remark">
            <el-input v-model="updateTemp.remark" clearable />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="updateVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchShippedFeeList, exportShippedFeeList, loanAccountInfo, shippedFeeUpdate } from '@/api/article'
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
      accountArr: null,
      tableKey: 0,
      list: null,
      shippedStatistics: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        size: 20,
        beginDate: undefined,
        endDate: undefined,
        shptNo: undefined,
        clp: undefined,
        projectId: undefined,
        custId: undefined
      },
      downloadLoading: false,
      detailTemp: {

      },
      updateTemp: {

      },
      detailVisible: false,
      updateVisible: false,
      updateRules: {

      }
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
      fetchShippedFeeList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        if (this.list === null) {
          this.list = []
        }
        // 客户类型转换
        this.list.forEach(item => {
          item.projectName = this.matchProject(item.projectId)
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
    handleDownload() {
      this.downloadLoading = true

      exportShippedFeeList(this.listQuery).then(response => {
        this.exportList = response.data.items
        this.exportList.forEach(item => {
          item.custShortName = this.matchAccount(item.custId)
        })
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['客户', '项目', '出仓日期', 'shptNo', '出仓单号', '车牌', '柜号', '运输路线', '出仓箱数', '出仓体积', '分拣费', '报关费', '闸口费', '装卸单价', '装货费', '商检费', '运输费', '押车费', '代垫费', '代垫税费', '合计']
          const filterVal = ['custShortName', 'projectId', 'shippedDate', 'shptNo', 'clp', 'carNum', 'cntrNo', 'trafficLine', 'shippedCtns', 'shippedVolume', 'sortingFee', 'customsDeclarationFee', 'enterGateFee', 'unloadUnitPrice', 'loadFee', 'commercialInspectionFee', 'trafficFee', 'pledgeCarFee', 'paymentInAdvanceFee', 'paymentInAdvanceTaxFee', 'total']
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
    },
    // 详情页面
    handleDetail(row) {
      this.detailTemp = Object.assign({}, row)
      this.detailVisible = true
    },
    // 修改页面
    handleUpdate(row) {
      this.updateTemp = Object.assign({}, row)
      this.updateVisible = true
      this.$nextTick(() => {
        this.$refs['updateForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['updateForm'].validate(valid => {
        if (valid) {
          shippedFeeUpdate(this.updateTemp).then(response => {
            this.updateVisible = false
            this.listQuery.page = 1
            this.getList()
            if (response.respHeader.respCode !== '200') {
              this.$notify({
                title: '失败',
                message: response.respHeader.respMsg,
                type: 'fail',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '成功',
                message: response.respHeader.respMsg,
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    }
  }
}
</script>
