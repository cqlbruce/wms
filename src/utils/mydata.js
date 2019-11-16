const enumerMap = (value, property) => {
  // map映射
  const mapData = (val, objList) => {
    const myMap = new Map(objList)
    return myMap.get(val)
  }
  // 对应数据
  const payTypeList = [
    ['0', '微信'],
    ['1', '现金'],
    ['2', '月结']
  ]

  const stockStatusList = [
    ['0', '登记'],
    ['1', '入库']
  ]

  const insideMapList = [
    ['payType', payTypeList],
    ['stockStatus', stockStatusList]
  ]

  const firstResult = mapData(property, insideMapList)
  return mapData(value, firstResult)
}

export default enumerMap
