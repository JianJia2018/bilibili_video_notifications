# bilibili_video_notifications
B站关注分组视频通知到手机设备

# 支持通知
### pushplus+, pushdeer

# 运行方式
1. ### github actions


# GitHub Actions secrets and variables 配置
路径: `Setting => Security => Actions secrets and variables => Actions => Secrets`

`Secrets`配置参数:
```js
COOKIE, // b站COOKIE
PUSH_KEY, // pushdeer的token
PUSH_PLUS_TOKEN, // pushplus的token
UID,  //你的uid
TAG_ID, //你关注的分组id
```


## 使用说明
1. 开启`github actions`
2. 密钥中加入密钥`COOKIE`,`PUSH_KEY`,`PUSH_PLUS_TOKEN`, `UID`, `TAG_ID`. 其中B站`COOKIE`, `UID`, `TAG_ID`必传, 其它通知`token`自己选择.
3. `.github/workflows/main.yml`中有定时任务时间, 默认为北京时间 `19:45`, 可以自己修改. 
