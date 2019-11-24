import request from '@/utils/request'

/**  入库概要查询  **/
export function batchLoadStock(data) {
  return request({
    url: '/stock/abstract/load',
    method: 'post',
    data
  })
}

/**  入库查询  **/
export function fetchStock(data) {
  return request({
    url: '/stock/load',
    method: 'post',
    data
  })
}

/** 新增入库信息 */
export function addStock(data) {
  return request({
    url: '/stock/add',
    method: 'post',
    data
  })
}

/** 更改入库信息 */
export function updateStock(data) {
  return request({
    url: '/stock/modify',
    method: 'post',
    data
  })
}

/** 出库 */
export function outBoundStock(data) {
  return request({
    url: '/stock/outbound',
    method: 'post',
    data
  })
}

/** 上传入库文件 */
export function uploadFile(data) {
  return request({
    url: 'stock/upload',
    method: 'post',
    data
  })
}

/**  出库查询  **/
export function loadShippedList(data) {
  return request({
    url: '/shipped/load',
    method: 'post',
    data
  })
}

/**  出库批量查询  **/
export function loadBatchShippedList(data) {
  return request({
    url: '/shipped/abstract/load',
    method: 'post',
    data
  })
}

/** 上传入库文件 */
export function uploadShippedFile(data) {
  return request({
    url: 'shipped/upload',
    method: 'post',
    data
  })
}

/** 入库费用查询 */
export function fetchStockFeeList(data) {
  return request({
    url: '/statement/loadStockFee',
    method: 'post',
    data
  })
}

/** 入库费用导出 */
export function exportStockFeeList(data) {
  return request({
    url: '/statement/exportStockFee',
    method: 'post',
    data
  })
}

/** 出库费用查询*/
export function fetchShippedFeeList(data) {
  return request({
    url: '/statement/loadShippedFee',
    method: 'post',
    data
  })
}

/** 出库费用导出*/
export function exportShippedFeeList(data) {
  return request({
    url: '/statement/exportShippedFee',
    method: 'post',
    data
  })
}

/** 存仓货物查询*/
export function fetchStockGoodsList(data) {
  return request({
    url: '/statement/loadStockGoods',
    method: 'post',
    data
  })
}

/** 存仓货物导出*/
export function exportStockGoodsList(data) {
  return request({
    url: '/statement/exportStockGoods',
    method: 'post',
    data
  })
}

/** 出仓货物查询*/
export function fetchShippedGoodsList(data) {
  return request({
    url: '/statement/loadShippedGoods',
    method: 'post',
    data
  })
}

/** 出仓货物导出*/
export function exportShippedGoodsList(data) {
  return request({
    url: '/statement/exportShippedGoods',
    method: 'post',
    data
  })
}

/** 前台收费查询*/
export function fetchFrontDeskChargeList(data) {
  return request({
    url: '/charge/query',
    method: 'post',
    data
  })
}

/** 前台收费导出*/
export function exportFrontDeskCharge(data) {
  return request({
    url: '/charge/export',
    method: 'post',
    data
  })
}

/** 前台收费新增*/
export function addFrontDeskCharge(data) {
  return request({
    url: '/charge/add',
    method: 'post',
    data
  })
}

/** 前台收费修改*/
export function modifyFrontDeskCharge(data) {
  return request({
    url: '/charge/update',
    method: 'post',
    data
  })
}

/** 前台收费删除*/
export function deleteFrontDeskCharge(data) {
  return request({
    url: '/charge/delete',
    method: 'post',
    data
  })
}

/** 获取客户信息*/
export function loanAccountInfo(data) {
  return request({
    url: '/cust/query',
    method: 'post',
    data
  })
}

/** 客户新增*/
export function addAccount(data) {
  return request({
    url: '/cust/add',
    method: 'post',
    data
  })
}

/** 客户修改*/
export function updateAccount(data) {
  return request({
    url: '/cust/update',
    method: 'post',
    data
  })
}

/** 客户删除*/
export function deleteAccount(data) {
  return request({
    url: '/cust/delete',
    method: 'post',
    data
  })
}

