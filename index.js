import { init } from "./dynamic.js"
// init()

dayjs.tz.setDefault("Asia/Shanghai")
console.log("dayjs1", dayjs(1634194361425).locale("zh-cn").format("YYYY-MM-DD HH:mm"))
console.log("dayjs2", dayjs(1634194361425).format("YYYY-MM-DD HH:mm"))
console.log("dayjs3", dayjs(1634194361425).tz("Asia/Shanghai").format("YYYY-MM-DD HH:mm"))
