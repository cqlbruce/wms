<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="form-inline">
        <el-form-item label="客户">
          <el-select v-model="listQuery.custId" placeholder="请选择" clearable>
            <el-option v-for="item in accountArr" :key="item.custId" :label="item.custShortName" :value="item.custId" />
          </el-select>
        </el-form-item>
        <el-form-item label="CLP">
          <el-input v-model="listQuery.clp" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="SO">
          <el-input v-model="listQuery.so" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="PO">
          <el-input v-model="listQuery.po" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="ITEM">
          <el-input v-model="listQuery.item" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="柜号">
          <el-input v-model="listQuery.cntrNo" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="出仓日期：">
          <el-date-picker v-model="listQuery.beginDate" align="right" type="date" value-format="yyyy-MM-dd" style="width: 150px;" placeholder="开始日期" /> -
          <el-date-picker v-model="listQuery.endDate" align="right" type="date" value-format="yyyy-MM-dd" style="width: 150px;" placeholder="截止日期" />
        </el-form-item>
        <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">
          查询
        </el-button>
        <el-button type="primary" icon="el-icon-upload" @click="handleImport">
          导入
        </el-button>
        <el-button v-waves type="primary" icon="el-icon-download" @click="handleExport">
          导出
        </el-button>
      </el-form>
    </div>

    <!-- 列表展示 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      fixed
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="出仓日期" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shippedDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.custShortName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="CLP" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.clp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="柜号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cntrNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="封条" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.seal }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150px" align="center">
        <template slot-scope="{row}">
          <el-button size="mini" @click="handleDetail(row)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />

    <!-- 详情页 -->
    <el-dialog title="详情" :visible.sync="detailFormVisible" width="80%" destroy-on-close>
      <el-form
        ref="detailForm"
        :model="temp"
        :label-position="labelPosition"
        :inline="true"
      >
        <el-table
          v-loading="batchLoading"
          :data="batchList"
          border
          fit
          fixed
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column label="入仓落货纸号" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.so }}</span>
            </template>
          </el-table-column>
          <el-table-column label="客户采购订单号" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.po }}</span>
            </template>
          </el-table-column>
          <el-table-column label="货物款号" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.sku }}</span>
            </template>
          </el-table-column>
          <el-table-column label="出仓单号" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.shippedNo }}</span>
            </template>
          </el-table-column>
          <el-table-column label="出仓订单日期" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.shippedOrderDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="实际离仓日期" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.shippedDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="出仓箱数" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.shippedCtns }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150px" align="center">
            <template slot-scope="{row}">
              <el-button size="mini" @click="handleBatchDetail(row)">
                修改
              </el-button>
              <el-button size="mini" @click="handleBatchDetail(row)">
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <pagination v-show="batchTotal>0" :total="batchTotal" :page.sync="batchQuery.page" :limit.sync="batchQuery.size" />
    </el-dialog>

    <!-- 批次详情 -->
    <el-dialog title="详情" :visible.sync="batchFormVisible" width="80%" destroy-on-close>
      <el-form
        ref="batchForm"
        :model="batchTemp"
        :label-position="labelPosition"
        :inline="true"
        label-width="140px"
      >
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="出仓订单日期:">{{ batchTemp.shippedOrderDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实际离仓日期:">{{ batchTemp.shippedDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出仓单号:">{{ batchTemp.shippedNo }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="入仓落货纸号:">{{ batchTemp.so }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户采购订单号:">{{ batchTemp.po }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货物款号:">{{ batchTemp.sku }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="总出仓箱数:">{{ batchTemp.shippedCtns }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出仓件数:">{{ batchTemp.shippedpcs }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库位置:">{{ batchTemp.warehousePosition }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="出仓毛重:">{{ batchTemp.shippedGw }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出仓体积:">{{ batchTemp.shippedVolume }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入仓编号:">{{ batchTemp.inboundNo }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="海关系统物料号:">{{ batchTemp.customsMeterialNo }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品编码:">{{ batchTemp.customsMerchNo }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品名称:">{{ batchTemp.merchName }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="成交数量:">{{ batchTemp.declaCount }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="成交单位:">{{ batchTemp.declaUnit }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="成交单价:">{{ batchTemp.declaUnitPrice }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="成交总价:">{{ batchTemp.declaTotalPrice }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="成交币种:">{{ batchTemp.declaCurrency }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="原产国:">{{ batchTemp.originCountry }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="目的国:">{{ batchTemp.destCountry }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单件净重:">{{ batchTemp.pieceWeigh }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出仓总净重:">{{ batchTemp.shippedAllWeigh }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <!-- 导出 -->
    <el-dialog title="导出" :visible.sync="exportVisible" width="60%">
      <div class="filter-container">
        <el-form
          ref="exportForm"
          :rules="exportRules"
          :model="exportQuery"
          :inline="true"
          class="form-inline"
        >
          <el-form-item label="CLP" prop="clp">
            <el-input
              v-model="exportQuery.clp"
              style="width: 200px;"
              class="filter-item"
              clearable
            />
          </el-form-item>
          <el-form-item label="柜号" prop="cntrNo">
            <el-input
              v-model="exportQuery.cntrNo"
              style="width: 200px;"
              class="filter-item"
              clearable
            />
          </el-form-item>
          <el-form-item label="封条" prop="seal">
            <el-input
              v-model="exportQuery.seal"
              style="width: 200px;"
              class="filter-item"
              clearable
            />
          </el-form-item>
          <el-form-item label="柜重" prop="cntrWeigh">
            <el-input
              v-model="exportQuery.cntrWeigh"
              style="width: 200px;"
              class="filter-item"
              clearable
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="exportVisible = false">取消</el-button>
        <el-button type="primary" @click="exportFile()">导出</el-button>
      </div>
    </el-dialog>

    <!-- 导入 -->
    <el-dialog title="导入" width="60%" :visible.sync="dialogVisible" @close="closeImport">
      <el-form ref="form" class="pedetail_Summary" :rules="rules" :model="asyncValue" />
      <div class="pedetail-title clearfix">
        <div class="btnList">
          <el-upload
            ref="upload"
            class="upload"
            multiple
            action="http://192.168.34.186:20020/"
            :limit="5"
            :show-file-list="false"
            :on-change="handleChange"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">选择多文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传excel文件，最多只能选5个</div>
            <el-button type="success" size="small" @click="allUpload">开始上传</el-button>
          </el-upload>
        </div>
        <div class="progress">
          <el-progress
            v-show="progress != 0"
            :percentage="progress"
            :stroke-width="18"
            status="success"
          />
        </div>

        <el-table v-loading="loading" :data="tableData.list" class="table">
          <el-table-column prop="fileName" align="center" min-width="160" label="文件名" />
          <el-table-column prop="size" align="center" min-width="100" label="大小" />
          <el-table-column prop="statusTxt" align="center" min-width="100" label="状态" />
          <el-table-column align="center" min-width="80" fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button
                v-show="scope.row.status === 'fail'"
                size="mini"
                :type="loadType(scope.row.status)"
                @click="againUpload(scope.$index, scope.row)"
              >重传</el-button>
              <el-button
                v-show="scope.row.status !== 'load'"
                size="mini"
                type="danger"
                @click="beforeRemove(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { loadShippedList, loadBatchShippedList, uploadShippedFile, loanAccountInfo } from '@/api/article'
import { download } from '@/utils'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
  },
  data() {
    return {
      labelPosition: 'right',
      accountArr: [],
      list: null,
      batchList: null,
      batchTotal: 0,
      total: 0,
      listLoading: true,
      batchLoading: true,
      downloadLoading: true,
      // 列表查询请求参数
      listQuery: {
        page: 1,
        size: 20,
        custId: undefined,
        clp: undefined,
        so: undefined,
        po: undefined,
        item: undefined,
        cntrNo: undefined,
        beginDate: undefined,
        endDate: undefined
      },
      // 批量查询请求参数
      batchQuery: {
        page: 1,
        size: 20,
        clp: undefined,
        cntrNo: undefined,
        custId: undefined,
        shippedDate: undefined
      },
      // 导出请求参数
      exportQuery: {
        clp: undefined,
        cntrNo: undefined,
        cntrWeigh: undefined,
        seal: undefined
      },
      temp: {
        shippedOrderDate: '',
        shippedDate: '',
        shippedNo: '',
        so: ' ',
        po: '',
        sku: '',
        shippedCtns: '',
        shippedpcs: '',
        warehousePosition: '',
        shippedGw: '',
        shippedVolume: '',
        inboundNo: '',
        customsMeterialNo: '',
        customsMerchNo: '',
        merchName: '',
        declaCount: '',
        declaUnit: '',
        declaUnitPrice: '',
        declaTotalPrice: '',
        declaCurrency: '',
        originCountry: '',
        destCountry: '',
        pieceWeigh: '',
        shippedAllWeigh: ''
      },
      batchTemp: {
        shippedOrderDate: '',
        shippedDate: '',
        shippedNo: '',
        so: ' ',
        po: '',
        sku: '',
        shippedCtns: '',
        shippedpcs: '',
        warehousePosition: '',
        shippedGw: '',
        shippedVolume: '',
        inboundNo: '',
        customsMeterialNo: '',
        customsMerchNo: '',
        merchName: '',
        declaCount: '',
        declaUnit: '',
        declaUnitPrice: '',
        declaTotalPrice: '',
        declaCurrency: '',
        originCountry: '',
        destCountry: '',
        pieceWeigh: '',
        shippedAllWeigh: ''
      },
      // 列表详情
      detailFormVisible: false,
      // 批次详情
      batchFormVisible: false,
      // 导入文件
      dialogVisible: false,
      // 导出文件
      exportVisible: false,
      loading: false,
      progress: 0,
      progressIndex: 0,
      tableData: {
        list: []
      },
      asyncValue: {
        file: null
      },
      rules: {
      },
      exportRules: {
        cntrNo: [
          { required: true, message: '请输入柜号', trigger: 'blur' }
        ],
        seal: [
          { required: true, message: '请输入封条', trigger: 'blur' }
        ],
        cntrWeigh: [
          { required: true, message: '请输入柜重', trigger: 'blur' }
        ]
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
      loadBatchShippedList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
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
    handleDetail(row) {
      this.batchQuery = Object.assign({}, row)
      this.batchLoading = true
      loadShippedList(this.batchQuery).then(response => {
        this.batchList = response.data.items
        this.batchTotal = response.data.total
        setTimeout(() => {
          this.batchLoading = false
        }, 1.5 * 1000)
        this.detailFormVisible = true
      })
    },
    handleBatchDetail(row) {
      this.batchTemp = Object.assign({}, row)
      this.batchFormVisible = true
      this.$nextTick(() => {
        this.$refs['batchForm'].clearValidate()
      })
    },
    /** 导入文件 */
    handleImport() {
      this.dialogVisible = true
    },
    closeImport() {
      this.tableData.list = []
      this.asyncValue = {
        file: null
      }
      this.$emit('input', '')
      this.getList()
    },
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
    // 全部上传
    async allUpload() {
      const res = await this.$refs['form'].validate()
      if (!res) return

      const postMessage = i => {
        const fd = new FormData()
        if (i >= this.tableData.list.length) {
          setTimeout(() => {
            this.progressIndex = 0
          }, 1000)
          return
        }
        for (const key in this.asyncValue) {
          if (this.asyncValue.hasOwnProperty(key)) {
            const item = this.asyncValue[key]
            if (key === 'file') {
              fd.append('excelFile', this.tableData.list[i].file)
            } else {
              fd.append(key, item)
            }
          }
        }
        uploadShippedFile(fd).then(res => {
          if (res.respHeader.respCode === '200') {
            this.tableData.list[i].status = 'load'
            this.tableData.list[i].statusTxt = '成功'
          } else {
            this.tableData.list[i].status = 'fail'
            this.tableData.list[i].statusTxt = '失败'
          }
          this.progressIndex = this.progressIndex * 1 + 1
          postMessage(this.progressIndex)
        })
      }
      postMessage(this.progressIndex)
    },
    // 重新上传
    async againUpload(i, row) {
      const res = await this.$refs['form'].validate()
      if (!res) return

      this.tableData.list[i].statusTxt = '重传中'
      this.tableData.list[i].status = 'again'
      const fd = new FormData()
      for (const key in this.asyncValue) {
        if (this.asyncValue.hasOwnProperty(key)) {
          const item = this.asyncValue[key]
          if (key === 'file') {
            fd.append('excelFile', this.tableData.list[i].file)
          } else {
            fd.append(key, item)
          }
        }
      }
      uploadShippedFile(fd).then(res => {
        if (res.respHeader.respCode === '200') {
          this.tableData.list[i].status = 'load'
          this.tableData.list[i].statusTxt = '成功'
        } else {
          this.tableData.list[i].status = 'fail'
          this.tableData.list[i].statusTxt = '失败'
        }
      })
    },
    // 颜色显示
    loadType(status) {
      switch (status) {
        case 'fail':
          return 'primary'
        case 'success':
          return 'primary'
        case 'existed':
          return 'info'
        default:
          return 'primary'
      }
    },
    // 删除未上传文件
    beforeRemove(index, file) {
      this.tableData.list.splice(index, 1)
    },
    handleExport() {
      this.exportVisible = true

      this.$nextTick(() => {
        this.$refs['exportForm'].clearValidate()
      })
    },
    /** 导出文件 */
    exportFile() {
      this.$refs['exportForm'].validate((valid) => {
        if (valid) {
          console.log('验证成功')
          this.downloadLoading = true
          download('/shipped/download', this.exportQuery, '出库信息.xlsx').then(response => {
            this.exportVisible = false
            this.downloadLoading = false
          })
        } else {
          console.log('验证失败')
          return false
        }
      })
    }
  }
}
</script>
