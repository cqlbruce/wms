<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="form-inline">
        <el-form-item label="入仓落货纸号：">
          <el-input v-model="listQuery.so" placeholder="so" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="客户采购订单号：">
          <el-input v-model="listQuery.po" placeholder="po" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="货物款号：">
          <el-input v-model="listQuery.sku" placeholder="sku" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          查询
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
          新增
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleImport">
          导入
        </el-button>
      </el-form>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
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
      <el-table-column label="Actions" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button type="danger" size="mini" align="center" @click="handleOutBound(row)">
            出库
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 1200px; margin-left:30px;">
        <el-row>
          <el-col :span="80">
            <el-form-item label="客户采购订单号:" prop="po">
              <el-input v-model="temp.po" />
            </el-form-item>
          </el-col>
          <el-col :span="80">
            <el-form-item label="货物款号:" prop="sku">
              <el-input v-model="temp.sku" />
            </el-form-item>
          </el-col>
          <el-col :span="80">
            <el-form-item label="入仓落货纸号:" prop="so">
              <el-input v-model="temp.so" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="80">
            <el-form-item label="物料号:">
              <el-input v-model="temp.customsMeterialNo" />
            </el-form-item>
          </el-col>
          <el-col :span="80">
            <el-form-item label="实收箱数:">
              <el-input v-model="temp.rcvdCtns" />
            </el-form-item>
          </el-col>
          <el-col :span="80">
            <el-form-item label="实收件数:">
              <el-input v-model="temp.rcvdPcs" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="80">
            <el-form-item label="单箱毛重:">
              <el-input v-model="temp.gwPerBoxActul" />
            </el-form-item>
          </el-col>
          <el-col :span="80">
            <el-form-item label="单箱净重:">
              <el-input v-model="temp.custsDeclaPieceWeigh" />
            </el-form-item>
          </el-col>
          <el-col :span="80">
            <el-form-item label="报关单件净重:">
              <el-input v-model="temp.boxLengthActul" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="80">
            <el-form-item label="长(CM):">
              <el-input v-model="temp.boxLengthActul" />
            </el-form-item>
          </el-col>
          <el-col :span="80">
            <el-form-item label="宽(CM):">
              <el-input v-model="temp.boxWidthActul" />
            </el-form-item>
          </el-col>
          <el-col :span="80">
            <el-form-item label="高(CM):">
              <el-input v-model="temp.boxHighActul" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="80">
            <el-form-item label="成交数量:">
              <el-input v-model="temp.declaCount" />
            </el-form-item>
          </el-col>
          <el-col :span="80">
            <el-form-item label="申报单位:">
              <el-input v-model="temp.declaUnit" />
            </el-form-item>
          </el-col>
          <el-col :span="80">
            <el-form-item label="申报单价:">
              <el-input v-model="temp.declaUnitPrice" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="80">
            <el-form-item label="币制:">
              <el-input v-model="temp.declaCurrency" />
            </el-form-item>
          </el-col>
          <el-col :span="80">
            <el-form-item label="商品编码:">
              <el-input v-model="temp.customsMerchNo" />
            </el-form-item>
          </el-col>
          <el-col :span="80">
            <el-form-item label="商品名称:">
              <el-input v-model="temp.merchName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="80">
            <el-form-item label="原产国:">
              <el-input v-model="temp.originCountry" />
            </el-form-item>
          </el-col>
          <el-col :span="80">
            <el-form-item label="目的国:">
              <el-input v-model="temp.destCountry" />
            </el-form-item>
          </el-col>
          <el-col :span="80">
            <el-form-item label="仓位:">
              <el-input v-model="temp.warehousePosition" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="80">
            <el-form-item label="入仓号">
              <el-input v-model="temp.inboundNo" />
            </el-form-item>
          </el-col>
          <el-col :span="80">
            <el-form-item label="供应商名称">
              <el-input v-model="temp.supplierName" />
            </el-form-item>
          </el-col>
          <el-col :span="80">
            <el-form-item label="备注:">
              <el-input v-model="temp.remarks" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'? createData() : updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="outBoundFormVisible" width="60%">
      <div class="filter-container">
        <el-form ref="outBoundForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 1200px; margin-left:30px;">
          <el-form-item label="出仓单号：" prop="clp">
            <el-input v-model="temp.clp" placeholder="clp" style="width: 200px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item label="出仓件数：" prop="pcs">
            <el-input v-model="temp.pcs" placeholder="pcs" style="width: 200px;" class="filter-item" clearable />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="outBoundFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="outBoundData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="导入"
      width="60%"
      :visible.sync="dialogVisible"
      @close="closeImport"
    >
      <el-form
        ref="form"
        class="pedetail_Summary"
        :rules="rules"
        :model="asyncValue"
      />
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
            <el-button
              slot="trigger"
              size="small"
              type="primary"
            >选择多文件</el-button>
            <div
              slot="tip"
              class="el-upload__tip"
            >只能上传excel文件，最多只能选5个</div>
            <el-button
              type="success"
              size="small"
              @click="allUpload"
            >开始上传</el-button>
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

        <el-table
          v-loading="loading"
          :data="tableData.list"
          class="table"
        >
          <el-table-column
            prop="fileName"
            align="center"
            min-width="160"
            label="文件名"
          />
          <el-table-column
            prop="size"
            align="center"
            min-width="100"
            label="大小"
          />
          <el-table-column
            prop="statusTxt"
            align="center"
            min-width="100"
            label="状态"
          />
          <el-table-column
            align="center"
            min-width="80"
            fixed="right"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                v-show="scope.row.status == 'fail'"
                size="mini"
                :type="loadType(scope.row.status)"
                @click="againUpload(scope.$index, scope.row)"
              >重传</el-button>
              <el-button
                v-show="scope.row.status != 'load'"
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
import { fetchInboundList, addStock, updateStock, outBoundStock, uploadFile } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        po: undefined,
        so: undefined,
        sku: undefined
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
        stockCheck: ''
      },
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增',
        outbound: '出库'
      },
      rules: {
        po: [{ required: true, message: 'po is required', trigger: 'blur' }],
        sku: [{ required: true, message: 'sku is required', trigger: 'blur' }]
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
      downloadLoading: false
    }
  },
  watch: {
    progressIndex: function(n) {
      this.progress = n * (100 / this.tableData.list.length)
    }
  },
  created() {
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
        stockCheck: ''
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.author = 'vue-element-admin'
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
      this.$refs['dataForm'].validate((valid) => {
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
          })
        }
      })
    },
    outBoundData() {
      this.$refs['outBoundForm'].validate((valid) => {
        if (valid) {
          this.temp.author = 'vue-element-admin'
          outBoundStock(this.temp).then(response => {
            this.outBoundFormVisible = false

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
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleOutBound(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'outbound'
      this.outBoundFormVisible = true
      this.$nextTick(() => {
        this.$refs['outBoundForm'].clearValidate()
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
            if (key == 'file') {
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
          if (key == 'file') {
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
      },
      this.$emit('input', '')
      this.getList()
    },
    // 颜色显示
    loadType(status) {
      switch (status) {
        case 'fail':
          return 'primary'
          break
        case 'success':
          return 'primary'
          break
        case 'fail':
          return 'info'
          break
        case 'existed':
          return 'info'
          break
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
.excel-upload-input{
  display: none;
  z-index: -9999;
}
</style>
