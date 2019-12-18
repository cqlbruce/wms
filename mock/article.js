import Mock from 'mockjs'

const List = []
const count = 100
const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    author: '@first',
    reviewer: '@first',
    title: '@title(5, 10)',
    content_short: 'mock data',
    content: baseContent,
    forecast: '@float(0, 100, 2, 2)',
    importance: '@integer(1, 3)',
    'type|1': ['CN', 'US', 'JP', 'EU'],
    'status|1': ['published', 'draft', 'deleted'],
    display_time: '@datetime',
    comment_disabled: true,
    pageviews: '@integer(300, 5000)',
    image_uri,
    platforms: ['a-platform']
  }))
}

const batchStockList = [
  {
    carNum: '粤B888888',
    rcvdDate: '2019-11-16',
    custId: 'A01',
    inboundNo: 'APG18075501',
    status: '0'
  },
  {
    carNum: '粤B888866',
    rcvdDate: '2019-11-15',
    custId: 'B01',
    inboundNo: 'APG18073001',
    status: '1'
  },
  {
    carNum: '粤B668888',
    rcvdDate: '2019-11-14',
    custId: 'C01',
    inboundNo: 'APG18076601',
    status: '0'
  }
]

const inboundList = [
  {
    id: '11',
    custId: 'A01',
    status: '0',
    supplierName: '东莞市瑞源进出口有限公司',
    so: 'APGHKG18070011',
    po: '154308',
    sku: '113963',
    inboundNo: 'APG18073001',
    customsMeterialNo: 'APG1807300101',
    rcvdDate: '2018/7/30',
    rcvdCtns: 155,
    rcvdPcs: 3702,
    itemsPerBox: 23.88,
    gwPerBoxActul: 10.72,
    gwAllActul: 1661.60,
    boxLengthActul: 41,
    boxWidthActul: 42,
    boxHighActul: 43,
    boxPerVolumeActul: 0.074,
    boxAllVolumeActul: 11.48,
    custsDeclaPieceWeigh: 0.394,
    custsDeclaAllWeigh: 1460.000,
    warehousePosition: '',
    shippedCtns: 155,
    shippedPcs: 3702,
    shippedGw: 1661.600,
    shippedWeigh: 1458.588,
    shippedVolume: 11.470,
    stockCtns: 0,
    stockPcs: 0,
    stockGw: 0.000,
    stockWeigh: 1.412,
    stockVolume: 0.010,
    remark: ''
  },
  {
    id: '12',
    custId: 'B01',
    status: '1',
    supplierName: '东莞市瑞源进出口有限公司1',
    so: 'APGHKG18070011',
    po: '154308',
    sku: '113963',
    inboundNo: 'APG18073001',
    customsMeterialNo: 'APG1807300101',
    rcvdDate: '2018/7/30',
    rcvdCtns: 155,
    rcvdPcs: 3702,
    itemsPerBox: 23.88,
    gwPerBoxActul: 10.72,
    gwAllActul: 1661.60,
    boxLengthActul: 41,
    boxWidthActul: 42,
    boxHighActul: 43,
    boxPerVolumeActul: 0.074,
    boxAllVolumeActul: 11.48,
    custsDeclaPieceWeigh: 0.394,
    custsDeclaAllWeigh: 1460.000,
    warehousePosition: '',
    shippedCtns: 155,
    shippedPcs: 3702,
    shippedGw: 1661.600,
    shippedWeigh: 1458.588,
    shippedVolume: 11.470,
    stockCtns: 0,
    stockPcs: 0,
    stockGw: 0.000,
    stockWeigh: 1.412,
    stockVolume: 0.010,
    remark: ''
  },
  {
    id: '13',
    custId: 'C01',
    status: '1',
    supplierName: '东莞市瑞源进出口有限公司2',
    so: 'APGHKG18070011',
    po: '154308',
    sku: '113963',
    inboundNo: 'APG18073001',
    customsMeterialNo: 'APG1807300101',
    rcvdDate: '2018/7/30',
    rcvdCtns: 155,
    rcvdPcs: 3702,
    itemsPerBox: 23.88,
    gwPerBoxActul: 10.72,
    gwAllActul: 1661.60,
    boxLengthActul: 41,
    boxWidthActul: 42,
    boxHighActul: 43,
    boxPerVolumeActul: 0.074,
    boxAllVolumeActul: 11.48,
    custsDeclaPieceWeigh: 0.394,
    custsDeclaAllWeigh: 1460.000,
    warehousePosition: '',
    shippedCtns: 155,
    shippedPcs: 3702,
    shippedGw: 1661.600,
    shippedWeigh: 1458.588,
    shippedVolume: 11.470,
    stockCtns: 0,
    stockPcs: 0,
    stockGw: 0.000,
    stockWeigh: 1.412,
    stockVolume: 0.010,
    remark: ''
  }
]

const InboundFees = [
  {
    stockDate: '2019/7/4',
    so: 'APGHKG18070011',
    car: '粤BG558U',
    stockCtns: 591,
    stockVolume: 15.36
  },
  {
    stockDate: '2019/7/6',
    so: 'S10SZX1917015',
    car: '粤BM09U5',
    stockCtns: 201,
    stockVolume: 2.56
  },
  {
    stockDate: '2019/7/4',
    so: 'APGHKG18070011',
    car: '粤BG558U',
    stockCtns: 591,
    stockVolume: 15.36
  },
  {
    stockDate: '2019/7/4',
    so: 'APGHKG18070011',
    car: '粤BG668U',
    stockCtns: 501,
    stockVolume: 15.75
  },
  {
    stockDate: '2019/9/9',
    so: 'APGHKG18070055',
    car: '粤BG558A',
    stockCtns: 441,
    stockVolume: 95.36
  }
]

const OutboundFees = [
  {
    shippedDate: '2019/7/4',
    shptNo: 'CKAS19070401',
    clp: 'SPS190422',
    car: '粤BG558U（客拖）',
    route: '中海仓-平湖外运仓',
    cabinetType: '3T',
    shippedCtns: 913,
    shippedVolume: 6.722
  },
  {
    shippedDate: '2019/7/5',
    shptNo: 'CKAS19070501',
    clp: 'SPS190423',
    car: '粤BG558U（客拖）',
    route: '中海仓-金运达仓',
    cabinetType: '3T',
    shippedCtns: 120,
    shippedVolume: 1.04
  },
  {
    shippedDate: '2019/7/4',
    shptNo: 'CKAS19070502',
    clp: 'SPS190424',
    car: 'KKFU7690170',
    route: '盐田码头-盐田码头',
    cabinetType: '40HQ',
    shippedCtns: 1634,
    shippedVolume: 60.41
  },
  {
    shippedDate: '2019/7/5',
    shptNo: 'CKAS19070503',
    clp: 'SPS190425',
    car: 'TCNU6421825',
    route: '盐田码头-盐田码头',
    cabinetType: '40HQ',
    shippedCtns: 1734,
    shippedVolume: 57.40
  },
  {
    shippedDate: '2019/7/4',
    shptNo: 'CKAS19070401',
    clp: 'SPS190422',
    car: '粤BG558U（客拖）',
    route: '中海仓-平湖外运仓',
    cabinetType: '3T',
    shippedCtns: 913,
    shippedVolume: 6.73
  }
]

const outboundList = [
  {
    custId: 'A01',
    clp: 'AE86',
    shippedDate: '2018/8/1',
    cntrNo: 'CC001',
    cntrWeigh: 13.5,
    seal: 'CAPG18080101'
  },
  {
    id: '12',
    custId: 'B01',
    clp: 'AE87',
    shippedDate: '2018/8/2',
    cntrNo: 'CC002',
    cntrWeigh: 13.5,
    seal: 'CAPG18080102'
  },
  {
    id: '13',
    custId: 'C01',
    clp: 'AE88',
    shippedDate: '2018/8/2',
    cntrNo: 'CC003',
    cntrWeigh: 13.5,
    seal: 'CAPG18080103'
  }
]

const shippedBatchList = [
  {
    id: '11',
    custId: 'A01',
    clp: 'AE86',
    shippedDate: '2018/8/1',
    cntrNo: 'CC001',
    seal: 'CAPG18080101',
    shippedOrderDate: '2018/8/1',
    shippedNo: 'CAPG18080101',
    so: 'APGHKG18070011 ',
    po: '154308',
    sku: '113963',
    shippedCtns: 155,
    shippedPcs: 3702,
    warehousePosition: 0,
    shippedGw: 1661.60,
    shippedVolume: 11.47,
    inboundNo: 'APG18073001',
    customsMeterialNo: 'APG1807300101',
    customsMerchNo: '6104390000',
    merchName: '女装针织V领长袖开襟外套',
    declaCount: 3702,
    declaUnit: '件',
    declaUnitPrice: 17.00,
    declaTotalPrice: 62934.00,
    declaCurrency: '美元',
    originCountry: '中国',
    destCountry: '澳大利亚',
    pieceWeigh: 0.394,
    shippedAllWeigh: 1458.588
  },
  {
    id: '12',
    custId: 'B01',
    clp: 'AE87',
    shippedDate: '2018/8/2',
    cntrNo: 'CC002',
    seal: 'CAPG18080102',
    shippedOrderDate: '2018/8/1',
    shippedNo: 'CAPG18080101',
    so: 'APGHKG18070011 ',
    po: '154308',
    sku: '113963',
    shippedCtns: 155,
    shippedPcs: 3702,
    warehousePosition: 0,
    shippedGw: 1661.60,
    shippedVolume: 11.47,
    inboundNo: 'APG18073001',
    customsMeterialNo: 'APG1807300101',
    customsMerchNo: '6104390000',
    merchName: '女装针织V领长袖开襟外套',
    declaCount: 3702,
    declaUnit: '件',
    declaUnitPrice: 17.00,
    declaTotalPrice: 62934.00,
    declaCurrency: '美元',
    originCountry: '中国',
    destCountry: '澳大利亚',
    pieceWeigh: 0.394,
    shippedAllWeigh: 1458.588
  },
  {
    id: '13',
    custId: 'C01',
    clp: 'AE88',
    shippedDate: '2018/8/2',
    cntrNo: 'CC003',
    seal: 'CAPG18080103',
    shippedOrderDate: '2018/8/1',
    shippedNo: 'CAPG18080101',
    so: 'APGHKG18070011 ',
    po: '154308',
    sku: '113963',
    shippedCtns: 155,
    shippedPcs: 3702,
    warehousePosition: 0,
    shippedGw: 1661.60,
    shippedVolume: 11.47,
    inboundNo: 'APG18073001',
    customsMeterialNo: 'APG1807300101',
    customsMerchNo: '6104390000',
    merchName: '女装针织V领长袖开襟外套',
    declaCount: 3702,
    declaUnit: '件',
    declaUnitPrice: 17.00,
    declaTotalPrice: 62934.00,
    declaCurrency: '美元',
    originCountry: '中国',
    destCountry: '澳大利亚',
    pieceWeigh: 0.394,
    shippedAllWeigh: 1458.588
  }
]

const accountInfos = [
  {
    id: '1',
    custFullName: '张三三',
    custId: 'A01',
    custShortName: '张三',
    projectId: '01',
    projectName: 'A项目'
  },
  {
    id: '2',
    custFullName: '张四四',
    custId: 'B01',
    custShortName: '张四',
    projectId: '02',
    projectName: 'B项目'
  },
  {
    id: '3',
    custFullName: '张五五',
    custId: 'C01',
    custShortName: '张五',
    projectId: '03',
    projectName: 'C项目'
  },
  {
    id: '4',
    custFullName: '李四',
    custId: 'D01',
    custShortName: '李四',
    projectId: '04',
    projectName: 'D项目'
  }
]

const frontDeskCharges = [
  {
    billOneCar: 2,
    carNum: '粤BY973K8',
    commercialInspectionFlag: '0',
    createTime: '2019-11-06 17:19:13',
    custId: 'A01',
    customsDeclarationFee: 101.01,
    customsMeterialNo: 'A112233',
    enterGateFee: 12.5,
    factory: 'A工厂',
    feeTotal: 520,
    id: 1,
    inboundNo: 'MOL19090203',
    payType: '0',
    projectId: 'A项目',
    recAmt: 740.20,
    receiptNo: 'test001',
    settlementType: '0',
    so: 'STM-CN8238577-ACT2',
    tranDate: '2019/9/2',
    updateTime: '2019-11-06 17:19:13',
    remark: 'test'
  },
  {
    billOneCar: 2,
    carNum: '粤BY973K8',
    commercialInspectionFlag: '1',
    createTime: '2019-11-06 17:19:13',
    custId: 'B01',
    customsDeclarationFee: 101.01,
    customsMeterialNo: 'A112233',
    enterGateFee: 12.5,
    factory: 'A工厂',
    feeTotal: 520,
    id: 1,
    inboundNo: 'MOL19090203',
    payType: '0',
    projectId: 'A项目',
    recAmt: 740.20,
    receiptNo: 'test001',
    settlementType: '0',
    so: 'STM-CN8238577-ACT2',
    tranDate: '2019/9/2',
    updateTime: '2019-11-06 17:19:13',
    remark: 'testA'
  },
  {
    billOneCar: 2,
    carNum: '粤BY973K8',
    commercialInspectionFlag: '0',
    createTime: '2019-11-06 17:19:13',
    custId: 'C01',
    customsDeclarationFee: 101.01,
    customsMeterialNo: 'A112233',
    enterGateFee: 12.5,
    factory: 'A工厂',
    feeTotal: 520,
    id: 1,
    inboundNo: 'MOL19090203',
    payType: '0',
    projectId: 'A项目',
    recAmt: 740.20,
    receiptNo: 'test001',
    settlementType: '0',
    so: 'STM-CN8238577-ACT2',
    tranDate: '2019/9/2',
    updateTime: '2019-11-06 17:19:13',
    remark: 'testB'
  }
]

export default [
  {
    url: '/stock/abstract/load',
    type: 'post',
    response: () => {
      return {
        respHeader: {
          respCode: '200'
        },
        data: {
          total: batchStockList.length,
          items: batchStockList
        }
      }
    }
  },
  {
    url: '/stock/abstract/modify',
    type: 'post',
    response: () => {
      return {
        respHeader: {
          respCode: '200',
          respMsg: '修改成功'
        }
      }
    }
  },
  {
    url: 'stock/abstract/upload',
    type: 'post',
    response: () => {
      return {
        respHeader: {
          respCode: '200',
          respMsg: '导入成功'
        }
      }
    }
  },
  {
    url: '/stock/load',
    type: 'post',
    response: () => {
      return {
        respHeader: {
          respCode: '200'
        },
        data: {
          total: inboundList.length,
          items: inboundList
        }
      }
    }
  },
  {
    url: '/stock/modify',
    type: 'post',
    response: () => {
      return {
        respHeader: {
          respCode: '200',
          respMsg: '修改成功'
        }
      }
    }
  },
  {
    url: '/stock/delete',
    type: 'post',
    response: () => {
      return {
        respHeader: {
          respCode: '200',
          respMsg: '删除成功'
        }
      }
    }
  },
  {
    url: '/stock/add',
    type: 'post',
    response: () => {
      return {
        respHeader: {
          respCode: '200',
          respMsg: '新增成功'
        }
      }
    }
  },
  {
    url: 'stock/upload',
    type: 'post',
    response: () => {
      return {
        respHeader: {
          respCode: '200',
          respMsg: '导入成功'
        }
      }
    }
  },
  {
    url: '/stock/outbound',
    type: 'post',
    response: () => {
      return {
        respHeader: {
          respCode: '200'
        },
        data: {
        }
      }
    }
  },
  {
    url: '/shipped/abstract/load',
    type: 'post',
    response: config => {
      return {
        respHeader: {
          respCode: '200'
        },
        data: {
          total: outboundList.length,
          items: outboundList
        }
      }
    }
  },
  {
    url: '/shipped/load',
    type: 'post',
    response: config => {
      return {
        respHeader: {
          respCode: '200'
        },
        data: {
          total: shippedBatchList.length,
          items: shippedBatchList
        }
      }
    }
  },
  {
    url: '/statement/loadStockFee',
    type: 'post',
    response: config => {
      return {
        respHeader: {
          respCode: '200'
        },
        data: {
          total: InboundFees.length,
          items: InboundFees
        }
      }
    }
  },

  {
    url: '/statement/loadShippedFee',
    type: 'post',
    response: config => {
      return {
        respHeader: {
          respCode: '200'
        },
        data: {
          total: OutboundFees.length,
          items: OutboundFees
        }
      }
    }
  },
  // 客戶信息查詢
  {
    url: '/cust/query',
    type: 'post',
    response: config => {
      return {
        respHeader: {
          respCode: '200'
        },
        data: {
          total: accountInfos.length,
          items: accountInfos
        }
      }
    }
  },
  // 客户新增
  {
    url: '/cust/add',
    type: 'post',
    response: config => {
      return {
        respHeader: {
          respCode: '200',
          respMsg: '新增成功'
        }
      }
    }
  },
  // 客户修改
  {
    url: '/cust/update',
    type: 'post',
    response: config => {
      return {
        respHeader: {
          respCode: '200',
          respMsg: '成功'
        }
      }
    }
  },
  // 客户删除
  {
    url: '/cust/delete',
    type: 'post',
    response: config => {
      return {
        respHeader: {
          respCode: '200',
          respMsg: '成功'
        }
      }
    }
  },
  // 收费查询
  {
    url: '/charge/query',
    type: 'post',
    response: config => {
      return {
        respHeader: {
          respCode: '200'
        },
        data: {
          total: frontDeskCharges.length,
          items: frontDeskCharges
        }
      }
    }
  },
  // 收费新增
  {
    url: '/charge/add',
    type: 'post',
    response: config => {
      return {
        respHeader: {
          respCode: '200',
          respMsg: '新增成功'
        }
      }
    }
  },
  // 收费导出
  {
    url: '/charge/export',
    type: 'post',
    response: config => {
      return {
        respHeader: {
          respCode: '200'
        },
        data: {
          items: frontDeskCharges
        }
      }
    }
  },
  // 收费修改
  {
    url: '/charge/update',
    type: 'post',
    response: config => {
      return {
        respHeader: {
          respCode: '200',
          respMsg: '修改成功'
        }
      }
    }
  },
  // 收费删除
  {
    url: '/charge/delete',
    type: 'post',
    response: config => {
      return {
        respHeader: {
          respCode: '200',
          respMsg: '删除成功'
        }
      }
    }
  }
]

