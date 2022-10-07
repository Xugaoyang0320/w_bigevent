// 每次发起真正的请求之后，都会经过的地方

$.ajaxPrefilter(function (config) {
  // 将key=value形式的数据，转成json格式的字符串
  const format2Json = (source) => {
    let target = {}
    source.split('&').forEach((el) => {
      let kv = el.split('=')
      // 需要对它进行解码操作
      target[kv[0]] = decodeURIComponent(kv[1])
    })
    return JSON.stringify(target)
  }


  // 在此处将基准地址拼接一下
  config.url = 'http://big-event-vue-api-t.itheima.net' + config.url

  // 设置统一的请求头 contentType
  config.contentType = 'application/json'

  // 统一设置请求的参数---post请求
  // if(typeof config)
  config.data = config.data && format2Json(config.data)

  // 设置请求头
  // 请求路径中有my这样的字符串的需要添加
  // indexOf  startsWith  endsWith  includes 包含包括
  if (config.url.includes('/my')) {
    // 经过调试，hreaders属性是自定义属性
    config.headers = {
      'Authorization': localStorage.getItem('big_news_token') || ''
    }
  }

  //添加统一错误回复 
  config.error=function(err) {
    if (err.responseJSON?.code === 1 &&
      err.responseJSON?.message === '身份认证失败！'
    ) {
      localStorage.clear()
      location.href='/login.html'
    }
  }
})

/* 
仓库：http:hithub.com/zlc100/big_news51.git
*/