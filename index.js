import { init } from "./dynamic.js"
import dayjs from "dayjs"
import "dayjs/locale/zh-cn.js"
import timezone from "dayjs/plugin/timezone.js"
dayjs.extend(timezone)
dayjs().locale("zh-cn")
// init()

dayjs.tz.setDefault("Asia/Shanghai")
console.log("dayjs1", dayjs().locale("zh-cn").format("YYYY-MM-DD HH:mm"))
console.log("dayjs1", dayjs().format("YYYY-MM-DD HH:mm"))
