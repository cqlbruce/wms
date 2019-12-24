<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="form-inline">
        <el-form-item label="客户">
          <el-select v-model="listQuery.custId" placeholder="请选择" clearable>
            <el-option v-for="item in accountArr" :key="item.custId" :label="item.custShortName" :value="item.custId" />
          </el-select>
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
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="客户" style="width: 25%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.custShortName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户全称" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.custFullName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.projectName }}</span>
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
          <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />

    <!-- 修改 -->
    <el-dialog title="修改" :visible.sync="updateVisible" :close-on-click-modal="false" width="70%">
      <el-form
        ref="updateForm"
        :rules="updateRules"
        :model="temp"
        :label-position="labelPosition"
        :inline="true"
        label-width="100px"
      >
        <el-row>
          <el-form-item label="客户:" prop="custShortName">
            <span>{{ temp.custShortName }}</span>
            <!-- <el-select v-model="temp.custId" placeholder="请选择" clearable>
              <el-option v-for="item in accountArr" :key="item.custId" :label="item.custShortName" :value="item.custId" />
            </el-select> -->
          </el-form-item>
          <el-form-item label="客户全称:" prop="custFullName">
            <el-input v-model="temp.custFullName" clearable />
          </el-form-item>
          <el-form-item label="项目名称:" prop="projectName">
            <el-input v-model="temp.projectName" clearable />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="updateVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData()">确认</el-button>
      </div>
    </el-dialog>

    <!-- 新增 -->
    <el-dialog title="新增" :visible.sync="addVisible" :close-on-click-modal="false" width="70%">
      <el-form
        ref="addForm"
        :rules="addRules"
        :model="temp"
        :label-position="labelPosition"
        :inline="true"
        label-width="100px"
      >
        <el-row>
          <el-form-item label="客户:" prop="custShortName">
            <el-select v-model="temp.custShortName" placeholder="请选择" filterable allow-create clearable default-first-option>
              <el-option v-for="item in accountArr" :key="item.custId" :label="item.custShortName" :value="item.custShortName" />
            </el-select>
          </el-form-item>
          <el-form-item label="客户全称:" prop="custFullName">
            <el-input v-model="temp.custFullName" clearable />
          </el-form-item>
          <el-form-item label="项目名称:" prop="projectName">
            <el-input v-model="temp.projectName" clearable />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" @click="createData()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addAccount, loanAccountInfo, updateAccount, deleteAccount } from '@/api/article'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'AccountManage',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      labelPosition: 'right',
      accountArr: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20,
        custId: undefined
      },
      temp: {
        custFullName: '',
        custId: '',
        custShortName: '',
        projectId: '',
        projectName: ''
      },
      addRules: {
        // po: [{ required: true, message: 'po is required', trigger: 'blur' }],
        // sku: [{ required: true, message: 'sku is required', trigger: 'blur' }]
      },
      updateRules: {
        // po: [{ required: true, message: 'po is required', trigger: 'blur' }],
        // sku: [{ required: true, message: 'sku is required', trigger: 'blur' }]
      },
      // 修改
      updateVisible: false,
      // 新增
      addVisible: false
    }
  },
  created() {
    this.getALLData()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      loanAccountInfo(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        if (this.list === null) {
          this.list = []
        }
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
    // 新增
    handleCreate() {
      this.resetTemp()
      this.addVisible = true
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.temp.custId = this.matchAccount(this.temp.custShortName)
          addAccount(this.temp).then(response => {
            this.addVisible = false
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
    matchAccount(value) {
      let str = ''
      this.accountArr.forEach(item => {
        if (item.custShortName === value) {
          str = item.custId
        }
      })
      return str
    },
    resetTemp() {
      this.temp = {
        id: '',
        custFullName: '',
        custId: '',
        custShortName: '',
        projectId: '',
        projectName: ''
      }
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.updateVisible = true
      this.$nextTick(() => {
        this.$refs['updateForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['updateForm'].validate(valid => {
        if (valid) {
          updateAccount(this.temp).then(response => {
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
    handleDelete(row) {
      this.$confirm('是否删除客户信息?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        deleteAccount({ id: row.id }).then(response => {
          this.dataVisible = false
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
      }).catch(
        () => {
          this.listQuery.page = 1
          this.getList()
        })
    }
  }
}
</script>
