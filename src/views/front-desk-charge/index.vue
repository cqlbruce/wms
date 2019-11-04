<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="form-inline">
        <el-form-item label="客户">
          <el-select v-model="listQuery.custName" placeholder="请选择" clearable>
            <el-option v-for="item in accountArr" :key="item.accountName" :label="item.accountName" :value="item.accountName" />
          </el-select>
        </el-form-item>
        <el-form-item label="收费日期">
          <el-date-picker v-model="listQuery.tranDate" align="right" type="date" value-format="yyyy-MM-dd" style="width: 150px;" placeholder="日期" />
        </el-form-item>
        <el-form-item label="车牌">
          <el-input
            v-model="listQuery.carNum"
            style="width: 200px;"
            class="filter-item"
            clearable
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-button
          v-waves
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >查询</el-button>
        <el-button
          type="primary"
          icon="el-icon-edit"
          @click="handleCreate"
        >新增</el-button>
      </el-form>
    </div>

    <!-- 列表 -->
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="收费日期" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tranDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户名称" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.custName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车牌" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.carNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入仓号" min-width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inboundNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="SO" min-width="180px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.so }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报关费" min-width="180px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.customsDeclarationFee }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入闸费" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.enterGateFee }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收款方式" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ enumerMap(scope.row.payType,'bankTransStatus') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收据编号" min-width="180px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.receiptNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="一车几单" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ "一车" + scope.row.billOneCar + "单" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="费用合计" min-width="180px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.recAmt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="180px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="220"
        fixed="right"
      >
        <template slot-scope="{row}">
          <el-button size="mini" @click="handleUpdate(row)">修改</el-button>
          <el-button size="mini" @click="handleDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />

    <!-- 新增/修改 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%">
      <el-form
        ref="dataForm"
        :rules="tempRules"
        :model="temp"
        :label-position="labelPosition"
        :inline="true"
        label-width="140px"
      >
        <el-row>
          <el-form-item label="入仓编号:" prop="inboundNo">
            <el-input v-model="temp.inboundNo" />
          </el-form-item>
          <el-form-item label="代收款合计:" prop="recAmt">
            <el-input v-model="temp.recAmt" />
          </el-form-item>
          <el-form-item label="收款方式:" prop="po">
            <el-select v-model="temp.payType" placeholder="请选择" clearable style="width: 190px" class="filter-item">
              <el-option v-for="item in payTypeOption" :key="item.display_name" :label="item.display_name" :value="item.key" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="收据编号:" prop="receiptNo">
            <el-input v-model="temp.receiptNo" />
          </el-form-item>
          <el-form-item label="一车几单:" prop="billOneCar">
            <el-input v-model="temp.billOneCar" />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData()">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="详情" :visible.sync="detailFormVisible" width="60%">
      <el-form
        ref="detailForm"
        :model="temp"
        :label-position="labelPosition"
        :inline="true"
        label-width="140px"
      >
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="入仓编号:">{{ temp.inboundNo }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="落货纸号码:">{{ temp.so }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收据编码:">{{ temp.receiptNo }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="客户名称:">{{ temp.custName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工厂名称:">{{ temp.factory }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收费日期:">{{ temp.tranDate }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="项目名称:">{{ temp.projectName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="一车几单:">{{ '一车' + temp.billOneCar + '单' }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车牌号:">{{ temp.carNum }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="支付方式:">{{ enumerMap(temp.payType,'bankTransStatus') }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="代收款合计:">{{ temp.recAmt }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入闸费:">{{ temp.enterGateFee }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="报关费:">{{ temp.customsDeclarationFee }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchFrontDeskChargeList,
  addFrontDeskCharge,
  loanAccountInfo
} from '@/api/article'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

// 收款方式
const payTypeOption = [
  { key: '0', display_name: '现金支付' },
  { key: '1', display_name: '微信支付' }
]

export default {
  name: 'FrontDeskCharge',
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    return {
      accountArr: [],
      payTypeOption,
      labelPosition: 'right',
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20,
        custName: undefined,
        tranDate: undefined,
        carNum: undefined
      },
      temp: {
        id: '',
        inboundNo: '',
        so: '',
        receiptNo: '',
        custName: '',
        factory: '',
        tranDate: '',
        projectName: '',
        billOneCar: '',
        carNum: '',
        payType: '',
        recAmt: '',
        enterGateFee: '',
        customsDeclarationFee: ''
      },
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {},
      tempRules: {
        // po: [{ required: true, message: 'po is required', trigger: 'blur' }],
        // sku: [{ required: true, message: 'sku is required', trigger: 'blur' }]
      },
      loading: false,
      progress: 0,
      progressIndex: 0,
      tableData: {
        list: []
      },
      asyncValue: {
        file: null
      },
      // 新增修改弹窗
      dialogFormVisible: false,
      // 下载
      downloadLoading: false,
      // 详情
      detailFormVisible: false
    }
  },
  watch: {
    progressIndex: function(n) {
      this.progress = n * (100 / this.tableData.list.length)
    }
  },
  created() {
    this.getALLData()
    this.getList()
  },
  methods: {
    // 文件改变时触发
    handleChange(file, fileList) {
      const obj = {
        fileName: file.name,
        size: (file.size / 1024).toFixed(2) + 'kb',
        statusTxt: '待上传',
        status: file.status,
        file: file.raw
      }
      if (this.tableData.list.length >= 5) {
        this.$message.warning(`最多可选五个文件`)
      } else {
        this.tableData.list.push(obj)
      }
    },
    getList() {
      this.listLoading = true
      fetchFrontDeskChargeList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // 获取客户信息
    getALLData() {
      const that = this
      this.Axios.all([loanAccountInfo()])
        .then(
          this.Axios.spread(function(AccountInfo) {
            that.accountArr = AccountInfo.data.items
          })
        )
        .catch(err => {
          console.log(err)
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: '',
        inboundNo: '',
        so: '',
        receiptNo: '',
        custName: '',
        factory: '',
        tranDate: '',
        projectName: '',
        billOneCar: '',
        carNum: '',
        payType: '',
        recAmt: '',
        enterGateFee: '',
        customsDeclarationFee: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          addFrontDeskCharge(this.temp).then(response => {
            this.dialogFormVisible = false
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
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.detailFormVisible = true
      this.$nextTick(() => {
        this.$refs['detailForm'].clearValidate()
      })
    },
    handleDetail(row) {
      this.temp = Object.assign({}, row)
      this.detailFormVisible = true
      this.$nextTick(() => {
        this.$refs['detailForm'].clearValidate()
      })
    }
  }
}
</script>

<style scoped>
.excel-upload-input {
  display: none;
  z-index: -9999;
}
</style>
