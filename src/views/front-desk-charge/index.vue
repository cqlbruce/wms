<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="form-inline">
        <el-form-item label="客户">
          <el-select v-model="listQuery.custId" placeholder="请选择" clearable>
            <el-option v-for="item in accountArr" :key="item.custId" :label="item.custShortName" :value="item.custId" />
          </el-select>
        </el-form-item>
        <el-form-item label="收费日期">
          <el-date-picker
            v-model="listQuery.tranDate"
            align="right"
            type="date"
            value-format="yyyy-MM-dd"
            style="width: 150px;"
            placeholder="日期"
          />
        </el-form-item>
        <el-form-item label="车牌">
          <el-input v-model="listQuery.carNum" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="handleCreate">新增</el-button>
        <el-button v-waves type="primary" icon="el-icon-download" @click="handleExport">导出</el-button>
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
          <span>{{ scope.row.custShortName }}</span>
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
          <span>{{ enumerMap(scope.row.payType,'payType') }}</span>
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
          <span>{{ scope.row.feeTotal }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="180px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220" fixed="right">
        <template slot-scope="{row}">
          <el-button size="mini" @click="handleUpdate(row)">修改</el-button>
          <el-button size="mini" @click="handleDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />

    <!-- 新增 -->
    <el-dialog title="新增" :visible.sync="dialogFormVisible" width="1100px">
      <el-form
        ref="addDataForm"
        :rules="addDataRules"
        :model="addDataModel"
        :label-position="labelPosition"
        :inline="true"
        label-width="100px"
        style="width:1100px;min-width:1100px"
      >
        <el-row>
          <el-form-item label="客户名称:" prop="custId">
            <el-select v-model="addDataModel.custId" placeholder="请选择" style="width: 185px" clearable>
              <el-option v-for="item in accountArr" :key="item.custId" :label="item.custShortName" :value="item.custId" />
            </el-select>
          </el-form-item>
          <el-form-item label="车牌:" prop="carNum">
            <el-input v-model="addDataModel.carNum" />
          </el-form-item>
          <el-form-item label="报关费:" prop="customsDeclarationFee">
            <el-input v-model="addDataModel.customsDeclarationFee" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="入闸费:" prop="enterGateFee">
            <el-input v-model="addDataModel.enterGateFee" />
          </el-form-item>
          <el-form-item label="收款方式:" prop="po">
            <el-select v-model="addDataModel.po" placeholder="请选择" style="width: 185px" class="filter-item">
              <el-option v-for="item in payTypeOption" :key="item.display_name" :label="item.display_name" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item label="收据编号:" prop="receiptNo">
            <el-input v-model="addDataModel.receiptNo" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="一车几单:" prop="billOneCar">
            <el-input v-model.number="addDataModel.billOneCar" @input="changeBill(addDataModel.billOneCar)" />
            <!-- <el-input-number v-model="addDataModel.billOneCar" :min="0" :max="10" controls-position="right" @change="changeBill(addDataModel.billOneCar)" /> -->
          </el-form-item>
          <el-form-item label="收费日期:" prop="tranDate">
            <el-date-picker v-model="addDataModel.tranDate" align="right" type="date" value-format="yyyy-MM-dd" style="width: 185px;" />
          </el-form-item>
          <el-form-item label="备注:" prop="remark">
            <el-input v-model="addDataModel.remark" />
          </el-form-item>
        </el-row>
      </el-form>
      <div v-for="(its,index) in addDataModel.items" :key="index">
        <el-form
          :ref="'addListForm' + index"
          :rules="addListFormRules"
          :model="its"
          :label-position="labelPosition"
          :inline="true"
          label-width="100px"
        >
          <el-row>
            <el-form-item label="入仓号:" prop="inboundNo">
              <el-input v-model="its.inboundNo" />
            </el-form-item>
            <el-form-item label="so:" prop="so">
              <el-input v-model="its.so" />
            </el-form-item>
            <el-form-item style="width:120px;">
              <el-checkbox v-model="its.commercialInspectionFlag" border size="medium">是否商检</el-checkbox>
            </el-form-item>
            <el-form-item label="海关物料号:" :prop="its.commercialInspectionFlag?'customsMeterialNo':''">
              <el-input v-model="its.customsMeterialNo" :disabled="!its.commercialInspectionFlag" />
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改" :visible.sync="updateVisible" width="70%">
      <el-form
        ref="dataForm"
        :rules="tempRules"
        :model="temp"
        :label-position="labelPosition"
        :inline="true"
        label-width="100px"
      >
        <el-row>
          <el-form-item label="客户名称:" prop="custShortName">
            <el-input v-model="temp.custShortName" />
          </el-form-item>
          <el-form-item label="车牌号:" prop="carNum">
            <el-input v-model="temp.carNum" />
          </el-form-item>
          <el-form-item label="报关费:" prop="customsDeclarationFee">
            <el-input v-model="temp.customsDeclarationFee" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="入闸费:" prop="enterGateFee">
            <el-input v-model="temp.enterGateFee" />
          </el-form-item>
          <el-form-item label="收款方式:" prop="payType">
            <el-select v-model="temp.payType" placeholder="请选择" clearable style="width: 185px" class="filter-item">
              <el-option v-for="item in payTypeOption" :key="item.display_name" :label="item.display_name" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item label="收据编号:" prop="receiptNo">
            <el-input v-model="temp.receiptNo" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="一车几单:" prop="billOneCar">
            <el-input v-model="temp.billOneCar" />
          </el-form-item>
          <el-form-item label="收费日期:" prop="carNum">
            <el-date-picker v-model="temp.tranDate" align="right" type="date" value-format="yyyy-MM-dd" style="width: 185px;" />
          </el-form-item>
          <el-form-item label="备注:" prop="remark">
            <el-input v-model="temp.remark" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="入仓号:" prop="inboundNo">
            <el-input v-model="temp.inboundNo" />
          </el-form-item>
          <el-form-item label="so:" prop="so">
            <el-input v-model="temp.so" />
          </el-form-item>
          <el-form-item label="海关物料号:" prop="customsMeterialNo">
            <el-input v-model="temp.customsMeterialNo" />
          </el-form-item>
        </el-row>
        <el-row :gutter="10">
          <el-checkbox v-model="temp.commercialInspectionFlag" size="medium">是否商检</el-checkbox>
        </el-row>
      </el-form>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="updateVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData()">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="详情" :visible.sync="detailFormVisible" width="60%">
      <el-form ref="updateForm" :model="temp" :label-position="labelPosition" :inline="true" label-width="140px">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="客户名称:">{{ temp.custShortName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车牌号:">{{ temp.carNum }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报关费:">{{ temp.customsDeclarationFee }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="入闸费:">{{ temp.enterGateFee }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收款方式:">{{ enumerMap(temp.payType,'payType') }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收据编号:">{{ temp.receiptNo }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="一车几单:">{{ '一车' + temp.billOneCar + '单' }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收费日期:">{{ temp.tranDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注:">{{ temp.remark }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="入仓号:">{{ temp.inboundNo }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="so:">{{ temp.so }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="海关物料号:">{{ temp.customsMeterialNo }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-checkbox v-model="temp.spectionFlag" disabled>商检标识</el-checkbox>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchFrontDeskChargeList,
  exportFrontDeskCharge,
  modifyFrontDeskCharge,
  // addFrontDeskCharge,
  loanAccountInfo
} from '@/api/article'
import waves from '@/directive/waves' // waves directive
import {
  parseTime,
  getNowFormatDate
} from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

// 收款方式
const payTypeOption = [{
  key: '0',
  display_name: '微信'
},
{
  key: '1',
  display_name: '现金'
},
{
  key: '2',
  display_name: '月结'
}
]

export default {
  name: 'FrontDeskCharge',
  components: {
    Pagination
  },
  directives: {
    waves
  },
  filters: {},
  data() {
    var checkNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('单数不能不填或0'))
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else {
        if (value <= 0) {
          callback(new Error('必须单数大于0'))
        } else {
          callback()
        }
      }
    }
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
        custId: undefined,
        tranDate: getNowFormatDate(),
        carNum: undefined
      },
      temp: {
        billOneCar: '',
        carNum: '',
        custName: '',
        customsDeclarationFee: '',
        enterGateFee: '',
        payType: '',
        projectName: '',
        recAmt: '',
        receiptNo: '',
        tranDate: getNowFormatDate(),
        items: []
      },
      addDataModel: {
        billOneCar: '',
        carNum: '',
        custName: '',
        customsDeclarationFee: '',
        enterGateFee: '',
        po: '',
        projectName: '',
        recAmt: '',
        receiptNo: '',
        tranDate: getNowFormatDate(),
        items: []
      },
      addListFormRules: {
        inboundNo: [
          { required: true, message: '请填写入仓号', trigger: 'blur' }
        ],
        so: [
          { required: true, message: '请填写so', trigger: 'blur' }
        ],
        customsMeterialNo: [
          { required: true, message: '请填写物料号', trigger: 'blur' }
        ]
      },
      addListFormModel: {
        inboundNo: '',
        so: '',
        customsMeterialNo: ''
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
      addDataRules: { // 新增校验规则
        customsDeclarationFee: [
          { required: true, message: '请填写报关费', trigger: 'blur' }
        ],
        carNum: [
          { required: true, message: '请填写车牌号', trigger: 'blur' }
        ],
        enterGateFee: [
          { required: true, message: '请填写入闸费', trigger: 'blur' }
        ],
        po: [
          { required: true, message: '请选择收款方式', trigger: 'change' }
        ],
        receiptNo: [
          { required: true, message: '请填写收据编号', trigger: 'blur' }
        ],
        billOneCar: [
          { validator: checkNum, type: 'number', required: true, trigger: 'blur' }
        ]
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
      // 新增
      dialogFormVisible: false,
      // 下载
      downloadLoading: false,
      // 详情
      detailFormVisible: false,
      // 修改
      updateVisible: false
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
        this.total = response.data.total
        this.list = response.data.items
        // 客户类型转换
        this.list.forEach(item => {
          item.custShortName = this.matchAccount(item.custId)
          item.spectionFlag = this.matchFlag(item.commercialInspectionFlag)
        })
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
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
    // 支付类型匹配
    matchPayType(value) {
      let str = '--'
      this.payTypeOption.forEach(item => {
        if (item.key === value) {
          str = item.display_name
        }
      })
      return str
    },
    // 商检标识
    matchFlag(value) {
      let str = false
      if (value === '1') {
        str = true
      }
      return str
    },
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        billOneCar: '',
        carNum: '',
        custName: '',
        customsDeclarationFee: '',
        enterGateFee: '',
        payType: '',
        projectName: '',
        recAmt: '',
        receiptNo: '',
        tranDate: new Date(),
        items: []
      }
    },
    // 根据输入的单号触发事件
    changeBill(size) {
      this.addDataModel.billOneCar = size
      this.addDataModel.items = []
      for (let i = 0; i < size; i++) {
        var num = {
          inboundNo: '',
          so: '',
          customsMeterialNo: ''
        }
        this.addDataModel.items.push(num)
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addDataForm'].clearValidate()
      })
    },
    checkCustomsMeterialNo(items) {
      if (!items.length) return true
      for (let i = 0, len = items.length; i < len; i++) {
        const { commercialInspectionFlag, customsMeterialNo } = items[i]
        if (commercialInspectionFlag && !customsMeterialNo) {
          this.$message({
            showClose: true,
            message: `第${i + 1}海关物料号不能为空`,
            type: 'error'
          })
          return false
        }
      }
      return true
    },
    createData() {
      var newArr = []
      this.$refs['addDataForm'].validate(valid => {
        if (valid) {
          this.$nextTick(() => {
            for (var i = 0; i < this.addDataModel.items.length; i++) {
              this.$refs['addListForm' + i][0].validate((valid) => {
                if (valid) {
                  newArr.push(valid)
                } else {
                  console.log('error submit!!')
                  return
                }
                if (i === this.addDataModel.items.length - 1) {
                  if (newArr.every(valid => valid)) {
                    if (this.checkCustomsMeterialNo(this.addDataModel.items)) {
                      console.log('success submit!!')
                      console.log(this.addDataModel)
                      // 保存数据并关闭弹窗
                    }
                  }
                }
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
      // this.$refs['dataForm'].validate(valid => {
      //   if (valid) {
      //     this.temp.items.forEach(item => {
      //       if (item.commercialInspectionFlag) {
      //         item.commercialInspectionFlag = '1'
      //       } else {
      //         item.commercialInspectionFlag = '0'
      //       }
      //     })
      //     addFrontDeskCharge(this.temp).then(response => {
      //       this.dialogFormVisible = false
      //       this.listQuery.page = 1
      //       this.getList()
      //       if (response.respHeader.respCode !== '200') {
      //         this.$notify({
      //           title: '失败',
      //           message: response.respHeader.respMsg,
      //           type: 'fail',
      //           duration: 2000
      //         })
      //       } else {
      //         this.$notify({
      //           title: '成功',
      //           message: response.respHeader.respMsg,
      //           type: 'success',
      //           duration: 2000
      //         })
      //       }
      //     })
      //   }
      // })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.temp.commercialInspectionFlag) {
            this.temp.commercialInspectionFlag = '1'
          } else {
            this.temp.commercialInspectionFlag = '0'
          }
          modifyFrontDeskCharge(this.temp).then(response => {
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
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.updateVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDetail(row) {
      this.temp = Object.assign({}, row)
      this.detailFormVisible = true
    },
    handleExport() {
      this.downloadLoading = true

      exportFrontDeskCharge(this.listQuery).then(response => {
        this.exportList = response.data.items
        // 客户姓名匹配
        this.exportList.forEach(item => {
          item.custShortName = this.matchAccount(item.custId)
          item.payType = this.matchPayType(item.payType)
        })

          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['收费日期', '客户名称', '车牌', '入仓号', 'SO', '报关费', '入闸费', '收款方式', '收据编号', '一车几单', '费用合计',
              '备注'
            ]
            const filterVal = ['tranDate', 'custShortName', 'carNum', 'inboundNo', 'so',
              'customsDeclarationFee', 'enterGateFee', 'payType', 'receiptNo', 'billOneCar', 'feeTotal',
              'remark'
            ]
            const data = this.formatJson(filterVal, this.exportList)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '前台收费信息表'
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

<style scoped>
  .excel-upload-input {
    display: none;
    z-index: -9999;
  }
</style>
