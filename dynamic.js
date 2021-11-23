import { getDynamicNew, getDynamicHistory } from "./api.js"
import { getAllTags } from "./tags.js"
import { getDuration } from "./utils.js"
import { pushPlusNotify } from "./pushplus.js"
import dayjs from "dayjs"
import "dayjs/locale/zh-cn.js"
import timezone from "dayjs/plugin/timezone.js"
import utc from "dayjs/plugin/utc.js"

// 切换 GMT 时区
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs().locale("zh-cn")
dayjs.tz.setDefault("Asia/Shanghai")

let tags = []
let offsetId = 0
let list = []
let page = 1
const yesterday = new Date(new Date().getTime() - 24.5 * 60 * 60 * 1000 * 2).getTime()

async function getTest() {
  try {
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
  } catch (e) {
    //TODO handle the exception
    pushPlusNotify(`失败`, string, e)
  }
}

function filterListToTags() {
  let obj = {}
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
          rid: x.desc.dynamic_id,
        }
      } else {
        return
      }
    })
    .filter(x => x)
    .reduce((prev, cur) => {
      console.log(obj, cur, prev)
      obj[cur.link] ? "" : (obj[cur.link] = true && prev.push(cur)) //_id为每个对象独有的标识，即用来判断去重的标识
      return prev
    }, [])
  sendVideos(myVideos)
}

function sendVideos(filterList) {
  let list = filterList
    .map((x, i) => {
      return `${i + 1}.  **${x.name}** [${x.title}](${x.link})
  * [![](https://images.weserv.nl/?url=${x.pic})](${x.link})
  * ${x.duration}  
  * ${x.time}           
- - - - - - -
`
    })
    .join("\n")
  let header = filterList
    .map((x, i) => {
      return `${i + 1}.  **${x.name}** [${x.title}](${x.link}) [${x.duration}]`
    })
    .join("\n")
  let string = `
${header}

*********

${list}`
  console.log("string: ", string)
  pushPlusNotify(`${dayjs.tz().format("MM-DD HH:mm")} B站视频动态`, string, "markdown")
}

async function init() {
  try {
    tags = await getAllTags()
    let { data } = await getDynamicNew()
    list = data.cards
    offsetId = data.cards[data.cards.length - 1].desc.dynamic_id
    getTest()
  } catch (e) {
    pushPlusNotify(`B站动态发送失败`, e)
  }
}

export { init }
