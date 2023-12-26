/*
B站视频动态推送

cron "55 7 * * *" index.js, tag=B站视频动态推送
 */
import { init } from "./dynamic.js"
!(async () => {
  // 代码开始
  init()
})
