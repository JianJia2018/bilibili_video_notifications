import { getDynamicNew, getDynamicHistory } from "./api.js"
import { getAllTags } from "./tags.js"
import { getDuration } from "./utils.js"
import { pushPlusNotify } from "./pushplus.js"
import dayjs from "dayjs"
import "dayjs/locale/zh-cn.js"
import timezone from "dayjs/plugin/timezone.js"
import utc from "dayjs/plugin/utc.js"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs().locale("zh-cn")
dayjs.tz.setDefault("Asia/Shanghai")

let tags = []
let offsetId = 0
let list = []
let page = 1
const yesterday = new Date(new Date().getTime() - 24.5 * 60 * 60 * 1000).getTime()

async function getTest() {
  let { data } = await getDynamicHistory(offsetId)
  console.log(`---获取第${page}页数据---`)
  list = [...list, ...data.cards]
  let endData = data.cards[data.cards.length - 1]
  offsetId = endData.desc.dynamic_id
  if (endData.desc.timestamp * 1000 <= yesterday) {
    console.log(`---获取完成---`)
    filterListToTags()
    return
  }
  setTimeout(() => {
    page++
    return getTest()
  }, 8000)
}

function filterListToTags() {
  let myVideos = list
    .map(x => {
      if (tags.includes(x.desc.uid)) {
        let card = JSON.parse(x.card)
        return {
          card,
          time: dayjs.tz(x.desc.timestamp * 1000).format("YYYY-MM-DD HH:mm"),
          title: card.title,
          link: card.short_link_v2 || card.short_link,
          name: card.owner.name,
          avatar: card.owner.face,
          pic: card.pic || card.first_frame,
          duration: getDuration(card.duration),
        }
      } else {
        return
      }
    })
    .filter(x => x)
  sendVideos(myVideos)
}

function sendVideos(filterList) {
  let list = filterList
    .map((x, i) => {
      return `  ${i + 1}.  **${x.name}** [${x.title}](${x.link})
        * [![](https://images.weserv.nl/?url=${x.pic})](${x.link})
        * ${x.duration}  
        * ${x.time}           
       - - -  
`
    })
    .join("")
  let header = filterList
    .map((x, i) => {
      return `${i + 1}.  **${x.name}** [${x.title}](${x.link}) [${x.duration}]`
    })
    .join()
  let string = `
      ${header}
      ******
      ${list}
  `
  pushPlusNotify(`${dayjs.tz().format("MM-DD HH:mm")} B站视频动态`, string, "markdown")
}

async function init() {
  tags = await getAllTags()
  let { data } = await getDynamicNew()
  list = data.cards
  offsetId = data.cards[data.cards.length - 1].desc.dynamic_id
  getTest()
}

export { init }
