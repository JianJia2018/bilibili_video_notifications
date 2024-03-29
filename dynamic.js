import { getDynamicNew, getDynamicHistory } from "./api.js"
import { getAllTags } from "./tags.js"
import { PushMeNotify, pushDeerNotify, pushPlusNotify } from "./pushplus.js"
import dayjs from "dayjs"
import "dayjs/locale/zh-cn.js"
import timezone from "dayjs/plugin/timezone.js"
import utc from "dayjs/plugin/utc.js"

// 切换 GMT 时区
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs().locale("zh-cn")
dayjs.tz.setDefault("Asia/Shanghai")

let tags = [] // 关注的所有标签分组
let offsetId = 0 // 翻页最后一条id
let list = [] // 视频动态列表
let page = 2 // 页数

const yesterday = new Date(new Date().getTime() - 24.5 * 60 * 60 * 1000).getTime() // 获取昨天发送的时间, +0.5小时防止误差
const filter_uid = [429711841] // 要过滤的uid, 默认过滤: 综艺哔哔机
const Max_Dynamic_Num = 12 // 同一uid最大视频动态条数,防止官方连发

/**
 * 递归获取关注的所有up主动态
 * @returns
 */
async function getList() {
  try {
    let { data } = await getDynamicHistory(offsetId, page)
    console.log(`---获取第${page}页数据---`)
    list = [...list, ...data.items]

    let endData = data.items[data.items.length - 1]

    offsetId = data.offset
    if (endData.modules.module_author.pub_ts * 1000 <= yesterday) {
      // 获取一天的数据完成
      console.log(`---获取完成---`)
      filterListToTags()
      return
    }
    // 延时请求翻页,防止风控
    setTimeout(() => {
      page++
      return getList()
    }, 8000)
  } catch (e) {
    //TODO handle the exception
    pushPlusNotify(`获取动态数据失败,请更新COOKIE或重试!`, `${e}`)
  }
}

/**
 * 在所有list列表里面过滤你需要的分组tag
 */
function filterListToTags() {
  let obj = {}
  let myVideos = list
    .map(x => {
      let card = x.modules.module_dynamic.major.archive
      let _author = x.modules.module_author

      if (tags.includes(_author.mid)) {
        return {
          uid: _author.mid,
          time: dayjs.tz(_author.pub_ts * 1000).format("YYYY-MM-DD HH:mm"),
          title: card.title,
          link: card.jump_url,
          name: _author.name,
          avatar: _author.face,
          pic: card.cover,
          duration: card.duration_text,
          bvid: card.bvid,
        }
      } else {
        return
      }
    })
    .filter(x => x)
    .reduce((prev, cur) => {
      obj[cur.link] ? "" : (obj[cur.link] = true && prev.push(cur)) //_id为每个对象独有的标识，即用来判断去重的标识. 过滤多个up主的合作视频.
      return prev
    }, [])

  console.log("myVideos: ", myVideos)
  if (myVideos.filter(x => filter_uid.includes(x.uid)).length >= Max_Dynamic_Num) {
    // 超出最大动态数量就过滤掉
    sendVideos(myVideos.filter(x => !filter_uid.includes(x.uid)))
  } else {
    sendVideos(myVideos)
  }
}

/**
 * 发送视频动态列表到通知软件. 格式为markdown
 * @param {*} filterList 过滤后的视频动态列表
 */
async function sendVideos(filterList) {
  console.log("filterList: ", filterList)
  let list = filterList
    .map((x, i) => {
      return `${i + 1}.  **${x.name}** [${x.title}](${x.link})
  * [![](https://images.weserv.nl/?url=${x.pic}&w=375&h=375&dpr=4)](${x.link})
  * ${x.duration}  
  * ${x.time}           
- - - - - - -
`
    })
    .join("\n")
  let header = filterList
    .map((x, i) => {
      return `${i + 1}.  **${x.name}** [${x.title}](${"bilibili://video/" + x.bvid}) [${x.duration}]`
    })
    .join("\n")
  let string = `
${header}

*********

${list}`
  // console.log("string: ", string)
  const title = `${dayjs.tz().format("MM-DD HH:mm")} B站视频动态`
  await pushPlusNotify(title, string, "markdown")
  await pushDeerNotify(title, string, "markdown")
  let res = await PushMeNotify(title, string)
  console.log("res: ", res)
}

/**
 * 初始化函数
 */
async function init() {
  try {
    tags = await getAllTags()
    let { data } = await getDynamicNew()
    list = data.items
    offsetId = data.offset // 翻页id, 动态的最后一个
    getList()
  } catch (e) {
    pushPlusNotify(`B站动态发送失败`, e)
  }
}

export { init }
