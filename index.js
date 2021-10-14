import { init } from "./dynamic.js"
// init()
import dayjs from "dayjs"
import "dayjs/locale/zh-cn.js"
import timezone from "dayjs/plugin/timezone.js"
import utc from "dayjs/plugin/utc.js"
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs().locale("zh-cn")
dayjs.tz.setDefault("Asia/Shanghai")
console.log("dayjs1", dayjs(1634194361425).locale("zh-cn").format("YYYY-MM-DD HH:mm"))
console.log("dayjs2", dayjs.tz().format("YYYY-MM-DD HH:mm"))
console.log("dayjs3", dayjs(1634194361425).tz("Asia/Shanghai").format("YYYY-MM-DD HH:mm"))
