function getDuration(second) {
  let days = Math.floor(second / 86400)
  let hours = Math.floor((second % 86400) / 3600)
  let minutes = Math.floor(((second % 86400) % 3600) / 60)
  let seconds = Math.floor(((second % 86400) % 3600) % 60)
  let d = days > 0 ? days + "天" : ""
  let h = hours > 0 ? hours + "小时" : ""
  let m = minutes > 0 ? minutes + "分" : ""
  let s = seconds > 0 ? seconds + "秒" : ""
  return d + h + m + s
}

export { getDuration }
