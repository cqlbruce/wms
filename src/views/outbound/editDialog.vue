<template>
  <div>
    <el-dialog title="编辑详情" :visible.sync="updateFormVisible" :close-on-click-modal="false" width="80%" @close="closeDialog">
      <el-form v-if="stockUpdateModel" ref="stockUpdateForm" :model="stockUpdateModel" :label-position="labelPosition" :inline="true" label-width="140px">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="出仓订单日期:">
              <el-date-picker v-model="stockUpdateModel.shippedOrderDate" type="date" placeholder="选择日期" style="width: 180px;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实际离仓日期:">
              <el-date-picker v-model="stockUpdateModel.shippedDate" type="date" placeholder="选择日期" style="width: 180px;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出仓单号:">
              <el-input v-model="stockUpdateModel.shippedNo" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="入仓落货纸号:">
              <el-input v-model="stockUpdateModel.so" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户采购订单号:">
              <el-input v-model="stockUpdateModel.po" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货物款号:">
              <el-input v-model="stockUpdateModel.sku" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="总出仓箱数:">
              <el-input v-model="stockUpdateModel.shippedCtns" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出仓件数:">
              <el-input v-model="stockUpdateModel.shippedPcs" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库位置:">
              <el-input v-model="stockUpdateModel.warehousePosition" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="出仓毛重:">
              <el-input v-model="stockUpdateModel.shippedGw" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出仓体积:">
              <el-input v-model="stockUpdateModel.shippedVolume" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入仓编号:">
              <el-input v-model="stockUpdateModel.inboundNo" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="海关系统物料号:">
              <el-input v-model="stockUpdateModel.customsMeterialNo" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品编码:">
              <el-input v-model="stockUpdateModel.customsMerchNo" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品名称:">
              <el-input v-model="stockUpdateModel.merchName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="成交数量:">
              <el-input v-model="stockUpdateModel.declaCount" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="成交单位:">
              <el-input v-model="stockUpdateModel.declaUnit" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="成交单价:">
              <el-input v-model="stockUpdateModel.declaUnitPrice" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="成交总价:">
              <el-input v-model="stockUpdateModel.declaTotalPrice" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="成交币种:">
              <el-input v-model="stockUpdateModel.declaCurrency" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="原产国:">
              <el-input v-model="stockUpdateModel.originCountry" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="目的国:">
              <el-input v-model="stockUpdateModel.destCountry" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单件净重:">
              <el-input v-model="stockUpdateModel.pieceWeigh" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出仓总净重:">
              <el-input v-model="stockUpdateModel.shippedAllWeigh" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="updateData()">确认</el-button>
      </div>
    </el-dialog>Ï
  </div>
</template>
<script>
import { stockFixed } from './editConf.js'
export default {
  name: 'ShipEditDialog',
  props: {
    stockUpdateModel: {
      type: Object,
      default: () => {

      }
    },
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      labelPosition: 'right',
      updateFormVisible: false
    }
  },
  watch: {
    isVisible(val) {
      this.updateFormVisible = val
    }
  },
  methods: {
    updateData() {
      const obj = this.stockUpdateModel
      for (const k in obj) {
        if (k === 'warehousePosition') {
          if (!obj[k] && obj[k] !== 0) {
            this.$message({
              showClose: true,
              message: `${stockFixed[k]}不能为空`,
              type: 'error'
            })
            return
          }
        } else {
          if (!obj[k]) {
            this.$message({
              showClose: true,
              message: `${stockFixed[k]}不能为空`,
              type: 'error'
            })
            return
          }
        }
      }
      this.$message({
        showClose: true,
        message: '保存成功',
        type: 'success'
      })
      // 要提供保存接口
      this.closeDialog()
    },
    closeDialog() {
      this.$emit('closeDialog', false)
    }
  }
}

</script>
