// =======================================push+设置区域=======================================
//官方文档：http://www.pushplus.plus/
//PUSH_PLUS_TOKEN：微信扫码登录后一对一推送或一对多推送下面的token(您的Token)，不提供PUSH_PLUS_USER则默认为一对一推送
//PUSH_PLUS_USER： 一对多推送的“群组编码”（一对多推送下面->您的群组(如无则新建)->群组编码，如果您是创建群组人。也需点击“查看二维码”扫描绑定，否则不能接受群组消息推送）
let PUSH_PLUS_TOKEN = "5109d3b40e5248f0bf2681977bf639fb"
let PUSH_PLUS_USER = ""

import request from "request"
const timeout = 15000 //超时时间(单位毫秒)

function pushPlusNotify(text, desp, template = "html") {
  return new Promise(resolve => {
    if (PUSH_PLUS_TOKEN) {
      if (template === "html") {
        desp = desp.replace(/[\n\r]/g, "<br>") // 默认为html, 不支持plaintext
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

export { pushPlusNotify }
