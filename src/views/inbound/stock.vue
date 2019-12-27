<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="form-inline">
        <el-form-item label="客户">
          <el-select v-model="listQuery.custId" placeholder="请选择" clearable>
            <el-option v-for="item in accountArr" :key="item.custId" :label="item.custShortName" :value="item.custId" />
          </el-select>
        </el-form-item>
        <el-form-item label="入仓号">
          <el-input
            v-model="listQuery.inboundNo"
            style="width: 200px;"
            class="filter-item"
            clearable
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="SO">
          <el-input
            v-model="listQuery.so"
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
      <el-table-column label="收货日期" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.rcvdDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.custShortName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入仓号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inboundNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车牌" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.carNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库状态" align="center">
        <template slot-scope="scope">
          <span>{{ enumerMap(scope.row.status,'stockStatus') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="220"
        fixed="right"
      >
        <template slot-scope="{row}">
          <!-- <el-button size="mini" type="primary" @click="handleAbstractUpdate(row)">修改</el-button> -->
          <el-button size="mini" type="danger" @click="handleAbstractImport(row)">导入</el-button>
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

    <!-- 概要导入 -->
    <el-dialog title="导入" width="60%" :visible.sync="abstractImportVisible" :close-on-click-modal="false" @close="closeAbstractImport">
      <el-form ref="abstractForm" :inline="true" :model="asyncAbstractValue" class="form-inline">
        <div class="pedetail-title clearfix">
          <div class="btnList">
            <el-upload
              ref="upload"
              class="upload"
              multiple
              action="http://192.168.34.186:20020/"
              :limit="5"
              :show-file-list="false"
              :on-change="handleAbstractChange"
              :auto-upload="false"
            >
              <el-button slot="trigger" size="small" type="primary">选择多文件</el-button>
              <div slot="tip" class="el-upload__tip">只能上传excel文件，最多只能选5个</div>
              <el-button type="success" size="small" @click="allAbstractUpload">开始上传</el-button>
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

          <el-table v-loading="loading" :data="abstractTableData.list" class="table">
            <el-table-column prop="fileName" align="center" min-width="160" label="文件名" />
            <el-table-column prop="size" align="center" min-width="100" label="大小" />
            <el-table-column prop="statusTxt" align="center" min-width="100" label="状态" />
            <el-table-column align="center" min-width="80" fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button
                  v-show="scope.row.status === 'fail'"
                  size="mini"
                  :type="loadType(scope.row.status)"
                  @click="againAbstractUpload(scope.$index, scope.row)"
                >重传</el-button>
                <el-button
                  v-show="scope.row.status !== 'load'"
                  size="mini"
                  type="danger"
                  @click="beforeAbstractRemove(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
    </el-dialog>

    <!-- 概要修改 -->
    <el-dialog title="修改" :visible.sync="abstractUpdateVisible" :close-on-click-modal="false" width="80%">
      <el-form
        ref="abstractUpdateForm"
        :rules="tempRules"
        :model="abstractUpdateTemp"
        :label-position="labelPosition"
        :inline="true"
        label-width="140px"
      >
        <el-row>
          <el-form-item label="车牌" prop="carNum">
            <el-input v-model="abstractUpdateTemp.carNum" clearable style="width: 195px" />
          </el-form-item>
          <el-form-item label="收货日期" prop="rcvdDate">
            <el-date-picker v-model="abstractUpdateTemp.rcvdDate" clearable align="right" type="date" value-format="yyyy-MM-dd" style="width: 195px;" />
          </el-form-item>
          <el-form-item label="入仓号" prop="inboundNo">
            <el-input v-model="abstractUpdateTemp.inboundNo" clearable style="width: 195px" />
          </el-form-item>
          <el-form-item label="入库状态" prop="status">
            <el-select v-model="abstractUpdateTemp.status" placeholder="请选择" clearable style="width: 195px" class="filter-item">
              <el-option v-for="item in statusOption" :key="item.display_name" :label="item.display_name" :value="item.key" />
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="abstractUpdateVisible = false">取消</el-button>
        <el-button type="primary" @click="abstractUpdateData()">确认</el-button>
      </div>
    </el-dialog>

    <!-- 列表详情 -->
    <el-dialog title="详情" :visible.sync="batchFormVisible" :close-on-click-modal="false" width="80%" destroy-on-close>
      <el-form
        ref="detailForm"
        :model="batchQuery"
        :label-position="labelPosition"
        :inline="true"
      >
        <el-form-item label="客户">
          <el-select v-model="batchQuery.custId" placeholder="请选择" clearable>
            <el-option v-for="item in accountArr" :key="item.custId" :label="item.custShortName" :value="item.custId" />
          </el-select>
        </el-form-item>
        <el-form-item label="SO">
          <el-input
            v-model="batchQuery.so"
            style="width: 200px;"
            class="filter-item"
            clearable
            @keyup.enter.native="handleLoadStockList"
          />
        </el-form-item>
        <el-form-item label="PO">
          <el-input
            v-model="batchQuery.po"
            style="width: 200px;"
            class="filter-item"
            clearable
            @keyup.enter.native="handleLoadStockList"
          />
        </el-form-item>
        <el-form-item label="ITEM">
          <el-input
            v-model="batchQuery.item"
            style="width: 200px;"
            class="filter-item"
            clearable
            @keyup.enter.native="handleLoadStockList"
          />
        </el-form-item>
        <el-button
          v-waves
          type="primary"
          icon="el-icon-search"
          @click="handleLoadStockList"
        >查询</el-button>
        <el-table
          v-loading="batchLoading"
          :data="batchList"
          border
          fit
          fixed
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column label="客户" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.custShortName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="入仓号" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.inboundNo }}</span>
            </template>
          </el-table-column>
          <el-table-column label="SO" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.so }}</span>
            </template>
          </el-table-column>
          <el-table-column label="PO" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.po }}</span>
            </template>
          </el-table-column>
          <el-table-column label="ITEM" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.item }}</span>
            </template>
          </el-table-column>
          <el-table-column label="箱数" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.rcvdCtns }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <span>{{ enumerMap(scope.row.status,'stockStatus') }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="250px" align="center">
            <template slot-scope="{row}">
              <el-button size="mini" type="danger" @click="handleDelete(row)">
                删除
              </el-button>
              <el-button size="mini" @click="handleUpdate(row)">
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

    <el-dialog title="详情" :visible.sync="detailFormVisible" :close-on-click-modal="false" width="80%" destroy-on-close>
      <el-form
        ref="batchForm"
        :model="batchTemp"
        :label-position="labelPosition"
        :inline="true"
        label-width="140px"
      >
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="供应商名称:">{{ batchTemp.supplierName }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入仓落货纸号:">{{ batchTemp.so }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户采购订单号:">{{ batchTemp.po }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="货物款号:">{{ batchTemp.item }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="入仓号:">{{ batchTemp.inboundNo }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="海关系统物料号:">{{ batchTemp.customsMeterialNo }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="收货日期:">{{ batchTemp.rcvdDate }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="实收箱数:">{{ batchTemp.rcvdCtns }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="实收件数:">{{ batchTemp.rcvdPcs }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="一箱几件:">{{ batchTemp.itemsPerBox }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单箱毛重:">{{ batchTemp.gwPerBoxActul }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="实收总毛重:">{{ batchTemp.gwAllActul }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="实测外箱长:">{{ batchTemp.boxLengthActul }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="实测外箱宽:">{{ batchTemp.boxWidthActul }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="实测外箱高:">{{ batchTemp.boxHighActul }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="实测单箱体积:">{{ batchTemp.boxPerVolumeActul }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="实收总体积:">{{ batchTemp.boxAllVolumeActul }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入仓报关单件净重:">{{ batchTemp.custsDeclaPieceWeigh }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入仓报关总净重:">{{ batchTemp.custsDeclaAllWeigh }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="仓库位置:">{{ batchTemp.warehousePosition }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="总出仓箱数:">{{ batchTemp.shippedCtns }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总出仓件数:">{{ batchTemp.shippedPcs }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总出仓毛重:">{{ batchTemp.shippedGw }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总出仓净重:">{{ batchTemp.shippedWeigh }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="总出仓体积:">{{ batchTemp.shippedVolume }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总库存箱数:">{{ batchTemp.stockCtns }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总库存件数:">{{ batchTemp.stockPcs }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总库存毛重:">{{ batchTemp.stockGw }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="总库存净重:">{{ batchTemp.stockWeigh }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总库存体积:">{{ batchTemp.stockVolume }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品名称:">{{ batchTemp.productName }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="海关编码:">{{ batchTemp.customsNo }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="成交单位:">{{ batchTemp.transactionUnit }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="成交币制:">{{ batchTemp.transactionCurrency }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="成交总价:">{{ batchTemp.declaTotalPrice }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申报要素:">{{ batchTemp.declaFator }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="第一法定单位:">{{ batchTemp.firstUnitMeasurement }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="第一法定数量:">{{ batchTemp.firstLegalCount }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="第二法定单位:">{{ batchTemp.secondUnitMeasurement }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="第二法定数量:">{{ batchTemp.secondLegalCount }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="备注:">{{ batchTemp.remark }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog title="修改" :visible.sync="updateFormVisible" :close-on-click-modal="false" width="80%">
      <el-form
        ref="updateForm"
        :rules="tempRules"
        :model="updateTemp"
        :label-position="labelPosition"
        :inline="true"
        label-width="140px"
      >
        <el-row>
          <el-form-item label="入仓号" prop="inboundNo">
            <el-input v-model="updateTemp.inboundNo" :disabled="true" style="width: 195px" />
          </el-form-item>
          <el-form-item label="SO" prop="so">
            <el-input v-model="updateTemp.so" :disabled="true" style="width: 195px" />
          </el-form-item>
          <el-form-item label="PO" prop="po">
            <el-input v-model="updateTemp.po" :disabled="true" style="width: 195px" />
          </el-form-item>
          <el-form-item label="ITEM" prop="item">
            <el-input v-model="updateTemp.item" :disabled="true" style="width: 195px" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="单箱毛重" prop="gwPerBoxActul">
            <el-input v-model="updateTemp.gwPerBoxActul" clearable />
          </el-form-item>
          <el-form-item label="长" prop="boxLengthActul">
            <el-input v-model="updateTemp.boxLengthActul" clearable />
          </el-form-item>
          <el-form-item label="宽" prop="boxWidthActul">
            <el-input v-model="updateTemp.boxWidthActul" clearable />
          </el-form-item>
          <el-form-item label="高" prop="boxHighActul">
            <el-input v-model="updateTemp.boxHighActul" clearable />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="箱数" prop="rcvdCtns">
            <el-input v-model="updateTemp.rcvdCtns" clearable />
          </el-form-item>
          <el-form-item label="仓位" prop="warehousePosition">
            <el-input v-model="updateTemp.warehousePosition" clearable />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="updateTemp.remark" clearable />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="updateFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData()">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" width="1100px">
      <el-form
        ref="addForm"
        :rules="tempRules"
        :model="addTemp"
        :label-position="labelPosition"
        :inline="true"
        label-width="140px"
        style="width:1100px;min-width:1100px"
      >
        <el-row>
          <el-form-item label="客户简称" prop="custId">
            <el-select v-model="addTemp.custId" placeholder="请选择" clearable>
              <el-option v-for="item in accountArr" :key="item.custId" :label="item.custShortName" :value="item.custId" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="入仓号" prop="inboundNo">
            <el-input v-model="addTemp.inboundNo" />
          </el-form-item>
          <el-form-item label="SO" prop="so">
            <el-input v-model="addTemp.so" />
          </el-form-item>
          <el-form-item label="PO" prop="po">
            <el-input v-model="addTemp.po" />
          </el-form-item>
          <el-form-item label="ITEM" prop="item">
            <el-input v-model="addTemp.item" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="箱数" prop="rcvdCtns">
            <el-input v-model="addTemp.rcvdCtns" />
          </el-form-item>
          <el-form-item label="PCS" prop="rcvdPcs">
            <el-input v-model="addTemp.rcvdPcs" />
          </el-form-item>
          <el-form-item label="单箱毛重" prop="gwPerBoxActul">
            <el-input v-model="addTemp.gwPerBoxActul" />
          </el-form-item>
          <el-form-item label="包装类型" prop="packType">
            <el-input v-model="addTemp.packType" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="实测长" prop="boxLengthActul">
            <el-input v-model="addTemp.boxLengthActul" />
          </el-form-item>
          <el-form-item label="实测宽" prop="boxWidthActul">
            <el-input v-model="addTemp.boxWidthActul" />
          </el-form-item>
          <el-form-item label="实测高" prop="boxHighActul">
            <el-input v-model="addTemp.boxHighActul" />
          </el-form-item>
          <el-form-item label="库位" prop="warehousePosition">
            <el-input v-model="addTemp.warehousePosition" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="收货备注" prop="remark">
            <el-input v-model="addTemp.remark" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="第一法定单位" prop="firstUnitMeasurement">
            <el-input v-model="addTemp.firstUnitMeasurement" />
          </el-form-item>
          <el-form-item label="第一法定数量" prop="firstLegalCount">
            <el-input v-model="addTemp.firstLegalCount" />
          </el-form-item>
          <el-form-item label="第二法定单位" prop="secondUnitMeasurement">
            <el-input v-model="addTemp.secondUnitMeasurement" />
          </el-form-item>
          <el-form-item label="第二法定数量" prop="secondLegalCount">
            <el-input v-model="addTemp.secondLegalCount" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="成交单位" prop="transactionUnit">
            <el-input v-model="addTemp.transactionUnit" />
          </el-form-item>
          <el-form-item label="成交数量" prop="transactionCount">
            <el-input v-model="addTemp.transactionCount" />
          </el-form-item>
          <el-form-item label="申报单价" prop="declaUnitPrice">
            <el-input v-model="addTemp.declaUnitPrice" />
          </el-form-item>
          <el-form-item label="申报总价" prop="declaTotalPrice">
            <el-input v-model="addTemp.declaTotalPrice" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="申报币种" prop="declaCurrency">
            <el-input v-model="addTemp.declaCurrency" />
          </el-form-item>
          <el-form-item label="最终目的国" prop="destCountry">
            <el-input v-model="addTemp.destCountry" />
          </el-form-item>
          <el-form-item label="总净重" prop="custsDeclaAllWeigh">
            <el-input v-model="addTemp.custsDeclaAllWeigh" />
          </el-form-item>
          <el-form-item label="海关物料号" prop="customsMeterialNo">
            <el-input v-model="addTemp.customsMeterialNo" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="报关备注" prop="declareRemark">
            <el-input v-model="addTemp.declareRemark" />
          </el-form-item>
          <el-form-item label="海关编码" prop="customsNo">
            <el-input v-model="addTemp.customsNo" />
          </el-form-item>
          <el-form-item label="商品名称" prop="productName">
            <el-input v-model="addTemp.productName" />
          </el-form-item>
          <el-form-item label="规格型号" prop="specifiType">
            <el-input v-model="addTemp.specifiType" />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData()">确认</el-button>
      </div>
    </el-dialog>

    <!-- 导入 -->
    <el-dialog title="导入" width="60%" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="closeImport">
      <el-form ref="form" :inline="true" :model="asyncValue" class="form-inline">
        <el-form-item label="客户">
          <el-select v-model="asyncValue.custId" placeholder="请选择" clearable>
            <el-option v-for="item in accountArr" :key="item.custId" :label="item.custShortName" :value="item.custId" />
          </el-select>
        </el-form-item>
        <el-form-item label="入仓号">
          <el-input
            v-model="asyncValue.inboundNo"
            style="width: 200px;"
            class="filter-item"
            clearable
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
      </el-form>

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
import {
  batchLoadStock,
  fetchStock,
  addStock,
  updateStock,
  deleteStock,
  uploadFile,
  loanAccountInfo,
  abstractUpdateStock
} from '@/api/article'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

// 状态
const statusOption = [{
  key: '0',
  display_name: '登记'
},
{
  key: '1',
  display_name: '入库'
}
]

export default {
  name: 'StockComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    return {
      labelPosition: 'right',
      statusOption,
      accountArr: [],
      list: null,
      batchList: null,
      total: 0,
      batchTotal: 0,
      // 列表查询加载标识
      listLoading: true,
      batchLoading: true,
      // 入库概要查询
      listQuery: {
        page: 1,
        size: 20,
        custId: undefined,
        inboundNo: undefined,
        so: undefined
      },
      // 入库批次查询
      batchQuery: {
        page: 1,
        size: 10,
        inbundNo: undefined,
        item: undefined,
        so: undefined,
        po: undefined
      },
      // 批次修改请求参数
      updateTemp: {
        id: '',
        inboundNo: '',
        so: '',
        po: '',
        item: '',
        gwPerBoxActul: '',
        boxLengthActul: '',
        boxWidthActul: '',
        boxHighActul: '',
        rcvdCtns: '',
        warehousePosition: '',
        remark: ''
      },
      // 修改请求参数
      abstractUpdateTemp: {
        carNum: '',
        rcvdDate: '',
        custId: '',
        inboundNo: '',
        status: ''
      },
      addTemp: {
        custId: '',
        inboundNo: '',
        so: '',
        po: '',
        item: '',
        rcvdCtns: '',
        rcvdPcs: '',
        gwPerBoxActul: '',
        packType: '',
        boxLengthActul: '',
        boxWidthActul: '',
        boxHighActul: '',
        warehousePosition: '',
        remark: '',
        firstUnitMeasurement: '',
        firstLegalCount: '',
        secondUnitMeasurement: '',
        secondLegalCount: '',
        transactionUnit: '',
        transactionCount: '',
        declaUnitPrice: '',
        declaTotalPrice: '',
        declaCurrency: '',
        destCountry: '',
        stockWeigh: '',
        customsMeterialNo: '',
        declareRemark: '',
        customsNo: '',
        productName: '',
        specifiType: ''
      },
      batchTemp: {
        id: '',
        custId: '',
        status: '',
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
      dialogStatus: '',
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
      abstractTableData: {
        list: []
      },
      asyncValue: {
        file: null
      },
      asyncAbstractValue: {
        file: null
      },
      // 导入文件弹窗
      dialogVisible: false,
      // 概要导入弹窗
      abstractImportVisible: false,
      // 新增修改弹窗
      dialogFormVisible: false,
      // 列表详情
      detailFormVisible: false,
      // 批次详情
      batchFormVisible: false,
      // 批次详情修改
      updateFormVisible: false,
      // 详情修改
      abstractUpdateVisible: false,
      // 新增
      addFormVisible: false
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
      batchLoadStock(this.listQuery).then(response => {
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
    // 打开详情
    handleDetail(row) {
      this.batchQuery.inbundNo = row.inboundNo
      this.batchFormVisible = true
      this.handleLoadStockList()
    },
    // 批次查询
    handleLoadStockList() {
      this.batchQuery.page = 1
      this.loadStockList()
    },
    loadStockList() {
      this.batchLoading = true
      fetchStock(this.batchQuery).then(response => {
        this.batchList = response.data.items
        this.batchTotal = response.data.total
        if (this.batchList === null) {
          this.batchList = []
        }
        // 客户类型转换
        this.batchList.forEach(item => {
          item.custShortName = this.matchAccount(item.custId)
        })
        setTimeout(() => {
          this.batchLoading = false
        }, 1.5 * 1000)
      })
    },
    handleBatchDetail(row) {
      this.batchTemp = Object.assign({}, row)
      this.detailFormVisible = true
      this.$nextTick(() => {
        this.$refs['batchForm'].clearValidate()
      })
    },
    resetTemp() {
      this.addTemp = {
        custId: '',
        inboundNo: '',
        so: '',
        po: '',
        item: '',
        rcvdCtns: '',
        rcvdPcs: '',
        gwPerBoxActul: '',
        packType: '',
        boxLengthActul: '',
        boxWidthActul: '',
        boxHighActul: '',
        warehousePosition: '',
        remark: '',
        firstUnitMeasurement: '',
        firstLegalCount: '',
        secondUnitMeasurement: '',
        secondLegalCount: '',
        transactionUnit: '',
        transactionCount: '',
        declaUnitPrice: '',
        declaTotalPrice: '',
        declaCurrency: '',
        destCountry: '',
        stockWeigh: '',
        customsMeterialNo: '',
        declareRemark: '',
        customsNo: '',
        productName: '',
        specifiType: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.addFormVisible = true
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          addStock(this.addTemp).then(response => {
            this.addFormVisible = false
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
      this.copyUpdateObject(row)
      this.updateFormVisible = true
      this.$nextTick(() => {
        this.$refs['updateForm'].clearValidate()
      })
    },
    copyUpdateObject(row) {
      this.updateTemp.id = row.id
      this.updateTemp.inboundNo = row.inboundNo
      this.updateTemp.so = row.so
      this.updateTemp.po = row.po
      this.updateTemp.item = row.item
      this.updateTemp.gwPerBoxActul = row.gwPerBoxActul
      this.updateTemp.boxLengthActul = row.boxLengthActul
      this.updateTemp.boxWidthActul = row.boxWidthActul
      this.updateTemp.boxHighActul = row.boxHighActul
      this.updateTemp.rcvdCtns = row.rcvdCtns
      this.updateTemp.warehousePosition = row.warehousePosition
      this.updateTemp.remark = row.remark
    },
    updateData() {
      this.$refs['updateForm'].validate(valid => {
        if (valid) {
          updateStock(this.updateTemp).then(response => {
            this.updateFormVisible = false
            this.batchQuery.page = 1
            this.loadStockList()
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
    // 删除
    handleDelete(row) {
      this.$confirm('是否删除入库信息?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        deleteStock({ id: row.id }).then(response => {
          this.dataVisible = false
          this.handleLoadStockList()
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
          this.handleLoadStockList()
        })
    },
    // 概要修改
    handleAbstractUpdate(row) {
      this.copyAbstractUpdateObject(row)
      this.abstractUpdateVisible = true
      this.$nextTick(() => {
        this.$refs['abstractUpdateForm'].clearValidate()
      })
    },
    copyAbstractUpdateObject(row) {
      this.abstractUpdateTemp.carNum = row.carNum
      this.abstractUpdateTemp.rcvdDate = row.rcvdDate
      this.abstractUpdateTemp.custId = row.custId
      this.abstractUpdateTemp.inboundNo = row.inboundNo
      this.abstractUpdateTemp.status = row.status
    },
    abstractUpdateData() {
      this.$refs['abstractUpdateForm'].validate(valid => {
        if (valid) {
          abstractUpdateStock(this.abstractUpdateTemp).then(response => {
            this.abstractUpdateVisible = false
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
    },
    // 概要导入
    handleAbstractImport(row) {
      this.asyncAbstractValue.carNum = row.carNum
      this.asyncAbstractValue.rcvdDate = row.rcvdDate
      this.asyncAbstractValue.custId = row.custId
      this.asyncAbstractValue.inboundNo = row.inboundNo
      this.asyncAbstractValue.status = row.status
      this.abstractImportVisible = true
    },
    // 全部上传
    async allAbstractUpload() {
      const res = await this.$refs['abstractForm'].validate()
      if (!res) return

      const postMessage = i => {
        const fd = new FormData()
        if (i >= this.abstractTableData.list.length) {
          setTimeout(() => {
            this.progressIndex = 0
          }, 1000)
          return
        }
        for (const key in this.asyncAbstractValue) {
          if (this.asyncAbstractValue.hasOwnProperty(key)) {
            const item = this.asyncAbstractValue[key]
            if (key === 'file') {
              fd.append('excelFile', this.abstractTableData.list[i].file)
            } else {
              fd.append(key, item)
            }
          }
        }
        uploadFile(fd).then(res => {
          if (res.respHeader.respCode === '200') {
            this.abstractTableData.list[i].status = 'load'
            this.abstractTableData.list[i].statusTxt = '成功'
          } else {
            this.abstractTableData.list[i].status = 'fail'
            this.abstractTableData.list[i].statusTxt = '失败'
          }
          this.progressIndex = this.progressIndex * 1 + 1
          postMessage(this.progressIndex)
        })
      }
      postMessage(this.progressIndex)
    },
    // 重新上传
    async againAbstractUpload(i, row) {
      const res = await this.$refs['abstractForm'].validate()
      if (!res) return

      this.abstractTableData.list[i].statusTxt = '重传中'
      this.abstractTableData.list[i].status = 'again'
      const fd = new FormData()
      for (const key in this.asyncAbstractValue) {
        if (this.asyncAbstractValue.hasOwnProperty(key)) {
          const item = this.asyncAbstractValue[key]
          if (key === 'file') {
            fd.append('excelFile', this.abstractTableData.list[i].file)
          } else {
            fd.append(key, item)
          }
        }
      }
      uploadFile(fd).then(res => {
        if (res.respHeader.respCode === '200') {
          this.abstractTableData.list[i].status = 'load'
          this.abstractTableData.list[i].statusTxt = '成功'
        } else {
          this.abstractTableData.list[i].status = 'fail'
          this.abstractTableData.list[i].statusTxt = '失败'
        }
      })
    },
    closeAbstractImport() {
      this.abstractTableData.list = []
      this.asyncAbstractValue = {
        file: null
      }
      this.$emit('input', '')
      this.listQuery.page = 1
      this.getList()
    },
    // 删除未文件
    beforeAbstractRemove(index, file) {
      this.abstractTableData.list.splice(index, 1)
    },
    // 文件改变时触发
    handleAbstractChange(file, fileList) {
      const obj = {
        fileName: file.name,
        size: (file.size / 1024).toFixed(2) + 'kb',
        statusTxt: '待上传',
        status: file.status,
        file: file.raw
      }
      if (this.abstractTableData.list.length >= 5) {
        this.$message.warning(`最多可选五个文件`)
      } else {
        this.abstractTableData.list.push(obj)
      }
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
