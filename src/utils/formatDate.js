/**
 * 格式化日期 - 转成Date类型
 * @param val
 * @returns Date
 */
export function number2Date(val) {
  if (val instanceof Date) {
    return val
  } else {
    return new Date(parseInt(val))
  }
}

/**
 * 格式化日期 - 转成时间戳
 * @param val
 * @returns number
 */
export function date2Number(val) {
  if (val instanceof Date) {
    return val.getTime()
  } else {
    return val
  }
}

