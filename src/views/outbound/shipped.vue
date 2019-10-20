<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="form-inline">
        <el-form-item label="出仓日期：">
          <el-date-picker v-model="listQuery.beginDate" align="right" type="date" value-format="yyyy-MM-dd" style="width: 150px;" placeholder="开始日期" /> -
          <el-date-picker v-model="listQuery.endDate" align="right" type="date" value-format="yyyy-MM-dd" style="width: 150px;" placeholder="截止日期" />
        </el-form-item>
        <el-form-item label="出仓单号：">
          <el-input v-model="listQuery.shippedNo" placeholder="shippedNo" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="入仓落货纸号：">
          <el-input v-model="listQuery.so" placeholder="so" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="客户采购订单号：">
          <el-input v-model="listQuery.po" placeholder="po" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="货物款号：">
          <el-input v-model="listQuery.sku" placeholder="sku" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">
          查询
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="handleImport"
        >导入</el-button>
        <el-button v-waves type="primary" icon="el-icon-download" @click="handleExport">导出</el-button>
        <!-- <el-button @click="reset">
          重置
        </el-button> -->
      </el-form>
    </div>

    <!-- 列表展示 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      fixed
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="入仓落货纸号" width="210px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.so }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户采购订单号" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.po }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货物款号" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sku }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出仓单号" width="210px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shippedNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出仓订单日期" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shippedOrderDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际离仓日期" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shippedDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出仓箱数" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shippedCtns }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出仓件数" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shippedPcs }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出仓毛重" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shippedGw }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出仓体积" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shippedVolume }}</span>
        </template>
      </el-table-column>
      <el-table-column label="海关商品编码" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.customsMerchNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.merchName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="海关物料号" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.customsMeterialNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成交币种" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.declaCurrency }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150px" align="center">
        <template slot-scope="{row}">
          <el-button size="mini" @click="handleDetail(row)">
            详情
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />

    <!-- 新增/修改 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%">
      <el-form ref="dataForm" :rules="rules" :model="temp" :label-position="labelPosition" :inline="true" label-width="140px">
        <el-row>
          <el-form-item label="出仓订单日期:" prop="shippedOrderDate">
            <el-input v-model="temp.shippedOrderDate" />
          </el-form-item>
          <el-form-item label="实际离仓日期:" prop="shippedDate">
            <el-input v-model="temp.shippedDate" />
          </el-form-item>
          <el-form-item label="出仓单号:" prop="shippedNo">
            <el-input v-model="temp.shippedNo" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="入仓落货纸号:" prop="so">
            <el-input v-model="temp.so" />
          </el-form-item>
          <el-form-item label="客户采购订单号:" prop="po">
            <el-input v-model="temp.po" />
          </el-form-item>
          <el-form-item label="货物款号:" prop="sku">
            <el-input v-model="temp.sku" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="总出仓箱数:" prop="shippedCtns">
            <el-input v-model="temp.shippedCtns" />
          </el-form-item>
          <el-form-item label="出仓件数:" prop="shippedpcs">
            <el-input v-model="temp.shippedpcs" />
          </el-form-item>
          <el-form-item label="仓库位置:" prop="warehousePosition">
            <el-input v-model="temp.warehousePosition" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="出仓毛重:" prop="shippedGw">
            <el-input v-model="temp.shippedGw" />
          </el-form-item>
          <el-form-item label="出仓体积:" prop="shippedVolume">
            <el-input v-model="temp.shippedVolume" />
          </el-form-item>
          <el-form-item label="入仓编号:" prop="inboundNo">
            <el-input v-model="temp.inboundNo" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="海关系统物料号:" prop="customsMeterialNo">
            <el-input v-model="temp.customsMeterialNo" />
          </el-form-item>
          <el-form-item label="商品编码:" prop="customsMerchNo">
            <el-input v-model="temp.customsMerchNo" />
          </el-form-item>
          <el-form-item label="商品名称:" prop="merchName">
            <el-input v-model="temp.merchName" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="成交数量:" prop="declaCount">
            <el-input v-model="temp.declaCount" />
          </el-form-item>
          <el-form-item label="成交单位:" prop="declaUnit">
            <el-input v-model="temp.declaUnit" />
          </el-form-item>
          <el-form-item label="成交单价:" prop="declaUnitPrice">
            <el-input v-model="temp.declaUnitPrice" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="成交总价:" prop="declaTotalPrice">
            <el-input v-model="temp.declaTotalPrice" />
          </el-form-item>
          <el-form-item label="成交币种:" prop="declaCurrency">
            <el-input v-model="temp.declaCurrency" />
          </el-form-item>
          <el-form-item label="原产国:" prop="originCountry">
            <el-input v-model="temp.originCountry" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="目的国:" prop="destCountry">
            <el-input v-model="temp.destCountry" />
          </el-form-item>
          <el-form-item label="单件净重:" prop="pieceWeigh">
            <el-input v-model="temp.pieceWeigh" />
          </el-form-item>
          <el-form-item label="出仓总净重:" prop="shippedAllWeigh">
            <el-input v-model="temp.shippedAllWeigh" />
          </el-form-item>
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

    <!-- 详情页 -->
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
            <el-form-item label="出仓订单日期:">{{ temp.shippedOrderDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实际离仓日期:">{{ temp.shippedDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出仓单号:">{{ temp.shippedNo }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="入仓落货纸号:">{{ temp.so }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户采购订单号:">{{ temp.po }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货物款号:">{{ temp.sku }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="总出仓箱数:">{{ temp.shippedCtns }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出仓件数:">{{ temp.shippedpcs }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库位置:">{{ temp.warehousePosition }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="出仓毛重:">{{ temp.shippedGw }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出仓体积:">{{ temp.shippedVolume }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入仓编号:">{{ temp.inboundNo }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="海关系统物料号:">{{ temp.customsMeterialNo }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品编码:">{{ temp.customsMerchNo }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品名称:">{{ temp.merchName }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="成交数量:">{{ temp.declaCount }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="成交单位:">{{ temp.declaUnit }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="成交单价:">{{ temp.declaUnitPrice }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="成交总价:">{{ temp.declaTotalPrice }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="成交币种:">{{ temp.declaCurrency }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="原产国:">{{ temp.originCountry }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="目的国:">{{ temp.destCountry }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单件净重:">{{ temp.pieceWeigh }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出仓总净重:">{{ temp.shippedAllWeigh }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
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
import { fetchOutputboundList, createArticle, updateArticle, uploadShippedFile } from '@/api/article'
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
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      downloadLoading: true,
      listQuery: {
        page: 1,
        size: 20,
        sku: undefined,
        shippedNo: undefined,
        so: undefined,
        po: undefined,
        beginDate: undefined,
        endDate: undefined
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
      dialogFormVisible: false,
      detailFormVisible: false,
      // 导入文件弹窗
      dialogVisible: false,
      loading: false,
      progress: 0,
      progressIndex: 0,
      tableData: {
        list: []
      },
      asyncValue: {
        file: null
      },
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogPvVisible: false,
      rules: {

      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchOutputboundList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    reset() {
      this.listQuery = {
        page: 1,
        size: 20,
        sku: '',
        clp: '',
        so: '',
        po: '',
        beginDate: '',
        endDate: ''
      }
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
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
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
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
    // 删除未文件
    beforeRemove(index, file) {
      this.tableData.list.splice(index, 1)
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleExport() {
      if (this.listQuery.shippedNo == null) {
        this.$message.warning('出仓单号不能为空')
      }
      this.downloadLoading = true
      download('/shipped/download', this.listQuery, '出库信息.xlsx').then(response => {
        this.downloadLoading = false
      })
    }
  }
}
</script>
