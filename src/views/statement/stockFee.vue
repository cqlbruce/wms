<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="form-inline">
        <el-form-item label="客户">
          <el-select v-model="listQuery.custId" placeholder="请选择" clearable>
            <el-option v-for="item in accountArr" :key="item.custId" :label="item.custShortName" :value="item.custId" />
          </el-select>
        </el-form-item>
        <el-form-item label="进仓日期">
          <el-date-picker v-model="listQuery.beginDate" align="right" type="date" value-format="yyyy-MM-dd" style="width: 150px;" placeholder="开始日期" /> -
          <el-date-picker v-model="listQuery.endDate" align="right" type="date" value-format="yyyy-MM-dd" style="width: 150px;" placeholder="截止日期" />
        </el-form-item>
        <el-form-item label="入仓落货纸号">
          <el-input v-model="listQuery.so" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="项目">
          <el-input v-model="listQuery.projectId" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
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
          <span>{{ scope.row.projectId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进仓日期" style="width: 20%" align="center">
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
      <el-table-column label="车牌" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.carNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入仓总箱数" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.rcvdCtns }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入仓总体积" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.boxAllVolumeActul }}</span>
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
            <el-form-item label="项目:">{{ detailTemp.projectId }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="进仓日期:">{{ detailTemp.rcvdDate }}</el-form-item>
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
            <el-form-item label="车牌:">{{ detailTemp.carNum }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="柜号:">{{ detailTemp.cntrNo }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入仓总箱数:">{{ detailTemp.rcvdCtns }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="入仓总体积:">{{ detailTemp.boxAllVolumeActul }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入仓报关费:">{{ detailTemp.customsDeclarationFee }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="续页费:">{{ detailTemp.continuationSheetFee }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入闸费:">{{ detailTemp.enterGateFee }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="装卸单价:">{{ detailTemp.unloadUnitPrice }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="卸货费:">{{ detailTemp.unloadFee }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="混装费:">{{ detailTemp.assortedPackingFee }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="加班费:">{{ detailTemp.overtimeFee }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="删单费:">{{ detailTemp.delBillFee }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商检费:">{{ detailTemp.commercialInspectionFee }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="运输费:">{{ detailTemp.trafficFee }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="押车费:">{{ detailTemp.pledgeCarFee }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="代垫费:">{{ detailTemp.paymentInAdvanceFee }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="代垫税费:">{{ detailTemp.paymentInAdvanceTaxFee }}</el-form-item>
          </el-col>
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
          <el-form-item label="卸货费:" prop="unloadFee">
            <el-input v-model="updateTemp.unloadFee" clearable />
          </el-form-item>
          <el-form-item label="入仓报关费:" prop="customsDeclarationFee">
            <el-input v-model="updateTemp.customsDeclarationFee" clearable />
          </el-form-item>
          <el-form-item label="入闸费:" prop="enterGateFee">
            <el-input v-model="updateTemp.enterGateFee" clearable />
          </el-form-item>
          <el-form-item label="代垫费:" prop="paymentInAdvanceFee">
            <el-input v-model="updateTemp.paymentInAdvanceFee" clearable />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="续页费:" prop="continuationSheetFee">
            <el-input v-model="updateTemp.continuationSheetFee" clearable />
          </el-form-item>
          <el-form-item label="装卸单价:" prop="unloadUnitPrice">
            <el-input v-model="updateTemp.unloadUnitPrice" clearable />
          </el-form-item>
          <el-form-item label="混装费:" prop="assortedPackingFee">
            <el-input v-model="updateTemp.assortedPackingFee" clearable />
          </el-form-item>
          <el-form-item label="加班费:" prop="overtimeFee">
            <el-input v-model="updateTemp.overtimeFee" clearable />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="删单费:" prop="delBillFee">
            <el-input v-model="updateTemp.delBillFee" clearable />
          </el-form-item>
          <el-form-item label="商检费:" prop="commercialInspectionFee">
            <el-input v-model="updateTemp.commercialInspectionFee" clearable />
          </el-form-item>
          <el-form-item label="运输费:" prop="trafficFee">
            <el-input v-model="updateTemp.trafficFee" clearable />
          </el-form-item>
          <el-form-item label="押车费:" prop="pledgeCarFee">
            <el-input v-model="updateTemp.pledgeCarFee" clearable />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="代垫税费:" prop="paymentInAdvanceTaxFee">
            <el-input v-model="updateTemp.paymentInAdvanceTaxFee" clearable />
          </el-form-item>
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
import { fetchStockFeeList, exportStockFeeList, loanAccountInfo, stockFeeUpdate } from '@/api/article'
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
      stockStatistics: null,
      exportList: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20,
        beginDate: undefined,
        endDate: undefined,
        so: undefined,
        projectId: undefined,
        custId: undefined
      },
      detailTemp: {

      },
      updateTemp: {
        unloadFee: undefined,
        customsDeclarationFee: undefined,
        enterGateFee: undefined,
        paymentInAdvanceFee: undefined,
        remark: undefined
      },
      downloadLoading: false,
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
    getList() {
      this.listLoading = true
      fetchStockFeeList(this.listQuery).then(response => {
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
    // 列表导出
    handleDownload() {
      this.downloadLoading = true
      exportStockFeeList(this.listQuery).then(response => {
        this.exportList = response.data.items
        // 客户类型转换
        this.exportList.forEach(item => {
          item.custShortName = this.matchAccount(item.custId)
        })
        console.log(this.exportList)
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['客户', '项目', '进仓日期', '入仓落货纸号', '入仓号', '车牌', '柜号', '入仓总箱数', '入仓总体积', '入仓报关费', '续页费', '闸口费', '装卸单价', '卸货费', '混装费', '加班费', '删单费', '商检费', '运输费', '压车费', '代垫费', '代垫税费', '合计']
          const filterVal = ['custShortName', 'projectId', 'rcvdDate', 'so', 'inboundNo', 'carNum', 'cntrNo', 'rcvdCtns', 'boxAllVolumeActul', 'customsDeclarationFee', 'continuationSheetFee', 'enterGateFee', 'unloadUnitPrice', 'unloadFee', 'assortedPackingFee', 'overtimeFee', 'delBillFee', 'commercialInspectionFee', 'trafficFee', 'pledgeCarFee', 'paymentInAdvanceFee', 'paymentInAdvanceTaxFee', 'total']
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
          stockFeeUpdate(this.updateTemp).then(response => {
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
