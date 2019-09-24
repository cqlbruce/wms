<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="form-inline">
        <el-form-item label="出仓日期：">
          <el-date-picker v-model="listQuery.beginDate" align="right" type="date" style="width: 150px;" placeholder="开始日期" /> -
          <el-date-picker v-model="listQuery.endDate" align="right" type="date" style="width: 150px;" placeholder="截止日期" />
        </el-form-item>
        <el-form-item label="出仓单号：">
          <el-input v-model="listQuery.clp" placeholder="clp" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
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
        <el-button v-waves type="primary" @click="handleFilter">
          查询
        </el-button>
        <el-button @click="reset">
          重置
        </el-button>
      </el-form>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="出仓订单日期" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shippedOrderDate | parseTime('{y}/{m}/{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际离仓日期" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shippedDate | parseTime('{y}/{m}/{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出仓单号" width="210px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shippedNo }}</span>
        </template>
      </el-table-column>
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
      <el-table-column label="入仓号" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inboundNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" @click="handleModifyStatus(row,'deleted')">
            详情
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
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
  </div>
</template>

<script>
import { fetchOutputboundList, fetchPv, createArticle, updateArticle } from '@/api/article'
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
        sku: undefined,
        clp: undefined,
        so: undefined,
        po: undefined,
        beginDate: undefined,
        endDate: undefined
      },
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogPvVisible: false,
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
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
        limit: 20,
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
    }
  }
}
</script>
