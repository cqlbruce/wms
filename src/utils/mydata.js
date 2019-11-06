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

  const insideMapList = [
    ['payType', payTypeList]
  ]

  const firstResult = mapData(property, insideMapList)
  return mapData(value, firstResult)
}

export default enumerMap
