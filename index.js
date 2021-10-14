import { init } from "./dynamic.js"
import dayjs from "dayjs"
import "dayjs/locale/zh-cn.js"
// init()

console.log("dayjs_locale1", dayjs.locale())
dayjs().locale("zh-cn")

console.log("dayjs_locale2", dayjs.locale())
console.log("dayjs", dayjs().locale("zh-cn").format("YYYY-MM-DD HH:mm"))
