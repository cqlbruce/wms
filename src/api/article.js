import request from '@/utils/request'

/**  入库查询  **/
export function fetchInboundList(data) {
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
export function fetchOutputboundList(data) {
  return request({
    url: '/shipped/load',
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

/** 前台收费查询*/
export function addFrontDeskCharge(data) {
  return request({
    url: '/charge/add',
    method: 'post',
    data
  })
}
