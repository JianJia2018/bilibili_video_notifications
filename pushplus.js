// =======================================push+设置区域=======================================
//官方文档：http://www.pushplus.plus/
//PUSH_PLUS_TOKEN：微信扫码登录后一对一推送或一对多推送下面的token(您的Token)，不提供PUSH_PLUS_USER则默认为一对一推送
//PUSH_PLUS_USER： 一对多推送的“群组编码”（一对多推送下面->您的群组(如无则新建)->群组编码，如果您是创建群组人。也需点击“查看二维码”扫描绑定，否则不能接受群组消息推送）
let PUSH_PLUS_TOKEN = ""
let PUSH_KEY = ""

// =======================================PushMe通知设置区域===========================================
//官方文档：https://push.i-i.me/
//此处填你的PushMe KEY.
let PUSHME_KEY = ""

let PUSH_PLUS_USER = ""
if (process.env.PUSH_PLUS_TOKEN) {
  PUSH_PLUS_TOKEN = process.env.PUSH_PLUS_TOKEN
}
if (process.env.PUSH_KEY) {
  PUSH_KEY = process.env.PUSH_KEY
}

if (process.env.PUSHME_KEY) {
  PUSHME_KEY = process.env.PUSHME_KEY
}

import request from "request"
const timeout = 15000 //超时时间(单位毫秒)

function pushPlusNotify(text, desp = "", template = "html") {
  return new Promise(resolve => {
    if (PUSH_PLUS_TOKEN) {
      if (template === "html") {
        desp = `${desp}`?.replace(/[\n\r]/g, "<br>") // 默认为html, 不支持plaintext
      }
      const body = {
        token: `${PUSH_PLUS_TOKEN}`,
        title: `${text}`,
        content: `${desp}`,
        topic: `${PUSH_PLUS_USER}`,
        template,
      }
      const options = {
        url: `http://www.pushplus.plus/send`,
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        timeout,
      }
      request(options, (err, resp, data) => {
        try {
          if (err) {
            console.log(`push+发送${PUSH_PLUS_USER ? "一对多" : "一对一"}通知消息失败！！\n`)
            console.log(err)
          } else {
            data = JSON.parse(data)
            if (data.code === 200) {
              console.log(`push+发送${PUSH_PLUS_USER ? "一对多" : "一对一"}通知消息完成。\n`)
            } else {
              console.log(`push+发送${PUSH_PLUS_USER ? "一对多" : "一对一"}通知消息失败：${data.msg}\n`)
            }
          }
        } catch (e) {
          console.log(`push+发送${PUSH_PLUS_USER ? "一对多" : "一对一"}通知消息失败：${data.msg}\n`)
        } finally {
          resolve(data)
        }
      })
    } else {
      // console.log('您未提供push+推送所需的PUSH_PLUS_TOKEN，取消push+推送消息通知🚫\n');
      resolve()
    }
  })
}

function pushDeerNotify(text, desp = "", type = "html") {
  return new Promise(resolve => {
    if (PUSH_KEY) {
      if (type === "html") {
        desp = `${desp}`.replace(/[\n\r]/g, "<br>") // 默认为html, 不支持plaintext
      }
      const body = {
        pushkey: `${PUSH_KEY}`,
        text: `${text}`,
        desp: `${desp}`,
        type: type,
      }
      const options = {
        url: `https://api2.pushdeer.com/message/push`,
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        timeout,
      }
      request(options, (err, resp, data) => {
        try {
          if (err) {
            console.log(`pushDeer发送通知消息失败！！\n`)
            console.log(err)
          } else {
            data = JSON.parse(data)
            console.log("data: ", data)
            if (data.code === 0) {
              console.log(`pushDeer发送通知消息完成。\n`)
            } else {
              console.log(`pushDeer发送通知消息失败：${data.msg}\n`)
            }
          }
        } catch (e) {
          console.log(`pushDeer发送通知消息失败：${data.msg}\n`)
        } finally {
          resolve(data)
        }
      })
    } else {
      resolve()
    }
  })
}

function PushMeNotify(text, desp, type = "markdown") {
  return new Promise(resolve => {
    if (PUSHME_KEY) {
      const options = {
        url: `https://push.i-i.me?push_key=${PUSHME_KEY}`,
        body: JSON.stringify({ push_key: PUSHME_KEY, title: text, content: desp, type }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        timeout,
      }
      request(options, (err, resp, data) => {
        try {
          if (err) {
            console.log("PushMeNotify发送通知调用API失败！！\n")
            console.log(err)
          } else {
            if (data === "success") {
              console.log("PushMe发送通知消息成功🎉\n")
            } else {
              console.log(`${data}\n`)
            }
          }
        } catch (e) {
          resolve(e)
        } finally {
          resolve(data)
        }
      })
    } else {
      resolve("没有提供PushMe的KEY，取消PushMe推送消息通知🚫\n")
    }
  })
}
export { pushPlusNotify, pushDeerNotify, PushMeNotify }
