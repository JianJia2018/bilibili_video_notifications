# bilibili_video_notifications
B站关注分组视频通知到手机设备

# 支持通知
### pushplus+, pushdeer, PushMe

# 运行方式
1. ### github actions
2. ### qinglong


# GitHub Actions secrets and variables 配置
路径: `Setting => Security => Actions secrets and variables => Actions => Secrets`

`Secrets`配置参数:
```js
COOKIE, // b站COOKIE
DEER_KEY, // pushdeer的token
PUSH_PLUS_TOKEN, // pushplus的token
BILI_UID,  //你的uid
TAG_ID, //你关注的分组id
PUSHME_KEY, // pushme通知key
```


## 使用说明
1. 开启`github actions`
2. 密钥中加入密钥`COOKIE`,`DEER_KEY`,`PUSH_PLUS_TOKEN`, `BILI_UID`, `TAG_ID`. `PUSHME_KEY`. 其中B站`COOKIE`, `BILI_UID`, `TAG_ID`必传, 其它通知`token`自己选择.
3. `.github/workflows/main.yml`中有定时任务时间, 默认为北京时间 `19:45`, 可以自己修改. 
