import fetch from "node-fetch"
let COOKIE = ``
let uid = ""
let tagid = ""
if (process.env.COOKIE) {
  COOKIE = JSON.stringify(process.env.COOKIE)
} else {
  console.log("请先获取cookie")
}
if (process.env.BILI_UID) {
  uid = process.env.BILI_UID
} else {
  console.log("请先获取你的uid")
}
if (process.env.TAG_ID) {
  tagid = process.env.TAG_ID
} else {
  console.log("请先获取关注视频分组tagid")
}
const type = "video" // b站视频类型. 默认只请求视频动态
const getDynamicNew = () => {
  return fetch(
    `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all?type=${type}&page=1&features=itemOpusStyle,listOnlyfans&timezone_offset=-480`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9",
        "sec-ch-ua": '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        cookie: `${COOKIE}`,
      },
      referrer: "https://www.bilibili.com/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
    }
  )
    .then(res => res.json())
    .then(json => {
      return json
    })
    .catch(err => {})
}

const getDynamicHistory = (offsetId, page) => {
  return fetch(
    `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all?offset=${offsetId}&type=${type}&page=${page}&features=itemOpusStyle,listOnlyfans&timezone_offset=-480`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9",
        "sec-ch-ua": '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        cookie: `${COOKIE}`,
      },
      referrer: "https://www.bilibili.com/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
    }
  )
    .then(res => res.json())
    .then(json => {
      return json
    })
    .catch(err => {
      console.log("getDynamicHistory error:", err)
    })
}

const getTags = async (pn = 1) => {
  try {
    const res = await fetch(`https://api.bilibili.com/x/relation/tag?mid=${uid}&tagid=${tagid}&pn=${pn}&ps=50`, {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9",
        "cache-control": "no-cache",
        pragma: "no-cache",
        "sec-ch-ua": '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        cookie: `${COOKIE}`,
      },
      referrer: "https://www.bilibili.com/",
      referrerPolicy: "no-referrer-when-downgrade",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "include",
    })
    const json = await res.json()
    return json
  } catch (err) {
    console.log("getTags error:", err)
  }
}
export { getDynamicNew, getDynamicHistory, getTags }
