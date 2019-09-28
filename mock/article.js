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

const inboundList = [
  {
    id: '11',
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
    id: '11',
    shippedOrderDate: null,
    shippedDate: null,
    shippedNo: 'CAPG18080101',
    so: 'APGHKG18070011 ',
    po: '154308',
    sku: '113963',
    shippedCtns: 155,
    shippedpcs: 3702,
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
    shippedOrderDate: '2018/8/1',
    shippedDate: '2018/8/2',
    shippedNo: 'CAPG18080101',
    so: 'APGHKG18070011 ',
    po: '154308',
    sku: '113963',
    shippedCtns: 155,
    shippedpcs: 3702,
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
    shippedOrderDate: '2018/8/1',
    shippedDate: '2018/8/2',
    shippedNo: 'CAPG18080101',
    so: 'APGHKG18070011 ',
    po: '154308',
    sku: '113963',
    shippedCtns: 155,
    shippedpcs: 3702,
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

export default [
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
    url: '/shipped/load',
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
  }
]

