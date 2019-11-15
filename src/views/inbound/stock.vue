<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="form-inline">
        <el-form-item label="客户">
          <el-select v-model="listQuery.custId" placeholder="请选择" clearable>
            <el-option v-for="item in accountArr" :key="item.custId" :label="item.custShortName" :value="item.custId" />
          </el-select>
        </el-form-item>
        <el-form-item label="入仓落货纸号：">
          <el-input
            v-model="listQuery.so"
            placeholder="so"
            style="width: 200px;"
            class="filter-item"
            clearable
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="客户采购订单号：">
          <el-input
            v-model="listQuery.po"
            placeholder="po"
            style="width: 200px;"
            class="filter-item"
            clearable
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="入仓编号：">
          <el-input
            v-model="listQuery.inboundNo"
            placeholder="inboundNo"
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
        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="handleImport"
        >导入</el-button>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      fixed
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="客户采购订单号" min-width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.po }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货物款号" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sku }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入仓号" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inboundNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物料号" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.customsMeterialNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总库存毛重" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stockGw }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商名称" min-width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.supplierName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入仓落货纸号" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.so }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收货日期" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.rcvdDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实收箱数" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.rcvdCtns }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实收件数" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.rcvdPcs }}</span>
        </template>
      </el-table-column>
      <el-table-column label="一箱几件" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.itemsPerBox }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实测单箱毛重" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.boxPerVolumeActul }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实收总毛重" min-width="110px" align="center">
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
          <el-button size="mini" @click="handleDetail(row)">详情</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">修改</el-button>
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
          <el-form-item label="货物款号:" prop="sku">
            <el-input v-model="temp.sku" placeholder="sku" />
          </el-form-item>
          <el-form-item label="入仓落货纸号:" prop="so">
            <el-input v-model="temp.so" placeholder="so" />
          </el-form-item>
          <el-form-item label="客户采购订单号:" prop="po">
            <el-input v-model="temp.po" placeholder="po" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="供应商名称:" prop="supplierName">
            <el-input v-model="temp.supplierName" />
          </el-form-item>
          <el-form-item label="入仓号:" prop="inboundNo">
            <el-input v-model="temp.inboundNo" />
          </el-form-item>
          <el-form-item label="海关系统物料号:" prop="customsMeterialNo">
            <el-input v-model="temp.customsMeterialNo" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="收货日期:" prop="rcvdDate">
            <el-date-picker v-model="temp.rcvdDate" align="right" type="date" value-format="yyyy-MM-dd" style="width: 185px;" />
          </el-form-item>
          <el-form-item label="实收箱数:" prop="rcvdCtns">
            <el-input v-model="temp.rcvdCtns" />
          </el-form-item>
          <el-form-item label="实收件数:" prop="rcvdPcs">
            <el-input v-model="temp.rcvdPcs" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="单箱毛重:" prop="gwPerBoxActul">
            <el-input v-model="temp.gwPerBoxActul" />
          </el-form-item>
          <el-form-item label="申报单价:" prop="declaUnitPrice">
            <el-input v-model="temp.declaUnitPrice" />
          </el-form-item>
          <el-form-item label="申报币种:" prop="declaCurrency">
            <el-input v-model="temp.declaCurrency" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="实测外箱长:" prop="boxLengthActul">
            <el-input v-model="temp.boxLengthActul" />
          </el-form-item>
          <el-form-item label="实测外箱宽:" prop="boxWidthActul">
            <el-input v-model="temp.boxWidthActul" />
          </el-form-item>
          <el-form-item label="实测外箱高:" prop="boxHighActul">
            <el-input v-model="temp.boxHighActul" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="入仓报关总净重:" prop="custsDeclaAllWeigh">
            <el-input v-model="temp.custsDeclaAllWeigh" />
          </el-form-item>
          <el-form-item label="仓库位置:" prop="warehousePosition">
            <el-input v-model="temp.warehousePosition" />
          </el-form-item>
          <el-form-item label="入仓报关单件净重:" prop="custsDeclaPieceWeigh">
            <el-input v-model="temp.custsDeclaPieceWeigh" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="备注:" prop="remark">
            <el-input v-model="temp.remark" />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'? createData() : updateData()">确认</el-button>
      </div>
    </el-dialog>

    <!-- 出库 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="outBoundFormVisible" width="60%">
      <div class="filter-container">
        <el-form
          ref="outBoundForm"
          :rules="rules"
          :model="shippedTemp"
          :label-position="labelPosition"
          label-width="120px"
        >
          <el-form-item label="出仓单号：" prop="shippedNo">
            <el-input
              v-model="shippedTemp.shippedNo"
              placeholder="shippedNo"
              style="width: 200px;"
              class="filter-item"
              clearable
            />
          </el-form-item>
          <el-form-item label="出仓件数：" prop="pcs">
            <el-input
              v-model="shippedTemp.pcs"
              placeholder="pcs"
              style="width: 200px;"
              class="filter-item"
              clearable
            />
          </el-form-item>
          <el-form-item label="总库存件数:">{{ shippedTemp.stockPcs }}</el-form-item>
        </el-form>
      </div>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="outBoundFormVisible = false">取消</el-button>
        <el-button type="primary" @click="outBoundData()">确认</el-button>
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
            <el-form-item label="供应商名称:">{{ temp.supplierName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入仓落货纸号:">{{ temp.so }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户采购订单号:">{{ temp.po }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="货物款号:">{{ temp.sku }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入仓号:">{{ temp.inboundNo }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="海关系统物料号:">{{ temp.customsMeterialNo }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="收货日期:">{{ temp.rcvdDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实收箱数:">{{ temp.rcvdCtns }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实收件数:">{{ temp.rcvdPcs }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="一箱几件:">{{ temp.itemsPerBox }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单箱毛重:">{{ temp.gwPerBoxActul }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实收总毛重:">{{ temp.gwAllActul }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="实测外箱长:">{{ temp.boxLengthActul }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实测外箱宽:">{{ temp.boxWidthActul }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实测外箱高:">{{ temp.boxHighActul }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="实测单箱体积:">{{ temp.boxPerVolumeActul }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实收总体积:">{{ temp.boxAllVolumeActul }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入仓报关单件净重:">{{ temp.custsDeclaPieceWeigh }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="入仓报关总净重:">{{ temp.custsDeclaAllWeigh }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库位置:">{{ temp.warehousePosition }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总出仓箱数:">{{ temp.shippedCtns }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="总出仓件数:">{{ temp.shippedPcs }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总出仓毛重:">{{ temp.shippedGw }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总出仓净重:">{{ temp.shippedWeigh }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="总出仓体积:">{{ temp.shippedVolume }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总库存箱数:">{{ temp.stockCtns }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总库存件数:">{{ temp.stockPcs }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="总库存毛重:">{{ temp.stockGw }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总库存净重:">{{ temp.stockWeigh }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总库存体积:">{{ temp.stockVolume }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="备注:">{{ temp.remark }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchInboundList,
  addStock,
  updateStock,
  uploadFile,
  loanAccountInfo
} from '@/api/article'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    return {
      labelPosition: 'right',
      accountArr: [],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20,
        po: undefined,
        so: undefined,
        inboundNo: undefined
      },
      temp: {
        id: '',
        supplierName: '',
        so: '',
        po: '',
        sku: '',
        inboundNo: '',
        customsMeterialNo: '',
        rcvdDate: '',
        rcvdCtns: '',
        rcvdPcs: '',
        itemsPerBox: '',
        gwPerBoxActul: '',
        gwAllActul: '',
        boxLengthActul: '',
        boxWidthActul: '',
        boxHighActul: '',
        boxPerVolumeActul: '',
        boxAllVolumeActul: '',
        custsDeclaPieceWeigh: '',
        custsDeclaAllWeigh: '',
        warehousePosition: '',
        shippedCtns: '',
        shippedPcs: '',
        shippedGw: '',
        shippedWeigh: '',
        shippedVolume: '',
        stockCtns: '',
        stockPcs: '',
        stockGw: '',
        stockWeigh: '',
        stockVolume: '',
        stockCheck: '',
        declaUnitPrice: undefined,
        declaCurrency: undefined
      },
      // 出库请求参数
      shippedTemp: {
        id: '',
        shippedNo: '',
        pcs: '',
        po: '',
        sku: '',
        so: '',
        stockPcs: ''
      },
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增',
        outbound: '出库'
      },
      rules: {
      },
      tempRules: {
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
      // 导入文件弹窗
      dialogVisible: false,
      // 新增修改弹窗
      dialogFormVisible: false,
      // 出库弹窗
      outBoundFormVisible: false,
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
      fetchInboundList(this.listQuery).then(response => {
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
    resetTemp() {
      this.temp = {
        id: '',
        supplierName: '',
        so: '',
        po: '',
        sku: '',
        inboundNo: '',
        customsMeterialNo: '',
        rcvdDate: '',
        rcvdCtns: '',
        rcvdPcs: '',
        itemsPerBox: '',
        gwPerBoxActul: '',
        gwAllActul: '',
        boxLengthActul: '',
        boxWidthActul: '',
        boxHighActul: '',
        boxPerVolumeActul: '',
        boxAllVolumeActul: '',
        custsDeclaPieceWeigh: '',
        custsDeclaAllWeigh: '',
        warehousePosition: '',
        shippedCtns: '',
        shippedPcs: '',
        shippedGw: '',
        shippedWeigh: '',
        shippedVolume: '',
        stockCtns: '',
        stockPcs: '',
        stockGw: '',
        stockWeigh: '',
        stockVolume: '',
        stockCheck: '',
        clp: '',
        pcs: ''
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
          addStock(this.temp).then(response => {
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
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.temp.author = 'vue-element-admin'
          updateStock(this.temp).then(response => {
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
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDetail(row) {
      this.temp = Object.assign({}, row)
      this.detailFormVisible = true
      this.$nextTick(() => {
        this.$refs['detailForm'].clearValidate()
      })
    },
    handleImport() {
      this.dialogVisible = true
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
        uploadFile(fd).then(res => {
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
      uploadFile(fd).then(res => {
        if (res.respHeader.respCode === '200') {
          this.tableData.list[i].status = 'load'
          this.tableData.list[i].statusTxt = '成功'
        } else {
          this.tableData.list[i].status = 'fail'
          this.tableData.list[i].statusTxt = '失败'
        }
      })
    },
    closeImport() {
      this.tableData.list = []
      this.asyncValue = {
        file: null
      }
      this.$emit('input', '')
      this.getList()
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
    // 删除未文件
    beforeRemove(index, file) {
      this.tableData.list.splice(index, 1)
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
