const enumerMap = (value, property) => {
  // map映射
  const mapData = (val, objList) => {
    const myMap = new Map(objList)
    return myMap.get(val)
  }
  // 对应数据
  const payTypeList = [
    ['0', '现金支付'],
    ['1', '微信支付']
  ]

  const insideMapList = [
    ['bankTransStatus', payTypeList]
  ]

  const firstResult = mapData(property, insideMapList)
  return mapData(value, firstResult)
}

export default enumerMap
